
window.addEvent('domready',function() {

	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};
	self.Coms.Comp.Post = self.Coms.Comp.Post || {};

	/*
	 * 
	 */

	/*  */

	self.Coms.Comp.Post.EditTemplates = (function() {
		return function() {
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

			var tList = new Coms.Comp.Post.TemplatesList( args );
			tList.attach('show_item', function(arg) {
			//	oneT.init(arg);
				tList.show(false);
			//	new_thread_draft_btn_show(false);
			//	oneT.show(true);
			});
			tList.reload();
			panel.grab(tList.panel);

/*
			var oneT = new Coms.Comp.Post.EditOneTemplate({});
			oneT.show(false);
			oneT.attach('close_item', function(arg) {
				oneT.show(false);
				List.show(true);
			//	threadsDraftsList.show(true);
			//	new_thread_draft_btn_show(true);
			});
			panel.grab(oneT.panel);
*/

			return me;
		};
	}());

	self.Coms.Comp.Post.TemplatesList = (function() {
		return function(args) {
			var user = window.user;
	//		alert(user);
			var panel = new Element('div', { class: '' });
		//	var new_thread_element = new Coms.Comp.AddThreadPanel( args );
		//	panel.grab(new_thread_element.panel);

			var t_list = new Element('fieldset', { class: 'templates_list' });
			t_list.grab(new Element('legend', {text: 'Templates list'}));
			var cont = new Element('div');
			t_list.grab(cont);
			panel.grab(t_list);
			function addRow(v) {
				var div = new Element('div', { class: 'item' });
				/*
				var a = new Element('a', { href: '#',
					events: {
						click: function (e) {
							me.notify('show_thread', v['thread_id']);
							return false;
						}
					}
				});
				a.set('text', v['thread_title']);
				div.grab(a);
				*/

			//	div.set('text', v['thread_title']);
				div.set('text', 'qqq qqq qqq qqq qqq');
				cont.grab(div);
			}
			function render(list) {
				cont.empty();
				if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
				var result = [1,2,3];
			//	RPC.send('msg.get_my_threads_on_paper', [user.id, args.cont_id, args.paper_id], function(result, error) {
				//	alert(JSON.encode(result));
					render(result);
			//	});
			}
			function reload() { loadData(); }
			var me = {
				panel: panel,
				reload: reload,
				show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
			};
			Mixin.implement(me, Mixin.Observable);
			return me;
		}
	}());


});
