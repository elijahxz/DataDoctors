$(document).ready(function()
{
    var employee = getCookie("Emp_id");
    
    // Takes the user back to the previous page with an invalid cookie
    if (employee == "")
    {  
        // will look like .... DataDoctors/PatientPortal/
        var current = $(location).attr('href');
        
        // Removes the last slash and looks like ...DataDoctors/PatientPortal
        current = current.substr(0, current.lastIndexOf("\/"));

        // Removes the last slash again and looks like ....DataDoctors
        current = current.substr(0, current.lastIndexOf("\/"));
        
        window.location.href = current;
    }
    else
    {
        get_employee_data();
    }

    // Set a 15 minute timer to see if the user is still here. 
    //setTimeout(function, 54000000);
    function get_employee_data() 
    {   
        jQuery.ajax({
                type: "POST",
                url: '../php/sql.php',
                dataType: 'json',
                data: {functionname: 'employee_portal', arguments: [employee]},
                success: function (obj, textstatus) {
                            if( !('error' in obj) ) {
                                if(obj.result != false)
                                {
                                    insert_employee_data(obj.result);
                                }
                                else
                                {
                                    alert("There has been an error in our database system. Please contact an administrator");
                                }
                            }
                            else {
                                  console.log(obj.error);
                                  return;
                            }
                        }
            }).fail(function (jqXHR, textStatus, error) {
                console.log(jqXHR.responseText);
                return;
            });
    }
    function insert_employee_data(data)
    {
        $("#welcome").html("Welcome " + data.Fname + " " + data.Lname + "!");
    } 

    // Retrieved from w3schools
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
});

