'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	UserSchema = require('../../../users/server/models/user.server.model.js'),
	Schema = mongoose.Schema;

/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
	id: Schema.ObjectId,
	text: {
		type: String,
		default: '',
		trim: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	user: UserSchema
});

mongoose.model('Answer', AnswerSchema);
