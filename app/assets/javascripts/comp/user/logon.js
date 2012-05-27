

//$(document).ready(function () {
window.addEvent('domready',function() {
//	alert('rtw rtwe we');

	var timeout = 600*1000;
//	var timeout = 20*1000;

	var ping = function(){
	//	alert('OK');
		RPC.send('user.ping', [], function(result, error) {
	//		alert( JSON.encode( result ) );
			ping.delay( timeout );
		});
	};
	ping.delay( timeout );


	var User = (function(args) {
		var me = new (new Class({
			Implements: Events,
			init: function() {
				RPC.send('user.get_user_info', [me.id], function(result, error) {
					if (!result) result = {};
					me.info = result;
			//		alert( JSON.encode(result) );
			//		if (result) me.permissions = result;
			//		RPC.send('conf.get_my_rights', [self.user.id, me.id], function(result, error) {
			//		//	alert( JSON.encode(result) );
			//			if (result) me.my_rights = result;
			//			me.fireEvent('init_ok');
			//		});
				});
			},
			id: args.id,
			lang: args.lang
		}));
		return me;
	});

	self.user = new User({
		id: $('user_id') ? $('user_id').get('value') : null,
		lang: Cookie.read('ecms_lang')
	});
	self.user.init();
});


