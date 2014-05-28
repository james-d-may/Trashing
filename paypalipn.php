<?php

// STEP 1: read POST data

// Reading POSTed data directly from $_POST causes serialization issues with array data in the POST.
// Instead, read raw POST data from the input stream.
$raw_post_data = file_get_contents('php://input');
$raw_post_array = explode('&', $raw_post_data);
$myPost = array();
foreach ($raw_post_array as $keyval) {
  $keyval = explode ('=', $keyval);
  if (count($keyval) == 2)
     $myPost[$keyval[0]] = urldecode($keyval[1]);
}
// read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
$req = 'cmd=_notify-validate';
if(function_exists('get_magic_quotes_gpc')) {
   $get_magic_quotes_exists = true;
}
foreach ($myPost as $key => $value) {
   if($get_magic_quotes_exists == true && get_magic_quotes_gpc() == 1) {
        $value = urlencode(stripslashes($value));
   } else {
        $value = urlencode($value);
   }
   $req .= "&$key=$value";
}


// STEP 2: POST IPN data back to PayPal to validate

$ch = curl_init('https://www.paypal.com/cgi-bin/webscr');
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: Close'));

// In wamp-like environments that do not come bundled with root authority certificates,
// please download 'cacert.pem' from "http://curl.haxx.se/docs/caextract.html" and set
// the directory path of the certificate as shown below:
// curl_setopt($ch, CURLOPT_CAINFO, dirname(__FILE__) . '/cacert.pem');
if( !($res = curl_exec($ch)) ) {
    // error_log("Got " . curl_error($ch) . " when processing IPN data");
    curl_close($ch);
    exit;
}
curl_close($ch);


// STEP 3: Inspect IPN validation result and act accordingly
$file = 'payments.txt';
// Open the file to get existing content
$current = file_get_contents($file);

if (strcmp ($res, "VERIFIED") == 0) {
    // The IPN is verified, process it:
    // check whether the payment_status is Completed
    // check that txn_id has not been previously processed
    // check that receiver_email is your Primary PayPal email
    // check that payment_amount/payment_currency are correct
    // process the notification

    // assign posted variables to local variables
    $last_name   = urlencode($_POST['last_name']);
    $first_name  = urlencode($_POST['first_name']);
    $payer_email = urlencode($_POST['payer_email']);
    $college     = urlencode($_POST['option_selection1']);
    $ref_used    = urlencode($_POST['option_selection2']);

    $item_name   = urlencode($_POST['item_name']);
    $quantity    = urlencode($_POST['quantity']);

    $payment_status = $_POST['payment_status'];

    if (strcmp ($payment_status, "Completed") == 0) {
      // Send Google Form
      $codes = file('codes.txt'); 
      $ref_owned = "http://www.trashing.me?ref=";
      $ref_owned .= s
      $codes[0] = "";

      $fp = fopen('codes.txt', 'w'); 
      fwrite($fp, implode($codes));

      $req = "";
      $req .= "&entry.1344218879=no";
      $req .= "&entry.96823989=no";
      $req .= "&entry.919457879=" . "$last_name";
      $req .= "&entry.1063042359=" . "$first_name";
      $req .= "&entry.1807052568=" . "$ref_owned";
      $req .= "&entry.2085491606=" . "$payer_email";
      $req .= "&entry.626776194=" ."$college";
      $req .= "&entry.2136297149=" . "$ref_used";
      $req .= "&entry.386753929=" . "$item_name";
      $req .= "&entry.99604089=" . "$quantity";
      $req .= "&entry.1991253615=paypal";

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
    }

    // IPN message values depend upon the type of notification sent.
    // To loop through the &_POST array and print the NV pairs to the screen:
    foreach($_POST as $key => $value) {
      echo $key." = ". $value."<br>";
      // Append a new person to the file
      $current .= $key." = ". $value."<br>"."\n";

    }
} else if (strcmp ($res, "INVALID") == 0) {
    // IPN invalid, log for manual investigation
    echo "The response from IPN was: <b>" .$res ."</b>";
    $current .= "The response from IPN was: <b>" .$res ."</b>"."\n";
}
// Write the contents back to the file
file_put_contents($file, $current);
?>
