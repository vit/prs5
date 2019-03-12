
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
				form_off.init(result);
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




	function InnerForm(cont) {

		cont.find('[name=form_addrow_btn]').click(function() {
		//	alert('click!!!');
			addRow();
		//	addRow({fname: 'rta rt sd ts'});
		});
		cont = cont.find('[name=accompaniing_cont]');

		var fields = ['fname', 'mname', 'lname'];
		var elems = [];

		function addRow(data) {
			data = data || {};
			var tr = $('<tr></tr>');
			var inputs = {};
			$.each(fields, function(k, v) {
				var td = $('<td></td>');
				var input = $('<input type=text />');
				input.val(data[v]);
				input.css('width', '100%');
				td.append(input);
				tr.append(td);
				inputs[v] = input;
			});
			var row = {
			//	data: data,
				inputs: inputs,
				tr: tr
			};
			var td = $('<td align=center></td>');
			var a = $('<a href=# >[X]</a>');
			var e_len = elems.length;
			a.click(function() {
				tr.remove();
				var index = $.inArray(row, elems);
				if(index != -1) elems.splice(index, 1);
				return false;
			});
			td.append(a);
			tr.append(td);
			cont.append(tr);
			elems.push( row );
		}

		function setData(data) {
			cont.text('');
			elems.length = 0;
			if(data)
				$.each(data, function(k, v) {
					addRow(v);
				});
		}

		function getData() {
			var arr = [];
			$.each(elems, function(k, v) {
				var data = {};
				$.each(fields, function(k2, v2) {
					data[v2] = v.inputs[v2].val();
				});
				arr.push( data );
			});
			return arr;
		}

		function initForm() {
		}

		function validate() {
			return true;
		}

		var me = {
			get: getData,
			set: setData,
			validate: validate
		};
		initForm();
		return me;
	}



	var ParticipationFormOn = function(cont) {
		var dict = new Dict( $('[name=dict]', cont) );
		var form = $('form', cont);
		function goPartPresenceDependent(name) {
			goHotelDependent.call(this, name);
		}
		function goPartTypeDependent(name) {
			var val = this.get()['part_type'];
			var flagEnabled = val!='nonauthor';
			var flagRequired = val=='speaker';
			this.setRequired('coauthors', flagRequired);
			this.setEnabled('coauthors', flagEnabled);
			this.setRequired('responsibilities', flagRequired);
		}
		function goOccupationDependent(name) {
			var flagEnabled = this.get()['occupation'] == 'work';
			this.setEnabled('position', flagEnabled);
			this.setEnabled('rank', flagEnabled);
			this.setEnabled('degree', flagEnabled);
		}
		function goForeignDependent(name) {
			goNationalityDependent.call(this, 'nationality');
//			var flagEnabled = this.get()['org_foreign'] == true;
//			alert( this.get()['org_foreign'] );
//		//	this.setEnabled('hotel_name', flagEnabled);
		}
		function goNationalityDependent(name) {
			var flagEnabled = this.get()['nationality'] != 'ru';
			var foreign = this.get()['org_foreign'] == true;
		//	this.setEnabled('passport', flagEnabled);
			this.setEnabled('passport', flagEnabled || foreign);
			this.setEnabled('birthplace', flagEnabled || foreign);
			this.setEnabled('passport_issued_date', flagEnabled || foreign);
			this.setEnabled('passport_expires_date', flagEnabled || foreign);
		}
		function goHotelDependent(name) {

//			console.log( this.get()['part_presence'] );

		//	var internalEnabled = this.get()['part_presence'] == 'internal';
			var internalEnabled = this.get()['part_presence'] != 'online';
			this.setEnabled('hotel', internalEnabled);
			var flagEnabled = this.get()['hotel'] == 'hotel_myself';
		//	this.enableElement('hotel_name', flagEnabled);
			this.setEnabled('hotel_name', flagEnabled);
			this.setEnabled('hotel_name', flagEnabled && internalEnabled);
		}

		var formStruct = [
			{name: 'gender', type: 'radio', isvalid: 'notempty'},
			{name: 'person_title', type: 'list', isvalid: 'notempty'},
			{name: 'lname', type: 'text', isvalid: 'notempty'},
			{name: 'fname', type: 'text', isvalid: 'notempty'},
			{name: 'mname', type: 'text', isvalid: 'notempty'},
			{name: 'birthdate', type: 'date', isvalid: 'notempty'},
		//	{name: 'part_presence', type: 'radio', isvalid: 'notempty', goDependent: goPartPresenceDependent},
			{name: 'part_presence', type: 'radio', isvalid: '', goDependent: goPartPresenceDependent},
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
		//	{name: 'org_foreign', type: 'checkbox'},
			{name: 'org_foreign', type: 'checkbox', goDependent: goForeignDependent},
			{name: 'phone', type: 'text', isvalid: 'notempty'},
			{name: 'mobile_phone', type: 'text'},
			{name: 'fax', type: 'text'},
			{name: 'email', type: 'text', isvalid: 'notempty'},
			{name: 'nationality', type: 'text', isvalid: 'notempty', goDependent: goNationalityDependent},
			{name: 'passport', type: 'text', isvalid: 'notempty'},
			{name: 'birthplace', type: 'text', isvalid: 'notempty'},
			{name: 'passport_issued_date', type: 'date', isvalid: 'notempty', yearRange: '-50:-0'},
			{name: 'passport_expires_date', type: 'date', isvalid: 'notempty', yearRange: '+0:+20'},
			{name: 'accompaniing', type: 'subform', constructor: InnerForm},
			{name: 'hotel', type: 'radio', isvalid: 'notempty', goDependent: goHotelDependent},
			{name: 'hotel_name', type: 'text', isvalid: 'notempty'},
			{name: 'publish_agree', type: 'radio', isvalid: 'notempty'}
		];

		function init(data) {
			var flag_edit = data && window.conf.my_rights['PARTICIPANT_EDIT_REGFORM'] || !data && window.conf.my_rights['USER_REGISTER_PARTICIPATION'];
			$( "[name=form_save_btn]", form ).css('display', flag_edit ? 'block' : 'none');
			$( "[name=form_you_can_change]", form ).css('display', flag_edit ? 'block' : 'none');
			$( "[name=form_you_cant_change]", form ).css('display', !flag_edit ? 'block' : 'none');

			var flag_drop = window.conf.my_rights['PARTICIPANT_GIVE_UP_PARTICIPATION'];
			$( "[name=unreg_btn]", form ).css('display', flag_drop ? 'block' : 'none');
			$( "[name=form_you_can_drop]", form ).css('display', flag_drop ? 'block' : 'none');
			$( "[name=form_you_cant_drop]", form ).css('display', !flag_drop ? 'block' : 'none');

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
	//		var data = di.get();
	//		console.log(data);
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
		me.init = function() {
		//	alert( JSON.stringify( window.conf.my_rights ) );
			var flag = window.conf.my_rights['USER_REGISTER_PARTICIPATION'];
			$( "[name=form_register_btn]", form ).css('display', flag ? 'block' : 'none');
			$( "[name=form_register_disabled]", form ).css('display', !flag ? 'block' : 'none');
		}

		$( "[name=form_register_btn]", form ).click(function(){
		//	alert( JSON.stringify( window.conf.my_rights ) );
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
			var requiredModel = {};
			Mixin.implement(requiredModel, Mixin.Observable);
			Mixin.implement(requiredModel, FlagsMixin);

			function setEnabled(name, flag) { enabledModel.set(name, flag); }
			function setMarked(name, flag) { markedModel.set(name, flag); }
			function setRequired(name, flag) { requiredModel.set(name, flag); }

			function decorateField(name) {
				var flagEnabled = !! enabledModel.get(name);
				var flagMarked = !! markedModel.get(name);
				enableElement(name, flagEnabled);
				markElement(name, flagMarked && flagEnabled);
			//	markElement(name, flagMarked);
			}

			enabledModel.attach('changed', decorateField);
			markedModel.attach('changed', decorateField);
			requiredModel.attach('changed', decorateField);

//			markedModel.attach('changed', function() {
//				
//			});
	
			function initForm() {
				$.each(info, function(k,v) {
					infoMap[v.name] = v;
					var elem = cont.find('[name='+v.name+']');
					if(v.type=='date') {
//						var yearRange="-100:-10";
//						if(v.yearRange)
//							yearRange=v.yearRange;
						var yearRange = v.yearRange || "-100:-10";
						elem.datepicker({
							"dateFormat": 'yy-mm-dd',
							yearRange: yearRange,
							changeYear: true
						});
					}
					if(v.type=='subform' && $.type(v.constructor)=='function') {
						v.subform = v.constructor(elem);
					}
					if($.type(v.goDependent)=='function') {
						elem.change(function() {
							testOneField(v);
						});
					}
					enabledModel.set(v.name, true);
					requiredModel.set(v.name, v.isvalid && v.isvalid=='notempty');
				});
			//	testAllFields();
				$.each(info, function(k,v) { testOneField( v ); });
			}
			function testOneField(v) { if($.type(v.goDependent)=='function') { v.goDependent.call(me, v); } }
		//	function testAllFields() { $.each(info, function(k,v) { testOneField( v ); }); }
		//	function unmarkAllElements() {
		//	//	$.each(info, function(k,v) { markElement(v.name, false); });
		//		$.each(info, function(k,v) { markedModel.set(v.name, false); });
		//	}
			function markElement(name, flag) {
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
			function enableElement(name, flag) { cont.find('[name='+name+']').attr('disabled', !flag); }
			function getElemData(name) {
				var v = infoMap[name];
				var elm = cont.find('[name='+name+']');
				var rez;
				if( v.subform ) {
					rez = v.subform.get();
				//	rez = [1,2,3];
				} else {
					var len = elm.length;
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
				}
				return rez;
			}

			function setElemData(name, d) {
				var v = infoMap[name];
				var elm = cont.find('[name='+name+']');
				if( v.subform ) {
					v.subform.set(d);
				} else {
					var len = elm.length;
					if( len > 1 ) {
						elm.val([d]);
					} else {
						if( v.type=='checkbox' ) elm.attr('checked', d);
						else elm.val(d);
					}
				}
				testOneField(v);
			}
			function getData() {
				var rez = {};
				$.each(info, function(k,v) { rez[v.name] = getElemData(v.name); });
				return rez;
			}
			function setData(data) { $.each(info, function(k,v) { setElemData(v.name, data[v.name]); }); }
			function validate() {
				var allValid = true;
				$.each(info, function(k,v) {
					var isValid = true;
					if( v.subform ) {
				//		isValid = v.subform.validate();
					} else {
						//if( v.isvalid && enabledModel.get(v.name) && v.isvalid=='notempty' ) {
						if( requiredModel.get(v.name) && enabledModel.get(v.name) ) {
							var val = getElemData(v.name);
							if(!val) {
						//		console.log("invalid " + v.name);
								isValid = false;
							}
						}
						markedModel.set(v.name, !isValid);
					//	if(!isValid)
					//		alert(v.name);
					}
					allValid = allValid && isValid;
				});
				return allValid;
			}

			var me = {
				get: getData,
				set: setData,
				setEnabled: setEnabled,
				setMarked: setMarked,
				setRequired: setRequired,
				validate: validate
			};
			initForm();
			return me;
		}


}(jQuery));


