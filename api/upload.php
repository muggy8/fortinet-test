<?php
require_once("utils.php");
require_once("../deps/class.uploader.php");
isPost(true);

$newName = $_POST["name"];
$file = $_FILES["file"];
$originalName = $file["name"];
$fileFolder = CONTENT_FOLDER . $_POST["folder"];

if ($newName === $originalName){
	$newName = null;
}

// file size validation. we are using base 10 for kilo and mega cuz it's just easier to read this way and most computer storages uses this anyways
if ($file["size"] < 1000 || $file["size"] > 1000000){
	http_response_code(422);
	echo json_encode([
		"message" => "File size out of allowed range: 1kb - 1mb"
	]);
	exit();
}

// we now have the metadata storage in memory. we now check if the file has a new name or not. if it does then we will record it
if ($newName){

	// check for the existence of the metadata file and create it if it's not there
	$containingFolderMetaDataPath = $fileFolder . METADATA_FILE;

	if (!file_exists($containingFolderMetaDataPath)){
		file_put_contents(
			$containingFolderMetaDataPath,
			json_encode($containingFolderMetaData = (object)[])
		);
	}
	else{
		$containingFolderMetaData = json_decode(file_get_contents($containingFolderMetaDataPath));
	}

	$containingFolderMetaData[$newName] = $originalName;
	file_put_contents(
		$containingFolderMetaDataPath,
		json_encode($containingFolderMetaData)
	);
}

// ok now we're done with all that, we can then proceed to do the uploader things
$uploader = new Uploader();

$uploadStatus = $uploader->upload($_FILES["files"], [
	"required" => true,
	"extensions" => [
		"css",
		"html",
		"php",
		"js"
	],
	"uploadDir" => $fileFolder,
	"title" => $newName ?: $originalName,
	"replace" => true,
	"perms" => 766
]);

$output = [
	"uploadedTo" => $fileFolder,
	"uploadStatus" => $uploadStatus
];
if($uploadStatus['hasErrors']){
    $output["debug"] = $uploadStatus['errors'];
	$output["message"] = "Upload failed";
	http_response_code(422);
}

echo json_encode($output);
