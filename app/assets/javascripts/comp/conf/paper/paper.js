window.addEvent('domready',function() {
//	var cont_id = $('cont_id').get('value');
//	var conf_lang = $('conf_lang').get('value');
	var cont_id = self.conf.id;
	var conf_lang = self.conf.lang;
	var user_id = $('user_id').get('value');
	var user_lang_code = Cookie.read('ecms_lang');
//	var lang_list = conf_lang=='en' ? ['en'] : conf_lang=='ru' ? ['ru'] : ['en', 'ru'];
	var lang_list = self.conf.lang_list();
	//var conf_permissions = {};
	var conf_user_rights = {};

	function CountryHelper(args) {
		var panel = args.panel;
		//var sample = panel.getElement('[name="country_sample"]');
		var sample = panel.getElement('[name="country"]');
		return {
			init: function(){
			},
			cloneSample: function(){
				return sample.clone();
			},
			getNameByCode: function(code){
				var opt = sample.getChildren('[value="'+code+'"]')[0];
				var text = opt ? opt.getProperty('text') : '--';
				return text;
			}
		};
	};

	function MyPapersList(args) {
		var panel = args.panel;
		var panel2 = args.panel.getElement('[name="papers"]');
		var newpaperbutton = panel2.getElement('[name="newpaperbutton"]');
		var container = panel2.getElement('[name="container"]');
		var common = args.common;
		var dict = args.dict;

		function renderList(data) {
			container.empty();
			var table = (new Element('table', {border: 1, width: '100%'})).inject(container);
			var tbody = (new Element('tbody')).inject(table);
			var tr = new Element('tr');
			tr.grab(new Element('th', {html: '&nbsp;'}));
			tbody.grab(tr);
			lang_list.each(function(lang){
				tr.grab(new Element('th', {text: dict('lang_'+lang)}));
			});
			if(data) data.each( function(p) {
				var tr = (new Element('tr').inject(tbody));
				tr.grab(new Element('td', {align: 'center', styles: {'vertical-align': 'top'}}).adopt(
 					new Element('b', {text: 'N='+p._meta.paper_cnt}),
					new Element('br'),
					new Element('br'),
					new Element('a', {href: '#', text: dict('edit'), events: {click: function(){
						//switchToPaperForm( p._id );
						args.onEdit( p._id );
						return false;
					}}}),
					new Element('br'),
					new Element('br'),
					//conf_permissions.PAPREG_PAPER_DELETE || conf_user_rights.PAPREG_PAPER_DELETE ?
					conf_user_rights.PAPREG_PAPER_DELETE ?
					new Element('a', {href: '#', text: dict('delete'), events: {click: function(){
						if(confirm(dict('delete_paper_confirm')))
						RPC.send('conf.paper.delete_my_paper', [user_id, cont_id, p._id], function(result, error) {
						//	alert( JSON.encode(result) );
							reload();
							args.onDelete(p._id);
						});
						return false;
					}}}) : null,
					new Element('br')
				));
				function limit(s, lim){
					s = s ? s.trim() : '';
					return s.length>lim ? (s.substr(0,lim)+' ...') : s;
				}
				var exdoc_side = lang_list.contains('ru') ? 'ru' : 'en';
				lang_list.each(function(lang){
					var td = (new Element('td', {styles: {'vertical-align': 'top'}})).inject(tr);
					td.adopt(
						new Element('b', {text: limit(p.text.title[lang], 120)}),
						new Element('br'),
						new Element('span', {text: limit(p.text.abstract[lang], 250)})
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
									a['city'][lang] + ', ' +
								//	a['country'] 
									common.country_helper.getNameByCode( a['country'] )
								})
							);
						});
					}
					if(p.files) {
						p.files.filter(function(f){
							var is_exdoc = ['paper_exdoc', 'abstract_exdoc'].contains(f.class_code);
						//	return f && f._meta && f._meta.lang==lang;
							return f && f._meta && (!is_exdoc && f._meta.lang==lang || is_exdoc && exdoc_side==lang);
						}).each(function(f){
							td.adopt( new Element('br'));
							td.adopt(
								new Element('br'),
							//	new Element('b', {text:
							//		dict('file_class_code')+': '
							//	}),
								new Element('b', {text:
									dict('file_'+f.class_code)
								}),
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
										//href: '../download/abstract/'+f.uniquefilename+'?id='+p._id+'&lang='+lang, target: '_blank',
										//href: '../download/abstract/'+f.filename+'?id='+p._id+'&lang='+lang, target: '_blank',
									//	href: '../download/abstract/'+f.filename+'?id='+p._id+'&lang='+lang+'&type='+f.class_code, target: '_blank',
									//	href: 'download/'+f.filename+'?id='+p._id+'&lang='+lang+'&type='+f.class_code, target: '_blank',
										href: 'download/'+f.filename+'?id='+p._id+'&lang='+f._meta.lang+'&type='+f.class_code, target: '_blank',
										text: dict('download_file')
									})
								)
							);
						});
					}
				});
			});
		}
		function reload(){
			RPC.send('conf.paper.get_my_papers_list', [user_id, cont_id], function(result, error) {
				//alert( JSON.encode(result) );
				renderList(result);
			});
			//newpaperbutton.setProperty('disabled', !conf_permissions.USER_REGISTER_NEW_PAPER && !conf_user_rights.USER_REGISTER_NEW_PAPER);
			newpaperbutton.setProperty('disabled', !conf_user_rights.USER_REGISTER_NEW_PAPER);
		}

		newpaperbutton.addEvent('click', function() {
			//switchToPaperForm();
			args.onNew();
		});
		return {
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
	};

	function MyPaperForm(args) {
		var panel = args.panel;
		var common = args.common;
		var dict = args.dict;
		var savebutton = panel.getElements('[name="savebutton"]');
		var paper_id = null;

		var tabs = new Tabs({
			selectedClass: 'current',
			deselectedClass: '',
			tabs: panel.getElement('[name="tabs"] [name="header"]').getChildren('li'),
			clickers: panel.getElement('[name="tabs"] [name="header"]').getChildren('li a'),
			sections: panel.getElement('[name="tabs"] [name="container"]').getChildren('div')
		});

		var tab_text = (function(panel){
			var frm = panel.getChildren('form')[0];
			var di = FormDataInputs( panel, {
				title: 'ml',
				abstract: 'ml'
			} );
			return {
				get: function() {
					return di.get();
				},
				set: function(data) {
					return di.set(data);
				},
				reset: function() {
					frm.reset();
				}
			};
		}( panel.getElement('[name="tabs"] [name="container"]').getChildren('[name="text"]')[0] ));
	//	}( panel.getElements('[name="tabs"] [name="container"] > [name="text"]') ));

		var tab_keywords = (function( panel ) {
			var trs = [];
			var opts = {};
			//var cont = panel.getElement('[name="container"]');
			var cont = panel.getElement('[name="container"]').getElement('tbody');
			var predefined = panel.getElement('[name="predefined"]');
			function addRow( data ) {
				data = $H({}).extend( data );
				var tr = (new Element('tr')).inject(cont);
				lang_list.each(function( lang ){
					tr.grab((new Element('td')).grab(
						new Element('input', {type: 'text', value: data[lang], name: 'kw_'+lang, styles: {width: '100%'}})
					));
				});
				tr.grab((new Element('td', {align: 'center'})).grab(
					new Element('a', {text: '[X]', href: '#', 'events': {'click': function() {
						trs.erase(tr);
						tr.destroy();
						return false;
					}}})
				));
				trs.push(tr);
			}
			function deleteRows() {
				trs.each(function(tr){ tr.destroy(); });
				trs.empty();
			}
			panel.getElement('[name="fromlistbutton"]').addEvent('click', function() {
				var i = predefined.getProperty('value').toInt();
				if( i )
					addRow( opts[i] );
				//	alert(i);
			});
			panel.getElement('[name="newkeywordbutton"]').addEvent('click', function() {
				addRow();
			});

			return {
				init: function( after ) {
					RPC.send('conf.get_conf_keywords', [cont_id], function(result, error) {
						opts = {};
						var cnt = 0;
					//	alert( JSON.encode(result) );
						if( result ) result.each(function(v){
							opts[++cnt] = v;
							predefined.grab( new Element('option', {value: cnt, text: lang_list.ffold([], function(acc, lang){
								acc.push(v[lang]);
								return acc;
							}).join(' | ')}));
						});
					});
				},
				get: function() {
					return trs.ffold([], function(arr, tr){
						arr.push( lang_list.ffold({}, function(acc, lang){
							acc[lang] = tr.getElement('input[name="kw_'+lang+'"]').getProperty('value');
							return acc;
						}));
						return arr;
					});
				},
				set: function(data, after) {
					deleteRows();
					if( data ) data.each(function(v){ addRow(v); });
					if ( after ) after();
				}
			};
		}( panel.getElement('[name="tabs"] [name="container"]').getChildren('[name="keywords"]')[0] ));

		var tab_authors = (function( panel ) {
			var trs = [];
			var opts = {};
			var cont = panel.getElement('[name="container"]').getElement('tbody');
			var country_sample = panel.getElement('[name="country"]');
			var dict = Dict( panel.getChildren('[name="dict"]')[0] );
			var fields = {
				fname: 'ml',
				mname: 'ml',
				lname: 'ml',
				affiliation: 'ml',
				city: 'ml',
				country: null,
				email: null
				//country_sample: null
			};
			function addRow( data ) {
				data = $H({}).extend( data );
				var tr = (new Element('tr')).inject(cont);
			//	var td = (new Element('td', {text: dict('author')})).inject(tr);
				var td = (new Element('td')).inject(tr);
				var tbl = (new Element('table', {width: '100%', border: 1})).inject(td);
				var tbd = (new Element('tbody')).inject(tbl);
				var tr1 = (new Element('tr').inject(tbd));
				//tr1.grab(new Element('th', {text: dict('fieldname')}));
				tr1.grab(new Element('th', {html: '&nbsp;'}));
				lang_list.each(function(lang){
					tr1.grab(new Element('th', {text: dict('lang_'+lang) }));
				});
				['fname', 'mname', 'lname', 'affiliation', 'city'].each(function(name){
					var tr1 = (new Element('tr').inject(tbd));
					tr1.grab(new Element('th', {text: dict(name)}));
					lang_list.each(function(lang){
						tr1.grab((new Element('td').grab(
							new Element('input', {type: 'text',
							//	value: data[name] ? data[name][lang] : null,
								name: name+'_'+lang,
								styles: {width: '100%'}
							})
						)));
					});
				});
				var tr1 = (new Element('tr').inject(tbd));
				tr1.grab(new Element('th', {text: dict('country')}));
			//	var country = country_sample.clone();
				var country = common.country_helper.cloneSample();
				//country.setProperty('name', 'country');
				country.setAttribute('name', 'country');
			//	alert( country.getAttribute('name') );
				country.setStyles({display: 'block', width: '100%'});
				//country.setProperty('width', '100%');
				tr1.grab((new Element('td', {colspan: 2}).grab(
					country
				)));

				var tr1 = (new Element('tr').inject(tbd));
			//	tr1.grab(new Element('th', {text: dict('email')}));
				tr1.grab(new Element('th', {text: dict('Email')}));
				tr1.grab((new Element('td', {colspan: 2}).grab(
							new Element('input', {type: 'text',
								name: 'email',
								styles: {width: '100%'}
							})
				)));

				tr.grab((new Element('td', {align: 'center'})).grab(
					new Element('a', {text: '[X]', href: '#', 'events': {'click': function() {
						tr.destroy();
						trs.erase(tr);
						return false;
					}}})
				));
				trs.push(tr);
			//	alert( JSON.encode(data) );
				var di = FormDataInputs( tr, fields );
				di.set( data );
			}
			function deleteRows() {
				//trs.each(function(tri){
				//	tri.each(function(tr){ tr.destroy(); });
				//});
				trs.each(function(tr){
					tr.destroy();
				});
				trs.empty();
			}
			panel.getElement('[name="newauthorbutton"]').addEvent('click', function() {
				addRow();
			});

			return {
				init: function( after ) {
					if ( after ) after();
				},
				get: function() {
					return trs.ffold([], function(arr, tr){
						var di = FormDataInputs( tr, fields );
				//		alert( JSON.stringify(di.get()) );
						arr.push( di.get() );
						return arr;
					});
				},
				set: function(data, after) {
					//alert( JSON.encode(data) );
					deleteRows();
					if( data ) data.each(function(v){ addRow(v); });
					if ( after ) after();
				}
			};
		}( panel.getElement('[name="tabs"] [name="container"]').getChildren('[name="authors"]')[0] ));

		var tab_files = (function( panel ) {
			var container = panel.getElement('[name="container"]');
			var dict = Dict( panel.getChildren('[name="dict"]')[0] );
			function renderYes() {
			//	['abstract', 'paper', 'presentation'].each(function(type){
			//	['abstract', 'paper', 'presentation', 'exdoc'].each(function(type){
				['abstract', 'paper', 'presentation'].each(function(type){
					//var h3 = (new Element('h3', {text: dict('file_'+type), align: 'center'})).inject(container);
					var table = (new Element('table', {border: 1, width: '100%'})).inject(container);
					var tbody = (new Element('tbody')).inject(table);
					(new Element('tr').inject(tbody)).grab(new Element('th', {colspan: '2', text: dict('file_'+type)}));
					lang_list.each(function(lang){
						var tr = (new Element('tr').inject(tbody));
						tr.grab(new Element('td', {align: 'center', text: dict('lang_'+lang)}));
						tr.grab(new Element('td', {align: 'center'}).grab(
						//	new Element('iframe', {src: 'file?id='+paper_id+'&lang='+lang+'&type='+type, styles: {width: '100%', height: '100pt'}})
							new Element('iframe', {src: 'mypapers_file?id='+paper_id+'&lang='+lang+'&type='+type, styles: {width: '100%', height: '100pt'}})
						));
					});
					if( ['abstract', 'paper'].contains(type) ) {
						var tr = (new Element('tr').inject(tbody));
					//	tr.grab(new Element('td', {align: 'center', text: dict('file_'+type+'_exdoc')+ ' (' + dict('only_for_russian') +')'}));
						var td = new Element('td', {align: 'center'});
						td.adopt(
							new Element('span', {text: dict('file_'+type+'_exdoc')}),
							new Element('br'),
							new Element('span', {text: '(' + dict('only_for_russian') +')'})
						);
						tr.grab(td);
						tr.grab(new Element('td', {align: 'center'}).grab(
							new Element('iframe', {src: 'mypapers_file?id='+paper_id+'&lang='+'ru'+'&type='+type+'_exdoc', styles: {width: '100%', height: '100pt'}})
						));
					}
				});
			}
			function renderNo() {
				var btn = new Element('input', {type: 'button', value: dict('save'), events: {click: function() {
					savePaper({
						before: function(){
							btn.setProperty('disabled', true);
						},
						after: function(){
							btn.setProperty('disabled', false);
						}
					});
				}}});
				(new Element('div')).inject(container).adopt(
					new Element('div', {text: dict('save_before_file_submittion')}),
					btn
				);
			}
			return {
				refresh: function() {
					container.empty();
					paper_id ? renderYes() : renderNo();
				}
			};
		}( panel.getElement('[name="tabs"] [name="container"]').getChildren('[name="files"]')[0] ));

		var tab_reviews = (function( panel ) {
			var container = panel.getElement('[name="container"]');
			var dict = Dict( panel.getChildren('[name="dict"]')[0] );
			function block_reviews() {
				var div = new Element('div');
				//if(!conf_permissions.PAPREG_VIEW_REVIEWERS_COMMENTS && !conf_user_rights.PAPREG_VIEW_REVIEWERS_COMMENTS){
				if(!conf_user_rights.PAPREG_VIEW_REVIEWERS_COMMENTS){
					div.setProperty('text', dict('view_review_disabled'));
				} else {
					RPC.send('conf.review.get_my_paper_reviews', [user_id, cont_id, paper_id], function(result, error) {
						var table = (new Element('tbody')).inject((new Element('table', {border: 1, align: 'center'})).inject(div))
						var tr = (new Element('tr').inject(table));
						lang_list.each(function(lang){
							tr.grab(new Element('th', {text: dict('lang_'+lang)}));
						});
						if(result) result.each(function(r){
							var tr = (new Element('tr').inject(table));
							if(r && r['data'] && r['data']['authcomments']) lang_list.each(function(lang){
								tr.grab(new Element('td', {text: r['data']['authcomments'][lang]}));
							});
						});
					});
				}
				return div;
			}
			function block_decision() {
				var div = new Element('div');
				//if(!conf_permissions.PAPREG_VIEW_FINAL_DECISION && !conf_user_rights.PAPREG_VIEW_FINAL_DECISION){
				if(!conf_user_rights.PAPREG_VIEW_FINAL_DECISION){
					div.setProperty('text', dict('view_decision_disabled'));
				} else {
					RPC.send('conf.get_conf_sections', [cont_id], function(result, error) {
						var sections = result;
						RPC.send('conf.paper.get_my_paper_decision', [user_id, cont_id, paper_id], function(result, error) {
						//	var sec_name = sections.ffold({}, function(acc, s){
							var sec_name = sections.ffold(null, function(acc, s){
								return s['id']==result['section'] ? s['name'] : acc
							});
							var table = (new Element('tbody')).inject((new Element('table', {border: 1, align: 'center'})).inject(div))
							var tr = (new Element('tr').inject(table));
							tr.grab(new Element('td', {text: dict('decision_decision')}));
							tr.grab(new Element('td', {text: dict(result['decision'] ? 'decision_'+result['decision'] : 'decision_uncertain')}));
							var tr = (new Element('tr').inject(table));
							tr.grab(new Element('td', {text: dict('decision_section')}));
							tr.grab(new Element('td', {text: (sec_name ? lang_list.map(function(lang){ return sec_name[lang]; }).join(' | ') : dict('section_uncertain')) }));
						//	tr.grab(new Element('td', {text: JSON.encode(sec_name)}));
						});
					});
				}
				return div;
			}
			function block_reviews2() {
				var div = new Element('div');
				//if(!conf_permissions.PAPREG_VIEW_SECTMANS_COMMENTS && !conf_user_rights.PAPREG_VIEW_SECTMANS_COMMENTS){
				if(!conf_user_rights.PAPREG_VIEW_SECTMANS_COMMENTS){
					div.setProperty('text', dict('view_review2_disabled'));
				} else {
					RPC.send('conf.review.get_my_paper_reviews2', [user_id, cont_id, paper_id], function(result, error) {
						var table = (new Element('tbody')).inject((new Element('table', {border: 1, align: 'center'})).inject(div))
						var tr = (new Element('tr').inject(table));
						lang_list.each(function(lang){
							tr.grab(new Element('th', {text: dict('lang_'+lang)}));
						});
						if(result) result.each(function(r){
							var tr = (new Element('tr').inject(table));
							if(r && r['data'] && r['data']['authcomments']) lang_list.each(function(lang){
								tr.grab(new Element('td', {text: r['data']['authcomments'][lang]}));
							});
						});
					});
				}
				return div;
			}
			function render() {
				[
					{t: 't_reviews', f: block_reviews},
					{t: 't_decision', f: block_decision},
					{t: 't_reviews2', f: block_reviews2}
				].each(function(b){
					container.adopt(
						new Element('h3', {text: dict(b.t), align: 'center'}),
						b.f()
					);
				});
			}
			return {
				refresh: function() {
					container.empty();
					if(paper_id) render();
				}
			};
		}( panel.getElement('[name="tabs"] [name="container"]').getChildren('[name="reviews"]')[0] ));

		function savePaper(args) {
			args = args || {};
			var data = {
				text: tab_text.get(),
				keywords: tab_keywords.get(),
				authors: tab_authors.get()
			}
		//	alert( JSON.encode(data) );

			var p = data;
			var im_from_russia = self.user && self.user.info && self.user.info.country=='ru';
			function is_optional( lang ) {
				return lang=='ru' && lang_list.length>1 && !im_from_russia;
			}

			if( ! lang_list.ffold(true, function(acc, lang) {
				return acc && (p.text && p.text.title && p.text.title[lang] && (p.text.title[lang].trim().length > 20) || is_optional(lang))
			})) alert( dict('msg_bad_title') );
			else if( ! lang_list.ffold(true, function(acc, lang) {
				return acc && (p.text && p.text.abstract && p.text.abstract[lang] && (p.text.abstract[lang].trim().length > 50) || is_optional(lang))
			})) alert( dict('msg_bad_abstract') );
			else if( ! p.keywords || p.keywords.length==0 || ! p.keywords.ffold(true, function(acc, kwml){
				return lang_list.ffold(acc, function(acc, lang) {
					return acc && (kwml[lang] && (kwml[lang].trim().length > 0) || is_optional(lang))
				})
			})) alert( dict('msg_bad_keywords') );
			else if( ! p.authors || p.authors.length==0 || ! p.authors.ffold(true, function(acc, aml){
				return lang_list.ffold(acc, function(acc, lang) {
				//	alert(aml['country']);
					var necessary_fields = ['fname', 'lname', 'affiliation', 'city'];
					if(aml['country']=='ru') necessary_fields.push('mname');
					//var necessary_fields = ['fname', 'mname', 'lname', 'affiliation', 'city'];
					//return ['fname', 'mname', 'lname', 'affiliation', 'city'].ffold(acc, function(acc, field) {
					return necessary_fields.ffold(acc, function(acc, field) {
						return acc && (aml[field] && aml[field][lang] && (aml[field][lang].trim().length > 0) || is_optional(lang));
					});
			//	}) && aml.country;
				}) && aml.country && aml.email;
			})) alert( dict('msg_bad_authors') );
			else {
				savebutton.setProperty('disabled', true);
				if(args.before) args.before();
				RPC.send('conf.paper.save_my_paper_data', [user_id, cont_id, paper_id, data], function(result, error) {
					if (!paper_id && result )
					paper_id = result
					tab_files.refresh();
					alert( dict('paper_saved') );
					savebutton.setProperty('disabled', false);
					if(args.after) args.after();
				});
			}
		}

		panel.getElements('[name="tolistbutton"]').addEvent('click', function() {
			args.onExit();
		//	switchToPapersList();
		});
		savebutton.addClass('important');
		savebutton.addEvent('click', function() {
			savePaper();
		});

		return {
			init: function(){
				tab_keywords.init();
			},
			enter: function( id ){
				paper_id = id;
				tab_text.reset();
				if (paper_id) RPC.send('conf.paper.get_my_paper_data', [user_id, cont_id, paper_id], function(result, error) {
					tab_text.set( result.text );
					tab_keywords.set( result.keywords );
					tab_authors.set( result.authors );
				});
				tab_files.refresh();
				tab_reviews.refresh();
				//savebutton.setProperty('disabled', paper_id && !conf_permissions.PAPREG_PAPER_EDIT && !conf_user_rights.PAPREG_PAPER_EDIT);
				savebutton.setProperty('disabled', paper_id && !conf_user_rights.PAPREG_PAPER_EDIT);
				panel.setStyles({ display: 'block' });
			},
			leave: function(){
				paper_id = null;
				panel.setStyles({ display: 'none' });
			},
			reset: function(after) {
				if ( after ) after();
			}
		};
	};

	function MyPapers() {
		var paperscomp = (function(comp) {
			var common = (function Common() {
				return {
					country_helper: CountryHelper({
						panel: comp.getChildren('[name="country_helper"]')[0]
					})
				};
			}());
			var dict = Dict( comp.getChildren('[name="dict"]')[0] );
			var list = MyPapersList({
				panel: comp.getElement('[name="paperslist"]'),
				common: common,
				dict: dict,
			    	onEdit: function(id) { switchToPaperForm( id ); },
				onNew: function(id) { switchToPaperForm(); },
				onSubmit: function(id) {
					//submittedlist.refresh();
				},
		    		onDelete: function(id) { }
			});

			var form = MyPaperForm({
				panel: comp.getElement('[name="paperform"]'),
				common: common,
				dict: dict,
				onExit: function(id) { switchToPapersList(); }
			});

			form.init();

			function switchToPapersList() {
				form.leave();
				list.enter();
			//	submittedlist.enter();
			}

			function switchToPaperForm(id) {
			//	submittedlist.leave();
				list.leave();
				form.enter(id);
			}
			switchToPapersList();

			return {};
		}($('papercomp')));
	}

	self.conf.addEvent('init_ok', function(result, error) {
		//conf_permissions = self.conf.permissions;
		conf_user_rights = self.conf.my_rights;
		MyPapers();
	});

});

