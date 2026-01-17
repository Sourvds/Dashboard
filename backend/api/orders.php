<?php
require_once '../config/database.php';
require_once '../models/Order.php';
require_once '../models/Product.php';
require_once '../utils/helpers.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));

// Initialize database and order model
$orderModel = new Order($pdo);
$productModel = new Product($pdo);

// Route handling for orders
if (isset($segments[2]) && $segments[2] === 'orders') {
    if (isset($segments[3]) && is_numeric($segments[3])) {
        $orderId = $segments[3];
        
        switch ($method) {
            case 'GET':
                handleGetOrder($orderModel, $orderId);
                break;
                
            default:
                sendJsonResponse(['error' => 'Method not allowed'], 405);
        }
    } else {
        switch ($method) {
            case 'GET':
                handleGetOrders($orderModel);
                break;
                
            case 'POST':
                handleCreateOrder($orderModel, $productModel);
                break;
                
            default:
                sendJsonResponse(['error' => 'Method not allowed'], 405);
        }
    }
} else {
    sendJsonResponse(['error' => 'Endpoint not found'], 404);
}

/**
 * Handle getting all orders with filters
 */
function handleGetOrders($orderModel) {
    $filters = [
        'customer_id' => $_GET['customer_id'] ?? '',
        'user_id' => $_GET['user_id'] ?? '',
        'date_from' => $_GET['date_from'] ?? '',
        'date_to' => $_GET['date_to'] ?? '',
        'limit' => $_GET['limit'] ?? 50
    ];
    
    // Remove empty filters
    $filters = array_filter($filters, function($value) {
        return $value !== '';
    });
    
    $orders = $orderModel->getAll($filters);
    
    sendJsonResponse(['orders' => $orders]);
}

/**
 * Handle getting a specific order
 */
function handleGetOrder($orderModel, $orderId) {
    $order = $orderModel->getById($orderId);
    
    if (!$order) {
        sendJsonResponse(['error' => 'Order not found'], 404);
    }
    
    sendJsonResponse(['order' => $order]);
}

/**
 * Handle creating a new order
 */
function handleCreateOrder($orderModel, $productModel) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $requiredFields = ['customer_id', 'user_id', 'order_date', 'subtotal', 'tax', 'grand_total', 'items'];
    $errors = validateRequiredFields($requiredFields, $input);
    
    if (!empty($errors)) {
        sendJsonResponse(['error' => 'Validation failed', 'details' => $errors], 400);
    }
    
    // Validate items
    if (empty($input['items']) || !is_array($input['items'])) {
        sendJsonResponse(['error' => 'Items are required and must be an array'], 400);
    }
    
    // Check product stock availability
    foreach ($input['items'] as $item) {
        $product = $productModel->findById($item['product_id']);
        if (!$product) {
            sendJsonResponse(['error' => 'Product not found with ID: ' . $item['product_id']], 404);
        }
        
        if ($product['current_stock'] < $item['quantity']) {
            sendJsonResponse(['error' => 'Insufficient stock for product: ' . $product['name']], 400);
        }
    }
    
    try {
        $result = $orderModel->create($input);
        
        if ($result) {
            sendJsonResponse(['message' => 'Order created successfully', 'order' => $result], 201);
        } else {
            sendJsonResponse(['error' => 'Failed to create order'], 500);
        }
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Failed to create order: ' . $e->getMessage()], 500);
    }
}
?>