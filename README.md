Authors: 
Elijah Atkins, Michael Butkevicius, Wasim Mondal, Jonathan Padilla

Presentation Overview: https://docs.google.com/presentation/d/16bPzXwkCddPwj9MBusU4vDVULDMgCuL5TLDygnJ30AY/edit?usp=sharing

Note: For insert.py you **must install mysql-connector-python** (pip install mysql-connector-python)

Instructions:
1. Download MySQL from the web: https://dev.mysql.com/downloads/workbench/
	-Go through all steps in the installer
   
2. Download XAMPP from the web: https://www.apachefriends.org/download.html
	
 	-Install **version 8.2.4**
	
 	-Our Application runs on port 3308, so follow these steps:

   		--Open XAMPP Control Panel

   		--On the MySQL row, Click Config -> my.ini

   		--Change the port from 3306 to 3308 and save the file
   
   	-If you are on Windows OS, Go to C://xampp/myPhpAdmin/config.inc.php (or wherever xampp is installed)

   		--Open the file and add :3308 to the variable "$cfg['Servers'][$i]['host']"

   		--Afterwords, it should look like $cfg['Servers'][$i]['host'] = '127.0.0.1:3308';

   -The reason you have to do this is because a default MySql connection uses the port 3306, so XAMPP's connection must use a different port

4. Clone the repository
	
 	-Go to C://xampp/htdocs (for mac, applications/xampp/htdocs) and clone this repository in that folder

5. Connect the XAMPP database instance to mysql workbench:
	
   -Have apache and mysql running on xampp, open mysql and hit the + by MySQL Connections
	
   -Set a connection name (ie: xamppserver)
	
   -Go to the xampp control panel and find the mysql port number

   -Insert that number into the Port input on the mysql workbench

   -Click Test Connection, then click OK

   -Open the new connection you just created

    -Steps:

   		1. Open install.sql (xampp/htdocs/datadoctors/mysql) and uncomment the first line (--create database datadoctors;)

   		2. Run the install.sql script 

   		3. In your terminal, go to the cloned repository's MySql folder (xampp/htdocs/datadoctors/MySql)

   			-run "python insert.py port username datadoctors"

   		Note: For insert.py you must install mysql-connector-python (pip install mysql-connector-python)

   			Your username should be root. ie: python insert.py 3308 root datadoctors

    -After running these steps, datadoctors should be filled with tables and entries in the tables.

    -To drop the tables in datadoctors, run drop.sql in SQL Workbench

    -To truncate the tables in datadoctors, run truncate.sql in SQL Workbench


After these steps, Open http://127.0.0.1/DataDoctors to see the website
