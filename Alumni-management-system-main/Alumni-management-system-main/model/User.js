const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
    fullname: {
		type: String
	},
	username: {
		type: String
	},
	password: {
		type: String
	},
    Joining_Year:{
        type: Number
    },
    Pass_Out_Year:{
        type: Number
    },
    Phone_Number:{
        type: Number
    },
    Job:{
        type: String
    },
    Company:{
        type: String
    },
    Further_Studies:{
        type: String
    }
})
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User)
