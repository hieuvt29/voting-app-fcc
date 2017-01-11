'use strict';
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var bodyParser = require('body-parser');

var routes = require('./app/routes/index.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

//Load the secret infomations
require('dotenv').load();

//connect the database
mongoose.connect(process.env.MONGO_URI|| 'mongodb://localhost:27017/votingapp' );
mongoose.Promise = global.Promise; //??

//config path to use shortcut in views part
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));
//config the passport 
require('./app/config/passport')(passport);

//config the session for passport
app.use(session({
	secret: 'secretVotingApp',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

//listen for clients
var port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log('Server is listening on port : ' + port);
})