<?php
require_once("utils.php");
isDelete(true);

$file = $_GET["file"];
$folder = $_GET["path"];
$path = CONTENT_FOLDER . $folder . $file;
$metaPath = CONTENT_FOLDER . $folder . METADATA_FILE;

// if file doesn't exist we dont delete anything
if (!file_exists($path)){
	http_response_code(404);
	echo json_encode([
		"message" => "$file does not exist"
	]);
	exit();
}

// try to delete the file. since we're working with stuff on the file system, stuff might fail for various reasons (which is why all file system access in node has an error thing) so this is just incase thigns fail for some reason though it really shouldn't unless someone's messing with it
try{
	// this is the method of deleting a directory according to php.net
	if (is_dir($path)){

		// code from: https://stackoverflow.com/questions/7288029/php-delete-directory-that-is-not-empty
		function rmdir_recursive($dir) {
		    foreach(scandir($dir) as $file) {
		        if ('.' === $file || '..' === $file) continue;
		        if (is_dir("$dir/$file")) rmdir_recursive("$dir/$file");
		        else unlink("$dir/$file");
		    }
		    rmdir($dir);
		}

		rmdir_recursive($path);
	}
	else{
		// deleting a file is more complicated since we need to delete the file itself but also clear the metadata from the metadata file as well and we dont know if the metadata file exists at all or if the metadata file has any information on the file delete, this is why it's got so many nested ifs
		unlink($path);

		if (file_exists($metaPath)){
			$pathMetaData = json_decode(file_get_contents($metaPath), true);
			if (array_key_exists($file, $pathMetaData)){
				unset($pathMetaData[$file]);
				file_put_contents($metaPath, (object)json_encode($pathMetaData));
			}
		}
	}
	http_response_code(204);
}
catch(Exception $err){
	// something went wrong... not sure what could but we'll be able to debug it as they come up and add better messages in the outputs later as they come up
	http_response_code(400);
	echo json_encode([
		"message" => "$file could not be deleted",
		"debug" => $err
	]);
}
