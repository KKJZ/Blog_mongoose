'use strict';
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models');

const app = express();
app.use(express.json());
app.use(morgan('common'));

//GET REQUESTS /posts or /posts/:id
//need to return JSON
//looking like
// {
// 	"title": "some title",
// 	"content": "WORDS",
// 	"author": "some person",
// 	"created": "123321534"
// }
app.get('/posts', (req, res) => {
	Blog.find()
	.then(posts => {
		res.json(posts.map(post => post.serialize()));
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: "Internal server error"})
	})
});

app.get('/posts/:id', (req, res) => {
	Blog.find({_id: req.params.id})
	.then(post => res.json(post.serialize()))
	.catch(err => {
		console.log(err);
		res.status(500).json({error: "Internal server error"})
	})
});

//POST REQUESTS /posts
//need to take a json
//if one field is missing return 400
//looking like
// {
// 	"title": "some teitle",
// 	"content": "dsfjkgjslkdjf",
// 	"author": {
// 		"firstName": "Sarah",
// 		"lastName": "Clarke"
// 	}
// }
//should return the same way the GET requests look
app.post('/posts', (req, res) => {
	const requiredFields = ["title", "content", "author"];
	const authorName = ["firstName", "lastName"];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Request body is missing ${field}`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = Blog.create({
		title: req.body.title, 
		content: req.body.content, 
		author: req.body.author
	}).then(post => res.status(201).json(post.serialize()))
	.catch(err => {
		console.log(err)
		res.status(500).json({error: 'Something went wrong'});
	});
});

//PUT REQUESTS /posts/:id
//needs to take a json
//has to have id in body and the url path
//if they don't match return 400
//should return updated object and 200 code
app.put('/posts/:id', (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({error: 'Request path id and request body id values must match'});
	}
	const updated = {};
	const updatedFields = ['title', 'content', 'author'];
	updatedFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});
	Blog.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
	.then(updatedPost => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Something went wrong'}));
});

//DELETE REQUESTS /posts/:id
//allows you to delete with a given id
//responds 204
app.delete('/posts/:id', (req, res) => {
	Blog.findByIdAndRemove(req.params.id)
	.then(() => {
		res.status(204).json({message: "success"});
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: "Something went wrong"});
	});
});

//catch all endpoint
app.use("*", (req, res) => {
	res.status(404).json({message: "Not Found"});
});

let server;

function runServer(databaseURL, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(
			databaseURL,
			err => {
				if (err) {
					return reject(err);
				}
				console.log(`Connected to ${databaseURL}`)
				server = app.listen(
					port, () => {
						console.log(`Your app is listening on port ${port}`);
						resolve();
					})
				.on("error", err => {
					mongoose.disconnect();
					reject(err);
				});
			}
		);
	});
};

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve,reject) => {
			console.log("Closing Server");
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
};

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.log(err));
}

module.exports = {app, runServer, closeServer}