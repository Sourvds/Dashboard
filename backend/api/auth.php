<?php
require_once '../config/database.php';
require_once '../models/User.php';
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

// Initialize database and user model
$userModel = new User($pdo);

// Route handling
if (isset($segments[2]) && $segments[2] === 'auth') {
    if (isset($segments[3])) {
        switch ($segments[3]) {
            case 'register':
                if ($method === 'POST') {
                    handleRegister($userModel);
                } else {
                    sendJsonResponse(['error' => 'Method not allowed'], 405);
                }
                break;
                
            case 'login':
                if ($method === 'POST') {
                    handleLogin($userModel);
                } else {
                    sendJsonResponse(['error' => 'Method not allowed'], 405);
                }
                break;
                
            case 'logout':
                if ($method === 'POST') {
                    handleLogout();
                } else {
                    sendJsonResponse(['error' => 'Method not allowed'], 405);
                }
                break;
                
            case 'me':
                if ($method === 'GET') {
                    handleGetUser($userModel);
                } else {
                    sendJsonResponse(['error' => 'Method not allowed'], 405);
                }
                break;
                
            default:
                sendJsonResponse(['error' => 'Endpoint not found'], 404);
        }
    } else {
        sendJsonResponse(['error' => 'Endpoint not found'], 404);
    }
} else {
    sendJsonResponse(['error' => 'Endpoint not found'], 404);
}

/**
 * Handle user registration
 */
function handleRegister($userModel) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $requiredFields = ['name', 'email', 'password'];
    $errors = validateRequiredFields($requiredFields, $input);
    
    if (!empty($errors)) {
        sendJsonResponse(['error' => 'Validation failed', 'details' => $errors], 400);
    }
    
    // Check if user already exists
    $existingUser = $userModel->findByEmail($input['email']);
    if ($existingUser) {
        sendJsonResponse(['error' => 'User with this email already exists'], 409);
    }
    
    // Create user
    $result = $userModel->create($input);
    
    if ($result) {
        // Remove password hash from response
        unset($result['password_hash']);
        sendJsonResponse(['message' => 'User registered successfully', 'user' => $result], 201);
    } else {
        sendJsonResponse(['error' => 'Failed to register user'], 500);
    }
}

/**
 * Handle user login
 */
function handleLogin($userModel) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $requiredFields = ['email', 'password'];
    $errors = validateRequiredFields($requiredFields, $input);
    
    if (!empty($errors)) {
        sendJsonResponse(['error' => 'Validation failed', 'details' => $errors], 400);
    }
    
    // Find user by email
    $user = $userModel->findByEmail($input['email']);
    
    if (!$user) {
        sendJsonResponse(['error' => 'Invalid credentials'], 401);
    }
    
    // Verify password
    if (!password_verify($input['password'], $user['password_hash'])) {
        sendJsonResponse(['error' => 'Invalid credentials'], 401);
    }
    
    // Start session
    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    
    // Remove password hash from response
    unset($user['password_hash']);
    
    sendJsonResponse([
        'message' => 'Login successful',
        'user' => $user
    ]);
}

/**
 * Handle user logout
 */
function handleLogout() {
    session_start();
    session_destroy();
    sendJsonResponse(['message' => 'Logout successful']);
}

/**
 * Handle getting current user
 */
function handleGetUser($userModel) {
    session_start();
    
    if (!isset($_SESSION['user_id'])) {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
    
    $user = $userModel->findById($_SESSION['user_id']);
    
    if (!$user) {
        sendJsonResponse(['error' => 'User not found'], 404);
    }
    
    sendJsonResponse(['user' => $user]);
}
?>