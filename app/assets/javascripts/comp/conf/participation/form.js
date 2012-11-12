
'use strict'

var ParticipationForm = function() {
	return (function($) {
		var my = {};
		$( "#form_birthdate" ).datepicker({
			"dateFormat": 'yy-mm-dd'
		});
	//	$('input:radio').change(
	//		function(){
	//			alert('changed');   
	//		}
	//	);	    

		return my;
	}(jQuery));
}

