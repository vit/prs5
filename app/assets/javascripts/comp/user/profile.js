window.addEvent('domready',function() {
	var user_lang_code = Cookie.read('ecms_lang');
	var user_id = $('user_id').get('value');
	var lang_list = ['en', 'ru'];

	var infoform = (function( panel ){
			var di = FormDataInputs( panel, {
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
			var btn = panel.getElement('[type="button"][name="senddata"]');
			function reload() {
				RPC.send('user.get_user_info', [user_id], function(result, error) {
				//	alert( JSON.encode( result ) );
					di.set(result);
				});
			}
			panel.addEvent('submit', function() { return false });
			btn.addEvent('click', function() {
				var data = di.get();
				RPC.send('user.set_user_info', [user_id, data], function(result, error) {
				//	alert( JSON.encode( result ) );
					alert('OK');
				});
			});
			var me = {
				init: function() {
					panel.reset();
					reload();
					panel.setStyles({display: 'block'});
				}
			};
			return me;
	}( $('changeinfo') ));
	infoform.init();

	var passwordform = (function( panel ){
			var dict = Dict( panel.getChildren('[name="dict"]')[0] );
			var di = FormDataInputs( panel, {
				oldpassword: null,
				password: null,
				password2: null
			} );
			var btn = panel.getElement('[type="button"][name="sendpassword"]');
			function isValid( data ) {
				if( data.password!=data.password2 ) {
					alert( dict('passwordnotequal') );
				}
				else return true;
			}
			panel.addEvent('submit', function() { return false });
			btn.addEvent('click', function() {
				var data = di.get();
				if( isValid(data) ) {
					RPC.send('user.set_user_password', [user_id, data.oldpassword, data.password], function(result, error) {
					//	alert( JSON.encode( result ) );
						panel.reset();
						alert('OK');
					});
				}
			});
			var me = {
				init: function() {
					panel.reset();
					panel.setStyles({display: 'block'});
				}
			};
			return me;
	}( $('changepassword') ));
	passwordform.init();

	var emailform = (function( panel ){
			var di = FormDataInputs( panel, {
				email: null
			} );
			var btn = panel.getElement('[type="button"][name="sendemail"]');
			function reload() {
				RPC.send('user.get_user_email', [user_id], function(result, error) {
				//	alert( JSON.encode( result ) );
					di.set({email: result});
				});
			}
			panel.addEvent('submit', function() { return false });
			btn.addEvent('click', function() {
				var data = di.get()
				RPC.send('user.set_user_email', [user_id, data.email], function(result, error) {
				//	alert( JSON.encode( result ) );
					alert('OK');
				});
			});
			var me = {
				init: function() {
					panel.reset();
					reload();
					panel.setStyles({display: 'block'});
				}
			};
			return me;
	}( $('changeemail') ));
	emailform.init();

});



