var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./users');

var pollSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    created: { type: Date, default: Date.now },
    title: { type: String, required: true, unique: true },
    votes: [{
        content: String,
        count: Number
    }],
    votedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});



module.exports = mongoose.model("Poll", pollSchema);
