'use strict';
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models');

app.use(express.json());

//GET REQUESTS /posts or /posts/:id
//need to return JSON
//looking like
// {
// 	"title": "some title",
// 	"content": "WORDS",
// 	"author": "some person",
// 	"created": "123321534"
// }
app.get("./posts", (req, res) => {});

app.get("./posts/:id", (req, res) => {});

//POST REQUESTS /posts
//need to take a json
//if one field is missing return 400
//looking like
// {
// 	"title": "some title",
// 	"content": "dsfjkgjslkdjf",
// 	"author": {
// 		"firstName": "Sarah",
// 		"lastName": "Clarke"
// 	}
// }
//should return the same way the GET requests look
app.post("./posts", (req, res) => {});

//PUT REQUESTS /posts/:id
//needs to take a json
//has to have id in body and the url path
//if they don't match return 400
//should return updated object and 200 code
app.put("./posts/:id", (req, res) => {});

//DELETE REQUESTS /posts/:id
//allows you to delete with a given id
//responds 204
app.delete("./posts/:id", (req, res) => {});