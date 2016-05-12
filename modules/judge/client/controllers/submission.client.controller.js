(function () {
    'use strict';

    angular
        .module('judge')
        .controller('SubmissionController', SubmissionController);

    SubmissionController.$inject = ['$http', 'submissionResolve'];

    function SubmissionController($http, submission) {
        var vm = this;
        $http({
            method: 'GET',
            url: '/api/submissions/details/' + submission._id
        }).then(function successCallback(res) {
            vm.submission = res.data;
        }, function errorCallback(res) {
            vm.error = res.data.message;
        });
    }
})();
