var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Poll  = require('./polls');

var userSchema = new Schema({
    facebook: {
        id: String,
        displayName: String
    },
    polls: [{type: Schema.Types.ObjectId, ref: "Poll"}]

});

module.exports = mongoose.model("User", userSchema);