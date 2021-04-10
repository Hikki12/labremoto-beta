//import express from 'express';
const express = require('express');
const app = express();
// import webpack from 'webpack';
// import webpackDevMiddleware from 'webpack-dev-middleware';
const webpackConfig = require('../../webpack.config.babel');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const managerIO = require('./mockups/managerIO');
//
const reservationRouter = require('./routes/reservation');
const mockupRouter = require('./routes/mockups');
const videoRouter = require('./routes/videos');
//const SocketIO = require('socket.io');
const path = require('path');


const DIST_DIR = path.join(__dirname, './dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW


app.get('/', (req, res) => {
	res.sendFile(HTML_FILE); // EDIT
});

// Set Port
app.set('port', process.env.PORT||3000);

// Set Routes
app.use(reservationRouter);
app.use(mockupRouter);
app.use(videoRouter);

// Middlewares
app.use(webpackDevMiddleware(webpack(webpackConfig)));


// Start server
const server = app.listen(app.get('port'), () => {
	console.log('server on port ', app.get('port'));

}, '0.0.0.0');

// Combine server with SocketIO
managerIO(server);
