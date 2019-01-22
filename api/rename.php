<?php
require_once("utils.php");
isPost(true);

$content = file_get_contents("php://input");
$body = json_decode($content, true);

$path = $body["path"];
$oldName = $body["oldName"];
$newName = $body["newName"];

$fileFolder = CONTENT_FOLDER . $path;
$fileFolderMetaPath = $fileFolder . METADATA_FILE;
$targetedFile = $fileFolder . $oldName;
$targetedFileNewName = $fileFolder . $newName;

if ($newName === $oldName){
	exit();
}

if (!is_dir($fileFolder)){
	http_response_code(404);
	echo json_encode([
		"message" => "$path not found"
	]);
	exit();
}

if (!file_exists($targetedFile)){
	http_response_code(404);
	echo json_encode([
		"message" => "$oldName does not exist anymore"
	]);
	exit();
}

// ok we now manage our meta file if the targeted file is not a directory
if (file_exists($targetedFile) && !is_dir($targetedFile)){
	if (file_exists($fileFolderMetaPath)){
		$fileFolderMeta = json_decode(file_get_contents($fileFolderMetaPath), true);

		if (array_key_exists($oldName, $fileFolderMeta)){
			$sourceName = $fileFolderMeta[$oldName];
			unset($fileFolderMeta[$oldName]);
			$fileFolderMeta[$newName] = $sourceName;
		}
		else{
			$fileFolderMeta[$newName] = $oldName;
		}
	}
	else{
		$fileFolderMeta = [
			$newName => $oldName
		];
	}

	file_put_contents(
		$fileFolderMetaPath,
		json_encode($fileFolderMeta)
	);
}
