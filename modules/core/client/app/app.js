/**
 * Created by ion on 07.04.2016.
 */

angular.module('scopeExample', [])
  .controller('MyController', ['$scope', function($scope) {
    $scope.posts = [
      'post 1',
      'post 2',
      'post 3',
      'post 4',
      'post 5'
    ];
  }]);

