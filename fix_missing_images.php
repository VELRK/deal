<?php
$db = new mysqli('127.0.0.1', 'root', '', 'shopkart');

if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}

// Function to get a random valid image from a directory
function getRandomImage($dir)
{
    if (!is_dir($dir))
        return null;
    $files = scandir($dir);
    $images = [];
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..' && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
            $images[] = $dir . '/' . $file;
        }
    }
    if (empty($images))
        return null;
    return $images[array_rand($images)];
}

// Tables and columns to fix
$configs = [
    ['table' => 'categories', 'column' => 'image', 'dir' => 'assets/uploads/categories'],
    ['table' => 'subcategories', 'column' => 'image', 'dir' => 'assets/uploads/subcategories'],
    ['table' => 'products', 'column' => 'thumbnail', 'dir' => 'assets/uploads/products'],
    ['table' => 'products', 'column' => 'og_image', 'dir' => 'assets/uploads/products'],
    ['table' => 'product_images', 'column' => 'image', 'dir' => 'assets/uploads/products'],
];

$total_fixed = 0;

foreach ($configs as $config) {
    $table = $config['table'];
    $column = $config['column'];
    $dir = $config['dir'];

    $result = $db->query("SELECT id, $column FROM $table WHERE $column IS NOT NULL AND $column != ''");
    if (!$result)
        continue;

    while ($row = $result->fetch_assoc()) {
        $id = $row['id'];
        $imagePath = $row[$column];

        // Sometimes the path has a leading slash, sometimes not
        $localPath = ltrim($imagePath, '/');

        if (!file_exists($localPath)) {
            $newImage = getRandomImage($dir);
            if ($newImage) {
                $db->query("UPDATE $table SET $column = '$newImage' WHERE id = $id");
                $total_fixed++;
            }
        }
    }
}

echo "Fixed $total_fixed missing images across the project.\n";
$db->close();
?>