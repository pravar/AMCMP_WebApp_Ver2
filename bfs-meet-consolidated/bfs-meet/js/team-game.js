$(document).ready(function() {
	 

	$('#connectingTheDots').on('click', function(){
        if(!$(this).hasClass('attempted')){
    		$('#connectinDotsModal').modal('show');
    		$('html,body').css('overflow-y','hidden');
        }
	});


	var activePanel = $("#accordionConnectDots div.panel:first");
    $(activePanel).addClass('active');
 
    $("#accordionConnectDots").delegate('.panel', 'click', function(e){
         if( ! $(this).is('.active') ){
            $(activePanel).animate({width: "35px"}, 300);
            $(this).animate({width: "90%"}, 300);
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
                        url: "config/gameConfig.json",// need to place service url
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
});