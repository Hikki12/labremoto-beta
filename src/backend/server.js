import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../../webpack.config';
const managerIO = require('./mockups/managerIO');
//
const reservationRouter = require('./routes/reservation');
const mockupRouter = require('./routes/mockups');
const videoRouter = require('./routes/videos');
//const SocketIO = require('socket.io');
// Initializing packages
const app = express();

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
