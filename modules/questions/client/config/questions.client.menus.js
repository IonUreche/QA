(function () {
  'use strict';

  angular
    .module('questions')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Training Arena',
      state: 'questions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'questions', {
      title: 'Show Questions',
      state: 'questions.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'questions', {
      title: 'Add Question',
      state: 'questions.create',
      roles: ['user']
    });

    menuService.addMenuItem('topbar', {
      title: 'Rankings',
      state: 'Rankings'
    });
  }
}());
