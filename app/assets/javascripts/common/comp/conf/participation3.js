
'use strict';

(function($) {

	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};
	self.Coms.Comp.Conf = self.Coms.Comp.Conf || {};

	self.Coms.Comp.Conf.ParticipationFormGeneral = function(cont) {

			var conf = self.conf;
			var user = self.user;
		//	var user_lang_code = Cookie.read('ecms_lang');
		//	user_lang_code = user_lang_code || 'ru';

		//	var panel = new Element('div', { styles: { } });

		//	alert(user.id);
			var me = {
			};

			var form_on_elm = $('[name=form_on]', cont);
			var form_off_elm = $('[name=form_off]', cont);

			var form_on = ParticipationFormOn( form_on_elm );
			var form_off = ParticipationFormOff( form_off_elm );


			RPC.send('conf.participation.get_my_participation_data', [user.id, conf.id], function(result, error) {
				form_on.init(result);
				form_off.show(!result);
				form_on.show(!!result);
			//	registeredForm.init(result);
			//	notYetForm.show(!result);
			//	registeredForm.show(!!result);
			});

		//	form_on.hide();
		//	form_on.show();
	//		form_off.show();

			return me;
	};

	var ParticipationFormOn = function(cont) {
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
		var FormAccess = function( cont, info ) {
			function initForm() {
			//	$.each(formStruct, function(k,v) {
				$.each(info, function(k,v) {
					if(v.type=='date')
						cont.find('[name='+v.name+']').datepicker({
							"dateFormat": 'yy-mm-dd'
						});
				});
			}
			function getElemData(cont, v) {
				var elm = cont.find('[name='+v.name+']');
				var len = elm.length;
				var rez;
				if( len > 1 ) {
					rez = null;
					elm.each(function() {
						v = $(this);
						if( v.attr('checked') ) {
							rez = v.val();
						}
					});
					/*
					$.each(elm, function(k, v) {
						v = $(v);
						if( v.attr('checked') ) {
							rez = v.val();
						}
					});
					*/
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
				$.each(info, function(k,v) {
					rez[v.name] = getElemData(cont, v);
				});
				return rez;
			}
			var me = {
				get: getData
			};
			initForm();
			return me;
		}

		var me = {
			panel: cont,
			init: function(data) {
			//	di.clear();
			//	if(data)
			//		di.set(data)
			}
		//	getData: getData
		};

//		var cont = $('#participationcomp');
		var form = new FormAccess( cont, formStruct );

//		$.each(formStruct, function(k,v) {
//			if(v.type=='date')
//				cont.find('[name='+v.name+']').datepicker({
//					"dateFormat": 'yy-mm-dd'
//				});
//		});

//		$( "#form_birthdate", cont ).datepicker({
//			"dateFormat": 'yy-mm-dd'
//		});
	//	$('input:radio').change(
	//		function(){
	//			alert('changed');   
	//		}
	//	);	    


		$( "#form_save_btn", cont ).click(function(){
		//	var data = getData();
			var data = form.get();
			alert(JSON.encode(data));
		});


		Mixin.implement(me, Mixin.Observable);
		Mixin.implement(me, PanelMixin);
		return me;
	}



	var ParticipationFormOff = function(cont) {

		var me = {
			panel: cont
		//	getData: getData
		};


//		$( "#form_save_btn", cont ).click(function(){
//		//	var data = getData();
//			var data = form.get();
//			alert(JSON.encode(data));
//		});


		Mixin.implement(me, Mixin.Observable);
		Mixin.implement(me, PanelMixin);
		return me;
	}



	var PanelMixin = {
		show: function(flag) {
			$(this.panel).css('display', flag ? 'block' : 'none');
		}
	}


}(jQuery));

