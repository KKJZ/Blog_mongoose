"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const blogSchema = mongoose.Schema({
 	title: {type: String, required: true},
 	content: {type: String, required: true},
 	author: {
 		firstName: {type: String, required: true},
 		lastName: {type: String, required: true}
 	},
 	created: {type: Date, default: Date.now}
});

blogSchema.virtual("name").get(function() {
	return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogSchema.methods.serialize = function() {
	return {
		id: this._id,
		title: this.title,
		content: this.content,
		author: this.name,
		created: this.created
	}
};

const Blog = mongoose.model("Blog", blogSchema);

module.exports = {Blog};