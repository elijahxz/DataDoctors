import mysql.connector
import sys

args = len(sys.argv)

if args != 2: 
    print("invalid")
    exit(1)

password = sys.argv[1]
mydb = mysql.connector.connect(
        host = 'localhost',
        user = 'root',
        password = password,
        database = 'datadoctors'
    )

mycursor = mydb.cursor()
sql = "Insert into hospital (Id, Address, City, Zip_code, State, Phone) VALUES (%s, %s, %s, %s, %s, %s)"
val = ("1", "test", "test", "37055", "TN", "6155985590")

mycursor.execute(sql, val)
mydb.commit()
