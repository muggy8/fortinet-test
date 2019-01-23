<?php
require_once("utils.php");
isGet(true);

$path = $_GET["path"];
$file = $_GET["file"];
$targetedFile = CONTENT_FOLDER . $path . $file;
$fileFolderMetaPath = CONTENT_FOLDER . $path . META_STORE;
$fileInfo = pathinfo($file);
$fileName = $fileInfo["filename"];
$originalFileName = $fileName;
$fileExt = $fileInfo["extension"];

if (file_exists($fileFolderMetaPath)){
	if (array_key_exists($file, $fileFolderMetaPath)){
		$originalFile = $fileFolderMetaPath[$file];
		$originalFileInfo = pathinfo($originalFile);
		$originalFileName = $originalFileInfo["filename"];
	}
}

$currentDate = date("Y-m-d_h:i:sA");
// this time zone is the server's time zone but the assumption is that the server would be set to the same time zone as the client since this app is probably a local server management tool. should the requeests be authenticated, the user's timezone could be saved and be used while calculating this. 

if (file_exists($targetedFile) && !is_dir($targetedFile)){
	header("Content-Description: File Transfer");
	header("Content-Type: application/octet-stream");
	header("Expires: 0");
	header("Cache-Control: must-revalidate");
	header("Pragma: public");
	header("Content-Length: " . filesize($targetedFile));

	header('Content-Disposition: attachment; filename="' . $originalFileName . '_' . $fileName . '_' . $currentDate . '.' . $fileExt . '"');

	readfile($targetedFile);
	exit();
}
else{
	http_response_code(404);
	echo "File not found";
}
