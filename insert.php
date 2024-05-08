<?php 

include "connection.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.php");
    exit();
}

$nama = $_POST["nama"];
$kategori = $_POST["kategori"];
$deskripsi = $_POST["deskripsi"];
$lat = $_POST["lat"];
$lng = $_POST["lng"];
$alamat = $_POST["alamat"];
$rating = $_POST["rating"];

$query = "INSERT INTO places (name, description, lat, lng, category, alamat, rating) VALUES ('$nama', '$deskripsi', $lat, $lng, '$kategori', '$alamat', '$rating')";

mysqli_query($mysql, $query);