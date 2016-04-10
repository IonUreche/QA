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
}

/**
 * Create a Vote
 */
exports.create = function (req, res) {
    var userId = req.body.user._id;
    var answerId = req.body.answer._id;
    var isUpVote = req.body.isUpVote;

    User.findById(userId, function (err, user) {
        Answer.findById(answerId, function (err, answer) {
            Vote.find({answer: answer, user: user}, function (err, votes) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else if (votes.length == 0) {
                    var vote = Vote({answer: answer, user: user, isUpVote: isUpVote});
                    vote.save(errHand);

                    if (isUpVote)
                        answer.voteCount++;
                    else {
                        answer.voteCount--;
                    }

                    answer.save(errHand);
                } else {
                    vote = votes[0];
                    if (vote.isUpVote == isUpVote)
                        return res.status(200).send({answer: answer});
                    else if (isUpVote) {
                        vote.remove();
                        answer.voteCount += 1;
                    } else {
                        vote.remove();
                        answer.voteCount -= 1;
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
    });
};
