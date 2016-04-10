'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    Question = mongoose.model('Question'),
    Answer = mongoose.model('Answer'),
    _ = require('lodash');

/**
 * Create a Answer
 */
exports.create = function(req, res) {
    var answer = new Answer(req.body);
    answer.user = req.user;

    answer.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).json(answer);
        }
    });

    Question.findById(req.body.question_id, function (err, question) {
        question.answers.push(answer);
        question.save();
    });
};

/**answer
 * Show the current Answer
 */
exports.read = function(req, res) {
    var answer = req.answer ? req.answer.toJSON() : {};
    res.json(answer);
};

/**
 * Update a Answer
 */
exports.update = function(req, res) {

};

/**
 * Delete an Answer
 */
exports.delete = function(req, res) {
    var answer = req.answer;

    answer.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(answer);
        }
    });
};

/**
 * List of Answers
 */
exports.list = function(req, res) {
    Answer.find().sort('-created_at').exec(function(err, answers) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(answers);
        }
    });
};

exports.answersByID = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Answer is invalid'
        });
    }

    Answer.findById(id).exec(function (err, answer) {
        if (err) {
            return next(err);
        } else if (!answer) {
            return res.status(404).send({
                message: 'No answer with that identifier has been found'
            });
        }
        req.answer = answer;
        next();
    });
};
