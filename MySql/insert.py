import mysql.connector
import sys

def usage():
    print("Usage: python %s <port> <user> <database name>" % (sys.argv[0]))
    print("\t<port>: Port to access the local mysql server (for default port use 3306)")
    print("\t<user>: Can be root or another user set up in your sql database")
    print("\t<database name>: Name of database being accessed")
    print("\tIe: python %s root datadoctors" % (sys.argv[0]))
    print("\tNote: This script assumes you will be using localhost, with no password")

def connect_to_database(port, user, database):
    try:
        mydb = mysql.connector.connect(
            host = '127.0.0.1',
            port = port,
            password = "",
            user = user,
            database = database
        )
    except Exception:
        print("Error: Connection to the database has failed") 
        exit(1)
    return mydb

# Fetch existing data from the database
def fetch_existing_data(table_name):
    data = list()
    try:
        mycursor.execute("SELECT * FROM %s" % (table_name))

        # Convert data into all strings, other than None values
        for entry in mycursor.fetchall():
            temp_list = list()
            for i in entry:
                if str(i) == 'None': 
                    temp_list.append(None)
                else:
                    temp_list.append(str(i))
            data.append(temp_list)

        # Return the 2d list of strings
        return data
    except mysql.connector.Error as err:
        print("Error fetching existing data:", err)
        return []
    
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
existing_data = list()

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
            existing_data = fetch_existing_data(table_name)
            found_table = True
    # If we are here, the line should be values to insert into the table
    else: 
        row = line.split(",")
        value_placeholder = "%s"

        # Strip the elements, and add placeholders for sql string
        for element in range(len(row)):
            row[element] = row[element].strip()
            if(row[element] == "NULL"):
                row[element] = None
            if element != 0:
                value_placeholder += ", %s"

        # Convert the row values to a tuple
        values = tuple(row)
        
        match = False
        
        # Check if we have data that does not exist in the database. 
        for data in existing_data: 
            if len(data) != len(row):
                data = data[1:]
                if len(data) != len(row):
                    print("Error: mismatching data, unable to compare with what is in database")
                    break;
            if data == row: 
                match = True

        if not match:
            # Set up the sql statement
            sql_statement = sql % (table_name, table_columns)
            sql_statement += value_placeholder + ")"
            print(sql_statement)
            print(values)

            # Execute the statement
            mycursor.execute(sql_statement, values)

mydb.commit()
