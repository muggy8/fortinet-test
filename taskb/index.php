<pre>
<?php
require_once("function.php");

if (array_key_exists("n", $_GET)){
	$result = taskB($_GET["n"]);
	echo "return ";
	var_dump($result);
}
?>
</pre>
n =
<input id="n" type="number"/>
<button onclick="document.location.search = '?n=' + document.getElementById('n').value">Go</button>
