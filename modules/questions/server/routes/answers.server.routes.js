'use strict';

module.exports = function(app) {
    var answers = require('../controllers/answers.server.controller.js');

    app.route('/api/answers')
        .get(answers.list)
        .post(answers.create);

    app.route('/api/answers/:answer_id')
        .get(answers.read)
        .put(answers.update)
        .delete(answers.delete);

    app.param('answer_id', answers.answersByID);
};
