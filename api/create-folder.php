<?php
require_once("utils.php");
isPost(true);

$content = file_get_contents("php://input");
$body = json_decode($content, true);

if (file_exists(CONTENT_FOLDER . $body["path"])){
	http_response_code(409);
	echo json_encode([
		"message" => "folder already exists"
	]);
	exit();
}

mkdir(CONTENT_FOLDER . $body["path"], 0766);

http_response_code(201);
