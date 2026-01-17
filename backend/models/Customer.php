<?php
require_once '../config/database.php';
require_once '../utils/helpers.php';

class Customer {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Create a new customer
     */
    public function create($data) {
        // Generate unique customer UID
        $customerUid = generateCustomerUID($this->pdo);
        
        $stmt = $this->pdo->prepare("INSERT INTO customers (customer_uid, name, email, phone, address) VALUES (?, ?, ?, ?, ?)");
        $result = $stmt->execute([
            $customerUid,
            $data['name'],
            $data['email'] ?? null,
            $data['phone'] ?? null,
            $data['address'] ?? null
        ]);
        
        if ($result) {
            return $this->findById($this->pdo->lastInsertId());
        }
        
        return false;
    }

    /**
     * Find customer by ID
     */
    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM customers WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Find customer by UID
     */
    public function findByUid($uid) {
        $stmt = $this->pdo->prepare("SELECT * FROM customers WHERE customer_uid = ?");
        $stmt->execute([$uid]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all customers with optional search and pagination
     */
    public function getAll($search = '', $limit = 10, $offset = 0) {
        $sql = "SELECT * FROM customers";
        $params = [];
        
        if (!empty($search)) {
            $sql .= " WHERE name LIKE ? OR email LIKE ? OR customer_uid LIKE ?";
            $searchParam = "%$search%";
            $params = [$searchParam, $searchParam, $searchParam];
        }
        
        $sql .= " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get total count of customers with optional search
     */
    public function getCount($search = '') {
        $sql = "SELECT COUNT(*) as count FROM customers";
        $params = [];
        
        if (!empty($search)) {
            $sql .= " WHERE name LIKE ? OR email LIKE ? OR customer_uid LIKE ?";
            $searchParam = "%$search%";
            $params = [$searchParam, $searchParam, $searchParam];
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }

    /**
     * Update customer
     */
    public function update($id, $data) {
        $fields = [];
        $params = [];
        
        foreach ($data as $key => $value) {
            if ($key !== 'id' && $key !== 'customer_uid') {
                $fields[] = "$key = ?";
                $params[] = $value;
            }
        }
        
        if (!empty($fields)) {
            $params[] = $id;
            $stmt = $this->pdo->prepare("UPDATE customers SET " . implode(', ', $fields) . " WHERE id = ?");
            return $stmt->execute($params);
        }
        
        return false;
    }

    /**
     * Delete customer
     */
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM customers WHERE id = ?");
        return $stmt->execute([$id]);
    }

    /**
     * Get customer orders and total spent
     */
    public function getCustomerOrders($customerId) {
        $stmt = $this->pdo->prepare("
            SELECT o.*, c.name as customer_name 
            FROM orders o 
            JOIN customers c ON o.customer_id = c.id 
            WHERE o.customer_id = ? 
            ORDER BY o.created_at DESC
        ");
        $stmt->execute([$customerId]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Calculate total spent
        $totalSpent = 0;
        foreach ($orders as $order) {
            $totalSpent += $order['grand_total'];
        }
        
        return [
            'orders' => $orders,
            'total_spent' => $totalSpent
        ];
    }
}
?>