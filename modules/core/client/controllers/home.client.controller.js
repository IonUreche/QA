(function () {
  'use strict';

  angular
  .module('core')
  .controller('HomeController', HomeController)
  .controller('HomeTestController', ['$scope', 'Authentication', function HomeTestController($scope) {
    $scope.posts = [
      'post 1',
      'post 2',
      'post 3',
      'post 4',
      'post 5'
    ];
  }]);

  HomeController.$inject = ['$scope', '$state', 'Authentication', '$http'];

  function HomeController($scope, $state, Authentication, $http) {
    var vm = this;
    vm.authentication = Authentication;

  }
}());
