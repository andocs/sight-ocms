<?php
date_default_timezone_set('Asia/Manila');

require 'db.php'; // Ensure your database connection is set up properly
require 'functions.php';

// Set the header to return JSON response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Get the input data
$inputData = json_decode(file_get_contents('php://input'), true);
$response = array();

// Check if required fields are set and not empty
if (
    !isset($inputData['name'], $inputData['username'], $inputData['password'], $inputData['email']) ||
    empty($inputData['name']) || empty($inputData['username']) || empty($inputData['password']) || empty($inputData['email'])
) {
    $response['success'] = false;
    $response['message'] = 'Please complete the registration form!';
    echo json_encode($response);
    exit();
}

$name = $inputData['name'];
$email = $inputData['email'];
$username = $inputData['username'];
$password = $inputData['password'];

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['success'] = false;
    $response['message'] = 'Email is not valid!';
    echo json_encode($response);
    exit();
}

// Validate username (alphanumeric)
if (!preg_match('/^[a-zA-Z0-9]+$/', $username)) {
    $response['success'] = false;
    $response['message'] = 'Username is not valid!';
    echo json_encode($response);
    exit();
}

// Validate password complexity
if (strlen($password) > 20 || strlen($password) < 8) {
    $response['success'] = false;
    $response['message'] = 'Password must be between 8 and 20 characters long!';
    echo json_encode($response);
    exit();
}
if (!preg_match('/[A-Z]/', $password)) {
    $response['success'] = false;
    $response['message'] = 'Password must include at least one uppercase letter!';
    echo json_encode($response);
    exit();
}
if (!preg_match('/[a-z]/', $password)) {
    $response['success'] = false;
    $response['message'] = 'Password must include at least one lowercase letter!';
    echo json_encode($response);
    exit();
}
if (!preg_match('/[0-9]/', $password)) {
    $response['success'] = false;
    $response['message'] = 'Password must include at least one number!';
    echo json_encode($response);
    exit();
}
if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
    $response['success'] = false;
    $response['message'] = 'Password must include at least one special character!';
    echo json_encode($response);
    exit();
}

// Check if username already exists
if ($stmt = $conn->prepare('SELECT userid FROM users WHERE username = ?')) {
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->close();
        $response['success'] = false;
        $response['message'] = 'Username exists, please choose another!';
        echo json_encode($response);
        exit();
    } else {
        // Insert new user
        if ($stmt = $conn->prepare('INSERT INTO users (name, username, password, email, verification_code, status, role) VALUES (?, ?, ?, ?, ?, ?, ?)')) {
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $verification_code = mt_rand(100000, 999999);
            $status = 'inactive';
            $role = 3;

            $stmt->bind_param('ssssssi', $name, $username, $password_hash, $email, $verification_code, $status, $role);

            if ($stmt->execute()) {
                // Send verification email
                $subject = 'Account Verification';
                $body = '<p>Your verification code is: <strong>' . $verification_code . '</strong>. It will expire within 1 minute.</p>';
                $mailSent = sendMail($email, $subject, $body);

                if ($mailSent == 'success') {
                    $response['success'] = true;
                    $response['message'] = 'Registration successful! Please check your email for verification.';
                    echo json_encode($response);
                } else {
                    $response['success'] = false;
                    $response['message'] = 'Error sending email: ' . $mailSent;
                    echo json_encode($response);
                }
            } else {
                $response['success'] = false;
                $response['message'] = 'Error inserting user: ' . $stmt->error;
                echo json_encode($response);
            }
            $stmt->close();
        } else {
            $response['success'] = false;
            $response['message'] = 'Could not prepare statement for user insertion.';
            echo json_encode($response);
        }
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Could not prepare statement for username check.';
    echo json_encode($response);
}

$conn->close();
?>
