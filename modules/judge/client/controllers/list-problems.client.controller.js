(function () {
  'use strict';

  angular
    .module('judge')
    .controller('JudgeListController', JudgeListController);

  JudgeListController.$inject = ['JudgeService'];

  function JudgeListController(JudgeService) {
    var vm = this;

    vm.problems = JudgeService.query();
  }
})();
