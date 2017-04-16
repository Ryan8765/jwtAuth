// Main starting point of the application
const express    = require('express');
const http       = require('http');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');


/*
	Database setup
 */
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:auth/auth');

//create instance of express
const app = express();


/*
	App setup - get express working.  
 */
//setup middleware.  All incoming requests will be passed to morgan and bodyParser.  Morgan is a logging framework used for debugging.  Bodyparser will parse incoming requests into JSON.  Note, with its current setup it iwll parse all incoming requests.
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));

//initialize routes from ./router.js file
router(app);


/*
	Server Setup
 */
const port = process.env.PORT || 3090;
//create a server that knows how to receive requests and send it ot app. 
const server = http.createServer(app);
server.listen(port);

console.log( 'Server listening on:', port );



