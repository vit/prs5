//window.addEvent('domready',function() {

	Array.prototype.fzip = function(arr) {
		var i, j, len = this.length;
		for( j = 0; j< arguments.length; j++ )
			if( len > arguments[j].length ) len = arguments[j].length
		var acc = [];
		for( i = 0; i< len; i++ ) {
			var row = [ this[i] ];
			for( j = 0; j< arguments.length; j++ ) row.push( arguments[j][i] );
			acc.push( row );
		}
		return acc;
	}

//	Array.prototype.finject = function(acc, fun) {
	Array.prototype.ffold = function(acc, fun) {
		this.each(function(elm){ acc = fun(acc, elm); });
		return acc;
	}
//	Array.prototype.inject = Array.prototype.finject;
//	Array.prototype.ffold = Array.prototype.finject;
/*
	Array.prototype.join = function(delim) {
		return this.finject("", function(acc, elm){
			if(acc.length>0) acc += delim;
			acc += elm;
			return acc;
		});
	}
*/

	FormDataInputs = function( container, inputs ) {
		var lang_list = ['en', 'ru'];
		var me = {
			createElement: function (name, lang, tag, args){
				var type = null;
				var name2 = name;
				if(lang){
					name2 = name+'_'+lang;
					type = 'ml';
				}
				args.name = name2;
				inputs[name] = type;
				return new Element(tag, args);
			},
			clear: function() {
				$H(inputs).each(function(v,k){
					if(v=='ml') {
						lang_list.each(function(lang){
							var e = container.getElement('[name="'+k+'_'+lang+'"]');
							if(e) e.setProperty('value', null);
						});
					} else {
						var e = container.getElement('[name="'+k+'"]');
						if(e) e.setProperty('value', null);
					}
				});
			},
			get: function() {
				var res = {};
				$H(inputs).each(function(v,k){
					res[k] = (v=='ml') ? lang_list.ffold({}, function(acc, lang){
						//acc[lang] = container.getElement('[name="'+k+'_'+lang+'"]').getProperty('value');
						acc[lang] = (function(e){
							return e ? e.getProperty('value') : null
						}( container.getElement('[name="'+k+'_'+lang+'"]') ));
						return acc;
					}) : (function(e){
						return e ? e.getProperty('value') : null
					}( container.getElement('[name="'+k+'"]') ));
				});
				return res;
			},
			set: function( data ) {
				if(data) $H(inputs).each(function(v,k){
					if ( v=='ml' ) lang_list.each(function( lang){
						(function(e) {
							if( e ) e.setProperty('value', data[k] ? data[k][lang] : null );
						}( container.getElement('[name="'+k+'_'+lang+'"]') ));
					}); else {
					//	var cc = '[name="'+k+'"]';
						//alert(cc);
						//container.getElements('[name="country"]').each(function(e){
					//	container.getChildren('[name="country"]').each(function(e){
					//		alert(e.getAttribute('name'));
					//	});
						container.getElement('[name="'+k+'"]').setProperty('value', data[k] );
					}
				});
			},
			mark: function( cls, name, lang ) {
				var t = inputs[name];
				var elm = container.getElement('[name="'+name+
					(t=='ml' ? '_'+lang : '')+
				'"]');
				elm.addClass(cls);
			},
			getElement: function( name, lang ) {
				var t = inputs[name];
				var elm = container.getElement('[name="'+name+
					(t=='ml' ? '_'+lang : '')+
				'"]');
				return elm;
			},
			unmark: function( cls, name, lang ) {
				var t = inputs[name];
				var elm = container.getElement('[name="'+name+
					(t=='ml' ? '_'+lang : '')+
				'"]');
				elm.removeClass(cls);
			},
			unmarkAll: function( cls ) {
				$H(inputs).each(function(v,k){
					if(v=='ml') {
						lang_list.each(function(lang){
							me.unmark(cls, k, lang);
						});
					} else me.unmark(cls, k);
				});
			}
		};
		return me;
	}

	Dict = function(cont){
		return function(word){
			var elm = cont ? cont.getElement('[name="'+word+'"]') : null;
			var res = elm ? elm.getProperty('value') : null;
			return res ? res : word;
		}
	}

	OM = (function(){
		var me = {
			implement: function(target, from) {
			//	for(var name in obj) {
				for(var name in from)
				//	if ( name!='initialize' )
				//		if (obj[name] instanceof Function) target[name] = obj[name];
				//	if( name!='init' && from[name] instanceof Function) target[name] = from[name];
					if(name!='init') target[name] = from[name];
			//	}
			//	if(from.init instanceof Function) from.init.apply(target, []);
				if(from.init) from.init.apply(target, []);
				return target;
			},
			implementMany: function(target) {
				for (var i=1; i<arguments.length; i++)
					me.implement(target, arguments[i]);
			}
		}
		return me;
	})();

	Mixin = OM;
	Mixin.Observable = {
		init: function(){
			this.__events = {};
		},
		attach: function(name, callback){
			if( !this.__events[name] ) this.__events[name] = [];
			this.__events[name].include(callback);
		},
		detach: function(name, callback){
			if( this.__events[name] ) this.__events[name].erase(callback);
		},
		notify: function(name){
			var args = [];
			for(var i=1; i<arguments.length; i++)
				args.push(arguments[i]);
			if( this.__events[name] ) this.__events[name].each(function(callback){
				callback.apply(null, args);
			});
		}
	};
	OM.Events = {
	//	__events: {},
		init: function(){
			this.__events = {};
		},
		addEvent: function(name, callback){
			if( !this.__events[name] ) this.__events[name] = [];
			this.__events[name].include(callback);
		},
		removeEvent: function(name, callback){
			if( this.__events[name] ) this.__events[name].erase(callback);
		},
		fireEvent: function(name){
			var args = [];
			for(var i=1; i<arguments.length; i++)
				args.push(arguments[i]);
			if( this.__events[name] ) this.__events[name].each(function(callback){
				//callback();
				callback.apply(null, args);
			});
		}
	};

/*
	OM.Slots = {
		init: function(){
			this.__slots = {};
		},
		setSlot: function(name, func){
			this.__slots[name] = func;
		},
		setSlots: function(args){
			for(var name in args)
				this.setSlot(name, args[name]);
		},
		callSlot: function(name){
			var func = this.__slots[name];
			if(func) {
				var args = [];
				for (var i=1; i<arguments.length; i++) args.push(arguments[i]);
				return func.apply(this, args);
			}
		}
	};
*/

	OM.Messages = {
		send: function(name){
			var args = [];
			for(var i=1; i<arguments.length; i++)
				args.push(arguments[i]);
			if(this[name] instanceof Function)
				this[name].apply(this, args);
		}
	};

//});


