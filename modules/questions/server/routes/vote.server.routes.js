'use strict';

module.exports = function(app) {
    var votes = require('../controllers/votes.server.controller.js');

    app.route('/api/votes')
        .post(votes.create);
};
