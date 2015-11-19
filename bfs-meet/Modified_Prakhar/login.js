// Code goes here

$(document).ready(function() {
  $('#loginModal').modal('show');

  var errorFunction = function() {


      $('.divUserId').addClass('error');
      $('.divPassword').addClass('error');
      $('.errorLogin').show();


    },

    fnDisableAttemptedQuiz = function(data) {
    	debugger;
      var isConnectingDotsPlayed = false, isPuzzlePlayed = false;
      if ($.inArray

        ('puzzle', data.gameIds) != -1) {
        if (data.gameIds.length > 1) {
          isConnectingDotsPlayed =

            true;

           isPuzzlePlayed = true;
        }
      } else {
        if (data.gameIds.length > 0) {


          isConnectingDotsPlayed = true;
        }
      }
      if (isConnectingDotsPlayed) {


        $('#connectingTheDots').attr('disabled', 'disabled');
        $('.divConnectingDots, #connectingTheDots ').addClass('attempted ');
      }

      if(isPuzzlePlayed) {
      	$( "#puzzleId").unbind( "click" );
      	$('#puzzleId').attr('disabled', 'disabled');
      	$('#puzzleId').addClass('attempted');
      }
    }

  $('#btnSubmitLogin').on('click', function() {


    $('#txtUserName').removeClass('error');
    $('#txtPassword').removeClass('error');
    $('.errorLogin').hide

      ();
    if (!$('#txtUserName').val() || !$('#txtPassword').val()) {
      errorFunction();
    } else {
      //http://localhost:8080/bfsquizamcp/rest/validateuser/ to be called


      $.ajax({
        url: 'http://bfsamcp.cognizant.com:8080/bfsquizamcp/rest/validateuser/',
       // url: 'config/userDetails.json',

        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',


        dataType: 'json',
        cache: false,
        data: JSON.stringify

          ({
          "userId": $('#txtUserName').val(),
          "password": $('#txtPassword').val()
        }),
        success: function(data) {


          //var responseObj = JSON.parse(data), loginId = $('#txtLoginId')
          var loginResponse = data;


          console.log('logged in');
          debugger;
          if

          (loginResponse.status) {
            $('#loginModal').modal('hide');


            //Global variable to store userName
            loggedInUser = $('#txtUserName').val();


            fnDisableAttemptedQuiz(data);
          } else {
            errorFunction();
          }


        },
        error: function(jqXHR, textStatus, errorThrown) {


          alert('Connection Error: ' + textStatus);
          console.log('Connection Error: ' +

            textStatus);

        }

      });
    }
  });

});