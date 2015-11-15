$(document).ready(function() {
	 

	$('#connectingTheDots').on('click', function(){
		$('#connectinDotsModal').modal('show');
		$('html,body').css('overflow-y','hidden');
	});


	var activePanel = $("#accordionConnectDots div.panel:first");
    $(activePanel).addClass('active');
 
    $("#accordionConnectDots").delegate('.panel', 'click', function(e){
         if( ! $(this).is('.active') ){
            $(activePanel).animate({width: "44px"}, 300);
            $(this).animate({width: "90%"}, 300);
            $('#accordionConnectDots .panel').removeClass('active');
            $(this).addClass('active');
            activePanel = this;
         };
    });
});