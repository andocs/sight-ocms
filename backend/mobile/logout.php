<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'db.php';
require 'functions.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$encodedData = file_get_contents('php://input');
$decodedData = json_decode($encodedData, true);

$response = array();

if (isset($decodedData['userid'])) {
    $userid = $decodedData['userid'];

    $stmt = $conn->prepare('UPDATE users SET remember_token = NULL WHERE userid = ?');
    $stmt->bind_param('s', $userid);
    $stmt->execute();
    $stmt->close();

    log_action($userid, 'Logout', 'User logged out', $conn);

    $response['success'] = true;
    $response['message'] = 'Logged out successfully.';
} else {
    $response['success'] = false;
    $response['message'] = 'User ID is required.';
}

echo json_encode($response);
$conn->close();
?>
