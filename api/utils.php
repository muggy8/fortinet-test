<?php
function isPost($exclusive){
	$isPost = $_SERVER['REQUEST_METHOD'] === 'POST';

	if (!$isPost && $exclusive) {
	    http_response_code(404);
		exit();
	}
	else if ($isPost){
		return true;
	}
	else{
		return false;
	}
}

function isGet($exclusive){
	$isGet = $_SERVER['REQUEST_METHOD'] === 'GET';

	if (!$isGet && $exclusive) {
	    http_response_code(404);
		exit();
	}
	else if ($isGet){
		return true;
	}
	else{
		return false;
	}
}

define("CONTENT_FOLDER", dirname(__DIR__) . "/files");

if (!file_exists(CONTENT_FOLDER)){
	mkdir(CONTENT_FOLDER, 0766);
}
