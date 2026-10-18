<?php
/**
 * One-time: recompress live hero banners (max width 1600, JPEG q75).
 * Run: php database/compress_hero_banners.php
 */
$dir = dirname(__DIR__) . '/assets/uploads/banners/';
$files = [
    'banners_6a991d869b5b3.jpg',
    'banners_6a9687af4d921.jpg',
    'banners_6a97fe8fe7b2c.jpg',
    'banners_6a97ffecdfb0e.jpg',
];
$maxW = 1600;
$q = 75;

foreach ($files as $f) {
    $path = $dir . $f;
    if (!is_file($path)) {
        echo "missing {$f}\n";
        continue;
    }
    $before = filesize($path);
    $info = @getimagesize($path);
    if (!$info) {
        echo "bad {$f}\n";
        continue;
    }
    [$w, $h, $type] = $info;
    if ($type === IMAGETYPE_JPEG) {
        $src = imagecreatefromjpeg($path);
    } elseif ($type === IMAGETYPE_PNG) {
        $src = imagecreatefrompng($path);
    } elseif ($type === IMAGETYPE_WEBP && function_exists('imagecreatefromwebp')) {
        $src = imagecreatefromwebp($path);
    } else {
        echo "skip type {$f}\n";
        continue;
    }
    if (!$src) {
        echo "fail open {$f}\n";
        continue;
    }
    $nw = $w;
    $nh = $h;
    if ($w > $maxW) {
        $nw = $maxW;
        $nh = (int) round($h * ($maxW / $w));
    }
    $dst = imagecreatetruecolor($nw, $nh);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
    imagejpeg($dst, $path, $q);
    imagedestroy($src);
    imagedestroy($dst);
    clearstatcache(true, $path);
    $after = filesize($path);
    echo sprintf(
        "%s: %d KB -> %d KB (%d x %d -> %d x %d)\n",
        $f,
        (int) round($before / 1024),
        (int) round($after / 1024),
        $w,
        $h,
        $nw,
        $nh
    );
}
