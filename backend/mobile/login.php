<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('error_log', './php-error.log');
error_reporting(E_ALL);

require 'db.php';
require 'functions.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$encodedData = file_get_contents('php://input');
$decodedData = json_decode($encodedData, true);
error_log("Encoded Data: " . $encodedData); // Log the received data
$email = $decodedData['email'];
$password = $decodedData['password'];
$remember_me = $decodedData['remember_me'];

$response = array();

// Update the query to select role_name as well
$stmt = $conn->prepare('SELECT userid, password, name, email, role_name FROM users LEFT JOIN roles ON users.role = roles.role_id WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($userid, $hashed_password, $name, $email, $role_name); // Bind role_name as well
    $stmt->fetch();

    // Verify the password
    if (password_verify($password, $hashed_password)) {

        log_action($userid, 'Login', 'User logged in', $conn);

        // Set a cookie if "Remember Me" is checked
        if ($remember_me) {
            $cookie_value = bin2hex(random_bytes(32)); // Generate random token
            setcookie('remember_me', $cookie_value, time() + (86400 * 30), "/"); // Set cookie for 30 days

            $stmt = $conn->prepare('UPDATE users SET remember_token = ? WHERE userid = ?');
            $stmt->bind_param('ss', $cookie_value, $userid);
            $stmt->execute();
        }

        // Include role_name in the response
        $response['success'] = true;
        $response['message'] = 'You have successfully logged in!';
        $response['user'] = [
            'userid' => $userid,
            'name' => $name,
            'email' => $email,
            'role' => $role_name,
        ];
    } else {
        // Password is incorrect
        $response['success'] = false;
        $response['message'] = 'Incorrect password!';
    }
} else {
    // Username not found
    $response['success'] = false;
    $response['message'] = 'Incorrect username!';
}

echo json_encode($response);
$stmt->close();
$conn->close();
?>
