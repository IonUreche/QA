(function () {
  'use strict';

  angular
    .module('questions.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('questions', {
        abstract: true,
        url: '/questions',
        template: '<ui-view/>'
      })
      .state('questions.list', {
        url: '',
        templateUrl: 'modules/questions/client/views/list-questions.client.view.html',
        controller: 'QuestionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Questions List'
        }
      })
      .state('questions.create', {
        url: '/create',
        templateUrl: 'modules/questions/client/views/form-question.client.view.html',
        controller: 'QuestionsController',
        controllerAs: 'vm',
        resolve: {
          answerResolve: function(){},
          questionResolve: newQuestion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Questions Create'
        }
      })
      .state('questions.edit', {
        url: '/:questionId/edit',
        templateUrl: 'modules/questions/client/views/form-question.client.view.html',
        controller: 'QuestionsController',
        controllerAs: 'vm',
        resolve: {
          answerResolve: function(){},
          questionResolve: getQuestion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Question {{ questionResolve.title }}'
        }
      })
      .state('questions.view', {
        url: '/:questionId',
        templateUrl: 'modules/questions/client/views/view-question.client.view.html',
        controller: 'QuestionsController',
        controllerAs: 'vm',
        resolve: {
          answerResolve: newAnswer,
          questionResolve: getQuestion
        },
        data: {
          pageTitle: 'Question {{ questionResolve.title }}'
        }
      });
  }

  getQuestion.$inject = ['$stateParams', 'QuestionsService'];

  function getQuestion($stateParams, QuestionsService) {
    return QuestionsService.get({
      questionId: $stateParams.questionId
    }).$promise;
  }

  getAnswer.$inject = ['$stateParams', 'AnswersService'];

  function getAnswer($stateParams, AnswersService) {
    return AnswersService.get({
      answerId: $stateParams.answerId
    }).$promise;
  }

  newQuestion.$inject = ['QuestionsService'];

  function newQuestion(QuestionsService) {
    return new QuestionsService();
  }

  newAnswer.$inject = ['AnswersService'];

  function newAnswer(AnswersService) {
    return new AnswersService();
  }
}());
