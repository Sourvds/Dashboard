<?php
require_once '../config/database.php';

class User {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Create a new user
     */
    public function create($data) {
        $stmt = $this->pdo->prepare("INSERT INTO users (name, email, password_hash, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)");
        return $stmt->execute([
            $data['name'],
            $data['email'],
            password_hash($data['password'], PASSWORD_DEFAULT),
            $data['phone'] ?? null,
            $data['address'] ?? null,
            $data['role'] ?? 'staff'
        ]);
    }

    /**
     * Find user by email
     */
    public function findByEmail($email) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Find user by ID
     */
    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT id, name, email, phone, address, role, created_at, updated_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all users
     */
    public function getAll() {
        $stmt = $this->pdo->query("SELECT id, name, email, phone, address, role, created_at, updated_at FROM users");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Update user
     */
    public function update($id, $data) {
        $fields = [];
        $params = [];
        
        foreach ($data as $key => $value) {
            if ($key !== 'id' && $key !== 'password') {
                $fields[] = "$key = ?";
                $params[] = $value;
            }
        }
        
        if (!empty($fields)) {
            $params[] = $id;
            $stmt = $this->pdo->prepare("UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?");
            return $stmt->execute($params);
        }
        
        return false;
    }

    /**
     * Update user password
     */
    public function updatePassword($id, $newPassword) {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
        return $stmt->execute([$hashedPassword, $id]);
    }

    /**
     * Delete user
     */
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>