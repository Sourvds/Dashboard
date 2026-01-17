<?php
require_once '../config/database.php';
require_once '../models/Customer.php';
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

// Initialize database and customer model
$customerModel = new Customer($pdo);

// Check if user is authenticated (simplified for now)
session_start();
$isAuthenticated = isset($_SESSION['user_id']);

// Route handling for customers
if (isset($segments[2]) && $segments[2] === 'customers') {
    // Public routes don't require authentication in this simplified version
    
    if (isset($segments[3]) && is_numeric($segments[3])) {
        $customerId = $segments[3];
        
        switch ($method) {
            case 'GET':
                handleGetCustomer($customerModel, $customerId);
                break;
                
            case 'PUT':
                handleUpdateCustomer($customerModel, $customerId);
                break;
                
            case 'DELETE':
                handleDeleteCustomer($customerModel, $customerId);
                break;
                
            default:
                sendJsonResponse(['error' => 'Method not allowed'], 405);
        }
    } else {
        switch ($method) {
            case 'GET':
                handleGetCustomers($customerModel);
                break;
                
            case 'POST':
                handleCreateCustomer($customerModel);
                break;
                
            default:
                sendJsonResponse(['error' => 'Method not allowed'], 405);
        }
    }
} else {
    sendJsonResponse(['error' => 'Endpoint not found'], 404);
}

/**
 * Handle getting all customers with pagination and search
 */
function handleGetCustomers($customerModel) {
    $search = $_GET['search'] ?? '';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    
    $customers = $customerModel->getAll($search, $limit, $offset);
    $totalCount = $customerModel->getCount($search);
    
    sendJsonResponse([
        'customers' => $customers,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $limit,
            'total' => $totalCount,
            'total_pages' => ceil($totalCount / $limit)
        ]
    ]);
}

/**
 * Handle getting a specific customer
 */
function handleGetCustomer($customerModel, $customerId) {
    $customer = $customerModel->findById($customerId);
    
    if (!$customer) {
        sendJsonResponse(['error' => 'Customer not found'], 404);
    }
    
    // Get customer orders and total spent
    $ordersData = $customerModel->getCustomerOrders($customerId);
    
    $customer['orders'] = $ordersData['orders'];
    $customer['total_spent'] = $ordersData['total_spent'];
    
    sendJsonResponse(['customer' => $customer]);
}

/**
 * Handle creating a new customer
 */
function handleCreateCustomer($customerModel) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $requiredFields = ['name'];
    $errors = validateRequiredFields($requiredFields, $input);
    
    if (!empty($errors)) {
        sendJsonResponse(['error' => 'Validation failed', 'details' => $errors], 400);
    }
    
    $result = $customerModel->create($input);
    
    if ($result) {
        sendJsonResponse(['message' => 'Customer created successfully', 'customer' => $result], 201);
    } else {
        sendJsonResponse(['error' => 'Failed to create customer'], 500);
    }
}

/**
 * Handle updating a customer
 */
function handleUpdateCustomer($customerModel, $customerId) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Check if customer exists
    $existingCustomer = $customerModel->findById($customerId);
    if (!$existingCustomer) {
        sendJsonResponse(['error' => 'Customer not found'], 404);
    }
    
    $result = $customerModel->update($customerId, $input);
    
    if ($result) {
        $updatedCustomer = $customerModel->findById($customerId);
        sendJsonResponse(['message' => 'Customer updated successfully', 'customer' => $updatedCustomer]);
    } else {
        sendJsonResponse(['error' => 'Failed to update customer'], 500);
    }
}

/**
 * Handle deleting a customer
 */
function handleDeleteCustomer($customerModel, $customerId) {
    // Check if customer exists
    $existingCustomer = $customerModel->findById($customerId);
    if (!$existingCustomer) {
        sendJsonResponse(['error' => 'Customer not found'], 404);
    }
    
    $result = $customerModel->delete($customerId);
    
    if ($result) {
        sendJsonResponse(['message' => 'Customer deleted successfully']);
    } else {
        sendJsonResponse(['error' => 'Failed to delete customer'], 500);
    }
}
?>