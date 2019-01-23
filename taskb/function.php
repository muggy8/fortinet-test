<?php

function taskB($n){
	$running = $n;
	$missing = [
		"0" => true,
		"1" => true,
		"2" => true,
		"3" => true,
		"4" => true,
		"5" => true,
		"6" => true,
		"7" => true,
		"8" => true,
		"9" => true,
	];

	$end = 100;
	for($i = 1; $i <= $end; $i++){
		$toCheck = (string)$running;
		echo "Numbers missing = " . implode(", ", array_keys($missing)). PHP_EOL;
		echo  "n * $i = $toCheck ". PHP_EOL . PHP_EOL;

		$length =  strlen($toCheck);
		for($l = 0; $l < $length; $l++) {
			if (array_key_exists($toCheck[$l], $missing)){
				unset($missing[$toCheck[$l]]);
				$missingCount = count($missing);
				if (!$missingCount){
					return $running;
				}
			}
		}

		// since running is n * i and n * i + n = n*(i+1). to get the next number, i can just take running and multiply it by n
		$running = $running + $n;
	}

	return false;
}
