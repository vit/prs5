window.addEvent('domready',function() {
	var user_lang_code = Cookie.read('ecms_lang');
	var lang_list = ['en', 'ru'];

	(function() {
		var panel = $('templatescomp');
		var comp = new Coms.Comp.Post.EditTemplates();
		//	comp.init(conf.id, paper_id);
		panel.adopt(comp.panel);

	}());

});


