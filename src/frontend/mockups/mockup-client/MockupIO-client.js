import SocketIO from "socket.io-client";


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

class MockupClientIO {

    constructor(name){
        this.name = name;
        this.io = SocketIO();
        this.configureSocketIO();
        this.displayVideoImage = null;
        this.reciveFromServer = null;
        this.updatesRequestCallback = null;
    }


    configureSocketIO = () => {   

        this.io.on('connect', () => {
            console.log("Connecting...", this.name);
            this.io.emit(identify_web, this.name);
            console.log("Identificando...");
        });

        this.io.on(identify_ok_web, () => {
            console.log("I'm identify");
            //this.io.emit(request_updates_web_server);
        });

        this.io.on(stream_video_server_web, (frame64) => {
            //console.log("Image video recived!", frame64);
            if(this.displayVideoImage){
                this.displayVideoImage(frame64);
            }
        })

        // Recive Updates
        this.io.on(response_updates_server_web, (data) => {
            if(this.reciveFromServer){
                this.reciveFromServer(data);
            }
            this.io.emit(response_ok_web_server);
            console.log("Responding...");
        });

        this.io.on(request_updates_server_web, () => {
            console.log("Solicitudes ");
            if(this.updatesRequestCallback){
                this.updatesRequestCallback();
            }
        });

    }

    newFrameReady = (cb) => {
        this.displayVideoImage = cb;
    }

    reciveUpdates = (cb) => {
        this.reciveFromServer = cb;
    }

    updatesRequest = (cb) => {
        this.reciveUpdatesCallback = cb;
    }

    sendToServer = (variables) => {
        this.io.emit(response_updates_web_server, variables);
    }


    close = () => {
        this.io.disconnect();
    }

    
}


export default MockupClientIO;