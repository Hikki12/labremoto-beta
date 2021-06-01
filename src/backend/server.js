//import express from 'express';
const express = require('express');
const app = express();

const managerIO = require('./mockups/managerIO');
const reservationRouter = require('./routes/reservation');
const mockupRouter = require('./routes/mockups');
const videoRouter = require('./routes/videos');
const path = require('path');


const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const webpackConfig = require('../../webpack.config.dev');

//app.use(middleware(webpack(webpackConfig)));
app.set('port', process.env.PORT||3000);  
// var env = require('node-env-file'); // .env file
// console.log("DIR ", __dirname)
// env(path.join(__dirname,"..","..", '.env'));

var env ={
	MODE: "PRODUCTION"
}

// Set Port
const DIST_DIR = path.join(__dirname, "..", 'dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW
console.log("DIST: ", DIST_DIR)

//console.log("Process: ", process.env.MODE)
if (env.MODE === "PRODUCTIONx"){
	console.log("Aquí ")
	app.use(express.static(DIST_DIR));
	app.get('/', (req, res) => {
		res.sendFile(HTML_FILE); // EDIT
	});
	//app.use(express.static(HTML_FILE));
}else{
	console.log("Aquí 2")
	app.use(middleware(webpack(webpackConfig)));
}


// Set Routes
app.use(reservationRouter);
app.use(mockupRouter);
app.use(videoRouter);

// Middlewares



// Start server
const server = app.listen(app.get('port'), () => {
	console.log('server on port ', app.get('port'));

}, '0.0.0.0');

// Combine server with SocketIO
managerIO(server);
