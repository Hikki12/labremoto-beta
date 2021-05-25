const { set } = require('mongoose');
const SocketIO = require('socket.io');


/* VARIABLES NAME FORMAT
action_from_to
*/

/*Connection Routes*/
const identify_mockup = "identify mockup";
const identify_web = "identify web";
const identify_ok_mockup = "identify ok mockup";
const identify_ok_web = "identify ok web";

const give_control = "give control";

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
	let vars = null;
	let users = {};
	let mockups = {};

    const io = SocketIO(server, {
    	 cors: {
		    origin: '*',
		  }
    });

    io.on('connection', (socket) => {

    	/*Connection routines*/
		
    	// Mockup connection
    	socket.on(identify_mockup, (mockupName) => {
			//console.log("mockup join: ", mockupName, socket.id);
			mockups[socket.id] = socket;
			let room = mockupName + "-ROOM";
			socket.mockupName = mockupName;
			socket.roomID = room;
			io.to(socket.id).emit(identify_ok_mockup);
			socket.join(room);	

			socket.isUser = false;

			if(n_users > 0){
				io.to(socket.id).emit(stream_control_web_server_mockup, true);
			}
			console.log("------- Connection Event -------");
			console.log("Users: ", Object.keys(users));
			console.log("Mockups: ", Object.keys(mockups));

    	});

        // Web client connection
		socket.on(identify_web, (mockupName)=>{
			socket.isUser = true;

			io.to(socket.id).emit(identify_ok_web);
			n_users++;
			//
			if(n_users < 2){
				socket.master = true;
			}
			else {
				socket.master = false;
			}


			let username = mockupName + "_" + n_users.toString();

			//console.log("web client join: ", username, socket.id, "Is master?: ", socket.master);

			let room = mockupName + "-ROOM";
			socket.username = username;
			socket.roomID = room;
			socket.join(room);

			let control = {
				"viewers": n_users,
				"isMaster": socket.master
			}

			io.to(socket.id).emit(give_control, control);

			users[socket.id] = socket;	
			console.log("------- Connection Event -------");
			console.log("Users: ", Object.keys(users));
			console.log("Mockups: ", Object.keys(mockups));
			
	    	if(n_users > 0){
	    		socket.to(room).emit(stream_control_web_server_mockup, true);
	    	}    

		});

		/*Video Streaming*/
		socket.on(stream_video_mockup_server, (frame64) => {
			//console.log("reciving frame... ");
			socket.to(socket.roomID).emit(stream_video_server_web, frame64);
		});

		/*Responses for updates*/
		socket.on(response_updates_mockup_server, (data) => {
			console.log("mockup says :", data);
			socket.to(socket.roomID).emit(response_updates_server_web, data);
		});

		socket.on(response_updates_web_server, (data) => {
			if(socket.master){
				vars = data;
				console.log("I'm the master : ", vars);
				socket.to(socket.roomID).emit(response_updates_server_mockup, data);
				socket.to(socket.roomID).emit(response_updates_server_web, data);
			}else{
				
				if(vars){
					vars["PlayState"] = data["PlayState"];
					vars["LightState"] = data["LightState"]
					console.log("I'm the viewer!", vars);
					socket.to(socket.roomID).emit(response_updates_server_mockup, vars);
					socket.to(socket.roomID).emit(response_updates_server_web, vars);	
				}			
			}
			// socket.to(socket.roomID).emit(response_updates_server_mockup, data);
			// socket.to(socket.roomID).emit(response_updates_server_web, data);

			
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
	    	if(socket.isUser){
	    		n_users--;	    		
	    	}

			delete mockups[socket.id];
			delete users[socket.id];
			let keys = Object.keys(users);
			console.log("------ Disconnection Event --------");
			console.log("Users: ", keys);
			console.log("Mockups: ", Object.keys(mockups))
			if(n_users==1){

				if(keys.length > 0){
					let masterid = keys[0];
					users[masterid].master = true;
					let control = {
						"viewers": n_users,
						"isMaster": true
					}
					io.to(masterid).emit(give_control, control);
				}
			}
			// if there are not users, stop streaming	    	
	    	if(n_users < 1){ 
	    		socket.to(socket.roomID).emit(stream_control_web_server_mockup, false);
	    		socket.to(socket.roomID).emit(stop_server_mockup);
	    		n_users = 0;
				vars = null;
	    	}
		});

    });


};

