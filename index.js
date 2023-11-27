$(document).ready(function()
{
    // Used to test for alphanumerics on input field
    const ALPHANUMERIC = value => /^[0-9a-z]+$/gi.test(value);
    const ALPHANUMERIC_WSPACE = value => /^[0-9a-z ]+$/gi.test(value);
    // Used to check for numerics on input field
    const NUMERIC = value => /^[0-9\.]+$/gi.test(value);
    
    // Datepicker for the date of birth stuff
    $("#Dob, #Dob-c").datepicker({
        dateFormat: 'yy-mm-dd',
        maxDate: new Date,
        changeDay: true, 
        changeMonth: true,
        changeYear: true,
        yearRange: "1800:2023"
    });
	
    // For the staff login, redirect them to this page. 
    $("#login-btn").on('click', function(e)
	{
        window.location.href = ($(location).attr('href') + "StaffLogin");
    });
    
    $("#check-in").on('click', function(e) 
    {
        $(".question").show();
    });

    $("#previous-user").on('click', function(e)
	{
        $("#previous-user-holder").show();
        $("#new-user-holder").hide();
    });
    
    $("#new-user").on('click', function(e)
	{
        $("#new-user-holder").show();
        $("#previous-user-holder").hide();
    });
    
    // This attempts to create a new patient
    $("#create-user-btn").on('click', function(e){
        e.preventDefault();
        
        var items = [];
        var data = $("#new-user-form").serializeArray();

        for (var i = 0; i < data.length; i++)
        {
            if (data[i].name == "Phone" && (data[i].value = verifyPhoneOrSocial(data[i].value, 10)) == false)
            {
                alert("Invalid Phone Number, please check it and try again");
                return;
            }
            else if (data[i].name == "Ssn" && (data[i].value = verifyPhoneOrSocial(data[i].value, 9)) == false)
            {
                alert("Invalid Social Security Number, please check it and try again");
                return;
            }
            else if(data[i].name == "Email")
            {
                if (verifyEmail(data[i].value) == false)
                {
                    alert("Invalid Email, please check it and try again");
                    return;
                }
            }
            else if(data[i].name == "Zipcode" && NUMERIC(data[i].value) == false)
            {
                alert("Zipcode must be numeric!");
                return;
            }
            else if(data[i].name == "Address")
            {
                if (ALPHANUMERIC_WSPACE(data[i].value) == false)
                {
                    alert("No special characters allowed in address");
                    return;
                }
            }
            else if(data[i].name == "Dob")
            {
                if (data[i].value == "")
                {
                    alert("Please enter a date of birth");
                    return;
                }
            }
            else if(data[i].name == "Symptoms")
            {
                if (data[i].value == "")
                {
                    alert("Please enter symptoms before continuing"); 
                    return;
                }
            }
            else if(ALPHANUMERIC(data[i].value) == false)
            {
                alert("Error: " + data[i].name + " is not alphanumeric! Please Try Again");
                return;
            }
            items.push(data[i].value); 
        }

        // Ajax call is what talks to PHP
        jQuery.ajax({
            type: "POST",
            url: 'php/sql.php',
            dataType: 'json',
            data: {functionname: 'create_patient', arguments: items},
            success: function (obj, textstatus) {
                        if( !('error' in obj) ) {
                            console.log(obj.result);
                            if(obj.result)
                            {
                                // here we know items is 6, console.log the structure of items if there is an error.
                                createCookie("user", items[6], $(location).attr('href'));
                                window.location.href = ($(location).attr('href') + "PatientPortal");
                            }
                            else
                            {
                                alert("There was an error creating your account, please try again or contact administration.");  
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
    });

    $("#Appointment").on('change', function(e){
        console.log($(this).val());
        if($(this).val() == "Y")
        {
            $("#symptoms-div").hide();
            $("#Symptoms").val("");
        }
        else
        {
            $("#symptoms-div").show();
        }
    });


    $("#check-in-btn").on('click', function(e){
        e.preventDefault();
        var appointment = false;
        var items = [];
        var data = $("#previous-user-form").serializeArray();
        
        $("#check-in-err").hide();
        
        for (var i = 0; i < data.length; i++)
        {
            if (data[i].name == "Ssn" && (data[i].value = verifyPhoneOrSocial(data[i].value, 9)) == false)
            {
                alert("Invalid Social Security Number, please check it and try again");
                return;
            }
            items.push(data[i].value); 
        }
        console.log(items);
        jQuery.ajax({
            type: "POST",
            url: 'php/sql.php',
            dataType: 'json',
            data: {functionname: 'check_in', arguments: items},
            success: function (obj, textstatus) {
                        if( !('error' in obj) ) {
                            console.log(obj.result);
                            if(obj.result != false)
                            {
                                createCookie("user", obj.result[0].Email, $(location).attr('href'));
                                if(appointment)
                                {
                                    createCookie("Appointment", obj.result[1].App_id, $(location).attr('href'));
                                }
                                window.location.href = ($(location).attr('href') + "PatientPortal");
                            }
                            else
                            {
                                if (appointment)
                                {
                                    alert("Please make sure that you have an appointment, or select No");
                                }
                                $("#check-in-err").show();  
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
        return;
    });

    // Ensures the user inserts a valid email. 
    function verifyEmail(email){
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

    // Ensure the user inserted a 10 digit number, returns false if 
    // they did not, and returns the 10 digit number without any 
    // dashes if they it is a length of 10.
    function verifyPhoneOrSocial(value, length){
        val = value.replace(/\-/g, "");
        
        if(val == "")
        {
            return false;
        }

        if (val.match(/\d/g).length === length)
            return val;
        return false;
    }
    
    // Creates a cookie that lasts 30 minutes
    function createCookie(name, value, path)
    {
        var date = new Date();
        date.setTime(date.getTime()+(1*30*60*1000));
        document.cookie = name+"="+value+"; expires="+date.toGMTString()+"; path=/;";
    }


});
