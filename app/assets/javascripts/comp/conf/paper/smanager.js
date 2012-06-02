window.addEvent('domready',function() {
	var conf = self.conf;
	var user = self.user;

	function PapersList(args) {
		var panel = args.panel;
		var container = panel;
		var dict = args.dict;

		var me = {
			init: function(){
			},
			enter: function(){
				reload();
				panel.setStyles({ display: 'block' });
			},
			leave: function(){
				panel.setStyles({ display: 'none' });
			}
		};
		OM.implement(me, OM.Events);
		OM.implement(me, OM.Messages);

		function renderList(data) {
			container.empty();
			var table = (new Element('table', {border: 1, width: '100%'})).inject(container);
			var tbody = (new Element('tbody')).inject(table);
			var tr = new Element('tr');
			tr.grab(new Element('th', {html: '&nbsp;'}));
			tbody.grab(tr);
			conf.lang_list().each(function(lang){
				tr.grab(new Element('th', {text: dict('lang_'+lang)}));
			});
			if(data) data.each( function(p) {
				var tr = (new Element('tr').inject(tbody));
				tr.grab(new Element('td', {align: 'center', styles: {'vertical-align': 'top'}}).adopt(
					new Element('a', {href: '#', text: 'N='+p._meta.paper_cnt, events: {click: function(){
						me.fireEvent('open_paper_page', p._id);
						return false;
					}}}),
					new Element('br')
				));
				function limit(s, lim){
					s = s ? s.trim() : '';
					return s.length>lim ? (s.substr(0,lim)+' ...') : s;
				}
				conf.lang_list().each(function(lang){
					var td = (new Element('td', {styles: {'vertical-align': 'top'}})).inject(tr);
					td.adopt(
						new Element('span', {text: limit(p.text.title[lang], 120)}) //,
					);
				});
			});
		}
		function reload(){
			RPC.send('conf.paper.get_papers_managed_list', [user.id, conf.id], function(result, error) {
				//alert( JSON.encode(result) );
				if(!result) result = [];
				renderList(result);
			});
		}
		return me;
	};

	function CurrentPaper(args) {
		var panel = args.panel;
		var container = panel;
		var dict = args.dict;

		function createTextElement(text){ return new Element('span', {text: text}); }
		function createSimpleTableRow(){
			var tr = (new Element('tr'));
			for(var i=0; i<arguments.length; i++)
				(new Element('td', {})).inject(tr).grab(arguments[i]);
			return tr;
		}

		function renderPanel(paper_id){
			var DataCenter = (function(){
				var reviewers = null;
				var paper_info = null;
				var me = {
				};
				OM.implement(me, OM.Events);
				OM.implement(me, {
					want_paper_info: function(callback){
						if(paper_info)
							callback(paper_info);
						else
							RPC.send('conf.paper.get_paper_info', [conf.id, paper_id], function(result, error) {
							//	alert( JSON.encode(result) );
								paper_info = result;
								callback(paper_info);
							});
					}
				});
				return me;
			}());
			function createCommonText(){
				var div = new Element('div', {});
				DataCenter.want_paper_info(function(result){
					if(result) {
						var p = result;
						div.adopt(
							new Element('b', {text: p._meta.paper_cnt}),
							new Element('span', {text: ' : '}),
							new Element('span', {text: conf.lang_list().map(function(lang){
								return p.text.title[lang];
							}).join(' | ')})
						);
					}
				});
				return div;
			}
			function createButtons(){
				return (new Element('div', {styles:{ padding: '8pt 0pt' }})).adopt(
					new Element('input', {type: 'button', value: dict('back_to_list'), events: {
						click: function(){
							//args.controller.callSlot('view_list');		
							me.fireEvent('view_list');
						}
					}})
				);
			}
			function createTabsPanel(){
				function createTabPaperPanel(){
					var panel = (new Element('div', {}));
					var t = new Element('tbody').inject( (new Element('table', {border: 1})).inject(panel) );
					var tr = new Element('tr', {}).inject(t);
					tr.grab(new Element('th', {text: 'N'}));
					conf.lang_list().each(function(lang){
						tr.grab(new Element('th', {text: dict('lang_'+lang)}));
					});
					DataCenter.want_paper_info(function(result){
						if(result) {
							var p = result;
							var tr = new Element('tr', {}).inject(t);
							tr.grab(new Element('th', {text: p._meta.paper_cnt}));
							conf.lang_list().each(function(lang){
								var td = (new Element('td', {styles: {'vertical-align': 'top'}})).inject(tr);
								td.adopt(
									new Element('b', {text: p.text.title[lang]}),
									new Element('br'),
									new Element('span', {text: p.text['abstract'][lang]})
								);
								if( p.keywords && p.keywords.length > 0 ) {
									td.adopt(
										new Element('br'),
										new Element('br'),
										new Element('i', {text: p.keywords.map(function(k){
											return k[lang];
										}).join(', ')})
									);
								}
								if( p.authors && p.authors.length > 0 ) {
									td.adopt( new Element('br'));
									p.authors.each(function(a){
										td.adopt(
											new Element('br'),
											new Element('i', {text:
												a['fname'][lang] + ' ' +
												a['mname'][lang] + ' ' +
												a['lname'][lang] + ', ' +
												a['affiliation'][lang] + ', ' +
												a['city'][lang]// + ', ' +
											})
										);
									});
								}
								if(p.files) {
									p.files.filter(function(f){
										return f && f._meta && f._meta.lang==lang;
									}).each(function(f){
										td.adopt( new Element('br'));
										td.adopt(
											new Element('br'),
											(new Element('span')).adopt(
												new Element('span', {text:
													dict('file_type') + ' ' + f.content_type + ', ' +
													dict('file_size') + ' ' + f.length + ' ' + dict('bytes')
												}),
												new Element('br'),
												new Element('span', {text:
													dict('timestamp') + ' ' + f._meta.ctime
												}),
												new Element('br'),
												new Element('a', {
													href: '../download/abstract/'+f['uniquefilename']+'?id='+f['_meta']['parent']+'&lang='+f['_meta']['lang'],
													text: dict('download_file')
												})
											)
										);
									});
								}
							});
						}
					});

					return panel;
				}
				function createTabMyReviewPanel(){
					function saveData(data) {
					//	alert(JSON.encode(data));
						RPC.send('conf.review.save_my_review2_data', [user.id, conf.id, paper_id, data], function(result, error) {
							alert( dict('review_saved') );
						//	alert(JSON.encode(result));
						});
					}
					function createEmptyRow(){
						return createSimpleTableRow(new Element('br', {}), new Element('br', {}));
					}

					var panel = (new Element('div', {}));
					var di = FormDataInputs( panel, {} );
					var t = new Element('tbody').inject( (new Element('table', {border: 0})).inject(panel) );

				//	var score = di.createElement('score', null, 'select', {});
				//	score.grab(new Element('option', {value: '', text: dict('score_uncertain')}));
				//	createSimpleTableRow(createTextElement(dict('score')), score).inject(t);

				//	var decision = di.createElement('decision', null, 'select', {});
				//	decision.grab(new Element('option', {value: '', text: dict('decision_uncertain')}));
				//	createSimpleTableRow(createTextElement(dict('decision')), decision).inject(t);

					conf.lang_list().each(function(lang){
						createEmptyRow().inject(t);
						createSimpleTableRow(createTextElement(dict('language')), createTextElement(dict('lang_'+lang))).inject(t);
					//	['ipccomments', 'authcomments'].each(function(name){
						['authcomments'].each(function(name){
							createSimpleTableRow(createTextElement(dict(name)), di.createElement(name, lang, 'textarea', {cols: 60, rows: 3})).inject(t);
						});
					});

					createEmptyRow().inject(t);
					createSimpleTableRow( new Element('input', {type: 'button', value: dict('review_submit'), events: {
						click: function() {
							var data = di.get();
							saveData( data );
						}
					}}), createTextElement('')).inject(t);

				//	RPC.send('conf.review.get_reviewer_scores', [conf.id], function(result, error) {
				//		if (result) result.each(function(sc_id){
				//			score.grab(new Element('option', {value: sc_id, text: dict('score_'+sc_id)}));
				//		});
					//	RPC.send('conf.review.get_reviewer_decisions', [conf.id], function(result, error) {
					//		if (result) result.each(function(dec_id){
					//			decision.grab(new Element('option', {value: dec_id, text: dict('decision_'+dec_id)}));
					//		});
							RPC.send('conf.review.get_my_review2_data', [user.id, conf.id, paper_id], function(result, error) {
							//	alert( JSON.encode(result) );
								di.set(result);
							});
					//	});
				//	});

					return panel;
				}
				var list = [{
					title: dict('tab_paper'),
					panelFun: createTabPaperPanel
				}, {
					title: dict('tab_review'),
					panelFun: createTabMyReviewPanel
				}];
			//	alert( JSON.encode(conf.my_rights) );
				return TabsPure({items: list});
			}

			container.empty();
			var fs = (new Element('fieldset')).inject(container);
			fs.adopt(
				createCommonText(),
				createButtons(),
				createTabsPanel()
			);
		}
		var me = {
			init: function(){
			},
			enter: function(paper_id){
				renderPanel(paper_id);
				panel.setStyles({ display: 'block' });
			},
			leave: function(){
				panel.setStyles({ display: 'none' });
			}
		};
		OM.implement(me, OM.Events);
		OM.implement(me, OM.Messages);
		return me;
	};

	function PapersApp(comp) {
		var cont = comp.getChildren('[name="container"]')[0];
		var dict = Dict( comp.getChildren('[name="dict"]')[0] );
		var list_div = new Element('div', { styles: {display: 'none'} });
		var paper_page_div = new Element('div', { styles: {display: 'none'} });
		var me = {}
		cont.adopt(
			list_div,
			paper_page_div
		);
		var list = PapersList({
			panel: list_div,
			dict: dict
		});
		var paper_page = CurrentPaper({
			panel: paper_page_div,
			dict: dict
		});

		list.addEvent('open_paper_page', function(paper_id){
			list.send('leave');	
			paper_page.send('enter', paper_id);
		});

		paper_page.addEvent('view_list', function(){
			paper_page.send('leave');
			list.send('enter');	
		});

		list.send('enter');	

		return me;
	}

	conf.addEvent('init_ok', function(result, error) {
		PapersApp($('papercomp'));
	});

});

