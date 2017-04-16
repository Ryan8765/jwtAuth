const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

//create a middleware ofr passport.  By default, passport wants to create a regular cookie session, we pass session "false" because we don't want that to happen as we're using tokens. 
const requireAuth = passport.authenticate('jwt', {session: false});

const requireSignin = passport.authenticate('local', {session: false});


module.exports = function(app) {

	app.get('/', requireAuth, function(req,res) {
		res.send({hi: 'there'});
	});

	app.post('/signin',requireSignin, Authentication.signin);

	app.post('/signup', Authentication.signup);

};