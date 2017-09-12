(function(){

	//app script
	'use strict';

	angular.module('scoresearch', [])
		.constant('DBOXK', 'Bearer FZmyw-CVNWAAAAAAAAABL5F447VITXGGxzJLcxdXVy0XrngiTxsRHml_RbekNCrK')
		.factory('searchService', searchServiceImpl)
		.controller('mainCtrl', mainCtrlImpl);

	function searchServiceImpl($http, DBOXK){
		//api
		return {
			getResults: getResults,
			downloadResult: downloadResult
		}

		//private methods
		function getResults(query){
			var req = {
				method: 'POST',
				url: 'https://api.dropboxapi.com/2/files/search',
				headers: {
					'Authorization': DBOXK,
					'Content-Type': 'application/json'
				},
				data: {
					'query': query,
					'path': ''
				}
			}
			return $http(req);
		}

		function downloadResult(id){
			var req = {
				method: 'POST',
				url: 'https://content.dropboxapi.com/2/files/download',
				responseType: 'blob',
				headers: {
					'Authorization': DBOXK,
					'Dropbox-API-Arg': http_header_safe_json({'path': id})
				}
			}
			return $http(req);
		}

		var charsToEncode = /[\u007f-\uffff]/g;
		function http_header_safe_json(v) {
			return JSON.stringify(v).replace(charsToEncode, function(c) {
				return '\\u'+('000'+c.charCodeAt(0).toString(16)).slice(-4);
			});
		}
	}

	function mainCtrlImpl($scope, searchService){

		$scope.searchResults = [];

		$scope.search = function(){
			$scope.searchResults = [];
			var qry = $scope.searchquery;
			searchService.getResults(qry).then(function(success){

				//console.log(success.data);
				var results = success.data;
				if(results.matches.length == 0){
					$scope.noResults = true;
				}else{
					$scope.noResults = false;
					results.matches.forEach(function(match){
						$scope.searchResults.push(match);
					});
				}
			}, function(error){
				console.log("It was so close!");
			});
		}

		$scope.downloadScore = function(matchData){
			console.log("Downloading " + matchData.id);
			searchService.downloadResult(matchData.id).then(function(success){
				console.log("Holy fucking shit this is magic!");
				var file = new Blob([success.data], {type: 'application/binary'});
				saveAs(file, matchData.name);
				//var fileUrl = URL.createObjectURL(file);
				//window.open(fileUrl);
			}, function(error){
				console.log("We had a good run, Morty!");
				console.log(error);
			});
		}
	}

})();