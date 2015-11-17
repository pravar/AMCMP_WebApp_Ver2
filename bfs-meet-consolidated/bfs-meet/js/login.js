$(document).ready(function() {
	$('#loginModal').modal('show');

    var errorFunction = function() {
        $('.divUserId').addClass('error');
        $('.divPassword').addClass('error');
        $('.errorLogin').show();
    },

    fnDisableAttemptedQuiz = function(data) {
        console.log(data);
    }

	$('#btnSubmitLogin').on('click', function(){
		$('#txtUserName').removeClass('error');
        $('#txtPassword').removeClass('error');
        $('.errorLogin').hide();
        if(!$('#txtUserName').val() || !$('#txtPassword').val()){
            errorFunction();
        }
        else{
                //http://localhost:8080/bfsquizamcp/rest/validateuser/ to be called
        		$.ajax({
                    url: "config/userDetails.json",
                    type: 'GET',
                    async:false,
                    contentType: "application/text; charset=utf-8",
                    dataType: 'text',
                    cache: false,
                    data: {
                        "userId": $('#txtUserName').val(),
                        "password": $('#txtPassword').val()
                    },

                    success: function(data){
                        //var responseObj = JSON.parse(data), loginId = $('#txtLoginId')
                        var loginResponse = $.parseJSON(data);
                        	console.log('logged in');
                        	if(loginResponse.status) {
                        		$('#loginModal').modal('hide');
                                //Global variable to store userName
                                loggedInUser = $('#txtUserName').val();
                                fnDisableAttemptedQuiz(data);
                        	}
                        	else {
                        		errorFunction();
                        	}
                    		
                        
                        
                    }

                });
        }
	});
	
});