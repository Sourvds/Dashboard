<?php
require_once '../config/database.php';
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

// Initialize database and product model
$productModel = new Product($pdo);

// Route handling for products
if (isset($segments[2]) && $segments[2] === 'products') {
    if (isset($segments[3]) && is_numeric($segments[3])) {
        $productId = $segments[3];
        
        switch ($method) {
            case 'GET':
                handleGetProduct($productModel, $productId);
                break;
                
            case 'PUT':
                handleUpdateProduct($productModel, $productId);
                break;
                
            case 'DELETE':
                handleDeleteProduct($productModel, $productId);
                break;
                
            default:
                sendJsonResponse(['error' => 'Method not allowed'], 405);
        }
    } else {
        switch ($method) {
            case 'GET':
                handleGetProducts($productModel);
                break;
                
            case 'POST':
                handleCreateProduct($productModel);
                break;
                
            default:
                sendJsonResponse(['error' => 'Method not allowed'], 405);
        }
    }
} else {
    sendJsonResponse(['error' => 'Endpoint not found'], 404);
}

/**
 * Handle getting all products with filters
 */
function handleGetProducts($productModel) {
    $filters = [
        'category' => $_GET['category'] ?? '',
        'status' => $_GET['status'] ?? '',
        'search' => $_GET['search'] ?? ''
    ];
    
    $products = $productModel->getAll($filters);
    
    sendJsonResponse(['products' => $products]);
}

/**
 * Handle getting a specific product
 */
function handleGetProduct($productModel, $productId) {
    $product = $productModel->findById($productId);
    
    if (!$product) {
        sendJsonResponse(['error' => 'Product not found'], 404);
    }
    
    // Get product analytics
    $analytics = $productModel->getProductAnalytics($productId);
    
    $product['analytics'] = $analytics;
    
    sendJsonResponse(['product' => $product]);
}

/**
 * Handle creating a new product
 */
function handleCreateProduct($productModel) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $requiredFields = ['name', 'category', 'cost_price', 'selling_price'];
    $errors = validateRequiredFields($requiredFields, $input);
    
    if (!empty($errors)) {
        sendJsonResponse(['error' => 'Validation failed', 'details' => $errors], 400);
    }
    
    $result = $productModel->create($input);
    
    if ($result) {
        sendJsonResponse(['message' => 'Product created successfully', 'product' => $result], 201);
    } else {
        sendJsonResponse(['error' => 'Failed to create product'], 500);
    }
}

/**
 * Handle updating a product
 */
function handleUpdateProduct($productModel, $productId) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Check if product exists
    $existingProduct = $productModel->findById($productId);
    if (!$existingProduct) {
        sendJsonResponse(['error' => 'Product not found'], 404);
    }
    
    $result = $productModel->update($productId, $input);
    
    if ($result) {
        $updatedProduct = $productModel->findById($productId);
        sendJsonResponse(['message' => 'Product updated successfully', 'product' => $updatedProduct]);
    } else {
        sendJsonResponse(['error' => 'Failed to update product'], 500);
    }
}

/**
 * Handle deleting a product
 */
function handleDeleteProduct($productModel, $productId) {
    // Check if product exists
    $existingProduct = $productModel->findById($productId);
    if (!$existingProduct) {
        sendJsonResponse(['error' => 'Product not found'], 404);
    }
    
    $result = $productModel->delete($productId);
    
    if ($result) {
        sendJsonResponse(['message' => 'Product deleted successfully']);
    } else {
        sendJsonResponse(['error' => 'Failed to delete product'], 500);
    }
}
?>