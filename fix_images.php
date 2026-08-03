<?php
$mysqli = new mysqli("127.0.0.1", "root", "", "shopkart");
$result = $mysqli->query("SELECT id FROM products");
$images = [
    "assets/uploads/products/products_6a0c04cc45f5e.jpeg",
    "assets/uploads/products/products_6a0c04cc46989.jpeg",
    "assets/uploads/products/products_6a0c04cc46d14.jpeg",
    "assets/uploads/products/products_6a0c04cc46f6c.jpeg",
    "assets/uploads/products/products_6a0c04cc4717d.jpeg",
    "assets/uploads/products/products_6a0c04cc4770c.jpeg",
    "assets/uploads/products/products_6a0c04cc47a2c.jpeg",
    "assets/uploads/products/products_6a0c0583ca3e7.jpeg"
];
$i = 0;
while ($row = $result->fetch_assoc()) {
    $img = $images[$i % count($images)];
    $id = $row['id'];
    $mysqli->query("UPDATE products SET thumbnail = '$img' WHERE id = $id");
    echo "Updated product $id with $img\n";
    $i++;
}
?>
