
'use strict';

(function($) {
	var PanelMixin = {
		show: function(flag) { $(this.panel).css('display', flag ? 'block' : 'none'); }
	}

	var lang_list = ['en', 'ru'];

	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};
	self.Coms.Comp.Admin = self.Coms.Comp.Admin || {};
	self.Coms.Comp.Admin.ConfImportKeywords = function(cont, dict) {
		var me = {
			panel: cont
		};
		me.init = function() {
			var confsBlock = $( "[name=importconfslist]", cont );
			var kwBlock = $( "[name=importkeywordslist]", cont );
			var cbAll = $( "[name=importkeywordscheckbox]", cont );

			cbAll.click(function() {
				var flag = cbAll.is(':checked');
				$.each(cbArr, function(k, d) { d.elm.prop("checked", flag); });
			});
			$( "[name=hideimportkeywordsbutton]", cont ).click(function() { me.show(false); });
			$( "[name=importcheckedkeywordsbutton]", cont ).click(function() {
				var kwlist = cbArr.reduce(function(acc, k) {
					if( k.elm.is(':checked') ) { acc.push(k.data); }
					return acc;
				}, []);
				me.notify('add_keywords', kwlist);
			});
			var cbArr = [];
			RPC.send('conf.get_confs_list', [], function(result, error) {
				var cArr = [];
				function onConfElement(k, conf) {
					if( conf.info && conf.info.title ) {
						var a = $('<a href="javascript:" style="display: block">');
						a.text(
							conf.info && conf.info.title ? lang_list.reduce(function(acc, k) {
								acc.push(conf.info.title[k]);
								return acc;
							}, []).join( ' | ' ) : ''
						);
						confsBlock.append( a );
						cArr.push(a);
						a.click(function() {
							$.each(cArr, function(k, v) { v.css('background', ''); });
							a.css('background', '#ccffcc');
							RPC.send('conf.get_conf_keywords', [conf._id], function(result, error) {
								kwBlock.text('');
								cbArr = [];
								$.each(result, function(k, kw) {
									cbAll.prop("checked", false);
									var li = $('<div>');
									var input = $('<input type="checkbox"></input>');
									var span = $('<span>');
									span.text( JSON.encode( kw ));
									li.append( input, span );
									kwBlock.append( li );
									cbArr.push({
										elm: input,
										data: kw
									});
								});
							});
						});
					}
				}
				$.each(result, onConfElement);
			});
		}

		Mixin.implement(me, Mixin.Observable);
		Mixin.implement(me, PanelMixin);
		me.init();
		return me;
	}

}(jQuery));

