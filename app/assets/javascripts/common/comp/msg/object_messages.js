
window.addEvent('domready',function() {

	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};

	/*
	 * Components for threads
	 */

	/* Threads of selected object (paper), panel with children (drafts list, threads list) */
	self.Coms.Comp.ObjectMessageThreads = (function() {
		return function(_cont_id, _paper_id) {
			var panel = new Element('div', { styles: { } });
			var me = { panel: panel };
			var args = {
				cont_id: _cont_id,
				paper_id: _paper_id //,
			}

			var new_thread_draft_btn = new Element('input', {class: 'new_thread_draft_btn', type: 'button', value: 'New topic draft', events: {
				click: function() {
					threadsDraftsList.addNewDraft();
				}
			}});
			panel.grab(new_thread_draft_btn); var bottom_div =
				new Element('div', {class: 'bottom_div'});

			var threadsDraftsList = new Coms.Comp.ObjectThreadsDraftsList( args );
			threadsDraftsList.attach('message_saved', function(arg) {
				threadsList.reload();
			});
			threadsDraftsList.reload();
			panel.grab(threadsDraftsList.panel);

			var threadsList = new Coms.Comp.ObjectThreadsList( args );
			threadsList.attach('show_thread', function(arg) {
				oneThread.init(arg);
				threadsList.show(false);
				threadsDraftsList.show(false);
				oneThread.show(true);
			});
			threadsList.reload();
			panel.grab(threadsList.panel);

			var oneThread = new Coms.Comp.ObjectOneThread({});
			oneThread.show(false);
			oneThread.attach('close_thread', function(arg) {
				oneThread.show(false);
				threadsList.show(true);
				threadsDraftsList.show(true);
			});
			panel.grab(oneThread.panel);

			return me;
		};
	}());

	/* MessageDraftPanel -- Create, save, edit or delete single message draft, send message */
	self.Coms.Comp.MessageDraftPanel = (function() {
		return function(args, msg_id) {
			var user = window.user;
		//	var user = window.user;
			var panel = new Element('div', { class: '' });
			var cont = new Element('div', {styles: {ddisplay: 'none'}});
			panel.grab(cont);
			var thread_title_label = new Element('b', {text: 'Topic title '});
			var thread_title = new Element('input', {type: 'text'});
			var msg_text_label = new Element('b', {text: 'Message text'});
			var msg_text = new Element('textarea', {styles: {
				width: '40em',
				height: '6em'
			}});
			var add_msg_btn = new Element('input', {type: 'button', class: '', value: 'Send message', events: {
				click: function(e){
					RPC.send('msg.save_my_message_draft_data', [user.id, msg_id, {msg_text: msg_text.get('value'), thread_title: thread_title.get('value')}], function(result, error) {
						RPC.send('msg.save_my_draft_as_message', [user.id, msg_id], function(result, error) {
					//		alert(JSON.encode(result));
							me.notify('message_saved', msg_id);
							me.panel.dispose();
						});
					});
				}
			}});
			var save_draft_btn = new Element('input', {type: 'button', class: '', value: 'Save draft', events: {
				click: function(e){
				//	alert( msg_id );
					RPC.send('msg.save_my_message_draft_data', [user.id, msg_id, {msg_text: msg_text.get('value'), thread_title: thread_title.get('value')}], function(result, error) {
				//		alert(JSON.encode(result));
					});
				}
			}});
			var delete_msg_btn = new Element('input', {type: 'button', class: '', value: 'Delete draft', events: {
				click: function(e){
					clear_form();
					RPC.send('msg.delete_my_message_draft', [user.id, msg_id], function(result, error) {
				//		alert(JSON.encode(result));
				//		me.notify('deleted', msg_id);
						me.panel.dispose();
					});
				//	cont.setStyles({display: 'none'});
				}
			}});
			cont.adopt(
				thread_title_label,
				thread_title,
				new Element('br'),
				msg_text_label,
				new Element('br'),
				msg_text,
				new Element('br'),
				add_msg_btn,
				save_draft_btn,
				delete_msg_btn
			);

			if( msg_id ) {
				RPC.send('msg.get_my_message_draft_data', [user.id, msg_id], function(result, error) {
				//	alert(JSON.encode(result));
					if(result) {
						msg_text.set('value', result.msg_text);
						thread_title.set('value', result.thread_title);
					}
				});
			} else {
				RPC.send('msg.create_my_message_draft_on_paper', [user.id, args.cont_id, args.paper_id, null], function(result, error) {
				//	alert(JSON.encode(result));
					if(result) {
						msg_id = result._id;
					}
//		//			render(result);
//				//	cont.setStyles({display: 'none'});
				});
			}

			function clear_form() {
				thread_title.set('value', '');
				msg_text.set('value', '');
			}
			var me = {
				panel: panel //,
			//	reload: reload,
			//	show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
			};
			Mixin.implement(me, Mixin.Observable);
			return me;
		};
	}());

	/*  */
	self.Coms.Comp.ObjectThreadsDraftsList = (function() {
		return function(args) {
			var user = window.user;
	//		alert(user);
			var panel = new Element('div', { class: '' });
		//	var new_thread_element = new Coms.Comp.AddThreadPanel( args );
		//	panel.grab(new_thread_element.panel);

			var topics_list = new Element('fieldset', { class: 'topics_drafts_list' });
			topics_list.grab(new Element('legend', {text: 'Topics drafts list'}));
			var cont = new Element('div');
			topics_list.grab(cont);
			panel.grab(topics_list);
			function addRow(v) {
		//		alert(JSON.encode(v));
				var new_panel = new Coms.Comp.MessageDraftPanel(args, v ? v._id : null);
				new_panel.attach('message_saved', function(arg) {
				//	alert(arg);
					me.notify('message_saved', arg);
				});
		//		new_panel.attach('deleted', function(arg) {
		//			alert(arg);
		//		});
				cont.grab(new_panel.panel);
			}
			function render(list) {
			//	alert(JSON.encode(list));
				cont.empty();
				if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
				RPC.send('msg.get_my_threads_drafts_on_paper', [user.id, args.cont_id, args.paper_id], function(result, error) {
		//			alert(JSON.encode(result));
					render(result);
				});
			}
			function reload() { loadData(); }
			function addNewDraft() {
			//	alert('add new');
				addRow();
			}
			var me = {
				panel: panel,
				reload: reload,
				addNewDraft: addNewDraft,
				show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
			};
			Mixin.implement(me, Mixin.Observable);
			return me;
		}
	}());

	self.Coms.Comp.ObjectThreadsList = (function() {
		return function(args) {
			var user = window.user;
	//		alert(user);
			var panel = new Element('div', { class: '' });
		//	var new_thread_element = new Coms.Comp.AddThreadPanel( args );
		//	panel.grab(new_thread_element.panel);

			var topics_list = new Element('fieldset', { class: 'topics_list' });
			topics_list.grab(new Element('legend', {text: 'Topics list'}));
			var cont = new Element('div');
			topics_list.grab(cont);
			panel.grab(topics_list);
			function addRow(v) {
				var div = new Element('div', { class: 'item' });
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
				cont.grab(div);
			}
			function render(list) {
				cont.empty();
				if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
				RPC.send('msg.get_my_threads_on_paper', [user.id, args.cont_id, args.paper_id], function(result, error) {
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


	/*
	 * Components for single thread
	 */

	/* Selected thread panel, container for messages and messages drafts */
	self.Coms.Comp.ObjectOneThread = (function() {
		return function(args) {
			var msg_id;
			var user = window.user;

			var panel = new Element('div', { styles: { } });
			var me = { panel: panel };

			var close_thread_btn = new Element('input', {type: 'button', class: 'close_thread_btn', value: '<< Leave topic'});
			//panel.grab(close_thread_btn);
			panel.grab( (new Element('div')).grab(close_thread_btn) );
			close_thread_btn.addEvents({
				click: function (e) {
					me.notify('close_thread');
					return false;
				}
			});

			var messagesDraftsList = new Coms.Comp.ThreadMessagesDraftsList( args );
		//	messagesList.reload();
			panel.grab(messagesDraftsList.panel);

			var messagesList = new Coms.Comp.ThreadMessagesList( args );
		//	messagesList.reload();
			panel.grab(messagesList.panel);

			function addRow(v) {
		//		var div = new Element('div', { class: 'item' });
		//		div.set('text', v['text']);
		//		cont.grab(div);
			}
			function render(list) {
		//		cont.empty();
				if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
				RPC.send('msg.get_my_messages_from_thread', [user.id, msg_id], function(result, error) {
					alert(JSON.encode(result));
					render(result);
				});
			}
			function reload() { loadData(); }
			function init(id) {
				msg_id = id
				//add_message_text.set('value', '');
	//			add_message_text.value = '';
			//	alert(msg_id);
	//			reload();
				messagesList.init(msg_id);
			}
			var me = {
				panel: panel,
				init: init,
				reload: reload,
				show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
			};
			Mixin.implement(me, Mixin.Observable);
			return me;
		};
	}());

	/* Messages drafts list for selected thread */
	self.Coms.Comp.ThreadMessagesDraftsList = (function() {
		return function(args) {
			var user = window.user;
	//		alert(user);
			var panel = new Element('div', { class: '' });
		//	var new_thread_element = new Coms.Comp.AddThreadPanel( args );
		//	panel.grab(new_thread_element.panel);

			var messages_list = new Element('fieldset', { class: 'messages_list' });
			messages_list.grab(new Element('legend', {text: 'Messages drafts list'}));
			var cont = new Element('div');
			messages_list.grab(cont);
			panel.grab(messages_list);

			function addRow(v) {
				var div = new Element('div', { class: 'item' });
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
				cont.grab(div);
			}
			function render(list) {
				cont.empty();
				if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
				RPC.send('msg.get_my_messages_from_thread', [user.id, msg_id], function(result, error) {
					alert(JSON.encode(result));
					render(result);
				});
			}
			function reload() { loadData(); }
			function init(id) {
				msg_id = id;
				reload();
			}
			var me = {
				panel: panel,
				reload: reload,
				init: init,
				show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
			};
			/*
			var topics_list = new Element('fieldset', { class: 'topics_drafts_list' });
			topics_list.grab(new Element('legend', {text: 'Topics drafts list'}));
			var cont = new Element('div');
			topics_list.grab(cont);
			panel.grab(topics_list);
			function addRow(v) {
		//		alert(JSON.encode(v));
				var new_panel = new Coms.Comp.MessageDraftPanel(args, v ? v._id : null);
				new_panel.attach('message_saved', function(arg) {
				//	alert(arg);
					me.notify('message_saved', arg);
				});
		//		new_panel.attach('deleted', function(arg) {
		//			alert(arg);
		//		});
				cont.grab(new_panel.panel);
			}
			function render(list) {
			//	alert(JSON.encode(list));
				cont.empty();
				if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
				RPC.send('msg.get_my_threads_drafts_on_paper', [user.id, args.cont_id, args.paper_id], function(result, error) {
		//			alert(JSON.encode(result));
					render(result);
				});
			}
			function reload() { loadData(); }
			function addNewDraft() {
			//	alert('add new');
				addRow();
			}
			var me = {
				panel: panel,
				reload: reload,
				addNewDraft: addNewDraft,
				show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
			};
			*/
			Mixin.implement(me, Mixin.Observable);
			return me;
		}
	}());

	/* Messages list for selected thread */
	self.Coms.Comp.ThreadMessagesList = (function() {
		return function(args) {
			var msg_id;
			var user = window.user;
	//		alert(user);
			var panel = new Element('div', { class: '' });
		//	var new_thread_element = new Coms.Comp.AddThreadPanel( args );
		//	panel.grab(new_thread_element.panel);

			var messages_list = new Element('fieldset', { class: 'messages_list' });
			messages_list.grab(new Element('legend', {text: 'Messages list'}));
			var cont = new Element('div');
			messages_list.grab(cont);
			panel.grab(messages_list);

			function addRow(v) {
				var div = new Element('div', { class: 'item' });
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
				cont.grab(div);
			}
			function render(list) {
				cont.empty();
				if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
				RPC.send('msg.get_my_messages_from_thread', [user.id, msg_id], function(result, error) {
					alert(JSON.encode(result));
					render(result);
				});
			}
			function reload() { loadData(); }
			function init(id) {
				msg_id = id;
				reload();
			}
			var me = {
				panel: panel,
				reload: reload,
				init: init,
				show: function (flag) {panel.setStyle('display', flag ? 'block' : 'none')}
			};
			Mixin.implement(me, Mixin.Observable);
			return me;
		}
	}());


	/*
	self.Coms.Comp.ObjectMessageItems = (function() {
		return function(args, _thread_id) {
			var panel = new Element('div', { styles: { } });
			var me = { panel: panel };

			var new_thread_draft_btn = new Element('input', {class: 'new_thread_draft_btn', type: 'button', value: 'New topic draft', events: {
				click: function() {
					threadsDraftsList.addNewDraft();
				}
			}});
			panel.grab(new_thread_draft_btn); var bottom_div =
				new Element('div', {class: 'bottom_div'});

			var threadsDraftsList = new Coms.Comp.ObjectThreadsDraftsList( args );
			threadsDraftsList.attach('message_saved', function(arg) {
				threadsList.reload();
			});
			threadsDraftsList.reload();
			panel.grab(threadsDraftsList.panel);

			var threadsList = new Coms.Comp.ObjectThreadsList( args );
			threadsList.attach('show_thread', function(thread_id) {
				oneThread.init(thread_id);
				threadsList.show(false);
				threadsDraftsList.show(false);
				oneThread.show(true);
			});
			threadsList.reload();
			panel.grab(threadsList.panel);

			var oneThread = new Coms.Comp.ObjectOneThread({});
			oneThread.show(false);
			oneThread.attach('close_thread', function(arg) {
				oneThread.show(false);
				threadsList.show(true);
				threadsDraftsList.show(true);
			});
			panel.grab(oneThread.panel);

			return me;
		};
	}());
	*/

});

