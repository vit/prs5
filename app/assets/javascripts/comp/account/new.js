window.addEvent('domready',function() {
	var user_lang_code = Cookie.read('ecms_lang');
	var lang_list = ['en', 'ru'];
	var comp = $('newuserform');
	//var comp = $('newuserform');
	//var comp = document.getElementById('newuserform');

	///*
	var newuserform = (function( panel ){
			var dict = Dict( panel.getChildren('[name="dict"]')[0] );
			var btn = panel.getElement('[type="button"][name="senddata"]');
			var con = panel.getElement('[type="checkbox"][name="confirm"]');
			var di_acc = FormDataInputs( panel, {
				email: null,
				password: null,
				password2: null
			} );
			var di_info = FormDataInputs( panel, {
				gender: null,
				country: null,
				phone: null,
				fax: null,
				title: 'ml',
				fname: 'ml',
				mname: 'ml',
				lname: 'ml',
				city: 'ml',
				affiliation: 'ml'
			} );
			function updState() {
				btn.setProperty('disabled', !con.getProperty('checked') );
			}
			function isValid( data ) {
				di_info.unmarkAll('field_error');
				di_acc.unmarkAll('field_error');
				var data_missing = false;
				['email', 'password', 'password2'].each(function(f){
					if( !(data.account[f] && data.account[f].trim()) ) {
						data_missing = true;
						di_acc.mark('field_error', f);
					}
				});
			//	['gender', 'country', 'phone', 'fax'].each(function(f){
				['gender', 'country', 'phone'].each(function(f){
					if( !(data.info[f] && data.info[f].trim()) ) {
						data_missing = true;
						di_info.mark('field_error', f);
					}
				});
				['title', 'fname', 'lname', 'city', 'affiliation'].each(function(f){
					lang_list.each(function(lang){
						if( !(data.info[f] && data.info[f][lang] && data.info[f][lang].trim()) ) {
							data_missing = true;
							di_info.mark('field_error', f, lang);
						}
					});
				});
				var passwords_not_equal = data.account.password!=data.account.password2;
				if( passwords_not_equal ) {
					di_acc.mark('field_error', 'password');
					di_acc.mark('field_error', 'password2');
				}
				if( data_missing ) {
					alert( dict('data_missing') );
				}
				else if( passwords_not_equal ) {
					alert( dict('passwordnotequal') );
				}
				else return true;
			}
			panel.addEvent('submit', function() { return false });	
			btn.addEvent('click', function() {
				var data = {account: di_acc.get(), info: di_info.get()}
				if( isValid(data) ) {
					delete data.account.password2
					btn.setProperty('disabled', true);
					RPC.send('user.new_user', [data], function(result, error) {
						//alert( JSON.encode( result ) );
						var pin = result && result['pin'];
						if(pin) {
							comp.setStyles({display: 'none'});
							var msg = dict('pin_message_1') + pin +  dict('pin_message_3');
							alert(msg);
							RPC.send('user.auth.userEnter', [pin, data.account.password], function(result, error) {
								Cookie.write('session_key', result, {path: '/'})
								window.location="/";
							});
						} else {
							var msg = dict('err_message_1');
							alert(msg);
						}
						btn.setProperty('disabled', false);
					});
				}
			});
			con.addEvent('change', function() {
				updState();
			});
			var me = {
				init: function() {
					panel.reset();
					updState();
				}
			};
			return me;
	}( comp.getChildren('form')[0] ));

	newuserform.init();
	comp.setStyles({display: 'block'});
	//*/

});





