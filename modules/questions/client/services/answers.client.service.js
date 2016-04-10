(function () {
  'use strict';

  angular
    .module('questions.services')
    .factory('AnswersService', AnswersService);

  AnswersService.$inject = ['$resource'];

  function AnswersService($resource) {
    return $resource('api/answers/:answerId', {
      answerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
