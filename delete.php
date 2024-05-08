<?php

include "connection.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST["id"];

    $query = "DELETE FROM places WHERE id = $id";

    if (mysqli_query($mysql, $query)) {
        echo "Delete berhasil.";
    } else {
        echo "Delete gagal: " . mysqli_error($mysql);
    }
} else {
    header("Location: index.php");
    exit();
}

?>
