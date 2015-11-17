$(document).ready(function(){
	$('#nav ul li').on('click', function(eve, ele) {
 			var moduleBackColor = $($($(this).find('a').attr('href')).parent()).css('background-color');
 			$('#nav').css('background-color',moduleBackColor);
 			$('#nav a').css('background', 'transparent');
 			$(this).find('a').css('background', '#383838');

 			// if($(this).find('a').hasClass('liAgenda')) {
 			// 	$('#nav').addClass('navWithLogo');
 			// }
 			// else{
 			// 	$('#nav').removeClass('navWithLogo');	
 			// }
		
	});

	// $('.feedBackDiv').on('click', function() {
		
	// });
});