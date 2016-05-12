
(function (app) {
  'use strict';

  app.registerModule('judge');
  app.registerModule('judge.services');
  app.registerModule('judge.routes', ['ui.router', 'judge.services']);
})(ApplicationConfiguration);
