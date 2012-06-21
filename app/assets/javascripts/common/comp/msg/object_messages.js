
window.addEvent('domready',function() {

	self.Coms = self.Coms || {};
	self.Coms.Comp = self.Coms.Comp || {};
	self.Coms.Comp.ObjectMessages = (function() {
		var constr = function(_cont_id, _paper_id) {
	//		function render(list) {
	//			cont.empty();
	//			if(list) list.each(function(v){ addRow(v); });
	//		}
			function loadData(){
				alert('hgw gefjqwgef uy tfu');
		//		RPC.send('conf.review.get_paper_reviews_ext', [conf.id, paper_id], function(result, error) {
		//			render(result);
		//		});
			}
		//	function init() {
		//		loadData();
		//	}
			var me = {
		//		init: init
			};
			var panel = new Element('div', {
				styles: {
					width: '100px',
					height: '100px'
				}
			});
			me.test = 'qqq';
			me.panel = panel;
			loadData();
			return me;
		}
		return constr;
	}());


});

