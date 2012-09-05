
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

	/*  */

	self.Coms.Comp.Conf.ParticipationForm = (function() {
		return function() {
		//	alert('Registration Form');
		//	RPC.send('util.get_dict', [user.id, conf.id], function(result, error) {
	//		RPC.send('util.get_dict', ['common/comp/conf/participation', ['en']], function(result, error) {
	//			//alert( JSON.encode(result) );
	//			if(!result) result = {};
	//			alert( JSON.encode(result) );
	//		});

			var panel = new Element('div', { styles: { } });
			var me = { panel: panel };

			Coms.Util.LoadDictionary('common/comp/conf/participation', 'en', function(dict) {
				alert( dict('test') );
			});


		//	panel.set('text', 'dfgsdghdgh dfgdfgh dfj gh');

//			var qqq = new Element();

			var args = {
			//	cont_id: _cont_id,
			//	paper_id: _paper_id //,
			}

			/*
			var new_thread_draft_btn = new Element('input', {class: 'new_thread_draft_btn', type: 'button', value: 'New topic draft', events: {
				click: function() {
					threadsDraftsList.addNewDraft();
				}
			}});
			function new_thread_draft_btn_show(flag) { new_thread_draft_btn.setStyle('display', flag ? 'block' : 'none'); }

			panel.grab(new_thread_draft_btn);
			var bottom_div = new Element('div', {class: 'bottom_div'});

			var threadsDraftsList = new Coms.Comp.ObjectThreadsDraftsList( args );
			threadsDraftsList.attach('message_saved', function(arg) {
				threadsList.reload();
			});
			threadsDraftsList.reload();
			panel.grab(threadsDraftsList.panel);
			*/

			/*
			var tList = new Coms.Comp.Post.TemplatesList( args );
			tList.attach('show_item', function(arg) {
				oneT.init(arg);
				tList.show(false);
			//	new_thread_draft_btn_show(false);
				oneT.show(true);
			});
			tList.reload();
			panel.grab(tList.panel);

			var oneT = new Coms.Comp.Post.EditOneTemplate({});
			oneT.show(false);
			oneT.attach('close_item', function(arg) {
				oneT.show(false);
				tList.reload();
				tList.show(true);
			});
			panel.grab(oneT.panel);
			*/

			return me;
		};
	}());

});

