<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>Data Doctors</title>
	<!-- link to the stylesheet for this page -->
    <link rel="stylesheet" href="index.css">
</head>
<body>

	  <h1>My first PHP page</h1>
	<?php
	  require ("external_php/connect.php");
	  $conn = OpenDb("3308");
	  $test = $conn -> query("Select * From Department");
	  echo "Hello World!";
	  $counter = 1;
	?>
	  <button id = "test"> Hello </button>
	<table class = "generic_table">
		<tr> 
			<th> ID </th>
			<th> Dep Name </th>
		</tr>
		<?php while ($row = $test -> fetch_row()): ?>
			<tr>
				<td>
					<?php echo $row[0] ?>
				</td>
				<td>
					<?php echo $row[1] ?>
				</td>
			</tr>
		<?php endwhile; ?>
	</table>
	<?php $test -> free_result(); ?>
</body>

<?php 
	CloseDB($conn);
?>
<!-- Google's jQuery CDN -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

<!-- Link to the javascript file used for our page -->
<script src="index.js"></script>

</html>
