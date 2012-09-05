
window.addEvent('domready',function() {

	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};
	self.Coms.Comp.Post = self.Coms.Comp.Post || {};

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

			return me;
		};
	}());

	self.Coms.Comp.Post.TemplatesList = (function() {
		return function(args) {
			var user = window.user;
	//		alert(user);
			var panel = new Element('div', { class: '' });
		//	var new_element = new Coms.Comp.AddThreadPanel( args );
		//	panel.grab(new_element.panel);

			var new_element_btn = new Element('input', {type: 'button', value: 'New template ', events: {
				click: function() {
				//	alert('qqq');
					me.notify('show_item', null);
					return false;
				}
			}});
			panel.grab(new_element_btn);

			var t_list = new Element('fieldset', { class: 'templates_list' });
			t_list.grab(new Element('legend', {text: 'Templates list'}));
			var cont = new Element('div');
			t_list.grab(cont);
			panel.grab(t_list);
			function addRow(v) {
				var div = new Element('div', { class: 'item' });
			//	/*
				var a = new Element('a', { href: '#',
					events: {
						click: function (e) {
							me.notify('show_item', v['_id']);
							return false;
						}
					}
				});
				a.set('text', v.title ? JSON.encode(v.title) : '???' );
				div.grab(a);
				cont.grab(div);
			}
			function render(list) {
				cont.empty();
				if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
			//	var result = [1,2,3];
				RPC.send('post.get_templates', [null], function(result, error) {
				//	alert(JSON.encode(result));
					render(result);
				});
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

	/* EditOneTemplate -- Create, save, edit or delete single template */
	self.Coms.Comp.Post.EditOneTemplate = (function() {
		return function(args) {
			var user = window.user;
		//	var user = window.user;
			var panel = new Element('div', { class: '' });

			var template_id = null;

			var cont = new Element('div', {styles: {ddisplay: 'none'}});
			panel.grab(cont);
			var t_title_label = new Element('b', {text: 'Template title '});
			var t_title_label2 = new Element('span', {text: ' ('+ 'for your convenience, not an important part of the template' +')'});
		//	var thread_title = new Element('input', {type: 'text'});
			var t_title_en = new Element('input', {type: 'text', name: 'title_en'});
			var t_title_ru = new Element('input', {type: 'text', name: 'title_ru'});
			var t_text_label = new Element('b', {text: 'Template text'});
			var t_text = new Element('textarea', {name: 'text', styles: {
				width: '40em',
				height: '6em'
			}});
			var back_btn = new Element('input', {type: 'button', class: '', value: '<< Back to the list', events: {
				click: function(e){
					clear_form();
			//		RPC.send('msg.delete_my_message_draft', [user.id, msg_id], function(result, error) {
			//	//		alert(JSON.encode(result));
						me.notify('close_item', template_id);
					//	me.panel.dispose();
			//		});
			//	//	cont.setStyles({display: 'none'});
				}
			}});
			var save_t_btn = new Element('input', {type: 'button', class: '', value: 'Save template', events: {
				click: function(e){
				//	alert( JSON.encode(t_info.get()) );
					RPC.send('post.save_template_data', [null, template_id, t_info.get()], function(result, error) {
						if( !template_id ) { template_id = result; }
						alert(JSON.encode(result));
					});
				}
			}});
			var save_t_finish_btn = new Element('input', {type: 'button', class: '', value: 'Save and finish', events: {
				click: function(e){
				//	alert( JSON.encode(t_info.get()) );
					RPC.send('post.save_template_data', [null, template_id, t_info.get()], function(result, error) {
						if( !template_id ) { template_id = result; }
					//	alert(JSON.encode(result));
						me.notify('close_item', template_id);
					});
				}
			}});
			var delete_t_btn = new Element('input', {type: 'button', class: '', value: 'Delete template', events: {
				click: function(e){
					if( confirm('Are you sure you want to delete this template?') ) {
						clear_form();
						RPC.send('post.delete_template', [null, template_id], function(result, error) {
						//	alert(JSON.encode(result));
							me.notify('close_item', template_id);
						});
					}
				}
			}});
		//	if( !thread_id ) {
				cont.adopt(
					back_btn,
					new Element('br'),
					t_title_label,
					t_title_label2,
					new Element('br'),
					new Element('b', {text: 'en '}),
					t_title_en,
					new Element('br'),
					new Element('b', {text: 'ru '}),
					t_title_ru,
				//	thread_title,
					new Element('br')
				);
		//	}
			cont.adopt(
				t_text_label,
				new Element('br'),
				t_text,
				new Element('br'),
			//	add_t_btn,
				save_t_btn,
				save_t_finish_btn,
				delete_t_btn
			);

			var t_info = FormDataInputs( cont, {
				text: null,
				title: 'ml' //,
			} );

			function clear_form() {
				t_info.set({
					title: {en: '', ru: ''},
					text: ''
				});
			}

			function loadData(){
			//	alert(template_id);
				if(template_id) {
					RPC.send('post.get_template_data', [null, template_id], function(result, error) {
						t_info.set(result);
					});
				}
			}
			function reload() { loadData(); }
			function init(id) {
				template_id = id;
				reload();
			}
			var me = {
				panel: panel,
				init: init,
			//	reload: reload,
				show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
			};
			Mixin.implement(me, Mixin.Observable);
			return me;
		};
	}());


});

