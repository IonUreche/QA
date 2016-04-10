'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	UserSchema = require('../../../users/server/models/user.server.model.js'),
	AnswerSchema = require('./answer.server.model.js'),
	Schema = mongoose.Schema;

/**
 * Vote Schema
 */
var VoteSchema = new Schema({
	id: Schema.ObjectId,
    isUpVote: Boolean,
	answer: AnswerSchema,
	user: UserSchema
});

mongoose.model('Vote', VoteSchema);
