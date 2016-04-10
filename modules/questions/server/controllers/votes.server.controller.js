'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    User = mongoose.model('User'),
    Answer = mongoose.model('Answer'),
    Question = mongoose.model('Question'),
    Vote = mongoose.model('Vote'),
    _ = require('lodash');

/**
 * Create a Vote
 */
exports.create = function (req, res) {
    var user = req.body.user;
    var answer = req.body.answer;

    User.findById(user._id, function (err, user) {
        Answer.findById(answer._id, function (err, answer) {
            Vote.find({answer: answer, user: user}, function (err, votes) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else if (votes.length == 0) {
                    var vote = Vote({answer: answer, user: user});
                    vote.save();
                    answer.voteCount++;
                    console.log('answer', answer);
                    answer.save();

                    Question.update(
                        {'answers._id': answer._id},
                        {
                            '$set': {
                                'answers.$.voteCount': answer.voteCount
                            }
                        },
                        function (err, question) {
                            console.log(question);
                            if (err) {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            }
                        }
                    );

                    return res.status(200).send({answer: answer});
                }
            })
        });
    });
};
