
window.addEvent('domready',function() {

	self.Coms = self.Coms || {};
	self.Coms.Util = self.Coms.Util || {};

	/*  */

	self.Coms.Util.Dictionary = (function() {
		return function(data) {
			return function(name) {
				return data[name] ? data[name] : name;
			}
		};
	}());
	self.Coms.Util.LoadDictionary = (function() {
		return function(name, lang, callback) {
			RPC.send('util.get_dict', [name, lang], function(result, error) {
				if(!result) result = {};
				if(callback) callback(new self.Coms.Util.Dictionary(result));
			});
		};
	}());


});

