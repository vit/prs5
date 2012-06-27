
window.addEvent('domready',function() {

	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};

	self.Coms.Comp.ObjectThreadsList = (function() {
		var constr = function(args) {
			var panel = new Element('fieldset', { class: 'topics_list' });
			panel.grab(new Element('legend', {text: 'Topics list'}));
			var cont = new Element('div');
			panel.grab(cont);
			function addRow(v) {
				var div = new Element('div', { class: 'item' });
				var a = new Element('a', {
					href: '#',
					events: {
						click: function (e) {
							me.notify('show_thread', v['title']);
							return false;
						}
					}
				});
				a.set('text', v['title']);
				div.grab(a);
				cont.grab(div);
			}
			function render(list) {
				cont.empty();
				if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
				var result = [
					{title: 'post 001'},
					{title: 'post 002'},
					{title: 'post 003'},
					{title: 'post 004'}
				];
			//	alert('hgw gefjqwgef uy tfu');
		//		RPC.send('conf.review.get_paper_reviews_ext', [conf.id, paper_id], function(result, error) {
					render(result);
		//		});
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
		return constr;
	}());
	self.Coms.Comp.ObjectOneThread = (function() {
		var constr = function(args) {
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
		}
		return constr;
	}());

	self.Coms.Comp.ObjectMessages = (function() {
		var constr = function(_cont_id, _paper_id) {
			var panel = new Element('div', {
				styles: {
			//		width: '100px',
			//		height: '100px'
				}
			});
			var me = {
				panel: panel
		//		init: init
			};
		//	Mixin.implement(me, Mixin.Observable);
			//var top_div = new Element('div', {class: 'top_div'});
			//var bottom_div = new Element('div', {class: 'bottom_div'});
			var top_div = new Element('div', {class: 'top_div'});
		//	var new_thread_btn = new Element('input.new_thread_btn', {type: 'button', value: 'qqq', name: 'www'});
			var new_thread_btn = new Element('input', {type: 'button', class: 'new_thread_btn', value: 'New topic'});
			top_div.grab(new_thread_btn);
			var bottom_div = new Element('div', {class: 'bottom_div'});
			panel.grab(top_div);
			panel.grab(bottom_div);
		//	top_div.grab(new_thread_btn);
			var threadsList = new Coms.Comp.ObjectThreadsList({
				cont_id: _cont_id,
				paper_id: _paper_id //,
			//	controller: me
			});
			threadsList.attach('show_thread', function(arg) {
			//	alert('Error ');
			//	alert(arg);
				oneThread.init(arg);
				threadsList.show(false);
				oneThread.show(true);
			});
			threadsList.reload();
			bottom_div.grab(threadsList.panel);

			var oneThread = new Coms.Comp.ObjectOneThread({});
			oneThread.show(false);
			oneThread.attach('close_thread', function(arg) {
			//	alert('Error ');
			//	alert(arg);
				oneThread.show(false);
				threadsList.show(true);
			});
			bottom_div.grab(oneThread.panel);

			function render(list) {
	//			cont.empty();
	//			if(list) list.each(function(v){ addRow(v); });
			}
			function loadData(){
				var result = [];
			//	alert('hgw gefjqwgef uy tfu');
		//		RPC.send('conf.review.get_paper_reviews_ext', [conf.id, paper_id], function(result, error) {
					render(result);
		//		});
			}
			loadData();
			return me;
		}
		return constr;
	}());


});

