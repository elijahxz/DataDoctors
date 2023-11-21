$(document).ready(function()
{
    //$("#Dob, #Dob-c").datepicker();
    // When we pull the Date of birth field, to parse/convert it to mysql, we will use this
    //$.datepicker.parseDate( "yy-mm-dd", "2007-01-26" );
	$("#login-btn").on('click', function(e)
	{
        window.location.href = ($(location).attr('href') + "StaffLogin");
    });
    
    $("#check-in-btn").on('click', function(e)
    {
        $(".question").show();
    });

    $('input[type="checkbox"]').on('change', function() {
        $('input[type="checkbox"]').not(this).prop('checked', false);
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
});
