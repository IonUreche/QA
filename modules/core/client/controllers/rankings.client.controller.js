(function () {
	'use strict';

	angular
		.module('core')
		.controller('RankingsController', RankingsController);

	RankingsController.$inject = ['$scope', '$state', '$http'];

	var RatingTresholds = {R1 : 0, R2 : 100, R3 : 200};

	function RankingsController($scope, $state, $http) {
		var vm = this;
		vm.error = null;
		vm.users = [];
		GetUsers(vm, $http);
	}

	function GetUsers(vm, $http){

		$http.get('/api/users',{username: user.username, score: user.score})
		.then(successCallback, errorCallback)

			function successCallback(res) {


				res.data.sort(function (a, b) {
					return a.score == b.score ? (a.username.toLowerCase()) > (b.username.toLowerCase()) : a.score < b.score;
				});

				for (var i = 0; i < res.data.length; ++i)
				{
					res.data[i].RatingStyle = GetStyle(res.data[i].score);
					res.data[i].index = i + 1;
				}

				vm.users = res.data;
			}

			function errorCallback(res) {
				vm.users = [];
			}
	}

	function GetStyle(score)
	{
		var color = "grey";

		if(score >= RatingTresholds.R3) color = 'red'; else
		if(score >= RatingTresholds.R2) color = 'deepskyblue'; else
		if(score >= RatingTresholds.R1) color = 'green';

		return "{\'float\': \'left\', \'color\' : \'" + color + "\'}"
	}

}());