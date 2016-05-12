'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Problem = mongoose.model('Problem');

/**
 * Globals
 */
var user, problem;

/**
 * Unit tests
 */
describe('Problem Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      problem = new Problem({
        title: 'Suma',
        content: 'Suma a doua numere',
        input: 'a b',
        output: 's',
        examples: [{input: '1 2', 'output': '3'}],
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return problem.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      problem.title = '';

      return problem.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Problem.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
