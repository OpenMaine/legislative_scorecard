<?php

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	$txt = file_get_contents('bills.txt');

	$bills_raw = explode("\n\n\n\n--\n\n\n\n\n", $txt);

	$bills = array();

	foreach($bills_raw as $b){
		$fields = explode("\n\n\n", $b);
		$bill = array();

		foreach($fields as $f){

			$lines =  explode("\n", $f);
			$fname = strtolower(explode('# ', $lines[0])[1]);
			$fname = str_replace(' ', '_', $fname);

			array_shift($lines);

			if(count($lines) == 1) {
				$value = $lines[0];
			}
			else {
				$value = '';
				foreach($lines as $f){
					if($f == '') continue;
					$value .= $f . "\n\n";
				}
			}

			$bill[$fname] = $value;


		}

		$bills[] = $bill;

	}

	
	$myfile = fopen("bills.json", "w") or die("Unable to open file!");
	$txt = json_encode($bills, JSON_PRETTY_PRINT);
	fwrite($myfile, $txt);
	fclose($myfile);


