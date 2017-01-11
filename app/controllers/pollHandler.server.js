'use strict';

var User = require('../models/users.js');
var Poll = require('../models/polls.js');

//Conver String into ObjectId to find by Poll._id in database
String.prototype.toObjectId = function() {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
};


function PollHandler() {

    this.createPoll = function(req, res) {
        User.findOne({ 'facebook.id': req.user.facebook.id }, function(err, user) {
            if (err) {
                throw err;
            }
            var newPoll = new Poll();
            newPoll.creator = user.id;
            newPoll.title = req.body.title;
            for (var i = 0; i < req.body.votes.length; i++) {
                newPoll.votes[i] = {};
                newPoll.votes[i].content = req.body.votes[i];
                newPoll.votes[i].count = 0;

            }
            newPoll.save(function(err) {
                if (err) {
                    throw err;
                }
            });
            user.polls.push(newPoll.id);
            user.save(function(err) {
                if (err)
                    throw err;
            })
            res.redirect("/single?pollId=" + newPoll.id);
        });


    }

    this.deletePoll = function(req, res) {
        //can co pollID
        var pollId = req.params.pollId;
        User.findOne({ 'facebook.id': req.user.facebook.id }, function(err, person) {
            if (err) {
                throw err
            };
            person.polls = person.polls.filter(function(value) {
                
                return value.toString() !== pollId;
            });
            person.save();
        });
        Poll.remove({"_id": pollId.toObjectId()}, function(err, res){
            if(err){
                throw err;
            }
            //return res;
        })
        res.json({ 'message': "deleted poll!" });
    }
    this.getPoll = function(req, res) {
        //Duyet 1 poll khi co pollID
        Poll.findOne({ "_id": req.params.pollId.toObjectId() }, function(err, poll) {
            if (err) throw err;
            res.json(poll);
        });
    }

    this.getUserPolls = function(req, res) {
        //Lay ra tat ca poll ma nguoi dung da tao khi co userID
        var userId = req.user.facebook.id;

        User.findOne({ "facebook.id": userId })
            .populate("polls")
            .exec(function(err, user) {
                if (err) throw err;
                //console.log('user: \n' + user);
                res.json(user.polls); //danh sach cac doi tuong polls
            });

    }
    this.getAllPolls = function(req, res) {
        //Lay ra tat ca cac poll co trong database de show len trang index
        Poll.find({}, function(err, docs) {
            if (err) {
                throw err;
            }
            res.json(docs);
        })
    }

    this.vote = function(req, res) {
        //Can co pollID cua poll dang truy van, voteId cua vote ma nguoi dung vote cho
        var pollId = req.params.pollId.toObjectId();
        var voteId = req.params.voteId.toObjectId();
        var resObj = {};
        Poll.findOne({ "_id": pollId }, function(err, poll) {
            if (err) throw err;
            //Kiem tra xem nguoi dung da vote cho khao sat nay hay chua?
            var voted = false;

            for (var i = 0; i < poll.votedUsers.length; i++) {
                if (req.user.id == poll.votedUsers[i]) {
                    voted = true;
                    break;
                }
            }

            if (!voted) {
                for (var i = 0; i < poll.votes.length; i++) {
                    if (poll.votes[i].id == voteId) {
                        poll.votes[i].count++;
                        poll.votedUsers.push(req.user.id);
                        poll.save(function(err) {
                            if (err)
                                throw err;
                        })
                        break;
                    }
                }
            }

            if(voted){
                resObj = {"changed": false};
            }else{
                resObj = {
                    "changed": true,
                    poll: poll
                }
            }
            res.json(resObj);
        });

    }


}

module.exports = PollHandler;
