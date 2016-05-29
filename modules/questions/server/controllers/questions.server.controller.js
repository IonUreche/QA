'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Question = mongoose.model('Question'),
    User = mongoose.model('User'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an question
 */
exports.create = function (req, res) {
    var question = new Question(req.body);
    question.user = req.user;

    question.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(question);
        }
    });
};

/**
 * Show the current question
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var question = req.question ? req.question.toJSON() : {};

    // Add a custom field to the Question, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Question model.
    question.isCurrentUserOwner = !!(req.user && question.user && question.user._id.toString() === req.user._id.toString());

    res.json(question);
};

/**
 * Update an question
 */
exports.update = function (req, res) {
    var question = req.question;

    question.title = req.body.title;
    question.content = req.body.content;

    question.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(question);
        }
    });
};

exports.resolve = function (req, res) {
    var question = req.question;
    var answerId = req.body.answer._id;
    var userId = req.body.user._id;

    Question.findById(question._id).exec(function (err, question) {
        if (err) {
            return err;
        } else if (!question) {
            return res.status(404).send({
                message: 'No question with that identifier has been found'
            });
        }

        question.is_resolved = true;
        question.resolving_answer_id = answerId;
        question.save();
    });

    User.findById(userId, function (err, user) {
        if (err) {
            return err;
        } else if (!user) {
            return res.send({
                message: 'No user with that identifier has been found'
            });
        }

        user.score += 100;
        user.save();
    });

    res.json(question);
 };

exports.reopen = function (req, res) {
    var question = req.question;
    var userId = req.body.user._id;

    Question.findById(question._id).exec(function (err, question) {
        if (err) {
            return err;
        } else if (!question) {
            return res.status(404).send({
                message: 'No question with that identifier has been found'
            });
        }

        question.is_resolved = false;
        question.resolving_answer_id = '';
        question.save();
    });

    User.findById(userId, function (err, user) {
        if (err) {
            return err;
        } else if (!user) {
            return res.send({
                message: 'No user with that identifier has been found'
            });
        }

        user.score -= 100;
        user.score = Math.max(0, user.score);

        user.save();
    });

    res.json(question);
};

/**
 * Delete an question
 */
exports.delete = function (req, res) {
    var question = req.question;

    question.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(question);
        }
    });
};

/**
 * List of Questions
 */
exports.list = function (req, res) {
    Question.find().sort('-created_at').exec(function (err, questions) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(questions);
        }
    });
};

/**
 * Question middleware
 */
exports.questionByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Question is invalid'
        });
    }

    Question.findById(id).exec(function (err, question) {
        if (err) {
            return next(err);
        } else if (!question) {
            return res.status(404).send({
                message: 'No question with that identifier has been found'
            });
        }
        var qu = question.toObject();

        qu.answers.sort(function (a, b) {
            return new Date(b.created_at) - new Date(a.created_at);
        });

        req.question = Question(qu);

        next();
    });
};
