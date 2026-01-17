<?php
/**
 * Utility functions for the inventory management system
 */

/**
 * Generate a unique customer ID in the format CUST-000001
 * @param PDO $pdo Database connection
 * @return string Unique customer ID
 */
function generateCustomerUID($pdo) {
    // Get the last customer ID from the database
    $stmt = $pdo->query("SELECT MAX(id) as max_id FROM customers");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $lastId = $result['max_id'] ?? 0;
    
    // Increment and pad with leading zeros
    $nextId = $lastId + 1;
    return 'CUST-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
}

/**
 * Generate a unique order number in the format ORD-000001
 * @param PDO $pdo Database connection
 * @return string Unique order number
 */
function generateOrderNumber($pdo) {
    // Get the last order ID from the database
    $stmt = $pdo->query("SELECT MAX(id) as max_id FROM orders");
    $result = $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $lastId = $result['max_id'] ?? 0;
    
    // Increment and pad with leading zeros
    $nextId = $lastId + 1;
    return 'ORD-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
}

/**
 * Generate a unique purchase number in the format PUR-000001
 * @param PDO $pdo Database connection
 * @return string Unique purchase number
 */
function generatePurchaseNumber($pdo) {
    // Get the last purchase ID from the database
    $stmt = $pdo->query("SELECT MAX(id) as max_id FROM purchases");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $lastId = $result['max_id'] ?? 0;
    
    // Increment and pad with leading zeros
    $nextId = $lastId + 1;
    return 'PUR-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
}

/**
 * Send JSON response
 * @param mixed $data Data to send
 * @param int $statusCode HTTP status code
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Validate required fields in request
 * @param array $requiredFields List of required fields
 * @param array $data Request data
 * @return array Validation errors
 */
function validateRequiredFields($requiredFields, $data) {
    $errors = [];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $errors[] = "$field is required";
        }
    }
    return $errors;
}
?>