(function () {
  'use strict';

  angular
    .module('judge.services')
    .factory('JudgeService', JudgeService);

  JudgeService.$inject = ['$resource'];

  function JudgeService($resource) {
    return $resource('api/problems/:problemId', {
      problemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
