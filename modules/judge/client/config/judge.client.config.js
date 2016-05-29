(function () {
  'use strict';

  angular
    .module('judge')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Quests',
      state: 'problems',
      type: 'dropdown',
      roles: ['*']
    });

    Menus.addMenuItem('topbar', {
      title: 'Achievements',
      state: 'submissions.list',
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'problems', {
      title: 'Select Quests',
      state: 'problems.list',
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'problems', {
      title: 'Create New Quest',
      state: 'problems.create',
      roles: ['user'],
      requiredScore: 200
    });
  }
})();
