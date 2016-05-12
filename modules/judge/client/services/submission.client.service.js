(function () {
    'use strict';

    angular
        .module('judge.services')
        .factory('SubmissionService', SubmissionService);

    SubmissionService.$inject = ['$resource'];

    function SubmissionService($resource) {
        return $resource('api/submissions/details/:submissionId', {
            submissionId: '@_id'
        });
    }
})();
