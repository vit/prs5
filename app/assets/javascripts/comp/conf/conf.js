window.addEvent('domready',function() {

	var Conf = (function(args) {
	//	var me = new (new Class({
	//		Implements: Events,
		var me = {
	//		Implements: Events,
			init: function() {
				RPC.send('conf.get_conf_permissions', [me.id], function(result, error) {
				//	alert( JSON.encode(result) );
					if (result) me.permissions = result;
					RPC.send('conf.get_my_rights', [self.user.id, me.id], function(result, error) {
					//	alert( JSON.encode(result) );
						if (result) me.my_rights = result;
						me.fireEvent('init_ok');
					});
				});
			},
			permissions: {},
			my_rights: {},
			id: args.id,
			lang: args.lang,
			lang_list: function(){
				return me.lang=='en' ? ['en'] : me.lang=='ru' ? ['ru'] : ['en', 'ru'];
			}
		};
	//	}));
		OM.implement(me, OM.Events);
		return me;
	});

	self.conf = new Conf({
		id: $('cont_id').get('value'),
		lang: $('conf_lang').get('value')
	});
	self.conf.init();




//	self.conf.addEvent('evt1', function(){
//		alert('evt1');
//	});

//	self.conf.fireEvent('evt1');

});
