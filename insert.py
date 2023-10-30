import mysql.connector
import sys

def usage():
    print("Usage: python %s <user> <password> <database name>" % (sys.argv[0]))
    print("\t<user>: Can be root or another user set up in your sql database")
    print("\t<password>: Account password used to get into mysql")
    print("\t<database name>: Name of database being accessed")
    print("\tIe: python %s root myPassword1 datadoctors" % (sys.argv[0]))
    print("\tNote: This script assumes you will be using localhost")

def connect_to_database(user, password, database):
    try:
        mydb = mysql.connector.connect(
            host = 'localhost',
            user = 'root',
            password = password,
            database = 'datadoctors'
        )
    except Exception:
        print("Error: Connection to the database has failed") 
        print("\tPlease check your password and make sure your database is named 'datadoctors")
        exit(1)
    return mydb
    
if len(sys.argv) != 4: 
    usage()
    exit(1)
# Setup the database connection
mydb = connect_to_database(sys.argv[1], sys.argv[2], sys.argv[3])

# Setup a cursor
mycursor = mydb.cursor()

file = open("insert.py", "r")

#for line in file: 
#    if line.search
#exit(1)

sql = "Insert into hospital (Id, Address, City, Zip_code, State, Phone) VALUES (%s, %s, %s, %s, %s, %s)"
val = ("1", "test", "test", "37055", "TN", "6155985590")

mycursor.execute(sql, val)


mydb.commit()
