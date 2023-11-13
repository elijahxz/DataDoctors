Authors: 
Elijah, Jonathan, Michael, Wasim

Note: For insert.py you **must install mysql-connector-python** (pip install mysql-connector-python)

Instructions:
1. Download XAMPP from the web: https://www.apachefriends.org/download.html

   Install **version 8.2.4**

   If you already have mysql workbench installed, you will have to the following steps:

   	Open XAMPP Control Panel

   	On the MySQL row, Click Config -> my.ini

   		Change the port from 3306 to 3308 and save the file

   	Go to C://xampp/myPhpAdmin/config.inc.php (or whereever you installed xampp)

   		Open the file and add :3308 to the variable "$cfg['Servers'][$i]['host']"

   		Afterwords, it should look like $cfg['Servers'][$i]['host'] = '127.0.0.1:3308';

   The reason you have to do this is because a default MySql connection uses the port 3306, so XAMPP's connection must use a different port

3. Connect the XAMPP database instance to mysql workbench:

   Have apache and mysql running on xampp, open mysql and hit the + by MySQL Connections

   Set a connection name (ie: xamppserver)

   Go to the xampp control panel and find the mysql port number

   Insert that number into the Port input on the mysql workbench

   Click Test Connection, then click OK

    Open the new connection you just created, then create a database called DataDoctors
    Steps:
	1. Open MySQL and create a database called datadoctors (CREATE DATABASE datadoctors;)
	2. Open install.sql and run it inside of MySql
	3. In your terminal, run "python insert.py port username password datadoctors"
		
  		Note: The default xampp password is nothing, so pass in "". Your username is usually root. Your port number can be found on the xampp control panel \n ie: python insert.py 3308 root "" datadoctors

    After running these steps, datadoctors should be filled with tables and entries in the tables.

    To drop the tables in datadoctors, run drop.sql in SQL Workbench
    To truncate the tables in datadoctors, run truncate.sql in SQL Workbench

To get this repository to show up on xampp, do the following:
    Go to C://xampp/htdocs and clone this repository in that folder
    Open http://127.0.0.1/DataDoctors
    
