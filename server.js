'use strict';
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models');

//GET REQUESTS /posts or /posts/:id
//need to return JSON
//looking like
// {
// 	"title": "some title",
// 	"content": "WORDS",
// 	"author": "some person",
// 	"created": "123321534"
// }

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

//PUT REQUESTS /posts/:id
//needs to take a json
//has to have id in body and the url path
//if they don't match return 400
//should return updated object and 200 code

//DELETE REQUESTS /posts/:id
//allows you to delete with a given id
//responds 204