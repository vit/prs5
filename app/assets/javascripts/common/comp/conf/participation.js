
window.addEvent('domready',function() {

	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};
	self.Coms.Comp.Conf = self.Coms.Comp.Conf || {};

	/*
	var cont_id = self.conf.id;
	var conf_lang = self.conf.lang;
	var user_id = $('user_id').get('value');
	var user_lang_code = Cookie.read('ecms_lang');
//	var lang_list = conf_lang=='en' ? ['en'] : conf_lang=='ru' ? ['ru'] : ['en', 'ru'];
	var lang_list = self.conf.lang_list();
	//var conf_permissions = {};
	var conf_user_rights = {};
	*/

	/*
	self.conf.addEvent('init_ok', function(result, error) {
		//conf_permissions = self.conf.permissions;
		conf_user_rights = self.conf.my_rights;
	//	MyPapers();
	});
	*/

	/*  */

	var NotYetForm = function(args) {
		var conf = self.conf;
		var user = self.user;
		var dict = args.dict;
		var conf_user_rights = self.conf.my_rights;

		var panel = new Element('div', { styles: {display: 'none'} });
		var me = {
			panel: panel,
			show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
		};

	//	panel.grab(new Element('div', {text: 'NotYetForm'}));
		var top_text = new Element('div', {text: dict('not_yet_text')});
		panel.adopt(
			top_text
		);
	//	if(conf_user_rights[]) {
			var register_btn = new Element('input', {type: 'button', value: dict('register_btn'), events: {
				click: function(e) {
					RPC.send('conf.participation.create_my_participation', [user.id, conf.id], function(result, error) {
						me.notify('reload');
					});
				}
			}});
			panel.adopt(
				register_btn
			);
	//	} else {
//			var you_cant_create_text = new Element('div', {text: dict('you_cant_create_text')});
//			panel.adopt(
//				you_cant_create_text
//			);
//		}

		Mixin.implement(me, Mixin.Observable);
		return me;
	};
	var RegisteredForm = function(args) {
		var conf = self.conf;
		var user = self.user;
		var dict = args.dict;

		var panel = new Element('div', { styles: {display: 'none'} });
		var me = {
			panel: panel,
			show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')},
			init: function(data) {
				di.clear();
				if(data)
					di.set(data)
			}
		};

		var text1 = new Element('div', {text: dict('you_have_registered_already_text')});
		var unregister_btn = new Element('input', {type: 'button', value: dict('unregister_btn'), events: {
			click: function(e) {
				RPC.send('conf.participation.drop_my_participation', [user.id, conf.id], function(result, error) {
					me.notify('reload');
				});
			}
		}});
		panel.adopt(
			text1,
			unregister_btn
		);

		var text2 = new Element('div', {text: dict('you_can_change_text')});
		var save_btn = new Element('input', {type: 'button', value: dict('save_form_btn'), events: {
			click: function(e) {
		//		alert( JSON.encode(di.get()) );
				RPC.send('conf.participation.save_my_participation_data', [user.id, conf.id, di.get()], function(result, error) {
			//		alert( JSON.encode(result) );
					alert( dict('form_saved_ok') );
					me.notify('reload');
				});
			}
		}});
		panel.adopt(
			text2,
			save_btn
		);

		var di_fields = {};
		var table = new Element('table', {border: 1, cellpadding: 5, cellspacing: 0});
		var tbody = new Element('tbody');
		panel.grab( table.grab( tbody ) );
		['badgename', 'birthyear', 'degree', 'organization', 'position', 'address', 'zipcode', 'phone', 'fax', 'email'].each( function(name) {
			var tr = new Element('tr');
			var td1 = new Element('td', {align: 'right', text: dict('form_'+name)});
			var td2 = new Element('td', {});
			var input = new Element('input', {type: 'text', value: '', name: name});
			tbody.grab( tr.adopt( td1, td2.grab(input) ) );
			di_fields[name] = null;
		});

		var di = FormDataInputs( table, di_fields );

//		RPC.send('conf.participation.get_my_participation_data', [user.id, conf.id], function(result, error) {
//			di.clear();
//			if(result)
//				di.set(result)
//		//	alert( JSON.encode(result) );
//		//	me.notify('reload');
//		});

		Mixin.implement(me, Mixin.Observable);
		return me;
	};
	var CommonForm = function(args) {
		var conf = self.conf;
		var user = self.user;

		var panel = new Element('div', { styles: { } });
		var me = {
			panel: panel,
			show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')},
			init: function(user_id, conf_id) {
				RPC.send('conf.participation.get_my_participation_data', [user_id, conf_id], function(result, error) {
					registeredForm.init(result);
					notYetForm.show(!result);
					registeredForm.show(!!result);
				});
			}
		};

		var notYetForm = new NotYetForm(args);
		var registeredForm = new RegisteredForm(args);
		panel.adopt(
			notYetForm.panel,
			registeredForm.panel
		);
		notYetForm.attach('reload', function() {
			me.init(user.id, conf.id);
		});
		registeredForm.attach('reload', function() {
			me.init(user.id, conf.id);
		});

		Mixin.implement(me, Mixin.Observable);
		return me;
	};

	self.Coms.Comp.Conf.ParticipationForm = (function() {
		return function() {
			var conf = self.conf;
			var user = self.user;
			var user_lang_code = Cookie.read('ecms_lang');
			user_lang_code = user_lang_code || 'ru';

			var panel = new Element('div', { styles: { } });
			var me = { panel: panel };

			Coms.Util.LoadDictionary('common/comp/conf/participation', user_lang_code, function(dict) {
				var args = {
					dict: dict
				}
				var commonForm = new CommonForm(args);
				panel.grab( commonForm.panel );
				commonForm.init(user.id, conf.id);
	//			alert( dict('test') );
//				RPC.send('conf.participation.get_my_participation_data', [user.id, conf.id], function(result, error) {
//	//				alert( JSON.encode(result) );
//		//			if(!result) result = {};
//		//			alert( JSON.encode(result) );
//				});
			});

			return me;
		};
	}());

});

