
window.addEvent('domready',function() {


	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};

	/*
	self.Coms.Comp.AddThreadPanel = (function() {
		return function(args) {
			var user = window.user;
		//	var user = window.user;
			var panel = new Element('div', { class: '' });
			var new_thread_btn = new Element('input', {type: 'button', class: 'new_thread_btn', value: 'New topic', events: {
				click: function(e){
					cont.setStyles({display: 'block'});
				}
			}});
			panel.grab(new_thread_btn);
			var cont = new Element('div', {styles: {display: 'none'}});
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
				//	alert( msg_text.get('value') );
					RPC.send('msg.add_my_message_on_paper', [user.id, args.cont_id, args.paper_id, msg_text.get('value'), null, thread_title.get('value')], function(result, error) {
					//	alert(JSON.encode(result));
			//			render(result);
						clear_form();
						cont.setStyles({display: 'none'});
					});
				}
			}});
			var cancel_msg_btn = new Element('input', {type: 'button', class: '', value: 'Cancel', events: {
				click: function(e){
					clear_form();
					cont.setStyles({display: 'none'});
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
				cancel_msg_btn
			);
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
	*/

	/* MessageDraftPanel -- Create, save, edit and delete message draft, send message */
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
							me.notify('show_thread', v['thread_title']);
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
			//		alert(JSON.encode(result));
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
	self.Coms.Comp.ObjectOneThread = (function() {
		return function(args) {
			var msg_id;
			var panel = new Element('fieldset', { class: 'topic_messages' });
			panel.grab(new Element('legend', {text: 'Topic messages'}));

			var close_thread_btn = new Element('input', {type: 'button', class: 'close_thread_btn', value: '<< Leave topic'});
			//panel.grab(close_thread_btn);
			panel.grab( (new Element('div')).grab(close_thread_btn) );
			close_thread_btn.addEvents({
				click: function (e) {
					me.notify('close_thread');
					return false;
				}
			});

			var add_message_btn = new Element('input', {type: 'button', class: 'add_message_btn', value: 'Add message'});
			var add_message_text = new Element('textarea', {class: 'add_message_text'});
			//panel.grab(close_thread_btn);
			panel.grab( (new Element('div')).grab(add_message_text) );
			panel.grab( (new Element('div')).grab(add_message_btn) );
			add_message_btn.addEvents({
				click: function (e) {
					alert('Error');
				//	me.notify('close_thread');
					return false;
				}
			});

			var cont = new Element('div');
			panel.grab(cont);
			function addRow(v) {
				var div = new Element('div', { class: 'item' });
			//	var a = new Element('a', {
			//		href: '#',
				//	events: {
				//		click: function (e) {
				//			me.notify('select_thread');
				//			return false;
				//		}
				//	}
			//	});
			//	a.set('text', v['title']);
			//	div.grab(a);
				div.set('text', v['text']);
				cont.grab(div);
			}
			function render(list) {
				cont.empty();
				if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
				var result = [
					{text: 'message 001'},
					{text: 'message 002'},
					{text: 'message 003'},
					{text: 'message 004'},
					{text: 'message 005'}
				];
			//	alert('hgw gefjqwgef uy tfu');
		//		RPC.send('conf.review.get_paper_reviews_ext', [conf.id, paper_id], function(result, error) {
					render(result);
		//		});
			}
			function reload() { loadData(); }
			function init(id) {
				msg_id = id
				//add_message_text.set('value', '');
				add_message_text.value = '';
			//	alert(msg_id);
				reload();
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

	self.Coms.Comp.ObjectMessages = (function() {
		return function(_cont_id, _paper_id) {
			var panel = new Element('div', { styles: { } });
			var me = { panel: panel };
			var args = {
				cont_id: _cont_id,
				paper_id: _paper_id //,
			}

			var top_div = new Element('div', {class: 'top_div'});
			var new_thread_draft_btn = new Element('input', {class: 'new_thread_draft_btn', type: 'button', value: 'New topic draft', events: {
				click: function() {
					threadsDraftsList.addNewDraft();
				}
			}});
			top_div.grab(new_thread_draft_btn); var bottom_div =
				new Element('div', {class: 'bottom_div'});
			panel.grab(top_div);
			panel.grab(bottom_div);

			var threadsDraftsList = new Coms.Comp.ObjectThreadsDraftsList( args );
			threadsDraftsList.attach('message_saved', function(arg) {
		//		alert(arg);
				threadsList.reload();
			});
			threadsDraftsList.reload();
			bottom_div.grab(threadsDraftsList.panel);

			var threadsList = new Coms.Comp.ObjectThreadsList( args );
			threadsList.attach('show_thread', function(arg) {
				oneThread.init(arg);
				threadsList.show(false);
				threadsDraftsList.show(false);
				oneThread.show(true);
			});
			threadsList.reload();
			bottom_div.grab(threadsList.panel);

			var oneThread = new Coms.Comp.ObjectOneThread({});
			oneThread.show(false);
			oneThread.attach('close_thread', function(arg) {
				oneThread.show(false);
				threadsList.show(true);
				threadsDraftsList.show(true);
			});
			bottom_div.grab(oneThread.panel);

			return me;
		};
	}());


});

