const SocketIO = require('socket.io');

/*Connection Routes*/
const identify_mockup = "identify mockup";
const identify_web = "identify web";
const identify_ok_mockup = "identify ok mockup";
const identify_ok_web = "identify ok web";

/*Streaming ucontrol*/
const stream_control_web_server_mockup = "stream control";
const stream_video_mockup_server = "stream video mockup server";
const stream_video_server_web = "stream video server web";

/*Responses updates routes*/
const response_updates_web_server = "response web server";
const response_updates_server_mockup = "response server mockup";
const response_updates_mockup_server = "response mockup server";
const response_updates_server_web = "response server web";
const response_ok_mockup_server = "resonse ok mockup server";
const response_ok_server_web = "response ok server web";
const response_ok_web_server = "response ok web server";
const response_ok_server_mockup = "response ok server mockup";

/*Request for updates*/
const request_updates_mockup_server = "request mockup server";
const request_updates_server_web = "request server web";
const request_updates_web_server = "request web mockup";
const request_updates_server_mockup = "request server mockup";



module.exports = (server) => {
	let n_users = 0;

    const io = SocketIO(server, {
    	 cors: {
		    origin: '*',
		  }
    });

    io.on('connection', (socket) => {

    	/*Connection routines*/

    	// Mockup connection
    	socket.on(identify_mockup, (mockupName) => {
			console.log("mockup join: ", mockupName, socket.id);

			let room = mockupName + "-ROOM";
			socket.mockupName = mockupName;
			socket.roomID = room;
			io.to(socket.id).emit(identify_ok_mockup);
			socket.join(room);	

			if(n_users > 0){
				io.to(socket.id).emit(stream_control_web_server_mockup, true);
			}

    	});

        // Web client connection
		socket.on(identify_web,(mockupName)=>{
			n_users++;
			let username = mockupName + "_" + n_users.toString();

			console.log("web client join: ", username, socket.id);

			let room = mockupName + "-ROOM";
			socket.username = username;
			socket.roomID = room;
			socket.join(room);
			io.to(socket.id).emit(identify_ok_web);

	    	if(n_users > 0){
	    		io.to(socket.roomID).emit(stream_control_web_server_mockup, true);
	    	}    

		});

		/*Video Streaming*/
		socket.on(stream_video_mockup_server, (frame64) => {
			//console.log("reciving frame... ", n_users);
			socket.to(socket.roomID).emit(stream_video_server_web, frame64);
		});

		/*Responses for updates*/
		socket.on(response_updates_mockup_server, (data) => {
			console.log("mockup saids :", data);
			socket.to(socket.roomID).emit(response_updates_server_web, data);
		});

		socket.on(response_updates_web_server, (data) => {
			console.log("web client says :", data);
			socket.to(socket.roomID).emit(response_updates_server_mockup, data);
		});

		socket.on(response_ok_mockup_server, () => {
			console.log("mockup says ok to server!");
			socket.to(socket.roomID).emit(response_ok_server_web);
		});

		socket.on(response_ok_web_server, () => {
			console.log("web says ok to server!");
			socket.to(socket.roomID).emit(response_ok_server_mockup);
		});

		/*Response for requests*/
		socket.on(request_updates_mockup_server, () => {
			console.log("*mockup request updates");
			socket.to(socket.roomID).emit(request_updates_server_web);
		});

		socket.on(request_updates_web_server, () => {
			console.log("*web request updates");
			socket.to(socket.roomID).emit(request_updates_server_mockup);
		});

		// When a user disconnects
	    socket.on("disconnect", () => {
	    	n_users--;
			// if there are not users, stop streaming	    	
	    	if(n_users < 1){ 
	    		socket.to(socket.roomID).emit(stream_control_web_server_mockup, false);
	    		n_users = 0;
	    	}
		});

    });


};

