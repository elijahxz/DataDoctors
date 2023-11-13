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
            user = user,
            password = password,
            database = database
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

file = open("insert.txt", "r")

found_table = False;
table_name = ""
table_columns = ""
sql = "Insert into %s (%s) VALUES ("

for line in file:
    # Check if a table was found, if a new one is found, next line is columns
    if found_table:
        # Reset the column string
        table_columns = ""

        # Split the list of columns
        tables = line.split(',')

        # Iterate through the list, adding them to the col string
        for i in range(len(tables)):
            if (i + 1 == len(tables)):
                table_columns += tables[i].strip()
            else: 
                table_columns += tables[i].strip() + ','
        
        # Reset the flag and skip the statements below
        found_table = False
        continue

    # No commas found? Either a new line or a new table.
    if line.find(',') < 0: 
        if line == "\n":
            continue
        else:
            table_name = line.strip()
            found_table = True
    # If we are here, the line should be values to insert into the table
    else: 
        row = line.split(",")
        value_placeholder = "%s"

        # Strip the elements, and add placeholders for sql string
        for element in range(len(row)): 
            row[element] = row[element].strip()
            if element != 0:
                value_placeholder += ", %s"

        # Convert the row values to a tuple
        values = tuple(row)
        
        # Set up the sql statement
        sql_statement = sql % (table_name, table_columns)
        sql_statement += value_placeholder + ")"
        print(sql_statement)
        print(values)

        # Execute the statement
        mycursor.execute(sql_statement, values)

mydb.commit()
