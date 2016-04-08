(function () {
  'use strict';
  angular
    .module('questions')
    .controller('QuestionsController', QuestionsController);


  QuestionsController.$inject = ['$scope', '$state', 'questionResolve', '$window', 'Authentication'];

  function QuestionsController($scope, $state, question, $window, Authentication) {
    var vm = this;

    vm.question = question;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Question
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.question.$remove($state.go('questions.list'));
      }
    }
    /*
     function remove() {
     if ($window.confirm('Are you sure you want to delete?')) {
     vm.question.$remove($state.go('questions.list'));
     }
     }
     */

    // Save Question
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.questionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.question._id) {
        vm.question.$update(successCallback, errorCallback);
      } else {
        vm.question.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('questions.view', {
          questionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
