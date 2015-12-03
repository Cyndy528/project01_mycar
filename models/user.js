var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
	username: String,
	password: String,
	cars:[{type:Schema.Types.ObjectId, ref: 'car'}]
});

var validatePassword = function(password,callback){
	if(password.length < 6){
		return callback({code:422, messaage:'Password must be atleast 6 characters!'});
	}
	return callback(null);
};

UserSchema.plugin(passportLocalMongoose,{
	passwordValidator:validatePassword
});

var User = mongoose.model('User', UserSchema);
module.exports = User;