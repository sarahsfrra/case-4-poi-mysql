<?php

include "connection.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST["id"];
    $nama = $_POST["nama"];
    $kategori = $_POST["kategori"];
    $deskripsi = $_POST["deskripsi"];
    $lat = $_POST["lat"];
    $lng = $_POST["lng"];
    $alamat = $_POST["alamat"];
    $rating = $_POST["rating"];

    $query = "UPDATE places SET name = '$nama', description = '$deskripsi', lat = $lat, lng = $lng, category = '$kategori', alamat = '$alamat', rating = $rating WHERE id = $id";

    if (mysqli_query($mysql, $query)) {
        echo "Update successful.";
    } else {
        echo "Update failed: " . mysqli_error($mysql);
    }
} else {
    header("Location: index.php");
    exit();
}

?>
