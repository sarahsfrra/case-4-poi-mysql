<?php

include "connection.php";

$query = "SELECT * FROM places";
$result = mysqli_query($mysql, $query);

$data = array();

while ($row = mysqli_fetch_assoc($result)) {
  $data[] = array(
    "id" => $row["id"],
    "name" => $row["name"],
    "description" => $row["description"],
    "lat" => $row["lat"],
    "lng" => $row["longitude"],
    "category" => $row["category"],
    "alamat" => $row["alamat"],
    "rating" => $row["rating"],
  );
}

echo json_encode($data);

mysqli_close($mysql);