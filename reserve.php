<?php
  $name     = urlencode($_POST['name']);
  $email    = urlencode($_POST['email']);
  $phone    = urlencode($_POST['phone']);
  $item     = urlencode($_POST['item']);
  $ref_used = urlencode($_POST['refcode']);

  // Send Google Form
  $codes = file('codes.txt'); 
  $ref_owned = "http://www.trashing.me?ref=";
  $ref_owned .= substr($codes[0], 0, 9);
  $codes[0] = "";

  $fp = fopen('codes.txt', 'w'); 
  fwrite($fp, implode($codes));

  $req = "";
  $req .= "&entry.1344218879=no";
  $req .= "&entry.96823989=no";
  $req .= "&entry.1063042359=" . "$name";
  $req .= "&entry.2085491606=" . "$email";
  $req .= "&entry.1048953884=" . "$phone";
  $req .= "&entry.386753929=" . "$item";
  $req .= "&entry.2136297149=" . "$ref_used";
  $req .= "&entry.1807052568=" . "$ref_owned";
  $req .= "&entry.99604089=" . "1";
  $req .= "&entry.1991253615=reserved";

  $ch = curl_init('https://docs.google.com/forms/d/1A0Q_pWOKV-H1mQ_14YTw2OsmZnme7A-r9LB5VFP5OZg/formResponse');
  curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
  curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: Close'));

  $res = curl_exec($ch);
  curl_close($ch);

  header( 'Location: http://www.trashing.me/thanks.html' ) ;
?>
