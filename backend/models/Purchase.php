<?php
require_once '../config/database.php';
require_once '../utils/helpers.php';

class Purchase {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Create a new purchase
     */
    public function create($data) {
        try {
            $this->pdo->beginTransaction();
            
            // Generate unique purchase number
            $purchaseNumber = generatePurchaseNumber($this->pdo);
            
            // Create the purchase
            $stmt = $this->pdo->prepare("INSERT INTO purchases (purchase_number, supplier, user_id, purchase_date, total_amount) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $purchaseNumber,
                $data['supplier'],
                $data['user_id'],
                $data['purchase_date'],
                $data['total_amount']
            ]);
            
            $purchaseId = $this->pdo->lastInsertId();
            
            // Create purchase items and update product stock
            foreach ($data['items'] as $item) {
                // Add purchase item
                $stmt = $this->pdo->prepare("INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_cost, total_cost) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([
                    $purchaseId,
                    $item['product_id'],
                    $item['quantity'],
                    $item['unit_cost'],
                    $item['total_cost']
                ]);
                
                // Update product stock
                $stmt = $this->pdo->prepare("UPDATE products SET current_stock = current_stock + ? WHERE id = ?");
                $stmt->execute([$item['quantity'], $item['product_id']]);
            }
            
            $this->pdo->commit();
            
            // Return the created purchase with items
            return $this->getById($purchaseId);
        } catch (Exception $e) {
            $this->pdo->rollback();
            throw $e;
        }
    }

    /**
     * Get purchase by ID with items
     */
    public function getById($id) {
        // Get purchase details
        $stmt = $this->pdo->prepare("
            SELECT p.*, u.name as user_name
            FROM purchases p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        ");
        $stmt->execute([$id]);
        $purchase = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$purchase) {
            return null;
        }
        
        // Get purchase items
        $stmt = $this->pdo->prepare("
            SELECT pi.*, pr.name as product_name
            FROM purchase_items pi
            JOIN products pr ON pi.product_id = pr.id
            WHERE pi.purchase_id = ?
        ");
        $stmt->execute([$id]);
        $purchase['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $purchase;
    }

    /**
     * Get all purchases
     */
    public function getAll($limit = 50) {
        $stmt = $this->pdo->prepare("
            SELECT p.*, u.name as user_name
            FROM purchases p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
            LIMIT ?
        ");
        $stmt->execute([$limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>