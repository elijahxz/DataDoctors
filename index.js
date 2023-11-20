$(document).ready(function()
{
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
        $("#previous-user-form").show();
    });
    $("#new-user").on('click', function(e)
	{
        $("#new-user-form").show();
    });
});
