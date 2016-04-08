(function () {
  'use strict';

  angular
  .module('core')
  .controller('HomeController', HomeController)
  .controller('HomeTestController', ['$scope', function HomeTestController($scope) {
    $scope.posts = [
      'post 1',
      'post 2',
      'post 3',
      'post 4',
      'post 5'
    ];
  }]);

  function HomeController() {
    var vm = this;
  }
}());
