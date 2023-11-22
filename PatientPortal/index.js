$(document).ready(function()
{
    const WAIT = "Current Wait Time: ";
    var user = getCookie("user");
    var appointment = getCookie("appointment");
    console.log(user, appointment);
    // Takes the user back to the previous page with an invalid cookie
    if (user == "" || verifyEmail(user) == false)
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
        get_patient_data();
    }

    // Set a 15 minute timer to see if the user is still here. 
    //setTimeout(function, 54000000);
    function get_patient_data() 
    {   
        jQuery.ajax({
                type: "POST",
                url: '../php/sql.php',
                dataType: 'json',
                data: {functionname: 'patient_portal', arguments: [user]},
                success: function (obj, textstatus) {
                            if( !('error' in obj) ) {
                                if(obj.result != false)
                                {
                                    insert_user_data(obj.result);
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
    function insert_user_data(data)
    {
        user_data = data[0];
        wait_time = parseInt(data[1]) * 15; 
        if (wait_time == 0)
        {
            wait_time = 5;
        }
        $("#welcome").html("Welcome " + user_data.Fname + " " + user_data.Lname + "!");
        $("#wait").html(WAIT + wait_time + " Min(s)");
    } 

    // This website has no security when it comes to hacking, but just for fun ... 
    // Reverify that we have a valid email in the cookie
    // Ensures the user inserts a valid email.
    function verifyEmail(email){
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
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

