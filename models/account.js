// var mongoose = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

// var UserSchema = new mongoose.Schema({
//     username: String,
//     password: String
// });

// UserSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", UserSchema);













var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
