
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

}

function ItemFilesCtrl($scope, $http, $element) {

	var rpc = function(method, params, callback) {
		var path = $scope.items_path+'/rpc';
		$http.post(path, {method: method, params: params}).success(function(answer){
			callback(answer);
		});
	}

	function loadFilesList() {
		rpc('get_files', {id: $scope.id}, function(answer) {
		//	console.log(answer);
		//	$scope.files = {paper: {en: true, ru: false}};
			$scope.files = [];
			answer.result.forEach(function(f) {
				console.log(f);
				$scope.files[ f['_meta']['type'] ] = $scope.files[ f['_meta']['type'] ] || {};
				$scope.files[ f['_meta']['type'] ][ f['_meta']['lang'] ] = true;
			});
		});
	}

	$scope.init = function() {
		$scope.uploadInProgress = {};
		loadFilesList();
	}

	$scope.submit = function(type, lang) {
	//	console.log(lang);
		var form = jQuery('form[name='+lang+']', $element)[0];
	//	console.log(form);
		formData = new FormData(form);
	//	console.log(formData);
		$scope.uploadInProgress[type+'_'+lang] = true;
		jQuery.ajax({
			url: $scope.items_path+'/'+$scope.id+'/upload',
			type: 'POST',
	//		beforeSend: function(xhr, settings) {
	//			var upload = xhr.upload;
	//			upload.addEventListener('progress', function() {
	//				console.log('progress');
	//			}, false);
	//		},
			success: function(answer) {
		//		console.log(answer);
				loadFilesList();
				$scope.uploadInProgress[type+'_'+lang] = false;
			},
			processData: false,
			contentType: false,
			cache: false,
			data: formData
		});
	};
}


