
window.addEvent('domready',function() {

	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};
	self.Coms.Comp.Conf = self.Coms.Comp.Conf || {};

	/*  */

	self.Coms.Comp.Conf.ParticipationForm = (function() {
		return function() {
			alert('Registration Form');

			var panel = new Element('div', { styles: { } });
			var me = { panel: panel };

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

