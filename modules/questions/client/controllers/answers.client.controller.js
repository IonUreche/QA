(function () {
  'use strict';
  angular
    .module('questions')
    .controller('AnswersController', AnswersController);

  AnswersController.$inject = ['$scope', '$state', 'answerResolve', '$window', 'Authentication'];

  function AnswersController($scope, $state, answer, $window, Authentication) {
    var vm = this;

    vm.answer = answer;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.saveAnswer = saveAnswer;

    // Save Answer
    function saveAnswer(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.answerForm');
        return false;
      }

      console.error(answer);

      if (vm.answer._id) {
        vm.answer.$update(successCallback, errorCallback);
      } else {
        vm.answer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
          $route.reload();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
