'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Problem schema
 */

var ProblemSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    content: {
        type: String,
        default: '',
        trim: true,
        required: 'Content cannot be blank'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    input: {
        type: String,
        default: '',
        trim: true,
        required: 'Input cannot be blank'
    },
    output: {
        type: String,
        default: '',
        trim: true,
        required: 'Output cannot be blank'
    },
    timeLimit: {
        type: Number,
        min: 0,
        max: 30000,
        default: 1000
    },
    memoryLimit:{
        type: Number,
        min: 1,
        max: 128,
        default: 64
    },
    examples: [{
        output : {
            type: String,
            trim: true
        },
        input : {
            type: String,
            trim: true
        }}
    ],
    tests: [{
        output : {
            type: String,
            trim: true
        },
        input : {
            type: String,
            trim: true
        }}
    ]
});

var SubmissionSchema = new Schema({
    submitted: {
        type: Date,
        default: Date.now
    },
    language: {
        type: String,
        trim: true,
        required: 'Language cannot be blank'
    },
    submission: {
        type: String,
        default: '',
        trim: true,
        required: 'Submission data cannot be blank'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    results: [{
        status: {
            type: String,
            trim: true
        },
        executionTime: {
            type: Number
        },
        test: {
            type: Number
        }
    }],
    evaluationStatus: {
        type: String,
        trim: true,
        default: 'pending'
    },
    problem: {
        type: Schema.ObjectId,
        ref: 'Problem'
    }
});

mongoose.model('Problem', ProblemSchema);
mongoose.model('Submission', SubmissionSchema);
