<?php
require 'db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Get the JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Check if the email is set
if (!isset($data['email']) || empty($data['email'])) {
    echo json_encode(['success' => false, 'message' => 'Email is required.']);
    exit();
}

$email = $data['email'];

// Validate the email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit();
}

// Check if the email exists in the database
if ($stmt = $conn->prepare('SELECT userid FROM users WHERE email = ?')) {
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($userid);
        $stmt->fetch();
        // Email exists, return userid
        echo json_encode(['success' => true, 'message' => 'Email is valid.', 'userid' => $userid]);
    } else {
        // Email does not exist
        echo json_encode(['success' => false, 'message' => 'Email not found.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: Unable to prepare statement.']);
}

$conn->close();
