<?php
require 'db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Get the JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Check if the userid and password are set
if (!isset($data['userid']) || empty($data['userid']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'User ID and new password are required.']);
    exit();
}

$userid = $data['userid'];
$password = $data['password'];

// Hash the new password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Update the password in the database
if ($stmt = $conn->prepare('UPDATE users SET password = ? WHERE userid = ?')) {
    $stmt->bind_param('si', $hashedPassword, $userid);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Password has been successfully updated.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update password.']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: Unable to prepare statement.']);
}

$conn->close();
