<?php
require_once("utils.php");
isGet(true);

$path = CONTENT_FOLDER . $_GET["path"];

if (!file_exists($path)){
	http_response_code(404);
	echo json_encode([
		"message" => "Directory Not Found"
	]);
	exit();
}

// get all the contents
$contents = scandir($path);

// we dont want . and ..
$contents = array_filter($contents, function($relPath){
	if ($relPath === "." || $relPath === ".."){
		return false;
	}
	return true;
});

$contents = array_values($contents);

// now we figure out if each file is a file or a folder
$contents = array_map(function($relPath) use ($path) {
	return [
		"name" => $relPath,
		"type" => is_dir($path . $relPath) ? "dir" : "file"
	];
}, $contents);

// return the results
echo json_encode($contents);
