const { set } = require('mongoose');
const { reset } = require('nodemon');
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


setNewMaster = (io, room, rooms) => {
	let keys = Object.keys(rooms[room].users);
	if(keys.length > 0){
		rooms[room].master = keys[0];
		rooms[room].users[keys[0]].isMaster = true;
		rooms[room].users[keys[0]].lastActivity = new Date();
		const n_users = rooms[room].n_users;
		let control = {
			"viewers": n_users,
			"isMaster": true
		}
		io.to(rooms[room].master).emit(give_control, control);
	}else{
		rooms[room].master = "";
	}
}

let rooms = {};
let globalIO = null;
let maxInactivityTime = 20*60000; //ms


checkInactivity = () => {
	let currentRooms = Object.keys(rooms);
	currentRooms.forEach((room) => {
		if(rooms[room]){
			let masterid = rooms[room].master;
			if(masterid){
				let master = rooms[room].users[masterid];
				if(master){
					let lastActivity = master.lastActivity;
					let elapsedTime = new Date() - lastActivity;
					//console.log("masterid: ", masterid, elapsedTime);
					if(elapsedTime >= maxInactivityTime){
						if(globalIO){
							globalIO.to(masterid).emit(stop_server_web);
						}
						master.disconnect(true);
					}
				}

			}
		}
		
	});
}


let checkTimer = setInterval(checkInactivity, 60000);


