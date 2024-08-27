<?php
define('SERVERNAME','localhost');
define('USERNAME','root');
define('PASSWORD','');
define('DBNAME','pasigdbtrms');

$conn = new mysqli(SERVERNAME, USERNAME, PASSWORD, DBNAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
