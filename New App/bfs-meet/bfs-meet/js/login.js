$(document).ready(function() {
	//$('#loginModal').modal('show');

	$('#btnSubmitLogin').on('click', function(){
		$('#txtLoginId').removeClass('error');
        $('#txtPassword').removeClass('error');
        $('.errorLogin').hide();
		$.ajax({
            url: "config/userDetails.json",
            type: 'GET',
            async:false,
            contentType: "application/text; charset=utf-8",
            dataType: 'text',
            cache: false,
           
            success: function(data){
                //var responseObj = JSON.parse(data), loginId = $('#txtLoginId')
                	
                	if(true) {
                		$('#loginModal').modal('hide');
                	}
                	else {
                		$('.divUserId').addClass('error');
                		$('.divPassword').addClass('error');
                		$('.errorLogin').show();
                	}
            		
                
                
            }

        });
	});
	
});