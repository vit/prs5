
var DateInput = function(args) {
	var field = args.field;
//	var cont = new Element('div', {class: 'dateinput'});
	var form = new Element('form', {class: 'dateinput', events: {submit: function() {
		alert('submit');
		return false;
	}}});
	var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
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
	$(document).addEvent('click', function( e ) {
		if( e.target != field )
			if( ! form.contains( e.target ) )
 	 			form.addClass('hidden');
	});

	var year_elem = new Element('select', {class: 'year'});
	for(var y = 2000; y<2013; y++) {
		year_elem.adopt( new Element('option', {text: y}) );
	}
	var month_elem = new Element('select', {class: 'month'});
	for(var m = 0; m<12; m++) {
		month_elem.adopt( new Element('option', {text: months[m]}) );
	}
	var days_elem = new Element('div', {});
	form.adopt(
		year_elem,
		month_elem,
		days_elem
	);

	var me = {
	};
	return me;
};

