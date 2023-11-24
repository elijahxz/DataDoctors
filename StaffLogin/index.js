$(document).ready(function()
{   
    // Used to test for alphanumerics on input field
    const ALPHANUMERIC = value => /^[0-9a-z]+$/gi.test(value);
    // Used to check for numerics on input field
    const NUMERIC = value => /^[0-9\.]+$/gi.test(value);
    $("#employee-login-btn").on('click', function(e){
        e.preventDefault();
        
        var items = [];
        // This will only return two data items.
        var data = $("#staff-login-form").serializeArray();
       
        if(NUMERIC(data[0].value) == false)
        {
            alert("Employee ID must be numeric!");
            return;
        }
        else if(ALPHANUMERIC(data[1].value)==false)
        {
            alert("Password must be alphanumeric");
            return;
        }
        
        items.push(data[0].value); 
        items.push(data[1].value); 
        
        jQuery.ajax({
            type: "POST",
            url: "../php/sql.php",
            dataType: 'json', 
            data: {functionname: "employee_login", arguments: items},
            success: function(obj, textstatus){
                if ( !('error' in obj) )
                {
                    if(obj.result)
                    {
                        // will look like .... DataDoctors/StaffLogin/
                        var current = $(location).attr('href');

                        // Removes the last slash and looks like ...DataDoctors/StaffLogin
                        current = current.substr(0, current.lastIndexOf("\/"));

                        // Removes the last slash again and looks like ....DataDoctors
                        current = current.substr(0, current.lastIndexOf("\/"));
                        
                        if (obj.result == 1)
                        {
                            current = current + "/EmployeePortal/";
                        }
                        else if(obj.result == 3)
                        {
                            alert("Error: Cleanup Crew does not currently have a patient portal");
                            return;
                        }
                        else
                        {
                            current = current + "/EmployeePortal/department.html";
                        }
                        console.log(document.cookie);
                        createCookie("Emp_id", items[0]);
                        createCookie("Department", obj.result);
                        window.location.href = current;
                    }
                    else
                    {
                        alert("Invalid EID or Password");
                    }
                }
                else
                {
                    alert("There was an error attempting to log in, please contact administration.");
                }
            }
        }).fail(function(jqXHR, textStatus, error){
            console.log(jqXHR.responseText);
            return;
        });

    });

    // Takes the user back to the home page.
    $("#home-btn").on('click', function(e){
        e.preventDefault();
        
        // will look like .... DataDoctors/StaffLogin/
        var current = $(location).attr('href');

        // Removes the last slash and looks like ...DataDoctors/StaffLogin
        current = current.substr(0, current.lastIndexOf("\/"));

        // Removes the last slash again and looks like ....DataDoctors
        current = current.substr(0, current.lastIndexOf("\/"));
        
        window.location.href = current;
    });


    // Creates a cookie that lasts 30 minutes
    function createCookie(name, value)
    {
        var date = new Date();
        date.setTime(date.getTime()+(1*30*60*1000));
        
        // will look like .... DataDoctors/StaffLogin/
        var current = $(location).attr('href');

        // Removes the last slash and looks like ...DataDoctors/StaffLogin
        current = current.substr(0, current.lastIndexOf("\/"));

        // Removes the last slash again and looks like ....DataDoctors
        current = current.substr(0, current.lastIndexOf("\/"));

        document.cookie = name+"="+value+"; expires="+date.toGMTString()+"; path=/;";
    }

});

