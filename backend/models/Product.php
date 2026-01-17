<?php
require_once '../config/database.php';

class Product {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Create a new product
     */
    public function create($data) {
        $stmt = $this->pdo->prepare("INSERT INTO products (name, category, description, cost_price, selling_price, current_stock, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $result = $stmt->execute([
            $data['name'],
            $data['category'],
            $data['description'] ?? null,
            $data['cost_price'],
            $data['selling_price'],
            $data['current_stock'] ?? 0,
            $data['status'] ?? 'active'
        ]);
        
        if ($result) {
            return $this->findById($this->pdo->lastInsertId());
        }
        
        return false;
    }

    /**
     * Find product by ID
     */
    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all products with optional filters
     */
    public function getAll($filters = []) {
        $sql = "SELECT * FROM products";
        $params = [];
        $conditions = [];
        
        // Apply filters
        if (!empty($filters['category'])) {
            $conditions[] = "category = ?";
            $params[] = $filters['category'];
        }
        
        if (!empty($filters['status'])) {
            $conditions[] = "status = ?";
            $params[] = $filters['status'];
        }
        
        if (!empty($filters['search'])) {
            $conditions[] = "(name LIKE ? OR description LIKE ?)";
            $searchParam = "%" . $filters['search'] . "%";
            $params[] = $searchParam;
            $params[] = $searchParam;
        }
        
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(' AND ', $conditions);
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Update product
     */
    public function update($id, $data) {
        $fields = [];
        $params = [];
        
        foreach ($data as $key => $value) {
            if ($key !== 'id') {
                $fields[] = "$key = ?";
                $params[] = $value;
            }
        }
        
        if (!empty($fields)) {
            $params[] = $id;
            $stmt = $this->pdo->prepare("UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?");
            return $stmt->execute($params);
        }
        
        return false;
    }

    /**
     * Delete product
     */
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM products WHERE id = ?");
        return $stmt->execute([$id]);
    }

    /**
     * Update product stock
     */
    public function updateStock($id, $newStock) {
        $stmt = $this->pdo->prepare("UPDATE products SET current_stock = ? WHERE id = ?");
        return $stmt->execute([$newStock, $id]);
    }

    /**
     * Get product analytics
     */
    public function getProductAnalytics($productId) {
        // Get total quantity sold
        $stmt = $this->pdo->prepare("
            SELECT SUM(oi.quantity) as total_sold
            FROM order_items oi
            WHERE oi.product_id = ?
        ");
        $stmt->execute([$productId]);
        $soldResult = $stmt->fetch(PDO::FETCH_ASSOC);
        $totalSold = $soldResult['total_sold'] ?? 0;
        
        // Get total revenue
        $stmt = $this->pdo->prepare("
            SELECT SUM(oi.total_price) as total_revenue
            FROM order_items oi
            WHERE oi.product_id = ?
        ");
        $stmt->execute([$productId]);
        $revenueResult = $stmt->fetch(PDO::FETCH_ASSOC);
        $totalRevenue = $revenueResult['total_revenue'] ?? 0;
        
        // Get sales data for chart
        $stmt = $this->pdo->prepare("
            SELECT DATE(o.order_date) as sale_date, SUM(oi.quantity) as quantity
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE oi.product_id = ?
            GROUP BY DATE(o.order_date)
            ORDER BY sale_date
        ");
        $stmt->execute([$productId]);
        $salesData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get all sales records
        $stmt = $this->pdo->prepare("
            SELECT oi.*, o.order_number, o.order_date, c.name as customer_name
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN customers c ON o.customer_id = c.id
            WHERE oi.product_id = ?
            ORDER BY o.order_date DESC
        ");
        $stmt->execute([$productId]);
        $salesRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            'total_sold_quantity' => $totalSold,
            'total_revenue' => $totalRevenue,
            'sales_data' => $salesData,
            'sales_records' => $salesRecords
        ];
    }
}
?>