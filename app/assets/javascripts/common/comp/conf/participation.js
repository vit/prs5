
'use strict';

(function($) {


	var Dict = function(cont){
		return function(word){
			var elm = cont ? $('[name="'+word+'"]', cont) : null;
			var res = elm ? elm.val() : null;
			return res ? res : word;
		}
	}

	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};
	self.Coms.Comp.Conf = self.Coms.Comp.Conf || {};

	self.Coms.Comp.Conf.ParticipationFormGeneral = function(cont) {
		var dict = new Dict( $('[name=dict]', cont) );
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

	//	var form_on = ParticipationFormOn( form_on_elm );
		var form_on = ParticipationFormOn( form_on_elm );
		var form_off = ParticipationFormOff( form_off_elm );

		form_off.attach('want_register', function() {
			form_off.show(false);
			form_on.show(true);
		});

		function load_data() {
			RPC.send('conf.participation.get_my_participation_data', [user.id, conf.id], function(result, error) {
				//	result = {gender: 'F', lname: 'wqrwrtqrtqrtqrtqrtq', org_foreign: false};
				form_on.init(result);
				form_off.show(!result);
				form_on.show(!!result);
			});
		}

		form_on.attach('save_form', function(data) {
			RPC.send('conf.participation.save_my_participation_data', [user.id, conf.id, data], function(result, error) {
				alert( dict('msg_form_saved_successfully') );
				load_data();
			//	form_off.show(true);
			//	form_on.show(false);
		//		if(callback) callback();
			});
		//}, callback);
		});
		form_on.attach('drop_form', function() {
			RPC.send('conf.participation.drop_my_participation', [user.id, conf.id], function(result, error) {
				alert( dict('msg_form_dropped_successfully') );
				load_data();
			//	form_off.show(true);
			//	form_on.show(false);
		//		if(callback) callback();
			});
		//}, callback);
		});

		load_data();

		return me;
	};



	var ParticipationFormOn = function(cont) {
		var dict = new Dict( $('[name=dict]', cont) );
		var form = $('form', cont);
		function goPartTypeDependent(name) {
			var flagEnabled = this.get()['part_type'] != 'nonauthor';
		//	this.enableElement('coauthors', flagEnabled);
			this.setEnabled('coauthors', flagEnabled);
		}
		function goOccupationDependent(name) {
			var flagEnabled = this.get()['occupation'] == 'work';
		//	this.enableElement('position', flagEnabled);
		//	this.enableElement('rank', flagEnabled);
		//	this.enableElement('degree', flagEnabled);
			this.setEnabled('position', flagEnabled);
			this.setEnabled('rank', flagEnabled);
			this.setEnabled('degree', flagEnabled);
		}
		function goNationalityDependent(name) {
			var flagEnabled = this.get()['nationality'] != 'ru';
		//	this.enableElement('passport', flagEnabled);
			this.setEnabled('passport', flagEnabled);
		}
		function goHotelDependent(name) {
			var flagEnabled = this.get()['hotel'] == 'hotel_myself';
		//	this.enableElement('hotel_name', flagEnabled);
			this.setEnabled('hotel_name', flagEnabled);
		}

		var formStruct = [
			{name: 'gender', type: 'radio', isvalid: 'notempty'},
			{name: 'person_title', type: 'list', isvalid: 'notempty'},
			{name: 'lname', type: 'text', isvalid: 'notempty'},
			{name: 'fname', type: 'text', isvalid: 'notempty'},
			{name: 'mname', type: 'text', isvalid: 'notempty'},
			{name: 'birthdate', type: 'date', isvalid: 'notempty'},
			{name: 'part_type', type: 'radio', isvalid: 'notempty', goDependent: goPartTypeDependent},
			{name: 'coauthors', type: 'text'},
			{name: 'occupation', type: 'radio', isvalid: 'notempty', goDependent: goOccupationDependent},
			{name: 'organization', type: 'text', isvalid: 'notempty'},
			{name: 'position', type: 'text'},
			{name: 'rank', type: 'text'},
			{name: 'degree', type: 'text'},
			{name: 'responsibilities', type: 'text', isvalid: 'notempty'},
			{name: 'org_country', type: 'text', isvalid: 'notempty'},
			{name: 'org_city', type: 'text', isvalid: 'notempty'},
			{name: 'org_postcode', type: 'text', isvalid: 'notempty'},
			{name: 'org_street', type: 'text', isvalid: 'notempty'},
			{name: 'org_house', type: 'text', isvalid: 'notempty'},
			{name: 'org_foreign', type: 'checkbox'},
			{name: 'phone', type: 'text', isvalid: 'notempty'},
			{name: 'mobile_phone', type: 'text'},
			{name: 'fax', type: 'text'},
			{name: 'email', type: 'text', isvalid: 'notempty'},
			{name: 'nationality', type: 'text', isvalid: 'notempty', goDependent: goNationalityDependent},
			{name: 'passport', type: 'text', isvalid: 'notempty'},
			{name: 'hotel', type: 'radio', isvalid: 'notempty', goDependent: goHotelDependent},
			{name: 'hotel_name', type: 'text'},
			{name: 'publish_agree', type: 'radio', isvalid: 'notempty'}
		];

		function init(data) {
			$('form[name=unregister_form]', cont).css('display', data ? 'block' : 'none');
		//	di.clear();
			if(data)
				di.set(data);
		}

		var me = {
			panel: cont,
			init: init
		};

		var di = new JSComp.FormAccess( form, formStruct );

		$( "[name=form_save_btn]", form ).click(function(){
			if( di.validate() ) {
				var data = di.get();
				me.notify('save_form', data);
			} else {
				alert( dict('msg_missing_required_fields') );
			}
		});
		$( "[name=unreg_btn]", form ).click(function(){
			if( confirm(dict('unregister_are_you_sure')) ) {
				me.notify('drop_form');
			}
		});

		Mixin.implement(me, Mixin.Observable);
		Mixin.implement(me, PanelMixin);
		return me;
	}

	var ParticipationFormOff = function(cont) {
		var form = $('form', cont);
		var me = {
			panel: cont
		};

		$( "[name=form_register_btn]", form ).click(function(){
			me.notify('want_register');
		});

		Mixin.implement(me, Mixin.Observable);
		Mixin.implement(me, PanelMixin);
		return me;
	}


	var PanelMixin = {
		show: function(flag) { $(this.panel).css('display', flag ? 'block' : 'none'); }
	}


}(jQuery));

