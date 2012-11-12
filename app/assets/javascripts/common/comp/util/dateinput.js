
'use strict'

var DateInput = function(args) {
	//var args = Object.merge({
	args = $H({
		y1: 1980,
		y2: 2020
	}).extend(args);
//	}).combine(args);
//	alert( JSON.encode(args) );
	var field = args.field;
	field.set('readonly', 'readonly');

	var date0 = new Date(field.get('value'));
	alert(date0);

//	field.setStyles({'margin-bottom': 0});
//	var cont = new Element('div', {class: 'dateinput'});
	var form = new Element('form', {class: 'dateinput', events: {submit: function() {
		alert('submit');
		return false;
	}}});
	var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
	//var weekDaysShort = ['', '', '', '', '', '', ''];
	var weekDaysShort = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
	form.addClass('hidden');
	form.inject( field, 'after' );
//	cont.inject( field, 'after' );
//	form.inject( cont );
	field.addEvents({
		focus: function() {
			form.removeClass('hidden');
		},
		blur: function() {
//			form.addClass('hidden');
		}
	});
	function hide() {
		form.addClass('hidden');
	}
	$(document).addEvent('click', function( e ) {
		if( e.target != field )
			if( ! form.contains( e.target ) )
				hide();
	});

	var year_elem = new Element('select', {class: 'year'});
	//for(var y = 2000; y<2013; y++) {
	for(var y = args.y1; y<=args.y2; y++) {
		year_elem.adopt( new Element('option', {text: y}) );
	}
	var month_elem = new Element('select', {class: 'month'});
	for(var m = 0; m<12; m++) {
		month_elem.adopt( new Element('option', {value: m, text: months[m]}) );
	}
	var days_elem = (function() {
		// See http://stackoverflow.com/a/4881951
		function getNumberOfDays(year, month) {
			var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
			return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		}
		var panel = new Element('div', {text: ''});
		function render(year, month) {
			var daysN = getNumberOfDays(year, month);
			var day1 = new Date(year, month, 1);
			var wDay1 = day1.getDay()-1; if( wDay1<0 ) wDay1 = 6;
			panel.empty();
			var table = new Element('table', {});
			var tbody = new Element('tbody', {});
			var tr = new Element('tr', {});
			weekDaysShort.each(function(v){
				var th = new Element('th', {class: 'wday', text: v});
				tr.adopt(th);
			});
			tbody.adopt(tr);

			var dayCnt = 0 - wDay1;
			do {
				var tr = new Element('tr', {});
				for( var wDay = 0; wDay < 7; wDay++ ) {
					dayCnt++;
					//var td = new Element('td', {class: 'day', text: (dayCnt > 0 && dayCnt <= daysN) ? dayCnt : ''});
					var td = new Element('td', {class: 'day', ttext: (dayCnt > 0 && dayCnt <= daysN) ? dayCnt : ''});
					var validDay = dayCnt > 0 && dayCnt <= daysN;
					(function( day ) {
						var a = new Element('a', {text: validDay ? day : '', href: '#', events: {
							click: function() {
							//	alert( dayCnt );
								me.notify('selected', day);
								return false;
							}
						}});
						td.adopt( a );
					}( dayCnt ));
					tr.adopt( td );
				}
				tbody.adopt(tr);
			} while ( dayCnt < daysN );

			table.adopt(tbody);
			panel.adopt(table);
		}
		var me = {
			render: render,
			panel: panel
		};
		Mixin.implement(me, Mixin.Observable);
		return me;
	}());
	function renderDays() {
		days_elem.render(year_elem.get('value'), month_elem.get('value'));
	}
	function format2(m) {
		return m>9 ? m : '0'+m;
	}
	year_elem.addEvents({'change': function() {
		renderDays();
	}});
	month_elem.addEvents({'change': function() {
		renderDays();
	}});
	days_elem.render(2012, 9);
	days_elem.attach('selected', function(day) {
	//	var year = year_elem.getSelected().get("value");
		var year = year_elem.get("value");
	//	var month = month_elem.getSelected().get("value");
	//	var month = parseInt( month_elem.get("value") );
		var month = month_elem.get("value");
	//	var date = new Date(year, month, day);
	//	var date_s = date.toISOString().split('T')[0];
	//	var date_s = date.format('Y-m-d');
		var date_s = '' + year + '-' + format2( 1+parseInt(month) ) + '-' + format2( day );
		field.set('value', date_s);
	//	alert( date_s );
	//	alert( year );
	//	alert( month );
	//	alert( day );
		hide();
		//me.init(user.id, conf.id);
	});
	form.adopt(
		year_elem,
		month_elem,
		days_elem.panel
	);

	var me = {
	};
	return me;
};

