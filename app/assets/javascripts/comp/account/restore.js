window.addEvent('domready',function() {
	var user_lang_code = Cookie.read('ecms_lang');
	var lang_list = ['en', 'ru'];
	var comp = $('recoveryform');

	var recoveryform = (function( panel ){
			var dict = Dict( panel.getChildren('[name="dict"]')[0] );
			var statusLabel = panel.getElement('[name="status"]');
			var btn = panel.getElement('[type="button"][name="senddata"]');
			var di = FormDataInputs( panel, {
				pin: null,
				email: null,
				lname: null
			} );
			function setStatus( s ) {
				statusLabel.setProperty('text', s);
			}
			function trimData( data ) {
				var rez={};
				$H(data).each(function(v, k) {
					rez[k] = v.trim();
				});
				return rez;
			}
			function isValid( data ) {
				//var cnt = ['pin', 'email', 'lname'].ffold(0, function(acc, f){ if( data[f] ) acc++; return acc; });
				var cnt = ['pin', 'email', 'lname'].ffold(0, function(acc, f){ return data[f] ? ++acc : acc; });
				if( cnt < 2 ) alert( dict('notenoughdata') );
				else return true;
			}
			panel.addEvent('submit', function() { return false });	
			btn.addEvent('click', function() {
				var data = di.get();
				data = trimData( data );
			//	console.log(data);
				if( isValid(data) ) {
					RPC.send('user.restore_password', [data], function(result, error) {
						setStatus( '' );
						if(result) {
							if( result['status']=='found' ) {
								alert( dict('found_sent_ok') );
								window.location="/";
							} else {
								alert( dict('not_found') );
							}
						//	console.log(result);
						} else {
							alert( dict('error_msg') );
						}
					});
					setStatus( dict('requestsent') );
				}
			});
			var me = {
				init: function() {
					panel.reset();
				}
			};
			return me;
	}( comp.getChildren('form')[0] ));

	recoveryform.init();
	comp.setStyles({display: 'block'});

});