(function($) {

	self.JSComp = self.JSComp || {};


	var FlagsMixin = {
		set: function(name, flag) {
			this.hash = this.hash || {};
			var changed = this.hash[name]!==flag;
			this.hash[name] = flag;
			if(changed)
				this.notify('changed', name, flag);
		},
		get: function(name) {
		//	alert( JSON.stringify(this.hash) );
			return this.hash ? this.hash[name] : null;
		}
	};

		self.JSComp.FormAccess = function( cont, info ) {
			var infoMap = {};
			var enabledModel = {};
			Mixin.implement(enabledModel, Mixin.Observable);
			Mixin.implement(enabledModel, FlagsMixin);
			var markedModel = {};
			Mixin.implement(markedModel, Mixin.Observable);
			Mixin.implement(markedModel, FlagsMixin);

			function setEnabled(name, flag) { enabledModel.set(name, flag); }
			function setMarked(name, flag) { markedModel.set(name, flag); }

			function decorateField(name) {
				var flagEnabled = !!enabledModel.get(name);
				enableElement(name, flagEnabled);
			}

			enabledModel.attach('changed', decorateField);
			markedModel.attach('changed', decorateField);
	
			function initForm() {
				$.each(info, function(k,v) {
					infoMap[v.name] = v;
					var elem = cont.find('[name='+v.name+']');
					if(v.type=='date')
						elem.datepicker({
							"dateFormat": 'yy-mm-dd',
							changeYear: true
						});
					if($.type(v.goDependent)=='function') {
						elem.change(function() {
					//		alert('changed!!!');
							testOneField(v);
						});
					}
				});
				testAllFields();
			}
			function testOneField(v) {
				if($.type(v.goDependent)=='function') {
					v.goDependent.call(me, v);
				}
			}
			function testAllFields() {
				$.each(info, function(k,v) {
					testOneField( v );
				});
			}
			function unmarkAllElements() {
			//	$.each(info, function(k,v) { markElement(v, false); });
				$.each(info, function(k,v) { markElement(v.name, false); });
			}
			function markElement(name, flag) {
			//	var elm = cont.find('[name='+v.name+']');
				var elm = cont.find('[name='+name+']');
				var len = elm.length;
				if( len > 1 ) {
					elm.each(function() {
						var p = $(this).parent();
						flag ? p.addClass('marked') : p.removeClass('marked');
					});
				} else {
					flag ? elm.addClass('marked') : elm.removeClass('marked');
				}
			}
			function getElemData(name) {
				var v = infoMap[name];
				var elm = cont.find('[name='+name+']');
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
				} else {
					if( v.type=='checkbox' ) rez = elm.attr('checked') ? true : false;
					else rez = elm.val();
				}
				//var rez = elm.length;
				return rez;
			}
			function setElemData(name, d) {
				var v = infoMap[name];
				var elm = cont.find('[name='+name+']');
				var len = elm.length;
				if( len > 1 ) {
					elm.val([d]);
				} else {
					if( v.type=='checkbox' ) elm.attr('checked', d);
					else elm.val(d);
				}
			}
			function enableElement(name, flag) {
				cont.find('[name='+name+']').attr('disabled', !flag);
			}
			function getData() {
				var rez = {};
				$.each(info, function(k,v) {
					rez[v.name] = getElemData(v.name);
				});
				return rez;
			}
			function setData(data) {
			//	alert('set');
				$.each(info, function(k,v) {
					setElemData(v.name, data[v.name]);
				});
			}
			function validateElement(name) {
				var v = infoMap[name];
			}
			function validate() {
				var err = [];
				unmarkAllElements();

				$.each(info, function(k,v) {
					if( v.isvalid ) {
						var val = getElemData(v.name);
						if( $.type(v.isvalid)=='string' ) {
							var rules = v.isvalid.split('|');
							$.each(rules, function(k2,v2) {
								switch( v2 ) {
									case 'notempty':
										if(!val) {
										//	markElement(v, true);
											markElement(v.name, true);
											err.push({name: v.name, rule: v2});
										}
								}
							});
						} else if( $.type(v.rules)=='function' ) {
							v.rules.call(me, v.name, function(rule) {
								if(!val) {
									markElement(v, true);
									err.push({name: v.name, rule: rule});
								}
							});
						}
					}
				});
		//		alert( JSON.stringify(err) );
				return err.length == 0;
			}
			var me = {
				get: getData,
				set: setData,
			//	enableElement: enableElement,
			//	markElement: markElement,
				setEnabled: setEnabled,
				setMarked: setMarked,
				validate: validate
			};
			initForm();
			return me;
		}


}(jQuery));


