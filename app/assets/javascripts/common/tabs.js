window.addEvent('domready',function() {

	Tabs = function(args){
		//alert(JSON.encode(args.tabs));
	//	alert( typeOf( args.tabs ) );
	//	alert( args.tabs );
	//	args.tabs.each(function(v,k){
	//		alert( k );
	//	});
		
		var tabs = []; args.tabs.each(function(e){ tabs.push(e); });
		var clickers = []; args.clickers.each(function(e){ clickers.push(e); });
		var sections = []; args.sections.each(function(e){ sections.push(e); });


	//	args.tabs.fzip( args.clickers, args.sections ).each( function( row ) {
		tabs.fzip( clickers, sections ).each( function( row ) {
		//	alert(row);
			row[1].addEvents({
				'click': function() {
					//args.clickers.each( function( e ) { e.setProperty('class', args.deselectedClass); });
				//	args.tabs.each( function( e ) { e.setProperty('class', args.deselectedClass); });
				//	args.sections.each( function( e ) { e.setStyle('display', 'none'); });
					tabs.each( function( e ) { e.setProperty('class', args.deselectedClass); });
					sections.each( function( e ) { e.setStyle('display', 'none'); });
					row[2].setStyle('display', 'block');
					//row[1].setProperty('class', args.selectedClass);
					row[0].setProperty('class', args.selectedClass);
					return false;
				}
			});
		//	args.sections[0].setStyle('display', 'block');
		//	args.clickers[0].setProperty('class', args.selectedClass);
	//		sections[0].setStyle('display', 'block');
	//		clickers[0].setProperty('class', args.selectedClass);
		} );
		sections[0].setStyle('display', 'block');
		//clickers[0].setProperty('class', args.selectedClass);
		tabs[0].setProperty('class', args.selectedClass);
		return { }
	};

	TabsPure = function(args){
		var list = args.items;
		var tabs_panel = (new Element('div'));

		var tabs = [];
		var clickers = [];
		var sections = [];

		var header_div = new Element('div', {'class': 'menu'});
		list.each(function(t){
			var a = (new Element('a', {href: '#', text: t.title}));
			var h = (new Element('li', {})).grab(a);
			header_div.grab(h);
			tabs.push(h);
			clickers.push(a);
		});
		tabs_panel.grab(header_div);

		var container_div = new Element('div', {'cclass': 'menu'});
		list.each(function(t){
			var s = t.panelFun ? t.panelFun() : t.panel;
			s.setStyle('display', 'none');
			container_div.grab(s);
			sections.push(s);
		});
		tabs_panel.grab(container_div);

		new Tabs({
			selectedClass: 'current',
			deselectedClass: '',
			tabs: tabs,
			clickers: clickers,
			sections: sections
		});
		return tabs_panel;
	}

});


