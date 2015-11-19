$(document).ready(function() {


	$('.divConnectingDots').on('click', function(){
         var isConnectingDotsReadyToPlay = false;
        //JSON CALL for config file to check whether gane is available or not
         $.ajax({
                        url: "config/gameConfig.json",// need to place service url
                        type: 'GET',
                        async:false,
                        contentType: "application/text; charset=utf-8",
                        dataType: 'text',
                        cache: false,
                        success: function(data){
                            debugger;
                            var response = $.parseJSON(data);
                            if(response.isConnectingDotsPlayedFlag){
                                isConnectingDotsReadyToPlay = true;
                            }
                        }
         });
        if(!$(this).hasClass('attempted')){
            if(isConnectingDotsReadyToPlay){
                $('#connectinDotsModal').modal('show');
                $('html,body').css('overflow-y','hidden');
            }
            else {
                $('#gameNotAvailable').modal('show');
            }
        }
	});


	var activePanel = $("#accordionConnectDots div.panel:first");
    $(activePanel).addClass('active');
 
    $("#accordionConnectDots").delegate('.panel', 'click', function(e){
         if( ! $(this).is('.active') ){
            $(activePanel).animate({width: "35px"}, 300);
            $(this).animate({width: "88%"}, 300);
            $('#accordionConnectDots .panel').removeClass('active');
            $(this).addClass('active');
            activePanel = this;
         };
    });

    $('#btnSubmitConnectingDots').on('click', function() {
        var objConnectingDots = {}, arrAllDotsResponse = [];
        $('.connectingGame').each(function(){
            var thisGameAnswer ={};
            thisGameAnswer.gameId = $(this).find('.selectedPerson').attr('id');
            thisGameAnswer.gameRes = $(this).find('.selectedPerson').val();
            thisGameAnswer.text = $(this).find('.dotsText').val();
            arrAllDotsResponse.push(thisGameAnswer);
        });
        objConnectingDots.userId = loggedInUser;
        objConnectingDots.gameRes = arrAllDotsResponse;

        //SERVICE CALLURL: http://localhost:8080/bfsquizamcp/rest/storegameres/
         $.ajax({
                        url: "http://bfsamcp.cognizant.com:8080/bfsquizamcp/rest/storegameres/",
                        type: 'GET',
                        async:false,
                        contentType: "application/text; charset=utf-8",
                        dataType: 'text',
                        cache: false,
                        data: objConnectingDots,
                        success: function(data){
                            console.log('Connecting the dots successfully stored');
                            $('#connectinDotsModal').modal('hide');
                            $('#connectingTheDots').attr('disabled','disabled');
                            $('.divConnectingDots, #connectingTheDots').addClass('attempted');
                        }
         });
    });

/**************************TEAM GAME START************************************/
    var documentId;


    $(".nav li a").on("click", function() {
        var link = '#'+$(this).attr('data-link');
        if(link == '#games'){
		documentId = null;
            defaultTeamGame();
            $("#puzzleId").show();
        }
    });

    $('input[type=file]').on('change', prepareUpload);


    defaultTeamGame = function()
    {
        //rightImage.src = 'images/Team-game-Quiz.png';
        $("#puzzleId").hide();
        $("#afterPuzzleClick").hide();
        $("#afterUploadSuccessful").hide();
        $("#afterSubmitClick").hide();
    }

    /*$( "#puzzleId" ).click(function() {
        defaultTeamGame();
        //rightImage.src = 'images/Team-game-upload.png';
        $("#afterPuzzleClick").show();
    });*/
    
    $( "#puzzleId" ).click(function() {

        $.ajax({
            url: "config/puzzleConfig.json",// need to place service url
            type: 'GET',
            async:false,
            contentType: "application/text; charset=utf-8",
            dataType: 'text',
            cache: false,
            success: function(data){
                debugger;
                var response = $.parseJSON(data);
                if(response.isPuzzleEnabled){
                    defaultTeamGame();
                    $("#afterPuzzleClick").css('display','inline-block');
                }
                else
                {
                    alert('Puzzle is disabled.')
                }
            }
        });
    });

    $("#uploadId").click(function(){
        var event = new Event('click');
        myFile.dispatchEvent(event);
    });

    function uploadSuccessful()
    {
        defaultTeamGame();
        $('#puzzleName').val('');
        //rightImage.src = 'images/Team-game-Quiz-success.png';
        $("#afterUploadSuccessful").css('display','inline-block');
    }

    function prepareUpload(event)
    {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening

        var files = event.target.files;

        var fileData = new FormData();
        $.each(files, function(key, value)
        {
            fileData.append(key, value);
        });
        var data = {
            file:fileData,
            userid:loggedInUser
        };

        $.ajax({
            url: 'http://bfsamcp.cognizant.com:8080/bfsquizamcp/rest/upload/',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR)
            {
                if(typeof data.error === 'undefined')
                {
                    // Success so call function to process the form
                    $form = $(event.target);
                    var formData = $form.serialize();
                    documentId = formData.fileId;
                }
                else
                {
                    alert('Error while uploading puzzle. ' + textStatus);
                    console.log('ERRORS: ' + textStatus);
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                alert('Connection Error: ' + textStatus);
                console.log('ERRORS: ' + textStatus);
            }
        });
    }

    $( "#submitTeamGame" ).click(function() {
        var _puzzleName = $('#puzzleName').val();
        if(!_puzzleName || _puzzleName.length==0)
        {
            alert("Please enter puzzle name.");
            return;

        }

        $.ajax({
            url: 'http://bfsamcp.cognizant.com:8080/bfsquizamcp/rest/updatepuzzle/',
            type: 'POST',
            data: {
                fileId:documentId,
                userid:loggedInUser,
                puzzleText:$('#puzzleName').val()
            },
            cache: false,
            dataType: 'json',

            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR)
            {
                if(typeof data.error === 'undefined')
                {
                    submitSuccessFul();
                }
                else
                {
                    alert('Error while submit puzzle. ' + data.error);
                    console.log('ERRORS : ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                alert('Connection Error: ' + textStatus);
                console.log('Connection Error: ' + textStatus);
            }
        });
    });

    function submitSuccessFul()
    {
        defaultTeamGame();
        //rightImage.src = 'images/Team-game-Quiz-success.png';
        $("#afterSubmitClick").css('display','inline-block');
    }
    
    $("teamgame").load(function(){
        defaultTeamGame();
    });

/**************************TEAM GAME END************************************/


});