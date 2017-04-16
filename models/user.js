const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


//Define our model
const userSchema = new Schema({
	//email must be unique in the database.  all email strings are also saved in lowercase 
	email: {
		type: String,
		unique: true,
		lowercase: true
	},
	password: String

});

//On Save Hook, encrypt password
//Before saving model, run this function (basically a middleware for mongoose 'pre')
userSchema.pre('save', function(next) {
	//"this" is the user model.  We could reference "user.email" and "user.password" etc.
	const user = this;


	//generate a salt with a little delay and then run callback.
	bcrypt.genSalt(10, function(err,salt) {
		if(err) {
			return next(err);
		}

		//hash our password using the salt.
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if(err) {
				return next(err);
			}

			//overwrite plain text password with encrypted password
			user.password = hash;
			next();
		});
	});
});

//create a method on the userSchema that whenever a user object is created it will have access to.
userSchema.methods.comparePassword = function(candidatePassword, callback) {
	//this.password is the hashed and salted password in DB, whereas candidate password is the password used in the signin process by the user.
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		//if an error, return the error
		if(err) {return callback(err);}


		callback(null, isMatch);
	});
};

// Create model Class 
const ModelClass = mongoose.model('user', userSchema);




//Export hte model
module.exports = ModelClass;