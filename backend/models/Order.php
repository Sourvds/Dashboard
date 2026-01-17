<?php
require_once '../config/database.php';
require_once '../utils/helpers.php';

class Order {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Create a new order
     */
    public function create($data) {
        try {
            $this->pdo->beginTransaction();
            
            // Generate unique order number
            $orderNumber = generateOrderNumber($this->pdo);
            
            // Create the order
            $stmt = $this->pdo->prepare("INSERT INTO orders (order_number, customer_id, user_id, order_date, subtotal, tax, grand_total) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $orderNumber,
                $data['customer_id'],
                $data['user_id'],
                $data['order_date'],
                $data['subtotal'],
                $data['tax'],
                $data['grand_total']
            ]);
            
            $orderId = $this->pdo->lastInsertId();
            
            // Create order items and update product stock
            foreach ($data['items'] as $item) {
                // Add order item
                $stmt = $this->pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([
                    $orderId,
                    $item['product_id'],
                    $item['quantity'],
                    $item['unit_price'],
                    $item['total_price']
                ]);
                
                // Update product stock
                $stmt = $this->pdo->prepare("UPDATE products SET current_stock = current_stock - ? WHERE id = ?");
                $stmt->execute([$item['quantity'], $item['product_id']]);
            }
            
            $this->pdo->commit();
            
            // Return the created order with items
            return $this->getById($orderId);
        } catch (Exception $e) {
            $this->pdo->rollback();
            throw $e;
        }
    }

    /**
     * Get order by ID with items
     */
    public function getById($id) {
        // Get order details
        $stmt = $this->pdo->prepare("
            SELECT o.*, c.name as customer_name, c.customer_uid, u.name as user_name
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        ");
        $stmt->execute([$id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            return null;
        }
        
        // Get order items
        $stmt = $this->pdo->prepare("
            SELECT oi.*, p.name as product_name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        ");
        $stmt->execute([$id]);
        $order['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $order;
    }

    /**
     * Get all orders with optional filters
     */
    public function getAll($filters = []) {
        $sql = "
            SELECT o.*, c.name as customer_name, c.customer_uid, u.name as user_name
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            JOIN users u ON o.user_id = u.id
        ";
        
        $params = [];
        $conditions = [];
        
        // Apply filters
        if (!empty($filters['customer_id'])) {
            $conditions[] = "o.customer_id = ?";
            $params[] = $filters['customer_id'];
        }
        
        if (!empty($filters['user_id'])) {
            $conditions[] = "o.user_id = ?";
            $params[] = $filters['user_id'];
        }
        
        if (!empty($filters['date_from'])) {
            $conditions[] = "o.order_date >= ?";
            $params[] = $filters['date_from'];
        }
        
        if (!empty($filters['date_to'])) {
            $conditions[] = "o.order_date <= ?";
            $params[] = $filters['date_to'];
        }
        
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(' AND ', $conditions);
        }
        
        $sql .= " ORDER BY o.created_at DESC";
        
        if (!empty($filters['limit'])) {
            $sql .= " LIMIT ?";
            $params[] = $filters['limit'];
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats() {
        // Get today's sales
        $stmt = $this->pdo->prepare("SELECT COALESCE(SUM(grand_total), 0) as total FROM orders WHERE DATE(created_at) = CURDATE()");
        $stmt->execute();
        $todaySales = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get this month's sales
        $stmt = $this->pdo->prepare("SELECT COALESCE(SUM(grand_total), 0) as total FROM orders WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())");
        $stmt->execute();
        $monthSales = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get overall sales
        $stmt = $this->pdo->prepare("SELECT COALESCE(SUM(grand_total), 0) as total FROM orders");
        $stmt->execute();
        $overallSales = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get sales chart data (last 30 days)
        $stmt = $this->pdo->prepare("
            SELECT DATE(created_at) as date, COALESCE(SUM(grand_total), 0) as total
            FROM orders 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date
        ");
        $stmt->execute();
        $salesChartData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            'today_sales' => $todaySales,
            'month_sales' => $monthSales,
            'overall_sales' => $overallSales,
            'sales_chart_data' => $salesChartData
        ];
    }
}
?>