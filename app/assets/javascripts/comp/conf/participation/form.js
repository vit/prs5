
'use strict'

var ParticipationForm = function() {
	return (function($) {
		var formStruct = [
			{name: 'gender', type: 'radio'},
			{name: 'person_title', type: 'list'},
			{name: 'lname', type: 'text'},
			{name: 'fname', type: 'text'},
			{name: 'mname', type: 'text'},
			{name: 'birthdate', type: 'date'},
			{name: 'part_type', type: 'radio'},
			{name: 'coauthors', type: 'text'},
			{name: 'occupation', type: 'radio'},
			{name: 'organization', type: 'text'},
			{name: 'position', type: 'text'},
			{name: 'rank', type: 'text'},
			{name: 'degree', type: 'text'},
			{name: 'responsibilities', type: 'text'},
			{name: 'org_country', type: 'text'},
			{name: 'org_city', type: 'text'},
			{name: 'org_postcode', type: 'text'},
			{name: 'org_street', type: 'text'},
			{name: 'org_house', type: 'text'},
			{name: 'org_foreign', type: 'checkbox'},
			{name: 'phone', type: 'text'},
			{name: 'mobile_phone', type: 'text'},
			{name: 'fax', type: 'text'},
			{name: 'email', type: 'text'},
			{name: 'nationality', type: 'text'},
			{name: 'passport', type: 'text'},
			{name: 'hotel', type: 'radio'},
			{name: 'hotel_name', type: 'text'},
			{name: 'publish_agree', type: 'radio'}
		//	{name: '', type: 'text'},
		];
		function getElemData(cont, v) {
			var elm = cont.find('[name='+v.name+']');
			var len = elm.length;
			var rez;
			if( len > 1 ) {
				rez = null;
				$.each(elm, function(k, v) {
					v = $(v);
					if( v.attr('checked') ) {
						rez = v.val();
					}
				});
			} else {
				rez = elm.val();
				if( v.type=='checkbox' ) {
					rez = elm.attr('checked') ? true : false;
				}
			}
			//var rez = elm.length;
			return rez;
		}
		function getData() {
			var rez = {};
			$.each(formStruct, function(k,v) {
				rez[v.name] = getElemData(cont, v);
			});
			return rez;
		}

		var me = {
		//	getData: getData
		};

		var cont = $('#participationcomp');
		$.each(formStruct, function(k,v) {
			if(v.type=='date')
				cont.find('[name='+v.name+']').datepicker({
					"dateFormat": 'yy-mm-dd'
				});
		});
//		$( "#form_birthdate", cont ).datepicker({
//			"dateFormat": 'yy-mm-dd'
//		});
	//	$('input:radio').change(
	//		function(){
	//			alert('changed');   
	//		}
	//	);	    


		$( "#form_save_btn", cont ).click(function(){
			var data = getData();
			alert(JSON.encode(data));
		});

		return me;
	}(jQuery));
}