module.exports = (server) => {

    const io = SocketIO(server, {
    	 cors: {
		    origin: '*',
		  }
    });
	globalIO = io;

    io.on('connection', (socket) => {

    	/*Connection routines*/
		
    	// Mockup connection
    	socket.on(identify_mockup, (mockupName) => {
	
			let room = mockupName + "-ROOM";
			if(!rooms[room]){
				rooms[room] = {};
			}

			rooms[room].mockup = socket.id;
			socket.isMockup = true;
			
			if(!rooms[room].users){
				rooms[room].users = {};
			}

			if(!rooms[room].master){
				rooms[room].master = "";
			}

			if(!rooms[room].vars){
				rooms[room].vars = {};
			}

			rooms[room].n_users = Object.keys(rooms[room].users).length;

			socket.join(room);
			socket.room = room;
			io.to(socket.id).emit(identify_ok_mockup);

			const n_users = rooms[room].n_users;

			const mockup = rooms[room].mockup;
			if (n_users > 0 && mockup){
				io.to(socket.id).emit(stream_control_web_server_mockup, true)
			}
			console.log("------- Connection Event -------");
			console.log("Rooms: ", rooms);

    	});

        // Web client connection
		socket.on(identify_web, (mockupName) => {
	
			let room = mockupName + "-ROOM";
			if(!rooms[room]){
				rooms[room] = {};
			}
			if(!rooms[room].mockup){
				rooms[room].mockup = "";
			}

			socket.room = room;
			socket.join(room);
			io.to(socket.id).emit(identify_ok_web);


			if(!rooms[room].users){
				rooms[room].users = {};
				rooms[room].users[socket.id] = socket;
			}else{
				rooms[room].users[socket.id] = socket;
			}
			
			if(!rooms[room].vars){
				rooms[room].vars = {};
			}

			rooms[room].n_users = Object.keys(rooms[room].users).length;
			
			const n_users = rooms[room].n_users;

			if(n_users < 2){
				rooms[room].master = socket.id;
				socket.isMaster = true;
			}else{
				socket.isMaster = false;
			}

			if (socket.isMaster){
				socket.lastActivity = new Date();
			}else{
				let masterid = rooms[socket.room].master;
				let masterSocket = rooms[socket.room].users[masterid];
				let lastActivity =  masterSocket.lastActivity;
				let elapsedTime = new Date() - lastActivity;	
				if(elapsedTime >= maxInactivityTime){
					io.to(masterid).emit(stop_server_web);
					masterSocket.disconnect(true);
				}			
			}
			

			let control = {
				"viewers": n_users,
				"isMaster": socket.isMaster
			}

			io.to(socket.id).emit(give_control, control);

			console.log("------- Connection Event -------");
			console.log("Rooms: ", rooms);
			
			const mockup = rooms[room].mockup;
	    	if(n_users > 0 && mockup){
	    		io.to(mockup).emit(stream_control_web_server_mockup, true);
	    	}    

		});

		/*Video Streaming*/
		socket.on(stream_video_mockup_server, (frame64) => {
			//console.log("reciving frame... ");
			io.to(socket.room).emit(stream_video_server_web, frame64);
		});

		/*Responses for updates*/
		socket.on(response_updates_mockup_server, (data) => {
			//console.log("mockup says :", data);
			io.to(socket.room).emit(response_updates_server_web, data);
		});

		socket.on(response_updates_web_server, (data) => {
			if(socket.isMaster){
				socket.lastActivity = new Date();
				rooms[socket.room].vars = data;
				io.to(socket.room).emit(response_updates_server_mockup, data);
				io.to(socket.room).emit(response_updates_server_web, data);
			}else{
				let masterid = rooms[socket.room].master;
				let masterSocket = rooms[socket.room].users[masterid];
				let lastActivity =  masterSocket.lastActivity;
				let elapsedTime = new Date() - lastActivity;
				console.log("Elapsed Time: ", elapsedTime);
				if(elapsedTime >=  maxInactivityTime){
					masterSocket.disconnect(true);
					rooms[socket.room].vars = data;
				}
				
				if(rooms[socket.room].vars){
					let vars = rooms[socket.room].vars;
					rooms[socket.room].vars["PlayState"] = data["PlayState"];
					rooms[socket.room].vars["LightState"] = data["LightState"]
					//console.log("I'm the viewer!", rooms[socket.room].vars);
					io.to(socket.room).emit(response_updates_server_mockup, vars);
					io.to(socket.room).emit(response_updates_server_web, vars);	
				}			
			}
			// socket.to(socket.room).emit(response_updates_server_mockup, data);
			// socket.to(socket.room).emit(response_updates_server_web, data);

			
		});

		socket.on(response_ok_mockup_server, () => {
			console.log("mockup says ok to server!");
			io.to(socket.room).emit(response_ok_server_web);
		});

		socket.on(response_ok_web_server, () => {
			console.log("web says ok to server!");
			io.to(socket.room).emit(response_ok_server_mockup);
		});

		/*Response for requests*/
		socket.on(request_updates_mockup_server, () => {
			console.log("*mockup request updates");
			io.to(socket.room).emit(request_updates_server_web);
		});

		socket.on(request_updates_web_server, () => {
			console.log("*web request updates");
			io.to(socket.room).emit(request_updates_server_mockup);
		});

		/*Routes for quizes*/
		socket.on(quiz_mockup_server, (quiz) =>{
			io.to(socket.room).emit(quiz_server_web);
		});

		/*Routes for stop process*/
		socket.on(stop_web_server, () => {
			io.to(socket.room).emit(stop_server_mockup);
		});

		socket.on(stop_mockup_server, () => {
			io.to(socket.room).emit(stop_server_web);
		});

		/*Routes for erros*/
		socket.on(error_mockup_server, (error) => {
			console.log("Mockup notifies an error!");
			console.log(error);
		})

		// When a user disconnects
	    socket.on("disconnect", () => {
			delete rooms[socket.room].users[socket.id];
			rooms[socket.room].n_users = Object.keys(rooms[socket.room].users).length;
			
			if(socket.isMaster){
				console.log("Setting new master...");
				setNewMaster(io, socket.room, rooms);
			}
			if(socket.isMockup){
				rooms[socket.room].mockup = ""
			}

			
			const n_users = rooms[socket.room].n_users;

			// if there are not users, stop streaming	    	
	    	if(n_users < 1){ 
	    		io.to(socket.room).emit(stream_control_web_server_mockup, false);
	    		io.to(socket.room).emit(stop_server_mockup);
				vars = null;
	    	}


			console.log("------- Disconnection Event -------");
			console.log("Rooms: ", rooms);

		});

    });


};

