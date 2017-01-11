'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function(app, passport) {

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect("/login");
        }
    }

    var pollHandler = new PollHandler();

    //Route for index page
    app.route('/')
        .get(function(req, res) {
            res.sendFile(path + '/public/index.html');
        });
    app.route('/api/allpolls')
        .get(pollHandler.getAllPolls);

    //Login and logout
    app.route('/login')
        .get(function(req, res) {
            res.sendFile(path + '/public/login.html')
        });

    app.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/');
        });

    //Route for profile page
    app.route('/profile')
        .get(isLoggedIn, function(req, res) {
            res.sendFile(path + '/public/profile.html');
        });

    app.route('/api/user/polls')
        .get(isLoggedIn, pollHandler.getUserPolls);
    app.route('/api/user/info')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.facebook);
		});

    //Route for single page, create and delete poll
    app.route('/single')
        .get(function(req, res) {
            res.sendFile(path + '/public/single.html');
        });
    app.route('/api/poll/:pollId')
        .get(pollHandler.getPoll)
        .delete(isLoggedIn, pollHandler.deletePoll);
    app.route('/api/user/createPoll')
        .post(isLoggedIn, pollHandler.createPoll);
    app.route('/api/vote/:pollId/:voteId')
        .post(isLoggedIn, pollHandler.vote);
    //Create poll page
    app.route('/createPoll')
        .get(function(req, res) {
            res.sendFile(path + '/public/createPoll.html');
        });
    //Authenticate
    app.route('/auth/facebook')
        .get(passport.authenticate('facebook'));
    app.route('/auth/facebook/callback')
        .get(passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/login'
        }));
}
