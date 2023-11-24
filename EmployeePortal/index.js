$(document).ready(function()
{
    var cur_row;
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
        get_patient_queue();
        get_open_employees();
    }
    
    // This controlls the Current Patient Queue Table, it is selectable. 
    // To remove a patient from the queue, the user has to click the table.
    $("#patient-queue-table").on('click', 'tbody tr', function(event) {
        var app_flg = $(this).children().get(1).innerText;
        if($(this).hasClass("table-success") == true)
        {
            $(this).removeClass("table-success");
            $("#non-appointment-div").hide();
            $("#remove-queue-btn").hide();
            cur_row = undefined;
            return;
        }
        else if (app_flg == "Patients")
        {
            return;
        }
        else if(app_flg == "Y"){
            $("#remove-queue-btn").show();
        }
        else if(app_flg == "N")
        {
            $("#non-appointment-div").show();
        }

        $(this).addClass('table-success').siblings().removeClass('table-success');
        console.log($(this).children().get(1).innerText);
    });
   
    // This will get the attributes of the selected column and attempt to remove the element from the queue table.
    $("#remove-queue-btn").on('click', function(e){
        
        var items = [];

        var selected = $(".table-success").children();
       
        // We should always have four values 
        if(selected.length != 4)
        {
            return;
        }

        for(var i = 0; i < selected.length; i++)
        {
            items.push(selected[i].innerText);
        }

        console.log(items);
    });

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

    function get_patient_queue()
    {
        jQuery.ajax({
                type: "POST",
                url: '../php/sql.php',
                dataType: 'json',
                data: {functionname: 'patient_queue', arguments: []},
                success: function (obj, textstatus) {
                            if( !('error' in obj) ) {
                                refresh_patient_queue(obj.result);
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
    
    function refresh_patient_queue(results)
    {
        $("#patient-queue-body").empty();
        if (results == null || results.length == 0)
        {
            $("#patient-queue-body").append("<tr style = 'user-select: none;'>" + 
                                  "<th scope='row'> No </th>" +
		  						  "<td> Patients </td>" +
		  						  "<td> In </td>" +
		  						  "<td> Queue </td>" +
		  						  "</tr>");
            return;
        }
        for(var i = 0; i < results.length; i++){
            $("#patient-queue-body").append("<tr style = 'user-select: none;'>"+
                                      "<th scope='row' name = 'ssn'>"+results[i][0] + "</th>" +
                                      "<td>"+ results[i][1] + "</td>" +
                                      "<td>"+ results[i][2] + "</td>" +
                                      "<td>"+ results[i][3] + "</td>" +
                                      "</tr>");
        }
        return;
    }


    function get_open_employees()
    {
        jQuery.ajax({
                type: "POST",
                url: '../php/sql.php',
                dataType: 'json',
                data: {functionname: 'get_open_employees', arguments: []},
                success: function (obj, textstatus) {
                            if( !('error' in obj) ) {
                                if(obj.result != false)
                                {
                                    fill_employees(obj.result);
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
    
    function fill_employees(data)
    {
        $("#Employee").empty();
        
        if(data.length == 0)
        {
            $("#Employee").append("<option value='null'>No Available Employees!</option>"); 
        }

        for(var i = 0; i < data.length; i++)
        {
            $("#Employee").append("<option value='" + data[i][0] + "'>" + 
                                                            data[i][2] + ", " + data[i][1] + ": " + data[i][3] + "</option>");
        }

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

