window.addEvent('domready',function() {
	var conf = self.conf;
	var user = self.user;
	//	alert(user);

	function createTextElement(text){ return new Element('span', {text: text}); }
	function createSimpleTableRow(){
		var tr = (new Element('tr'));
		for(var i=0; i<arguments.length; i++)
			(new Element('td', {})).inject(tr).grab(arguments[i]);
		return tr;
	}

	function PapersList(args) {
		var panel = args.panel;
		var container = panel;
		var dict = args.dict;

		var selectInputs = [];

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


		function createTabGroupFinalDecisionPanel(){
			function saveData(data, ids) {
			//	alert(JSON.encode(data));
				RPC.send('conf.paper.set_paper_decision', [conf.id, ids, data], function(result, error) {
					alert( dict('final_decision_saved') );
				});
			}
			function createEmptyRow(){
				return createSimpleTableRow(new Element('br', {}), new Element('br', {}));
			}

			var set_final_block = (new Element('fieldset', {})).inject(container);
			(new Element('legend', {text: dict('group_set_final_title')})).inject(set_final_block);

		//	var panel = (new Element('div', {}));
			var panel = (new Element('div', {})).inject(set_final_block);
			var di = FormDataInputs( panel, {} );
			var t = new Element('tbody').inject( (new Element('table', {border: 0})).inject(panel) );

			var decision = di.createElement('decision', null, 'select', {});
			decision.grab(new Element('option', {value: '', text: dict('decision_uncertain')}));
			createSimpleTableRow(createTextElement(dict('final_decision')), decision).inject(t);

			var section = di.createElement('section', null, 'select', {});
			section.grab(new Element('option', {value: '', text: dict('section_uncertain')}));
			createSimpleTableRow(createTextElement(dict('final_section')), section).inject(t);

		//	createEmptyRow().inject(t);
			createSimpleTableRow( new Element('input', {type: 'button', value: dict('final_decision_submit'), events: {
				click: function() {
					var data = di.get();
					var ids = selectInputs.ffold([], function(acc, elm) {
						if( elm.inp.getProperty('checked') ) {
							acc.push( elm.id );
						}
						return acc;
					});
					if( ids.length > 0 )
						saveData( data, ids );
					else
						alert( dict('nothing_is_selected') );
				}
			}}), createTextElement('')).inject(t);

				RPC.send('conf.get_reviewer_decisions', [conf.id], function(result, error) {
					if (result) result.each(function(dec_id){
						decision.grab(new Element('option', {value: dec_id, text: dict('decision_'+dec_id)}));
					});
					RPC.send('conf.get_conf_sections', [conf.id], function(result, error) {
						if (result) result.each(function(sec){
							section.grab(new Element('option', {value: sec.id,
								text: conf.lang_list().map(function(k){return sec.name[k]}).join(' | ')
							}));
						});
				//		RPC.send('conf.paper.get_paper_decision', [conf.id, paper_id], function(result, error) {
				//		//	alert( JSON.encode(result) );
				//			di.set(result);
				//		});
					});
				});
		//	return panel;
			return set_final_block;
		}




		function renderList(data) {
			container.empty();
			selectInputs = [];

			var can_set_final = conf.my_rights['set_final_decision'];
			var table = (new Element('table', {border: 1, width: '100%'})).inject(container);
			var tbody = (new Element('tbody')).inject(table);
			var tr = new Element('tr');
			if(can_set_final) {
				var th = new Element('th', {html: ''});
				var a1 = new Element('a', {href: 'javascript:null', text: '[+]', events: {click: function() {
					selectInputs.each(function(elm, k) {
						elm.inp.setProperty('checked', true);
					});
				}}});
				var a2 = new Element('a', {href: 'javascript:null', text: '[-]', events: {click: function() {
					selectInputs.each(function(elm, k) {
						elm.inp.setProperty('checked', false);
					});
				}}});
				var a3 = new Element('a', {href: 'javascript:null', text: '[!]', events: {click: function() {
					selectInputs.each(function(elm, k) {
						elm.inp.setProperty('checked', !elm.inp.getProperty('checked'));
					});
				}}});
				th.adopt(
					a1,
					new Element('span', {text: ' '}),
					a2,
					new Element('span', {text: ' '}),
					a3
				);
				tr.grab(th);
			}
			tr.grab(new Element('th', {html: '&nbsp;'}));
			tbody.grab(tr);
			conf.lang_list().each(function(lang){
				tr.grab(new Element('th', {text: dict('lang_'+lang)}));
			});
			if(data) {
				data.each( function(p) {
				//			console.log(p);
					var tr = (new Element('tr').inject(tbody));
					if(can_set_final) {
						var td = new Element('td', {align: 'center'});
						var inp = new Element('input', {type: 'checkbox'});
						selectInputs.push({inp: inp, id: p._id});
					//	inp.setEvents({click: });
						td.grab( inp );
						tr.grab( td );
					}
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
				if(can_set_final) {
					createTabGroupFinalDecisionPanel().inject(container);
				}
			}
		}
		function reload(){
			//RPC.send('conf.paper.get_my_drafts_list', [user_id, cont_id], function(result, error) {
			//RPC.send('conf.paper.get_my_papers_list', [user.id, conf.id], function(result, error) {
			//		alert( JSON.encode(conf.my_rights) );
			if(conf.my_rights['appoint_reviewers'] || conf.my_rights['review_everything'] || conf.my_rights['set_final_decision']){
				RPC.send('conf.paper.get_all_papers_list', [conf.id], function(result, error) {
					//alert( JSON.encode(result) );
					if(!result) result = [];
					renderList(result);
				});
			} else {
				RPC.send('conf.paper.get_papers_for_reviewing_list', [user.id, conf.id], function(result, error) {
					//alert( JSON.encode(result) );
					if(!result) result = [];
					renderList(result);
				});
			}
		}

		return me;
	};

	function CurrentPaper(args) {
		var panel = args.panel;
		var container = panel;
		var dict = args.dict;
/*
		function createTextElement(text){ return new Element('span', {text: text}); }
		function createSimpleTableRow(){
			var tr = (new Element('tr'));
			for(var i=0; i<arguments.length; i++)
				(new Element('td', {})).inject(tr).grab(arguments[i]);
			return tr;
		}
*/

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
					},
					want_reviewers: function(callback){
						if(reviewers)
							callback(reviewers);
						else
							RPC.send('conf.paper.get_paper_reviewers', [conf.id, paper_id], function(result, error) {
							//	alert( JSON.encode(result) );
								reviewers = result;
								callback(reviewers);
							});
					},
					add_reviewer_pin: function(pin, callback){
						if(pin) RPC.send('conf.paper.add_to_paper_reviewers', [conf.id, paper_id, pin], function(result, error) {
							if(callback) callback();
							RPC.send('conf.paper.get_paper_reviewers', [conf.id, paper_id], function(result, error) {
							//	alert( JSON.encode(result) );
								reviewers = result;
								me.fireEvent('reviewers_updated');
							});
						});
					},
					remove_reviewer_pin: function(pin, callback){
						if(pin) RPC.send('conf.paper.remove_from_paper_reviewers', [conf.id, paper_id, pin], function(result, error) {
							if(callback) callback();
							RPC.send('conf.paper.get_paper_reviewers', [conf.id, paper_id], function(result, error) {
							//	alert( JSON.encode(result) );
								reviewers = result;
								me.fireEvent('reviewers_updated');
							});
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
					//tr.grab(new Element('th', {html: '&nbsp;'}));
					tr.grab(new Element('th', {text: 'N'}));
					conf.lang_list().each(function(lang){
						tr.grab(new Element('th', {text: dict('lang_'+lang)}));
					});
					DataCenter.want_paper_info(function(result){
				//	RPC.send('conf.paper.get_paper_info', [conf.id, paper_id], function(result, error) {
					//	alert(JSON.encode(result));
						if(result) {
							var p = result;
							var tr = new Element('tr', {}).inject(t);
							tr.grab(new Element('th', {text: p._meta.paper_cnt}));
						//	conf.lang_list().each(function(lang){
						//		tr.grab(new Element('th', {text: dict('lang_'+lang)}));
						//	});
						conf.lang_list().each(function(lang){
							var td = (new Element('td', {styles: {'vertical-align': 'top'}})).inject(tr);
							td.adopt(
								new Element('b', {text: p.text.title[lang]}),
								new Element('br'),
								new Element('span', {text: p.text['abstract'][lang]})
							);
						//	/*
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
										//	common.country_helper.getNameByCode( a['country'] )
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
												//href: 'getfile?id='+p._id+'&lang='+lang, target: '_blank',
												//href: 'getfile/'+f.filename+'?id='+p._id+'&lang='+lang, target: '_blank',
												//href: '../download/abstract/'+f['uniquefilename']+'?id='+f['_meta']['parent']+'&lang='+f['_meta']['lang'],
										//		href: '../download/abstract/'+f['uniquefilename']+'?id='+f['_meta']['parent']+'&lang='+f['_meta']['lang']+'&type='+f.class_code,
												href: 'download/'+f['uniquefilename']+'?id='+f['_meta']['parent']+'&lang='+f['_meta']['lang']+'&type='+f.class_code,
											//	'getfile/'+f.filename+'?id='+p._id+'&lang='+lang, target: '_blank',
												text: dict('download_file')
											})
										)
									);
								});
							}
						//	*/
						});
						}
					});

					return panel;
				}
				function createTabMyReviewPanel(){
					function saveData(data) {
					//	alert(JSON.encode(data));
						RPC.send('conf.review.save_my_review_data', [user.id, conf.id, paper_id, data], function(result, error) {
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

					var score = di.createElement('score', null, 'select', {});
					score.grab(new Element('option', {value: '', text: dict('score_uncertain')}));
					createSimpleTableRow(createTextElement(dict('score')), score).inject(t);

					var decision = di.createElement('decision', null, 'select', {});
					decision.grab(new Element('option', {value: '', text: dict('decision_uncertain')}));
					createSimpleTableRow(createTextElement(dict('decision')), decision).inject(t);

					var section = di.createElement('section', null, 'select', {});
					section.grab(new Element('option', {value: '', text: dict('section_uncertain')}));
					createSimpleTableRow(createTextElement(dict('section')), section).inject(t);

					conf.lang_list().each(function(lang){
						createEmptyRow().inject(t);
						createSimpleTableRow(createTextElement(dict('language')), createTextElement(dict('lang_'+lang))).inject(t);
						['ipccomments', 'authcomments'].each(function(name){
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

					RPC.send('conf.review.get_reviewer_scores', [conf.id], function(result, error) {
						if (result) result.each(function(sc_id){
							score.grab(new Element('option', {value: sc_id, text: dict('score_'+sc_id)}));
						});
					//	RPC.send('conf.review.get_reviewer_decisions', [conf.id], function(result, error) {
						RPC.send('conf.get_reviewer_decisions', [conf.id], function(result, error) {
							if (result) result.each(function(dec_id){
								decision.grab(new Element('option', {value: dec_id, text: dict('decision_'+dec_id)}));
							});



							RPC.send('conf.get_conf_sections', [conf.id], function(result, error) {
								if (result) result.each(function(sec){
									section.grab(new Element('option', {value: sec.id,
										text: conf.lang_list().map(function(k){return sec.name[k]}).join(' | ')
									}));
								});
					//			RPC.send('conf.paper.get_paper_decision', [conf.id, paper_id], function(result, error) {
					//			//	alert( JSON.encode(result) );
					//				di.set(result);
					//			});
								RPC.send('conf.review.get_my_review_data', [user.id, conf.id, paper_id], function(result, error) {
								//	alert( JSON.encode(result) );
									di.set(result);
								});
							});


//							RPC.send('conf.review.get_my_review_data', [user.id, conf.id, paper_id], function(result, error) {
//							//	alert( JSON.encode(result) );
//								di.set(result);
//							});
						});
					});

					return panel;
				}
				function createTabReviewersPanel(){
					var panel = (new Element('div', {}));
					var add_div = (function(){
						var div = new Element('div', {});
						var inp = new Element('input', {type: 'text'}).inject(div);
						var btn = new Element('input', {type: 'button', value: dict('add_pin'), events: {
							click: function(){
								var pin = inp.getProperty('value').toInt();
								if(pin) DataCenter.add_reviewer_pin(pin, function() {
									inp.setProperty('value', '');
								});
								//alert(val);
							}
						}}).inject(div);
						return div;
					}()).inject(panel);
					var list_div = (function(){
						var div = new Element('div', {});
						var cont = new Element('div', {});
						var fset = new Element('fieldset', {}).inject(div).adopt(
							new Element('legend', {text: dict('reviewers_list')}),
							cont
						);
						DataCenter.addEvent('reviewers_updated', function(){
							render();
						});
						function render(){
							cont.empty();
						//	var t = new Element('tbody').inject( (new Element('table', {border: 0})).inject(cont) );
							DataCenter.want_reviewers(function(result){
							//	alert(JSON.encode(result));
								function addRow(data){
									var pin = data;
									var li = (new Element('li')).inject(cont);
									li.adopt(
										new Element('a', {text: '[X]', href: '#', 'events': {'click': function() {
											DataCenter.remove_reviewer_pin(pin);
											return false;
										}}}),
										new Element('span', {text: ' | '}),
										new Element('span', {text: pin}),
										new Element('span', {text: ' | '}),
										new Element('span')
									);

								}
							//	var t = new Element('tbody').inject( (new Element('table', {border: 0})).inject(cont) );
								if(result) result.each(function(v){ addRow(v); });
							});
						}
						render();
						return div;
					}()).inject(panel);
					return panel;
				}
				function createTabFinalDecisionPanel(){
					function saveData(data) {
					//	alert(JSON.encode(data));
						RPC.send('conf.paper.set_paper_decision', [conf.id, paper_id, data], function(result, error) {
							alert( dict('final_decision_saved') );
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

					var decision = di.createElement('decision', null, 'select', {});
					decision.grab(new Element('option', {value: '', text: dict('decision_uncertain')}));
					createSimpleTableRow(createTextElement(dict('final_decision')), decision).inject(t);

					var section = di.createElement('section', null, 'select', {});
					section.grab(new Element('option', {value: '', text: dict('section_uncertain')}));
					createSimpleTableRow(createTextElement(dict('final_section')), section).inject(t);

					createEmptyRow().inject(t);
					createSimpleTableRow( new Element('input', {type: 'button', value: dict('final_decision_submit'), events: {
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
						RPC.send('conf.get_reviewer_decisions', [conf.id], function(result, error) {
							if (result) result.each(function(dec_id){
								decision.grab(new Element('option', {value: dec_id, text: dict('decision_'+dec_id)}));
							});
							RPC.send('conf.get_conf_sections', [conf.id], function(result, error) {
								if (result) result.each(function(sec){
									section.grab(new Element('option', {value: sec.id,
										text: conf.lang_list().map(function(k){return sec.name[k]}).join(' | ')
									}));
								});
								RPC.send('conf.paper.get_paper_decision', [conf.id, paper_id], function(result, error) {
								//	alert( JSON.encode(result) );
									di.set(result);
								});
							});
						});
				//	});
					return panel;
				}
				function createTabReviewsPanel(){
					var panel = (new Element('div', {}));
					var div = new Element('div', {});
					//var cont = new Element('div', {});
					var cont = div;
				//	var fset = new Element('fieldset', {}).inject(div).adopt(
				//		new Element('legend', {text: dict('reviews_list')}),
				//		cont
				//	);
					div.inject(panel);
					function addRow(data){
						var pin = data;
						var li = (new Element('li', {styles: {'margin': '0.8em 0 0.0em 1em'}})).inject(cont);
						li.adopt(
								new Element('a', {text: '[X]', href: '#', 'events': {'click': function() {
									if( confirm(dict('delete_review_are_you_sure')) ) {
										RPC.send('conf.review.delete_review', [conf.id, paper_id, data._meta.owner], function(result, error) {
											loadData();
										});
									}
									//alert(data._meta._id);
									return false;
								}}}),
								new Element('span', {text: ' '}),
								new Element('span', {text: conf.lang_list().map(function(lang){
									return data.reviewer.fname[lang] +' '+ data.reviewer.mname[lang] +' '+ data.reviewer.lname[lang];
								}).join(' | ') + ' ('+data._meta.owner+') '}),
								new Element('br'),
								new Element('b').grab(
									new Element('span', {text: dict('score')+':'})
								),
								new Element('span', {text: ' '+ dict(data.data.score ? 'score_'+data.data.score : 'score_uncertain')}),
								new Element('br'),
								new Element('b').grab(
									new Element('span', {text: dict('decision')+':'})
								),
								new Element('span', {text: ' '+ dict(data.data.decision ? 'decision_'+data.data.decision : 'decision_uncertain')}),
							//	new Element('br'),
							//	new Element('span', {text: JSON.encode(data)}),
								new Element('span')
							);

					}
					function render(list) {
						cont.empty();
						if(list) list.each(function(v){ addRow(v); });
					}
					function loadData(){
						RPC.send('conf.review.get_paper_reviews_ext', [conf.id, paper_id], function(result, error) {
							render(result);
						});
					}
					loadData();
					return panel;
				}

				function createTabMessagesPanel(){
					var panel = (new Element('div', {}));
					var div = new Element('div', {});
					//var cont = new Element('div', {});
					var cont = div;
				//	var fset = new Element('fieldset', {}).inject(div).adopt(
				//		new Element('legend', {text: dict('reviews_list')}),
				//		cont
				//	);
					div.inject(panel);
				//	var comp = new Coms.Comp.ObjectMessages(conf.id, paper_id);
					var comp = new Coms.Comp.ObjectMessageThreads(conf.id, paper_id);
				//	comp.init(conf.id, paper_id);
					var panel = comp.panel;
			//		alert(comp.test);
					return panel;
				}

				var list = [{
					title: dict('tab_paper'),
					panelFun: createTabPaperPanel
				}, {
					title: dict('tab_review'),
					panelFun: createTabMyReviewPanel
				}];
				if(conf.my_rights['appoint_reviewers']){
					list.push({
						title: dict('tab_reviewers'),
						panelFun: createTabReviewersPanel
					});
				}
				if(conf.my_rights['set_final_decision']){
					list.push({
						title: dict('tab_finaldecision'),
						panelFun: createTabFinalDecisionPanel
					});
				}
				if(conf.my_rights['delete_reviews']){
					list.push({
						title: dict('tab_reviews'),
						panelFun: createTabReviewsPanel
					});
				}
//			//	if(conf.my_rights['delete_reviews']){
//					list.push({
//						title: dict('tab_messages'),
//						panelFun: createTabMessagesPanel
//					});
//			//	}
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
		//cont.setStyles({ display: 'block' });
		var list_div = new Element('div', { styles: {display: 'none'} });
		var paper_page_div = new Element('div', { styles: {display: 'none'} });
	//	var view_paper_div = new Element('div', { styles: {display: 'none'} });
	//	var reviewers_div = new Element('div', { styles: {display: 'none'} });
		var me = {}
		cont.adopt(
			list_div,
		//	view_paper_div,
		//	reviewers_div
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

