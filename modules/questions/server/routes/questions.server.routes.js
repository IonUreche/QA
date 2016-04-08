'use strict';

/**
 * Module dependencies
 */
var questionsPolicy = require('../policies/questions.server.policy.js'),
  questions = require('../controllers/questions.server.controller.js');

module.exports = function (app) {
  // Questions collection routes
  app.route('/api/questions').all(questionsPolicy.isAllowed)
    .get(questions.list)
    .post(questions.create);

  // Single question routes
  app.route('/api/questions/:questionId').all(questionsPolicy.isAllowed)
    .get(questions.read)
    .put(questions.update)
    .delete(questions.delete);

  // Finish by binding the question middleware
  app.param('questionId', questions.questionByID);
};
