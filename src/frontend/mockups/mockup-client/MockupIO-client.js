import SocketIO from "socket.io-client";


// SocketIO routes
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


class MockupClientIO {
    constructor(name){
        this.name = name;
        this.io = SocketIO();
        this.configureSocketIO();
        this.displayVideoImage = null;
        this.reciveFromServer = null;
    }

    identify(){
      const userName = `User${Math.floor(Math.random() * 1000000)}`;
      this.io.emit("new user", userName, this.name);
    };

    configureSocketIO(){   

        this.io.on('connect', () => {
            this.identify();
        });

        this.io.on(streaming_route, (frame64) => {
            //console.log("Image video recived!", frame64);
            if(this.displayVideoImage){
                this.displayVideoImage(frame64);
            }
        })

        // Recive Updates
        this.io.on(updates_to_web_route, (data) => {
            if(this.reciveFromServer){
                this.reciveFromServer(data);
            }
           // socket.emit(response_route_maqueta);
            console.log("Responding...");
        });

        this.io.on(request_updates_route, () => {
            //updateVariables();
            console.log("Solicitudes ");
        });

        //recive response
        this.io.on(response_route_web, ()=>{
            //response = true;
            console.log("Maqueta responsed!");
        });


    }

    newFrameReady(cb){
        this.displayVideoImage = cb;
    }

    reciveUpdates(cb){
        this.reciveFromServer = cb;
    }

    sendToServer(variables){
        this.io.emit(updates_to_maqueta_route, variables);
    }

    close(){
        this.io.disconnect();
    }

    
}


export default MockupClientIO;