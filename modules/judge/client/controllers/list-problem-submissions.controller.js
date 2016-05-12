(function () {
'use strict';

    angular
        .module('judge')
        .controller('JudgeProblemSubmissionListController', JudgeProblemSubmissionListController);

    JudgeProblemSubmissionListController.$inject = ['$http', 'problemResolve'];

    function JudgeProblemSubmissionListController($http, problem) {
        var vm = this;
        $http({
            method: 'GET',
            url: '/api/submissions/' + problem._id
        }).then(function successCallback(res) {
            vm.submission = res.data;
        }, function errorCallback(res) {
            vm.error = res.data.message;
        });
    }
})();
