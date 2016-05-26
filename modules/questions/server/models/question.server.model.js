'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    UserSchema = require('../../../users/server/models/user.server.model.js'),
    AnswerSchema = require('./answer.server.model.js'),
    Schema = mongoose.Schema;

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    is_resolved: {
        type: Boolean,
        default: false
    },
    resolving_answer_id: {
        type: String,
        default: ""
    },
    problem_id: {
        type: Number,
        default: ""
    },
    answers: [AnswerSchema],
    user: UserSchema
});

mongoose.model('Question', QuestionSchema);