window.addEvent('domready',function() {


	var user_lang_code = Cookie.read('ecms_lang');
	var lang_list = ['en', 'ru'];
	var comp = $('confcomp');

	var page_confslist = (function( panel ){
			var container = panel.getElement('[name="container"]');
			var me = {
				render: function( data ) {
					data.each( function(p) {
						var row = (new Element('div', {styles: {bborder: 'solid thin red', margin: '8px'}})).inject(container);
						//var a = new Element('a', {text: JSON.encode(p), href: '#'});
						var a = new Element('a', {text: p._id, href: '#'});
						row.adopt(
							a,
							new Element('br'),
							new Element('b', {text:
								lang_list.map(function(lang){
									return (p.info && p.info.title && p.info.title[lang]) ? p.info.title[lang] : '';
								}).join(' | ')
							})
						);
					//	container.grab( row );
						a.addEvent('click', function() {
							switchToConfPage( p._id );
							return false;
						});
					});
				},
				enter: function() {
					container.empty();
					RPC.send('conf.get_confs_list', [], function(result, error) {
						if( result ) me.render( result );
						panel.setStyles({ display: 'block' });
					});
				},
				leave: function() {
					panel.setStyles({ display: 'none' });
				}
			};
			return me;
	}( comp.getElement('[name="confslist"]') ));

	var page_confpage = (function( confpage ){
			var _id = null;
			new Tabs({
				selectedClass: 'current',
				deselectedClass: '',
				tabs: confpage.getElement('[name="tabs"] [name="header"]').getChildren('li'),
				clickers: confpage.getElement('[name="tabs"] [name="header"]').getChildren('li a'),
				sections: confpage.getElement('[name="tabs"] [name="container"]').getChildren('div')
			});
			var dict = Dict( confpage.getChildren('[name="dict"]')[0] );
			var conftitle = confpage.getChildren('[name="conftitle"]')[0];

			confpage.getElement('[name="tolistbutton"]').addEvent('click', function() {
				switchToConfsList();
			});

			var tab_info = (function( panel ) {
			//	var di = DataInputs( panel, {
				var di = FormDataInputs( panel, {
					lang: null,
					part_presence: null,
					status: null,
					email: null,
					homepage: 'ml',
					title: 'ml',
					description: 'ml'
				} );
				panel.getElement('[name="saveinfobutton"]').addEvent('click', function() {
					RPC.send('conf.save_conf_info', [_id, di.get()], function(result, error) {
						alert('OK');
					});
				});
				return {
					init: function( after ) {
						RPC.send('conf.get_conf_info', [_id], function(result, error) {
							di.set( result );
							conftitle.set('text', lang_list.map(function(k){ return result.title[k]; }).join(' | '));
							if ( after ) after();
						});
					}
				};
			}( confpage.getElement('[name="info"]') ));

			var tab_keywords = (function( panel ) {
				var trs = [];
				//var cont = panel.getElement('[name="container"]');
				var cont = panel.getElement('[name="container"]').getElement('tbody');
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
				panel.getElement('[name="newkeywordbutton"]').addEvent('click', function() {
					addRow();
				});
				panel.getElement('[name="importkeywordsbutton"]').addEvent('click', function() {
					importBlock.show(true);
				});
				panel.getElement('[name="savekeywordsbutton"]').addEvent('click', function() {
					var res = trs.ffold([], function(arr, tr){
						arr.push( lang_list.ffold({}, function(acc, lang){
							acc[lang] = tr.getElement('input[name="kw_'+lang+'"]').getProperty('value');
							return acc;
						}));
						return arr;
					});
					RPC.send('conf.save_conf_keywords', [_id, res], function(result, error) {
						alert('OK');
					});
				});

				var importBlock = new Coms.Comp.Admin.ConfImportKeywords( panel.getElement('[name="importblock"]', dict) );
				importBlock.attach('add_keywords', function(data) {
					if( data.length > 0 ) {
						data.each(function( d ) {
							addRow( d );
						});
						alert( dict('keywordsimported') );
					} else {
						alert( dict('keywordsimportlistisempty') );
					}
				});

				return {
					init: function( after ) {
						RPC.send('conf.get_conf_keywords', [_id], function(result, error) {
							deleteRows();
							if( result ) result.each(function(v){ addRow(v); });
							if ( after ) after();
						});
					}
				};
			}( confpage.getElement('[name="keywords"]') ));

			var tab_sections = (function( panel ) {
				(function(){
					var addnewblock = (new Element('div', {})).inject(panel);
					var addnewform = (new Element('form', {})).inject(addnewblock);
					var add_section_name_inp = {};
					lang_list.each(function(k){
						var inp = new Element('input', {type: 'text', value: ''});
						add_section_name_inp[k] = inp;
						addnewform.adopt(
							new Element('span', {text: k+': '}),
							inp,
							new Element('br')
						);
					});
					addnewform.adopt(
						new Element('input', {type: 'button', value: 'Add', events: {
							click: function() {
								var add_section_name = {};
								lang_list.each(function(k){
									add_section_name[k] = add_section_name_inp[k].getProperty('value');
								});
							//	alert(JSON.encode(add_section_name));
								RPC.send('conf.new_conf_section', [_id, add_section_name], function(result, error) {
									reload(function(){ addnewform.reset(); });
								});
							}
						}}),
						new Element('br')
					);
				})();

				var sectionslist = (new Element('div', {})).inject(panel);

				var rowElem = function(data){
					function managersList(){
						var me = {
							element: new Element('div', {styles: {display: 'none'}})
						};
						function mlAddRow( pin ) {
						//	var pin = data;
							var li = (new Element('li')).inject(man_list_div);
							li.adopt(
								new Element('a', {text: '[X]', href: '#', 'events': {'click': function() {
									RPC.send('conf.remove_conf_section_manager', [_id, data.id, pin], function(result, error) {
										mlReload();
									});
									return false;
								}}}),
								new Element('span', {text: ' | '}),
								new Element('span', {text: pin}),
							//	new Element('span', {text: ' | '}),
								new Element('span')
							);
						//	trs.push(li);
						}
						function mlReload(after){
							RPC.send('conf.get_conf_section_managers', [_id, data.id], function(result, error) {
								man_list_div.empty();
								if( result ) result.each(function(v){ mlAddRow(v); });
								if(after) after();
							});
						}
						var userpin_inp = new Element('input', {type: 'text'});
						var add_pin_btn = new Element('input', {type: 'button', value: 'Add manager', events: {
							click: function(){
								var userpin = userpin_inp.getProperty('value').toInt();
								if(userpin) RPC.send('conf.add_conf_section_manager', [_id, data.id, userpin], function(result, error) {
									mlReload();
								});
								return false;
							}
						}});
						var man_list_div = new Element('div', {text: 'd gsdfg sgewtr ert wret wrt ewrt ye'});
						me.element.adopt(
							new Element('span', {text: 'Enter PIN'}), new Element('br'), userpin_inp, add_pin_btn,
							(new Element('fieldset')).adopt(
								new Element('legend', {text: 'Section managers'}), man_list_div
							)
						);
						mlReload();
						return me;
					}

					var edit_visible = false;
					var managers_visible = false;
					var r2 = new Element('div', {styles: {display: 'none'}});
					var r3 = managersList().element;
					var save_section_name_inp = {};
					lang_list.each(function(k){
						var inp = new Element('input', {type: 'text', value: data.name[k]});
						save_section_name_inp[k] = inp;
						r2.adopt(
							new Element('span', {text: k+': '}),
							inp,
							new Element('br')
						);
					});
					r2.adopt(
						new Element('input', {type: 'button', value: 'Save', events: {
							click: function() {
								var save_section_name = {};
								lang_list.each(function(k){
									save_section_name[k] = save_section_name_inp[k].getProperty('value');
								});
								RPC.send('conf.set_conf_section_name', [_id, data.id, save_section_name], function(result, error) {
									name_elm.setProperty('text', lang_list.map(function(k){ return save_section_name[k]; }).join(' | '));
									edit_visible = false;
									r2.setStyles({display: 'none'});
								});
							}
						}}),
						new Element('br')
					);
					var name_elm = new Element('b', {text: lang_list.map(function(k){ return data.name[k]; }).join(' | ')});
					var me = {
						element: (new Element('div')).adopt(
							(new Element('div')).adopt(
								name_elm,
								new Element('b', {html: ' &bull; '}),
								new Element('a', {text: 'Edit', href: '#', title: 'Show/hide edit form', events: {
									click: function(){
										edit_visible = ! edit_visible;
										r2.setStyles({display: edit_visible ? 'block' : 'none'});
										return false;
									}
								}}),
								new Element('span', {text: ' | '}),
								new Element('a', {text: 'Managers', href: '#', title: 'Show/hide managers list', events: {
									click: function(){
										managers_visible = ! managers_visible;
										r3.setStyles({display: managers_visible ? 'block' : 'none'});
										return false;
									}
								}}),
								new Element('span', {text: ' | '}),
								new Element('a', {text: '[x]', href: '#', title: 'Delete section', events: {
									click: function(){
										if( confirm('Are you sure?') ) {
											RPC.send('conf.delete_conf_section', [_id, data.id], function(result, error) {
												reload();
											});
										}
										return false;
									}
								}})
							),
							r2,
							r3
						)
					};
					return me;
				}

				function addRow( data ) {
					data = $H({}).extend( data );
				//	function changePages(elm, page) {
				//		return false;
				//	}
					rowElem(data).element.inject(sectionslist);
				}
			//	function deleteRows() {
			//		sectionslist.empty();
			//	}
				function reload( after ) {
				//	deleteRows();
					sectionslist.empty();
					RPC.send('conf.get_conf_sections', [_id], function(result, error) {
						if( result instanceof Array )
							result.each(function(row) {
								addRow( row );
							});
						if ( after ) after();
					});
				}
				return {
					init: function( after ) {
						reload( after );
					}
				};
			}( confpage.getElement('[name="sections"]') ));

			var tab_decisions = (function( panel ) {
				function render(d_all, d_rev) {
					panel.empty();
					var curr_val = d_all.ffold({}, function(acc, k){ acc[k]=d_rev.contains(k); return acc; });
					var ul = (new Element('ul', {})).inject(panel);
					d_all.each(function(k){
						ul.grab((new Element('li', {ttext: dict(k)})).adopt(
							new Element('input', {type: 'checkbox', checked: curr_val[k], events: {
								change: function(){
									curr_val[k] = this.checked;
									var selected = d_all.filter(function(k){ return curr_val[k]; });
									RPC.send('conf.set_reviewer_decisions', [_id, selected], function(result, error) {
									//	alert(JSON.encode(result));
									});
								}
							}}),
							new Element('span', {text: ' '+dict(k)})
						));
					});
				}
				function reload( after ) {
				//	deleteRows();
				//	sectionslist.empty();
					RPC.send('conf.get_all_decisions', [_id], function(d_all, error) {
						RPC.send('conf.get_reviewer_decisions', [_id], function(result, error) {
							render(d_all, result);
						//	alert( JSON.encode(result) );
						//	if( result instanceof Array )
						//		result.each(function(row) {
						//		//	addRow( row );
						//		});
							if ( after ) after();
						});
					});
				}
				return {
					init: function( after ) {
						reload( after );
					}
				};
			}( confpage.getElement('[name="decisions"]') ));

			var tab_roles = (function( panel ) {
				var newblock = panel.getElement('[name="newblock"]');
				var roleslist = panel.getElement('[name="roleslist"]');

			//	var markedLink = null;

			//	var role_rights_list = [];
			//	var role_members_list = [];

				var rights = (function(panel){
					var rid = null;
					panel.getElements('input[type=checkbox]').addEvent('change', function(e) {
						var data = {}
						panel.getElements('input[type=checkbox]').each(function(elm) {
							var name = elm.get('name');
							var checked = elm.get('checked');
							data[name] = checked;
						});
						RPC.send('conf.set_conf_role_rights', [_id, rid, data], function(result, error) { });
					});
					return{
						show: function(id){
							panel.getElements('input[type=checkbox]').set('checked', false);
							rid = id;
							RPC.send('conf.get_conf_role_rights', [_id, rid], function(result, error) {
								//alert( JSON.encode(result) );
								$H(result).each(function(v, name) {
									var elm = panel.getElement('input[type=checkbox][name="'+name+'"]');
									if(elm) elm.set('checked', v);
								});
								panel.setStyles({ display: 'block' });
							});
						},
						hide: function(){
							rid = null;
							panel.setStyles({ display: 'none' });
						}
					}
				}( panel.getElement('[name="rights"]') ));

				var members = (function(panel){
					var rid = null;
					var trs = [];
					var cont = panel.getElement('[name="container"]');
					function addRow( data ) {
						var pin = data;
						var li = (new Element('li')).inject(cont);
						li.adopt(
							new Element('a', {text: '[X]', href: '#', 'events': {'click': function() {
								RPC.send('conf.remove_conf_role_member', [_id, rid, pin], function(result, error) {
									reloadList();
								});
								return false;
							}}}),
							new Element('span', {text: ' | '}),
							new Element('span', {text: pin}),
						//	new Element('span', {text: ' | '}),
							new Element('span')
						);
						trs.push(li);
					}
					function deleteRows() {
						trs.each(function(tr){ tr.destroy(); });
						trs.empty();
					}
					function reloadList(after) {
						RPC.send('conf.get_conf_role_members', [_id, rid], function(result, error) {
						//	alert( JSON.encode(result) );
							deleteRows();
							if( result ) result.each(function(v){ addRow(v); });
							if(after) after();
						});
					}
					panel.getElement('input[name="add_role_member"]').addEvent('click', function() {
						var inp = panel.getElement('input[name="userpin"]')
						var pin = inp.getProperty('value').toInt();
						if(pin) RPC.send('conf.add_conf_role_member', [_id, rid, pin], function(result, error) {
							inp.setProperty('value', '');
							reloadList();
						});
					});
					return{
						show: function(id){
							rid = id;
								panel.setStyles({ display: 'block' });
							reloadList(function(){
							});
						},
						hide: function(){
							rid = null;
							panel.setStyles({ display: 'none' });
							deleteRows();
						}
					}
				}( panel.getElement('[name="members"]') ));

				function addRow( data ) {
					data = $H({}).extend( data );
					function changePages(elm, page) {
						rights.hide();
						members.hide();
						roleslist.getElements('div a[name="role_rights"]').removeClass('current');
						roleslist.getElements('div a[name="role_members"]').removeClass('current');
						elm.addClass('current');
						page.show( data.id );
					//	if( markedLink ) markedLink.setStyles({backgroundColor: ''});
					//	elm.setStyles({backgroundColor: '#ffff44'});
					//	markedLink = elm;
						return false;
					}
					var li = (new Element('div', {styles: {margin: '25px'}})).inject(roleslist);
				//	var role_rights_a = new Element('a', {name: 'role_rights', text: dict('role_rights'), href: '#', events: {
				//		click: function() {
				//			changePages(this, rights);
				//			return false;
				//		}
				//	}});
				//	var role_members_a = new Element('a', {name: 'role_members', text: dict('role_members'), href: '#', events: {
				//		click: function() {
				//			changePages(this, members);
				//			return false;
				//		}
				//	}});
					li.adopt(
						new Element('b', {text: data.name}),
						new Element('br'),
						new Element('a', {name: 'role_rights', text: dict('role_rights'), href: '#', events: {
							click: function() {
								changePages(this, rights);
								return false;
							}
						}}),
				//		role_rights_a,
						new Element('span', {text: ' | '}),
						new Element('a', {name: 'role_members', text: dict('role_members'), href: '#', events: {
							click: function() {
								changePages(this, members);
								return false;
							}
						}}),
				//		role_members_a,
						new Element('span', {text: ' | '}),
						new Element('a', {text: dict('delete_role'), href: '#', events: {
							click: function(){
								if(confirm(dict('delete_role_confirm')))
								RPC.send('conf.delete_conf_role', [_id, data.id], function(result, error) {
									reload();
								});
								return false;
							}
						}})
					);
				}
				function deleteRows() {
				//	role_rights_list = [];
				//	role_members_list = [];
					roleslist.empty();
				}
				function reload( after ) {
					rights.hide();
					members.hide();
					deleteRows();
					RPC.send('conf.get_conf_roles', [_id], function(result, error) {
						if( result instanceof Array )
							result.each(function(row) {
								addRow( row );
							});
						if ( after ) after();
					});
				}
				newblock.getElement('[name="newrolebutton"]').addEvent('click', function() {
					var newrolename = newblock.getElement('[name="newrole"]')
					RPC.send('conf.new_conf_role', [_id, newrolename.getProperty('value')], function(result, error) {
						reload(function() { newrolename.setProperty('value', ''); });
					});
				});
				return {
					init: function( after ) {
						reload( after );
					}
				};
			}( confpage.getElement('[name="roles"]') ));

			var tab_permissions = (function( panel ) {
				var cont = panel.getElement('[name="container"]');
				cont.getElements('input[type=checkbox]').addEvent('change', function(e) {
					var data = {}
					cont.getElements('input[type=checkbox]').each(function(elm) {
						var name = elm.get('name');
						var checked = elm.get('checked');
						data[name] = checked;
					});
					RPC.send('conf.set_conf_permissions', [_id, data], function(result, error) { });
				});
				return {
					init: function( after ) {
						RPC.send('conf.get_conf_permissions', [_id], function(result, error) {
							cont.getElements('input[type=checkbox]').each(function(elm){
								var name = elm.getProperty('name');
								elm.set('checked', result && result[name]);
							});
							if ( after ) after();
						});
					}
				};
			}( confpage.getElement('[name="permissions"]') ));

			var tab_downloads = (function( panel ) {
			//	var di = DataInputs( panel, {
				var di = FormDataInputs( panel, {
					link_toc: 'ml',
					link_archive: 'ml'
				} );
				panel.getElement('[name="savedownloadsbutton"]').addEvent('click', function() {
					RPC.send('conf.save_conf_downloads', [_id, di.get()], function(result, error) {
						alert('OK');
					});
				});
				return {
					init: function( after ) {
						RPC.send('conf.get_conf_downloads', [_id], function(result, error) {
							di.set( result );
							conftitle.set('text', lang_list.map(function(k){ return result.title[k]; }).join(' | '));
							if ( after ) after();
						});
					}
				};
			}( confpage.getElement('[name="downloads"]') ));

			return {
				enter: function( id ) {
					_id = id;
					tab_info.init(function() {
///*
						tab_keywords.init(function() {
							tab_sections.init(function() {
								tab_decisions.init(function() {
									tab_roles.init(function() {
										tab_permissions.init(function() {
											tab_downloads.init(function() {
											//	confpage.setStyles({ display: 'block' });
											});
										});
									});
								});
							});
						});
//*/
					});
					confpage.setStyles({ display: 'block' });
				},
				leave: function() {
					_id = null;
					confpage.setStyles({ display: 'none' });
				}
			};
//	});
	}( comp.getElement('[name="confpage"]') ));

	function switchToConfsList() {
		page_confpage.leave();
		page_confslist.enter();
	}

	function switchToConfPage( _id ) {
		page_confslist.leave();
		page_confpage.enter( _id );
	}

	comp.getElement('[name="newconfbutton"]').addEvent('click', function() {
		RPC.send('conf.new', [], function(result, error) {
			if ( result && result._id )
				switchToConfPage( result._id );
		});
	});

	switchToConfsList();

});


