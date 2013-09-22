
function ItemFormCtrl($scope, $http, $window) {
	$scope.init = function() {
	}
	$scope.load = function() {
		if($scope.id) {
			var path = $scope.items_path+'/'+$scope.id+'.json';
		//	console.log(path);
			$http.get(path).success(function(answer){
		//		console.log(answer);
				$scope.data = answer;
			});
		}
	}
	$scope.submit = function() {
	//	console.log($scope);
		if($scope.id) {
		//	var path = $scope.items_path+'/'+$scope.id+'.json';
			var path = $scope.items_path+'/'+$scope.id+'/save';
		//	console.log(path);
			$http.post(path, $scope.data).success(function(answer){
				alert('The form was saved, I hope...');
		//		console.log(answer);
			//	$scope.data = answer;
			});
		} else {
			var path = $scope.items_path+'/add';
		//	console.log(path);
			$http.post(path, {parent: $scope.parent, data: $scope.data}).success(function(answer){
//			$http.post(path, $scope.data).success(function(answer){
				alert('The form was saved, I hope...');
			//	console.log(answer);
				if(answer.id) {
					var edit_path = $scope.items_path+'/'+answer.id+'/edit';
//					$location.path(edit_path);
					$window.location.href = edit_path;
				}
			//	$scope.data = answer;
			});
		}
	}
	$scope.removeAuthor = function(i) {
		if( confirm('Are you sure?') )
			$scope.data.authors.splice(i, 1);
	}
	$scope.moveAuthor = function(i, d) {
		var j = i+d;
		if(i>=0 && j>=0 && i<=$scope.data.authors.length && j<=$scope.data.authors.length) {
			var tmp = $scope.data.authors[i];
			$scope.data.authors[i] = $scope.data.authors[j];
			$scope.data.authors[j] = tmp;
		//	console.log($scope.data.authors);
		}
	}
	$scope.addAuthor = function(i) {
		if( ! $scope.data ) $scope.data = {};
		if( ! $scope.data.authors ) $scope.data.authors = [];
		$scope.data.authors.splice(i+1, 0,
			{}
		);
	}

	/*
		$scope.data={
			text: {
				title: {en: '', ru: ''},
				abstract: {en: '', ru: ''}
			},
			authors: [
				{fname: {en: '', ru: ''}, lname: {en: '', ru: ''}},
				{fname: {en: '', ru: ''}, lname: {en: '', ru: ''}}
			]
		}
		*/
}

