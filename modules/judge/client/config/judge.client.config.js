(function () {
  'use strict';

  angular
    .module('judge')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Problems',
      state: 'problems',
      type: 'dropdown',
      roles: ['*']
    });

    Menus.addMenuItem('topbar', {
      title: 'Submissions',
      state: 'submissions.list'
    });


    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'problems', {
      title: 'List Problems',
      state: 'problems.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'problems', {
      title: 'Create Problem',
      state: 'problems.create',
      roles: ['user']
    });
  }
})();
