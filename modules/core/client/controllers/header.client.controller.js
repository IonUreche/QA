(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService'];

  var RatingTresholds = {R1 : 0, R2 : 200, R3 : 500};

  function HeaderController($scope, $state, Authentication, menuService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.CanView = CanView

    vm.RatingStyle = GetRatingStyle;
    vm.badgeImageURL = GetBadgeByRating;
    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    /**
     * @return {string}
     */
    function GetBadgeByRating()
    {
      var rating = parseInt(Authentication.user.score);
      var iconUrl = "modules/users/client/img/badges/badge";
      var imageIndex="1";

      if(rating >= RatingTresholds.R3) imageIndex = "3"; else
      if(rating >= RatingTresholds.R2) imageIndex = "2";

      return iconUrl + imageIndex + ".png";
    }

    function GetRatingStyle()
    {
      var rating = parseInt(Authentication.user.score);
      var ccolor = 'grey';

      if(rating >= RatingTresholds.R3) ccolor = 'red'; else
      if(rating >= RatingTresholds.R2) ccolor = 'deepskyblue'; else
      if(rating >= RatingTresholds.R1)  ccolor = 'green';

      return {'color': ccolor};
    }

    function CanView(item) {
      if(item.requiredScore === null) return false;
      if(item.title === "Create New Quest" && vm.authentication.user.score < RatingTresholds.R3) return false;
      if(item.title === "Chat" && vm.authentication.user.score < RatingTresholds.R2) return false;
      return true;
    }
  }
}());
