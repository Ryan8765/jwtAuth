const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
	//first item is what you want to add to encode.  second item is the configuration secret.  jwt uses the "sub" property "subject".  In this case we use the user id for the sub.  "iat" stands for "Issued at time" and it is a way to keep track of when the token was issued. 
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id , iat: timestamp}, config.secret);
}

//handle signin.
exports.signin = function(req, res, next) {
	//user has already had their meial and password auth'd
	//We just need to give them a token.
	//passport automatically attaches the "user" to the req via the done method (check the pasport.js file)
	res.send({token: tokenForUser(req.user)});
};


//signpu is name of the method to be used in router.js
exports.signup = function(req, res, next) {

	const email = req.body.email;
	const password = req.body.password;

	if(!email || !password) {
		return res.status(422).send({error: "You must provide password"});
	}

	//See if a user with the given email exists
	User.findOne({ email: email }, function(err, existingUser) {
		if(err) {
			return next(err);
		}

		//if a user with email exists
		if(existingUser) {
			return res.status(422).send({error: 'Email is in user'});
		}

	});

	//If a user with an email does exist, return an email
	const user = new User({
		email: email,
		password: password
	});

	user.save(function(err) {
		if(err){return next(err);}

		res.json({token: tokenForUser(user)});
	});



}