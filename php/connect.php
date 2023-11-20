<?php 
function OpenDB($port)
{
  $dbhost = "localhost";
  $dbuser = "root";
  $dbpass = "";
  $db = "datadoctors";
  $conn = new mysqli($dbhost, $dbuser, $dbpass, $db, $port) or die("Connect failed: %s\n" . $conn -> error);
  return $conn;
}
function CloseDB($conn)
{
  $conn -> close();
}
?>
