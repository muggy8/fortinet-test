<?php
require_once("utils.php");
isGet(true);

$path = CONTENT_FOLDER . $_GET["path"];
$pathMetaDataFile = $path . METADATA_FILE;

if (!file_exists($path)){
	http_response_code(404);
	echo json_encode([
		"message" => "Directory Not Found"
	]);
	exit();
}

if (file_exists($pathMetaDataFile)){
	$pathMetaData = json_decode(file_get_contents($pathMetaDataFile), true);
}
else{
	$pathMetaData = [];
}

// get all the contents
$contents = scandir($path);

// we dont want . and ..
$contents = array_filter($contents, function($relPath){
	if ($relPath === "." || $relPath === ".." || $relPath === METADATA_FILE){
		return false;
	}
	return true;
});

$contents = array_values($contents);

// now we figure out if each file is a file or a folder
$contents = array_map(function($relPath) use ($path, $pathMetaData) {
	return [
		"name" => $relPath,
		"srcName" => array_key_exists($relPath, $pathMetaData)
			? $pathMetaData[$relPath]
			: "",
		"type" => is_dir($path . $relPath) ? "dir" : "file"
	];
}, $contents);

// return the results
echo json_encode($contents);
