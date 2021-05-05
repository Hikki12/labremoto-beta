const SocketIO = require('socket.io');


/* VARIABLES NAME FORMAT
action_from_to
*/

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


/*Request for quiz*/
const quiz_mockup_server = "quiz mockup server";
const quiz_server_web = "quiz server web";


/*Stop routes*/
const stop_web_server = "stop web server";
const stop_server_mockup = "stop server mockup";
const stop_mockup_server = "stop mockup server";
const stop_server_web = "stop server web";

/*Routes for error*/
const error_mockup_server = "error mockup server"; 


module.exports = (server) => {
	let n_users = 0;
	let masterid = "";

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

			if(n_users == 1){
				socket.master = true;
				masterid = socket.id;
			}
			else {
				socket.master = false;
			}
			let username = mockupName + "_" + n_users.toString();

			console.log("web client join: ", username, socket.id, "Is master?: ", socket.master);

			let room = mockupName + "-ROOM";
			socket.username = username;
			socket.roomID = room;
			socket.join(room);

			let identify_vars = {
				"viewers": n_users,
				"isMaster": socket.master
			}

			io.to(socket.id).emit(identify_ok_web, identify_vars);
			io.to(socket.roomID).emit('n_users', n_users);
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
			if (socket.master){
				socket.to(socket.roomID).emit(response_updates_server_mockup, data);
				socket.to(socket.roomID).emit(response_updates_server_web, data);
			}
			
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

		/*Routes for quizes*/
		socket.on(quiz_mockup_server, (quiz) =>{
			socket.to(socket.roomID).emit(quiz_server_web);
		});

		/*Routes for stop process*/
		socket.on(stop_web_server, () => {
			socket.to(socket.roomID).emit(stop_server_mockup);
		});

		socket.on(stop_mockup_server, () => {
			socket.to(socket.roomID).emit(stop_server_web);
		});

		/*Routes for erros*/
		socket.on(error_mockup_server, (error) => {
			console.log("Mockup notifies an error!");
			console.log(error);
		})

		// When a user disconnects
	    socket.on("disconnect", () => {
	    	n_users--;
			//
			io.to(socket.roomID).emit('n_users', n_users);
			// if there are not users, stop streaming	    	
	    	if(n_users < 1){ 
	    		socket.to(socket.roomID).emit(stream_control_web_server_mockup, false);
	    		socket.to(socket.roomID).emit(stop_server_mockup);
	    		n_users = 0;
	    	}
		});

    });


};

