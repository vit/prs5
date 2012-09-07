
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

		var panel = new Element('div', { styles: {display: 'none'} });
		var me = {
			panel: panel,
			show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
		};

		panel.grab(new Element('div', {text: 'NotYetForm'}));
		var text1 = new Element('div', {text: dict('not_yet_text')});
		var register_btn = new Element('input', {type: 'button', value: dict('register_btn'), events: {
			click: function(e) {
				alert('wwwwwwwwwww');
			}
		}});
		panel.adopt(
			text1,
			register_btn
		);

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
			show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
		};

	//	panel.grab(new Element('div', {text: 'RegisteredForm'}));

		var text1 = new Element('div', {text: dict('you_have_registered_already_text')});
		var unregister_btn = new Element('input', {type: 'button', value: dict('unregister_btn'), events: {
			click: function(e) {
				alert('wwwwwwwwwww');
			}
		}});
		panel.adopt(
			text1,
			unregister_btn
		);
		Mixin.implement(me, Mixin.Observable);
		return me;
	};
	var CommonForm = function(args) {
		var conf = self.conf;
		var user = self.user;
	//	alert('Registration Form');
	//	RPC.send('util.get_dict', [user.id, conf.id], function(result, error) {
//		RPC.send('util.get_dict', ['common/comp/conf/participation', ['en']], function(result, error) {
//			//alert( JSON.encode(result) );
//			if(!result) result = {};
//			alert( JSON.encode(result) );
//		});

		var panel = new Element('div', { styles: { } });
		var me = {
			panel: panel,
			show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')},
			init: function(user_id, conf_id) {
				RPC.send('conf.participation.get_my_participation_data', [user_id, conf_id], function(result, error) {
					notYetForm.show(!result);
					registeredForm.show(!!result);
	//				alert( JSON.encode(result) );
		//			if(!result) result = {};
		//			alert( JSON.encode(result) );
				});
			}
		};

		var notYetForm = new NotYetForm(args);
		var registeredForm = new RegisteredForm(args);
		panel.adopt(
			notYetForm.panel,
			registeredForm.panel
		);

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

