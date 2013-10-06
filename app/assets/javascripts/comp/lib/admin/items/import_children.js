
function ImportChildrenCtrl($scope, $http, $element, $window) {

	var rpc = function(method, params, callback) {
		var path = $scope.items_path+'/rpc';
		$http.post(path, {method: method, params: params}).success(function(answer){
			callback(answer);
		});
	};
	var loadPapers = function(id){
	//	console.log(id);
		rpc('get_papers_list', {id:id}, function(answer) {
			$scope.papers = answer.result;
			//$scope.files = [];
	//		$scope.confs = answer.result;
	//		console.log(answer);
		});
	};

	$scope.load = function(){
		rpc('get_conferences_list', {}, function(answer) {
			//$scope.files = [];
			$scope.confs = answer.result;
			answer.result.forEach(function(f) {
	//			console.log(f);
		//		$scope.files[ f['_meta']['type'] ] = $scope.files[ f['_meta']['type'] ] || {};
		//		$scope.files[ f['_meta']['type'] ][ f['_meta']['lang'] ] = true;
			});
		});
	};
	$scope.confClick = function(id){
		$scope.conf_id = id;
		loadPapers(id);
	};
	$scope.importSelected = function(){
//		console.log(jQuery.map($scope.papers, function(p) {
//			return p.selected;
//		}));
		var lst = jQuery.grep($scope.papers, function(p) {
			return p.selected;
		});
//		console.log( lst );
		var lst2= jQuery.map(lst, function(elm){
			return elm._id;
		});
	//	console.log( lst2 );
		rpc('import_children_from_conference', {id:$scope.id, conf_id: $scope.conf_id, papers: lst2}, function(answer) {
//			console.log(answer);
			$window.location.href = $window.location.href;
		});
	};
	$scope.showHide = function() {
		$scope.visible = !$scope.visible;
	};

	$scope.selectAllChange = function(flag) {
		angular.forEach($scope.papers, function(p) {
			p.selected = flag<0 ? !p.selected : !!flag;
		});
	};

}


