<?php 
include "connection.php";

$query = "SELECT * FROM places";
$result = mysqli_query($mysql, $query);

$places = array();
while ($row = mysqli_fetch_assoc($result)) {
    $places[] = $row;
}

header('Content-Type: application/json');
echo json_encode($places);
?>
