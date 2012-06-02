window.addEvent('domready',function() {
	var user_lang_code = Cookie.read('ecms_lang');
	var lang_list = ['en', 'ru'];
	var comp = $('adminscomp');

	var admins = (function( panel ) {
		var trs = [];
		var cont = panel.getElement('[name="container"]');
		function addRow( data ) {
			var pin = data;
			var li = (new Element('li')).inject(cont);
			li.adopt(
				new Element('a', {text: '[X]', href: '#', 'events': {'click': function() {
					RPC.send('user.remove_from_admins_list', [pin], function(result, error) {
						reloadList();
					});
					return false;
				}}}),
				new Element('span', {text: ' | '}),
				new Element('span', {text: pin}),
				new Element('span', {text: ' | '}),
				new Element('span')
			);
			trs.push(li);
		}
		function deleteRows() {
			trs.each(function(tr){ tr.destroy(); });
			trs.empty();
		}
		function reloadList() {
			RPC.send('user.get_admins_list', [], function(result, error) {
				deleteRows();
				if( result ) result.each(function(v){ addRow(v); });
			});
		}
		panel.getElement('input[name="addpin"]').addEvent('click', function() {
			var inp = panel.getElement('input[name="userpin"]')
			var pin = inp.getProperty('value').toInt();
			if(pin) RPC.send('user.add_to_admins_list', [pin], function(result, error) {
				inp.setProperty('value', '');
				reloadList();
			});
		});
		return {
			init: function( after ) {
				reloadList();
			}
		};
	}( comp ));

	admins.init();

});


