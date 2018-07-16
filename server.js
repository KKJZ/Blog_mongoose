'use strict';
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models');

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
		res.status(500).json({error: "Something didn't work"})
	})
});

app.get('/posts/:id', (req, res) => {});

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
app.post('/posts', (req, res) => {});

//PUT REQUESTS /posts/:id
//needs to take a json
//has to have id in body and the url path
//if they don't match return 400
//should return updated object and 200 code
app.put('/posts/:id', (req, res) => {});

//DELETE REQUESTS /posts/:id
//allows you to delete with a given id
//responds 204
app.delete('/posts/:id', (req, res) => {});

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