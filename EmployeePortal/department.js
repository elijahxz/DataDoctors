$(document).ready(function()
{
    // Used to check for numerics on input field
    const NUMERIC = value => /^[0-9\.]+$/gi.test(value);

    var employee = getCookie("Emp_id_d");

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
        get_current_patient();
        // Update the page every 30 seconds.
        setInterval(function(){
            get_current_patient();
        }, 30000)

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

    function get_current_patient()
    {
        jQuery.ajax({
            type: "POST",
            url: '../php/sql.php',
            dataType: 'json',
            data: {functionname: 'get_current_patient', arguments: [employee]},
            success: function (obj, textstatus) {
                        if( !('error' in obj) ) {
                            if(obj.result != false)
                            {
                                var patient_info = obj.result.shift();
                                $("#patient-body").empty();
                                $("#patient-body").append("<tr style = 'user-select: none;'>"+
                                      "<th scope='row' name = 'ssn'>"+patient_info[0] + "</th>" +
                                      "<td>"+ patient_info[1] + "</td>" +
                                      "<td>"+ patient_info[2] + "</td>" +
                                      "<td>"+ patient_info[3] + "</td>" +
                                      "<td>"+ patient_info[4] + "</td>" +
                                      "<td>"+ patient_info[5] + "</td>" +
                                      "<td>"+ patient_info[6] + "</td>" +
                                      "<td>"+ patient_info[7] + "</td>" +
                                      "<td>"+ patient_info[8] + "</td>" +
                                      "<td>"+ patient_info[9] + "</td>" +
                                      "</tr>");
                                
                                $("#patient-history-table").show();
                                $("#new-history").show();
                                $("#new-bill").show();

                                if(obj.result.length != 0)
                                {
                                    $("#patient-history").empty();
                                    var allergies = "";
                                    var surgeries = "";
                                    for(var i = 0; i < obj.result.length; i++)
                                    {
                                        if (obj.result[i][1] != null)
                                        {
                                            allergies = allergies + obj.result[i][1] + ", ";    
                                        } 
                                        if (obj.result[i][2] != null)
                                        {
                                            console.log(obj.result[i][2]);
                                            surgeries = surgeries + obj.result[i][2] + ", ";    
                                        } 
                                    }
                                    console.log(allergies, surgeries);

                                    // Remove the last comma
                                    allergies = allergies.replace(/,\s*$/, "");
                                    surgeries = surgeries.replace(/,\s*$/, "");
                                    
                                    if (allergies == "")
                                    {
                                        allergies = "None";
                                    }
                                    if (surgeries == "")
                                    {
                                        surgeries = "None";
                                    }
                                    $("#patient-history").append("<tr style = 'user-select: none;'>"+
                                        "<td>" + allergies + "</td>" +
                                        "<td>"+ surgeries + "</td>" +
                                        "</tr>");
                                }
                                else
                                {
                                    $("#patient-history").empty();
                                    $("#patient-history").append("<tr style = 'user-select: none;'>"+
                                        "<td> None </td>" +
                                        "<td> None </td>" +
                                        "</tr>");
                                }

                                console.log(patient_info);
                            }
                            else
                            {
                                $("#patient-body").empty();
                                $("#patient-history-body").empty();

                                $("#patient-body").append("<tr style = 'user-select: none;'>" +
                                    "<th scope='row'> No </th>" +
		  						    "<td> Current </td>" +
		  						    "<td> Patient </td>" +
		  						    "<td> Assigned </td>" +
		  						    "<td>  </td>" +
		  						    "<td>  </td>" +
		  						    "<td>  </td>" +
		  						    "<td>  </td>" +
		  						    "<td>  </td>" +
		  						    "<td>  </td>" +
		  						    "</tr>");
                                $("#patient-history-table").hide();
                                $("#new-history").hide();
                                $("#new-bill").hide();
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

    $("#new-history-btn").on('click', function(e){
        e.preventDefault();
        var items = [];
        var data  = $("#new-history-form").serializeArray();
        
        items.push($("#patient-body th").get(0).innerText); 
        items.push(data[0].value);
        items.push(data[1].value);

        if (items[1] == "" && items[2] == "")
        {
            alert("Error, please enter a new allery or surgery");
            return;
        }
        
        jQuery.ajax({
            type: "POST",
            url: '../php/sql.php',
            dataType: 'json',
            data: {functionname: 'insert_new_history', arguments: items},
            success: function (obj, textstatus) {
                        if( !('error' in obj) ) {
                            if(obj.result != false)
                            {
                                get_current_patient();
                                alert("Success!");
                            }
                            else
                            {
                                alert("Error: Failure");
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

    $("#new-bill-btn").on('click', function(e){
        e.preventDefault();
        var items = [];
        var data  = $("#new-bill-form").serializeArray();
         
        items.push($("#patient-body th").get(0).innerText); 
        items.push(data[0].value);

        if (data[0].value == "" || NUMERIC(data[0].value) == false)
        {
            alert("Bill amount must be a number!");
            return;
        }
        
        jQuery.ajax({
            type: "POST",
            url: '../php/sql.php',
            dataType: 'json',
            data: {functionname: 'insert_new_bill', arguments: items},
            success: function (obj, textstatus) {
                        if( !('error' in obj) ) {
                            if(obj.result != false)
                            {
                                alert("Success! Bill Added.");
                                clear_current_assignment();
                            }
                            else
                            {
                                alert("Error: Failure");
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

    function clear_current_assignment()
    {
        jQuery.ajax({
            type: "POST",
            url: '../php/sql.php',
            dataType: 'json',
            data: {functionname: 'clear_current_assignment', arguments: [employee]},
            success: function (obj, textstatus) {
                        if( !('error' in obj) ) {
                            if(obj.result != false)
                            {
                                get_current_patient();
                            }
                            else
                            {
                                alert("Error: Unable to clear current assignment, please contact Administration");
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

