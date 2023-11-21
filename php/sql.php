<?php
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
    function check_in($ssn, $dob)
    {
        $conn = OpenDb("3308");
        
        $stmt = $conn -> prepare("SELECT * FROM PATIENT WHERE Ssn=? AND Dob=?");

        $stmt->bind_param("ss", $ssn, $dob);

        $stmt->execute();
        
        $stmt->store_result(); 
        if($stmt -> num_rows == 1)
        { 
            CloseDB($conn);
            return True;
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

            $stmt->bind_param("ssssssssss", $args[0], $args[1], $args[2], $args[3], $args[4], $args[5], $args[6], $args[7], $args[8], $args[9]);

            $stmt->execute();

            CloseDB($conn);
        }
        catch (Exception $e)
        {
            CloseDB($conn);
            return false;
        }
        return true;
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
                if (check_arguments($_POST, 2) == True)
                {
                    $aResult['result'] = check_in($_POST['arguments'][0], $_POST['arguments'][1]);
                }
                else
                {
                    $aResult['error'] = check_arguments($_POST, 2);
                }
                break;
            case 'create_patient':
                if (check_arguments($_POST, 10) == True)
                {
                    // Since there are ten arguments, just pass in the list 
                    $aResult['result'] = create_patient($_POST['arguments']);
                }
                else
                {
                    $aResult['error'] = check_arguments($_POST, 2);
                }
                break;
            default:
                $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
                break;
        }
    }
    // Returned to jQuery / JavaScript
    echo json_encode($aResult);
?>
