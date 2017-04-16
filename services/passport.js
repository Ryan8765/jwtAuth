const passport      = require('passport');
const User          = require('../models/user');
const config        = require('../config');
const JwtStrategy   = require('passport-jwt').Strategy;
const ExtractJwt    = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//create local strategy.  This is used when a user logs in initially.  It will check the username and password and then pass a token back if there is a successful login.  Where to look in the request for a username/email is passed to this in the localOptions. 
const localOptions = {usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	//Verify username and password, call done with the user if it is the correct username and password
	User.findOne({email: email}, function(err, user) {
		//if an error, return that error
		if(err) {return done(err);}
		//if no user found, return false to passport
		if(!user) { return done(null, false); }

		//compare passwords - is 'password' equal to user.password.  This password is not encrypted yet though.
		user.comparePassword(password, function(err, isMatch) {
			//if error, return error
			if(err) {return done(err);}
			//if no match, return false to passport.
			if(!isMatch) {return done(null, false);}

			//if user found, return user.
			return done(null, user);
		});
	});

	//Else call done with false.
});


//Setup optoins for jwt Strategy.  we need to tell the jwt to look to find the jwt.
const jwtOptions = {
	//telling jwt that when a request coming in - needs to look at a headers called authorization for the jwt
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	//where to get the secret for decoding the jwt
	secretOrKey: config.secret
};


//Create JWT Strategy.  Payload is decoded jwt token.  When successfully authenticated - we can call done.
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	//See if the user id in the payload exists in the database
	//if it does call done with that user
	//otherwise call done without a user object

	User.findById(payload.sub, function(err, user) {
		//false means we didn't find a user.
		if(err){return done(err, false);}

		//if we found user, return that user
		if(user) {
			done(null, user);
		//if we didn't find a user and there was no error, return false meaning no user was found. 
		} else {
			done(null, false);
		}
	});
});


//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);