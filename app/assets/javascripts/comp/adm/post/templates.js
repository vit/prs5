window.addEvent('domready',function() {
	var user_lang_code = Cookie.read('ecms_lang');
	var lang_list = ['en', 'ru'];
	var comp = $('userscomp');
/*
	(function( panel ) {
		var timeout = 500;
		var trs = [];
		var query = "";
		var cont = panel.getElement('[name="container"]');
		var request = (function(){
			if(query)
				find(query);
			else
				request.delay(timeout);
		});
		function addRow( data ) {
			var pin = data;
			var li = (new Element('li')).inject(cont);
			li.adopt(
				new Element('b', {text: data.account.pin})
			);
			['en', 'ru'].each(function(lang){
				li.adopt(
					new Element('span', {text: ' | '}),
					new Element('span', {text: data.info.title[lang]+' '+data.info.fname[lang]+' '+data.info.mname[lang]+' '+data.info.lname[lang]})
				);
			});
			trs.push(li);
		}
		function deleteRows() {
			trs.each(function(tr){ tr.destroy(); });
			trs.empty();
		}
		function find(text) {
			RPC.send('user.find_users', [text], function(result, error) {
				deleteRows();
				if( result ) result.each(function(v){ addRow(v); });
				request.delay(timeout);
			});
			query = "";
		}
		var userquery = panel.getElement('input[name="userquery"]');
		function changeHandler() {
			var text = userquery.getProperty('value');
			query = text;
		}
		userquery.addEvent('change', changeHandler);
		//userquery.addEvent('keypress', changeHandler);
		userquery.addEvent('keyup', changeHandler);
		request.delay(timeout);
		return {
			init: function( after ) {
//				reloadList();
			}
		};
	}( comp )).init();
*/

//					var comp = new Coms.Comp.ObjectMessageThreads(conf.id, paper_id);
//				//	comp.init(conf.id, paper_id);
//					var panel = comp.panel;

});


