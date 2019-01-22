<?php
require_once("utils.php");
require_once("../deps/class.uploader.php");
isPost(true);

$uploaded = file_get_contents("php://input");
var_dump($uploaded);
var_dump($_FILES);
