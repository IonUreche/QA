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

var errHand = function (err, question) {
    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }
};

function updateUserScore(userId, score) {
    User.findById(userId, function (err, user) {
        if (err) {
            return err;
        } else if (!user) {
            return 'No user with that identifier has been found';
        }

        user.score += score;
        user.score = Math.max(0, user.score);
        user.save();
    });
}

/**
 * Create a Vote
 */
exports.create = function (req, res) {
    var userId = req.body.user._id;
    var answerId = req.body.answer._id;
    var isUpVote = req.body.isUpVote;

    Answer.findById(answerId, function (err, answer) {
        Vote.find({answerId: answerId, userId: userId}, function (err, votes) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else if (votes.length == 0) {
                var vote = Vote({answerId: answerId, userId: userId, isUpVote: isUpVote});
                vote.save(errHand);

                if (isUpVote) {
                    answer.voteCount++;
                    updateUserScore(answer.user._id, 5);
                } else {
                    answer.voteCount--;
                    updateUserScore(answer.user._id, -5);
                }

                answer.save(errHand);
            } else {
                vote = votes[0];
                if (vote.isUpVote == isUpVote)
                    return res.status(200).send({answer: answer});
                else if (isUpVote) {
                    vote.remove();
                    answer.voteCount++;
                    updateUserScore(answer.user._id, 5);
                } else {
                    vote.remove();
                    answer.voteCount--;
                    updateUserScore(answer.user._id, -5);
                }
                answer.save();
            }

            Question.update({'answers._id': answer._id},
                {'$set': {'answers.$.voteCount': answer.voteCount}},
                function (err, question) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                }
            );

            return res.status(200).send({answer: answer});
        })
    });
};
