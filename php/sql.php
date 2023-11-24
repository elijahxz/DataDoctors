<?php
    // This php file contains all of the SQL functionality for this program.
    // Each page that uses the database will call into this file.     

    include 'connect.php';
    
    // A portion of this code is from https://stackoverflow.com/questions/15757750/how-can-i-call-php-func
    // it states how to call PHP functions from javascript
    header('Content-Type: application/json');

    function check_arguments($arr, $number)
    {
        if( !isset($arr['arguments']) )
        {
            return 'No function arguments!';
        }
        if( !is_array($arr['arguments']) || (count($arr['arguments']) != $number) ) {
            return 'Error in arguments!';
        }
        return true;
    }

    // Checks if a patient exists in the patient table
    function check_in($ssn, $dob, $appointment, $symptoms)
    {
        $results = [];
        $conn = OpenDb("3308");
        
        // First, check if the user exists in the patient table 
        $stmt = $conn -> prepare("SELECT * FROM PATIENT WHERE Ssn=? AND Dob=?");

        $stmt->bind_param("ss", $ssn, $dob);

        $stmt->execute();

        $result = $stmt -> get_result();
        
        // Ssn is the pk, so there should only be one result
        if($result -> num_rows == 1)
        { 
            // push user data to array
            array_push($results, $result -> fetch_assoc());  

            // Check if the user has an appointment 
            if ($appointment == "Y")
            {

                // Get all appointments from the user, 
                // and order by timestamp
                $stmt = $conn -> prepare("SELECT * FROM APPOINTMENTS " . 
                                         "WHERE Pssn=? " . 
                                            "AND Date_time >= DATE(NOW()) " .
                                            "ORDER BY Date_time");
                $stmt->bind_param("s", $ssn);

                $stmt->execute();

                $result = $stmt -> get_result();

                // If there is no results, error 
                if($result -> num_rows < 1)
                {
                    CloseDB($conn);
                    return false;
                }
                
                // add closest appointment details to the array
                array_push($results, $result -> fetch_assoc());  

                // Insert the patient into the queue
                if (insert_patientqueue($conn, $ssn, $appointment, $results[1]['Symptoms']) == false)
                {
                    return false;
                }
            }
            else
            {
                // If the user does not have an appointment, still insert them into the patient queue
                if (insert_patientqueue($conn, $ssn, $appointment, $symptoms) == false)
                {
                    return false;
                }
            } 
            
            CloseDB($conn);
            
            return $results;
        }
       
        CloseDB($conn);
        return false;
    }

    // Inserts a new patient into the patient table
    function create_patient($args)
    {
        $conn = OpenDb("3308");
        try{
            $stmt = $conn -> prepare("INSERT INTO PATIENT VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $stmt->bind_param("ssssssssss", $args[1], $args[2], $args[3], $args[4], $args[5], $args[6], $args[7], $args[8], $args[9], $args[10]);

            $stmt->execute();
        }
        catch (Exception $e)
        {
            CloseDB($conn);
            return false;
        }
        
        if( insert_patientqueue($conn, $args[1], "N", $args[0] ) == false)
        {
            return false;
        }

        CloseDB($conn);

        return true;
    } 
    // Inserts a patient into the queue 
    function insert_patientqueue($conn, $ssn, $appointment, $symptoms)
    {
        // First, check if patient is already in the queue
        $stmt = $conn -> prepare("SELECT * FROM PATIENTQUEUE WHERE Pssn=?");

        $stmt->bind_param("s", $ssn);

        $stmt->execute();

        $result = $stmt -> get_result();
        
        // Ssn is the pk, so there should only be one result
        // Since they are already in the queue, we will assume thieir cookie expired and they are trying to reaccess
        // The queue time
        if($result -> num_rows == 1)
        {
            return true;
        }

        // If we are here, insert an entry into the patientqueue;
        try{
            $stmt = $conn -> prepare("INSERT INTO PATIENTQUEUE VALUES(?, ?, CURRENT_TIMESTAMP(), ?)");

            $stmt->bind_param("sss", $ssn, $appointment, $symptoms);

            $stmt->execute();
        }
        catch (Exception $e)
        {
            CloseDB($conn);
            return false;
        }
        return true;
    }


    // Queries for a patient based on their email.
    // Used on patient portal
    function query_patient($email)
    {
        $results = [];
        $conn = OpenDb("3308");
        
        $stmt = $conn -> prepare("SELECT * FROM PATIENT WHERE Email=? AND Ssn IN (SELECT Pssn FROM PATIENTQUEUE)");

        $stmt->bind_param("s", $email);

        $stmt->execute();

        $result = $stmt -> get_result();

        if($result -> num_rows == 1)
        { 
            // Store the results
            array_push($results, $result -> fetch_assoc());  
             
            $result = $conn -> query("Select COUNT(*) FROM PATIENTQUEUE");

            $row = $result -> fetch_row();

            array_push($results, $row[0]);

            CloseDB($conn);
            
            return $results;
        } 
        CloseDB($conn);
        return false;
    }
    function employee_login($eid, $pass)
    {
        $results = [];
        $conn = OpenDb("3308");
        
        $stmt = $conn -> prepare("SELECT * FROM EMPLOYEE " . 
                                 "WHERE Emp_id=? ". 
                                    "AND Pass=?");

        $stmt->bind_param("ss", $eid, $pass);
        
        $stmt->execute();

        $result = $stmt -> get_result();
        
        // There should only be one result since eid is pk
        if($result -> num_rows == 1)
        {
            $row = $result -> fetch_assoc();
            return $row['Department']; 
        }
        else
        {
            return false;
        }
    }
    function query_employee($eid)
    {
        $results = [];
        $conn = OpenDb("3308");
        
        $stmt = $conn -> prepare("SELECT * FROM EMPLOYEE " . 
                                 "WHERE Emp_id=? ");

        $stmt->bind_param("s", $eid);
        
        $stmt->execute();

        $result = $stmt -> get_result();
        
        // There should only be one result since eid is pk
        if($result -> num_rows == 1)
        {
            $row = $result -> fetch_assoc();
            return $row; 
        }
        else
        {
            return false;
        }
    }

    function get_patient_queue()
    {
        $resultArray = array();
        $conn = OpenDB("3308");
        $result = $conn -> query("SELECT * FROM PATIENTQUEUE");
        while ($row = $result->fetch_row()) {
            $resultArray[] = $row;
        }
        CloseDB($conn);
        return $resultArray;
    }

    function get_open_employees()
    {
        $resultArray = array();
        $conn = OpenDB("3308");
        $result = $conn -> query("SELECT E.Emp_id, E.Fname, E.Lname, D.Dname " .
                                 "FROM EMPLOYEE E, DEPARTMENT D " . 
                                 "WHERE E.Department = D.Dnum " .
                                    "AND D.Dnum != 1 " .
                                    "AND D.Dnum != 3 " .
                                    "AND E.Emp_id NOT IN (SELECT Emp_id FROM CURRENTPATIENT)");
        while ($row = $result->fetch_row()) {
            $resultArray[] = $row;
        }
        CloseDB($conn);
        return $resultArray;
    }

    // Start of global space
    if( !isset($_POST['functionname']) )
    {
      $aResult['error'] = 'No function name!';
    }
    if( !isset($aResult['error']) ) {

      switch($_POST['functionname']) {
            //case 'DisplaySuppliers':
            //    $aResult['result'] = DisplaySuppliers();
            //    break;
            case 'check_in':
                if (check_arguments($_POST, 4) == True)
                {
                    $aResult['result'] = check_in($_POST['arguments'][0], $_POST['arguments'][1], $_POST['arguments'][2], $_POST['arguments'][3]);
                }
                else
                {
                    $aResult['error'] = check_arguments($_POST, 4);
                }
                break;
            case 'create_patient':
                if (check_arguments($_POST, 11) == True)
                {
                    // Since there are ten arguments, just pass in the list 
                    $aResult['result'] = create_patient($_POST['arguments']);
                }
                else
                {
                    $aResult['error'] = check_arguments($_POST, 11);
                }
                break;
            case 'patient_portal':
                if (check_arguments($_POST, 1) == True)
                {
                    $aResult['result'] = query_patient($_POST['arguments'][0]);
                }
                else
                {
                    $aResult['error'] = check_arguments($_POST, 1);
                }
                break;
            case 'employee_login':
                if (check_arguments($_POST, 2) == True)
                {
                    $aResult['result'] = employee_login($_POST['arguments'][0], $_POST['arguments'][1]);
                }
                else
                {
                    $aResult['error'] = check_arguments($_POST, 2);
                }
                break;
            case 'employee_portal': 
                if (check_arguments($_POST, 1) == True)
                {
                    $aResult['result'] = query_employee($_POST['arguments'][0]);
                }
                else
                {
                    $aResult['error'] = check_arguments($_POST, 1);
                }
                break;
            case 'patient_queue':
                $aResult['result'] = get_patient_queue();
                break;
            
            case 'get_open_employees':
                $aResult['result'] = get_open_employees();
                break;

            default:
                $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
                break;
        }
    }
    // Returned to jQuery / JavaScript
    echo json_encode($aResult);
?>
