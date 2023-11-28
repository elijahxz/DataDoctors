$(document).ready(function()
{
    var employee = getCookie("Emp_id");
    
    // Takes the user back to the previous page with an invalid cookie
    if (employee == "")
    {  
        // will look like .... DataDoctors/EmployeePortal/
        var current = $(location).attr('href');
        
        // Removes the last slash and looks like ...DataDoctors/EmployeePortal
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
        get_all_employees();
        
        // Update the page every 30 seconds. 
        setInterval(function(){
            get_all_employees();
            get_patient_queue();
            get_open_employees();
        }, 30000)
    }

    $("#create-employee-btn").on('click', function(e) 
    {

        $("#new-employee").toggle();
    });

    $("#create-new-employee").on('click', function(e){
        e.preventDefault();
        
        var items = [];
        var data = $("#new-employee-form").serializeArray();

        for (var i = 0; i < data.length; i++)
        {
            items.push(data[i].value); 
        }

        // Ajax call is what talks to PHP
        jQuery.ajax({
            type: "POST",
            url: 'php/sql.php',
            dataType: 'json',
            data: {functionname: 'create_new_employee', arguments: items},
            success: function (obj, textstatus) {
                        if( !('error' in obj) ) {
                            console.log(obj.result);
                            if(obj.result)
                            {
                                return;
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
    
    // This controlls the Current Patient Queue Table, it is selectable. 
    // To remove a patient from the queue, the user has to click the table.
    $("#patient-queue-table").on('click', 'tbody tr', function(event) {
        
        // Table looks like   0     1      2       3        4          5
        //                  [Ssn, Fname, Lname, App_flg, Check In, Symptoms];
        var app_flg = $(this).children().get(3).innerText;
        if($(this).hasClass("table-success") == true)
        {
            $(this).removeClass("table-success");
            $("#non-appointment-div").hide();
            $("#appointment-div").hide();
            return;
        }
        else if (app_flg == "Patients")
        {
            return;
        }
        else if(app_flg == "Y"){
            $("#non-appointment-div").hide();
            $("#appointment-div").show();
            get_doctor_information($(this).children().get(0).innerText);
        }
        else if(app_flg == "N")
        {
            $("#appointment-div").hide();
            $("#non-appointment-div").show();
        }

        $(this).addClass('table-success').siblings().removeClass('table-success');
    });

    // This controls the all employee table Table, it is selectable. 
    // To remove an employee from the hospital staff, the admin has to click the table.
    $("#every-employee-table").on('click', 'tbody tr', function(event) {
        
        // Table looks like   0     1      2     3       4         5            6       7
        //                  [Eid, Fname, Lname, Ssn, Emp Type, Departmnet, Start Date, Pay];
        var app_flg = $(this).children().get(0).innerText;
            console.log(app_flg);
        if($(this).hasClass("table-success") == true)
        {
            $(this).removeClass("table-success");
            //$("#non-appointment-div").hide();
            //$("#appointment-div").hide();
            $("#delete-employee-btn").hide();
            return;
        }
        $("#delete-employee-btn").show();
        $(this).addClass('table-success').siblings().removeClass('table-success');
    });

    $("#delete-employee-btn").on('click', function(event) {
        var employee_selected = $("#every-employee-body .table-success").children();
        var emp_id = employee_selected[0].innerText;
        console.log(emp_id);
        console.log(employee_selected);

        jQuery.ajax({
            type: "POST",
            url: '../php/sql.php',
            dataType: 'json',
            data: {functionname: 'delete_employee', arguments: [emp_id]},
            success: function (obj, textstatus) {
                        if( !('error' in obj) ) {
                            if(obj.result != false)
                            {
                                alert("Success!");
                                console.log(obj.result);
                            }
                            else
                            {
                                alert("Failed to delete employee because employee has current appointments today.");
                                console.log(obj.result);
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
   
    // This will get the attributes of the selected column and attempt to remove the element from the queue table.
    $("#remove-queue-btn").on('click', function(e){
        console.log("in here"); 
        var items = [];

        var patient_selected = $("#patient-queue-body .table-success").children();
        var employee = $("#appointment-info-body tr").children();



        // We should always have 6 values for the patient 
        if(patient_selected.length != 6 || employee.length != 5)
        {
            return;
        }

        // Push the Employee Id to the front of the items array.
        items.push(employee[1].innerText);

        // Push the Patient's ssn to the list
        items.push(patient_selected[0].innerText); 
        
        assign_employee_patient(items)
        
        $("#appointment-div").hide();
    });
    
    $("#update-non-appointment-btn").on('click', function(e){
        e.preventDefault();
        console.log("in here"); 
        var items = [];

        var patient_selected = $(".table-success").children();
        var employee = $("#Employee").val();

        // We should always have 6 values for the patient 
        if(patient_selected.length != 6 || employee == 'null')
        {
            return;
        }

        // Push the Employee Id to the front of the items array.
        items.push(employee);

        // Push the Patient's ssn to the list
        items.push(patient_selected[0].innerText); 
        
        assign_employee_patient(items);
        
        $("#non-appointment-div").hide();
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

    function get_all_employees()
    {
        jQuery.ajax({
            type: "POST",
            url: '../php/sql.php',
            dataType: 'json',
            data: {functionname: 'get_all_employees', arguments: []},
            success: function (obj, textstatus) {
                        if( !('error' in obj) ) {
                            $("#every-employee-body").empty();

                            for (var i = 0; i < obj.result.length; i++){
                                var employee_i = obj.result[i];
                                $("#every-employee-body").append("<tr style = 'user-select: none;'>"+
                                "<th scope='row' name = 'ssn'>"+employee_i[0] + "</th>" +
                                "<td>"+ employee_i[2] + "</td>" +
                                "<td>"+ employee_i[3] + "</td>" +
                                "<td>"+ employee_i[4] + "</td>" +
                                "<td>"+ employee_i[5] + "</td>" +
                                "<td>"+ employee_i[6] + "</td>" +
                                "<td>"+ employee_i[7] + "</td>" +
                                "<td>"+ employee_i[8] + "</td>" +
                                "</tr>");
                            }
                            console.log(obj.result);
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
    
    // Results structure looks like [SSN, APP_FLG, Date_time, Symptoms, Fname, Lname]
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
		  						  "<td>  </td>" +
		  						  "<td>  </td>" +
		  						  "</tr>");
            return;
        }
        for(var i = 0; i < results.length; i++){
            $("#patient-queue-body").append("<tr style = 'user-select: none;'>"+
                                      "<th scope='row' name = 'ssn'>"+results[i][0] + "</th>" +
                                      "<td>"+ results[i][4] + "</td>" +
                                      "<td>"+ results[i][5] + "</td>" +
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
        $("#employee-body").empty();
        $("#Employee").empty();
        
        if(data.length == 0)
        {
            $("#Employee").append("<option value='null'>No Available Employees!</option>");
            $("#employee-body").append("<tr style = 'user-select: none;'>"+
                                      "<th scope='row' name = 'eid'> No </th>" +
                                      "<td> Available </td>" +
                                      "<td> Employees! </td>" +
                                      "<td> </td>" +
                                      "</tr>");

        }

        for(var i = 0; i < data.length; i++)
        {
            $("#Employee").append("<option value='" + data[i][0] + "'>" + 
                                                            data[i][2] + ", " + data[i][1] + ": " + data[i][3] + "</option>");
            $("#employee-body").append("<tr style = 'user-select: none;'>"+
                                      "<th scope='row' name = 'eid'>"+data[i][0] + "</th>" +
                                      "<td>"+ data[i][1] + "</td>" +
                                      "<td>"+ data[i][2] + "</td>" +
                                      "<td>"+ data[i][3] + "</td>" +
                                      "</tr>");

        }

    }

    function get_doctor_information(patient_ssn)
    {
        jQuery.ajax({
                type: "POST",
                url: '../php/sql.php',
                dataType: 'json',
                data: {functionname: 'get_appointment_doctor', arguments: [patient_ssn]},
                success: function (obj, textstatus) {
                            if( !('error' in obj) ) {
                                if(obj.result != false)
                                {
                                   show_doctor_information(obj.result); 
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
    function show_doctor_information(data)
    {
        var cur_date = new Date(Date.now());
        var valid_employee = false;
        var offset;
        var picked_date;
        var picked_offset;
        var picked_data;
        for(var i = 0; i < data.length; i++)
        {
            var date = new Date(data[i][0]);
            if(cur_date > date)
            {
                offset = cur_date.getTime() - date.getTime();
            }
            else
            {
                offset = date.getTime() - cur_date.getTime();
            }

            if (picked_date == undefined)
            {
                picked_date = date; 
                picked_offset = offset;
                var picked_data = data[i];
                continue;
            }
            
            if(offset < picked_offset)
            {
                picked_date = date;
                picked_offset = offset;
                var picked_data = data[i];
            }
        }
        $("#appointment-info-body").empty();
        $("#appointment-info-body").append("<tr> <th scope='row'>"+picked_data[0] + "</th>" +
		  						  "<td>"+ picked_data[1] + "</td>" +
		  						  "<td>"+ picked_data[2] + "</td>" +
		  						  "<td>"+ picked_data[3] + "</td>" +
		  						  "<td>"+ picked_data[4] + "</td>" +
		  						  "</tr>");
        
        var employees = $("#employee-body th").each(function(i, val){
            if(picked_data[1] == val.innerText)
            {
                valid_employee = true;
            }
        });
        
        if(valid_employee != true)
        {
            $("#remove-queue-btn").prop('disabled', true);
        }
        else
        {
            $("#remove-queue-btn").prop('disabled', false);
        }
    }

    function assign_employee_patient(items)
    {
        jQuery.ajax({
                type: "POST",
                url: '../php/sql.php',
                dataType: 'json',
                data: {functionname: 'assign_employee_patient', arguments: items},
                success: function (obj, textstatus) {
                            if( !('error' in obj) ) {
                                if(obj.result != false)
                                {
                                    get_open_employees();
                                    get_patient_queue();
                                    alert("Success!");      
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
