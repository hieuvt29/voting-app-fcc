'use strict';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');


module.exports = function(passport) {
    //session configure
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    //Strategy config
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
    }, function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'facebook.id': profile.id }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.username = profile.username;
                    newUser.facebook.displayName = profile.displayName;
                    newUser.polls= [];

                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
}
