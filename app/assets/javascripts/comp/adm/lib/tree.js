window.addEvent('domready',function() {
	var user_lang_code = Cookie.read('ecms_lang');
	var lang_list = ['en', 'ru'];

	(function() {
		var panel = $('treecomp');
		var comp = new Coms.Comp.Lib.EditTree();
		//	comp.init(conf.id, paper_id);
		panel.adopt(comp.panel);

	}());

});


