<?php
// Include your database connection file
include 'db.php'; // Change this to your actual database connection file

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Create an empty array to hold the response data
$response = array();

try {
    // Your SQL query
    $query = 'SELECT * FROM route';
    
    // Execute the query
    $result = $conn->query($query);

    // Check if there are results
    if ($result->num_rows > 0) {
        // Fetch all results into an array
        while ($row = $result->fetch_assoc()) {
            $response[] = $row;
        }

        // Return success response
        echo json_encode([
            'success' => true,
            'data' => $response
        ]);
    } else {
        // Return no data response
        echo json_encode([
            'success' => false,
            'message' => 'No terminals found.'
        ]);
    }
} catch (Exception $e) {
    // Handle any errors
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

// Close the database connection
$conn->close();
?>

