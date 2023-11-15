<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>Data Doctors</title>
	<!-- link to the stylesheet for this page -->
    <!-- <link rel="stylesheet" href="index.css"> -->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
</head>
<body>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>


	<div class="text-center text-primary-emphasis">
		<h1>My first PHP page</h1>
	</div>


	<?php
	  require ("external_php/connect.php");
	  $conn = OpenDb("3308");
	  $test = $conn -> query("Select * From Department");
	  echo "Hello World!";
	  $counter = 1;
	?>
	  <button id = "test"> Hello </button>
	  
	<div class="row">
		<div class="col-3">
		</div>
		<div class="col-6">
			<table class = "table table-bordered table-dark">
				<tr> 
					<th class="text-center"> ID </th>
					<th class="text-center"> Dep Name </th>
				</tr>
				<?php while ($row = $test -> fetch_row()): ?>
					<tr class="text-center">
						<td>
							<?php echo $row[0] ?>
						</td>
						<td>
							<?php echo $row[1] ?>
						</td>
					</tr>
				<?php endwhile; ?>
			</table>
		</div>
		<div class="col-3">
		</div>
	</div>
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
