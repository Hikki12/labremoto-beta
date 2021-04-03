const SocketIO = require('socket.io');



//Routes for socketIO 
const streaming_route = "stream video";
const identify_route = "identify maqueta";
const connection_user_route = "new user";
const updates_to_web_route = "updates to web";
const updates_to_maqueta_route = "updates to maqueta";
const request_updates_route = "request updates";
const stream_control = "stream control";
const quiz_route = "quiz route";
const response_route_maqueta = "response to maqueta";
const response_route_web = "response to web";


module.exports = (server) => {
    const activeUsers = new Set();
	const activeMaquetas = new Set();

    const io = SocketIO(server, {
    	 cors: {
		    origin: '*',
		  }
    });

    io.on('connection', (socket) => {
        console.log("Alguien se conectó !");


        // When a User connects 
		socket.on(connection_user_route,(userName, maquetaId)=>{
			let room = maquetaId + "-ROOM";

			socket.userId = userName;
			socket.maquetaId = maquetaId;
			socket.roomID = room;
			activeUsers.add(userName);
			socket.activeUsers = activeUsers;
			socket.join(room);

			// Said to the maqueta there are users to stream video
			socket.to(socket.roomID).emit(stream_control, true);

			// if a new user connects, it requests data to the maqueta, to be updated.
			socket.to(socket.roomID).emit(request_updates_route);
			console.log("Conectado: ", maquetaId);

		});
                
    	// Identify maqueta and create a room for each one
		socket.on(identify_route, (maquetaId) => {
			console.log("JOIN: ", maquetaId)

			let room = maquetaId + "-ROOM";
			socket.maquetaId = maquetaId;
			socket.roomID = room;

			activeMaquetas.add(maquetaId);
			socket.activeMaquetas = activeMaquetas;
			socket.activeUsers = activeUsers;
			// Join to the corresponding maqueta room
			socket.join(room);

			/*
			if a disconnect ocurred the data variables will be lost in the maqueta, for solve that,
			the maqueta will request to the web client an update of the variables.
			*/
			socket.to(socket.roomID).emit(request_updates_route);

	    	if(activeUsers.size > 0){ // if there are not users, stop streaming
	    		socket.to(socket.roomID).emit(stream_control, true);
	    	}

		});
        
		// Stream video coming from the maqueta
		socket.on(streaming_route, (frame64)=>{
			// stream to maqueta's room users
			socket.to(socket.roomID).emit(streaming_route, frame64);
		});

		// Recive updates coming from the maqueta and send they to the web client
		socket.on(updates_to_web_route,(data)=>{
			socket.to(socket.roomID).emit(updates_to_web_route,data);

		});

		// Recive updates coming from the web client and send they to the maqueta
		socket.on(updates_to_maqueta_route, (data) => {
			socket.to(socket.roomID).emit(updates_to_maqueta_route,data);
		});

		// Recive quiz
		socket.on(quiz_route, (quiz) => {
			console.log(quiz);
			ManagerIO.emit('quizRecived', quiz); 
		});

		socket.on(request_updates_route, () => {
			//console.log("requestss ", socket.userId);
			socket.to(socket.roomID).emit(request_updates_route);
		})

		// Response route
		socket.on(response_route_web, () => {
			//console.log("maqueta responsed to web");
			socket.to(socket.roomID).emit(response_route_web);
		});

		socket.on(response_route_maqueta, () => {
			//console.log("web client responsed to maqueta");
			socket.to(socket.roomID).emit(response_route_maqueta);
		});

		// When a user disconnects
	    socket.on("disconnect", () => {
	    	activeUsers.delete(socket.userId);
			// if there are not users, stop streaming	    	
	    	if(activeUsers.size < 1){ 
	    		socket.to(socket.roomID).emit(stream_control, false);
	    	}
		});

    });


};

