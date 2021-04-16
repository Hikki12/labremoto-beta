import React from 'react';
import { Player } from 'video-react'; 
import axios from 'axios';
import download from 'js-file-download';
import ScrollList from './ScrollList';
import ContinueModal from './ContinueModal';
import Modal from 'react-modal';
import './styles/videoLister.css';
import "video-react/dist/video-react.css"; // import css

const api = "/list/videos/mcu";
const api_video_stream = "/stream/video/mcu/";

const api_download_stream = "/download-video/mcu/";
const api_download_file = "/download-file/mcu/";
const api_delete = "/delete-video/mcu/";

class videoLister extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            modalIsOpen: false,
            videos: null,
            videoname: "test.mp4",
            url: api_video_stream + "test.mp4"
        }
    }

    componentDidMount(){
        this.requestMockups();
    }

    requestMockups(){
        axios.get(api)
            .then((res) =>{
                console.log("Videos: ", res.data);
                this.setState({
                    loading: false,
                    videos: res.data.reverse(),
                })               
            })
    }

    updateVideoURL = (videoname) => {
        this.setState({
            videoname: videoname,
            url: api_video_stream + videoname
        });
    }

    downloadVideo = (videoname) => {
        let url = api_download_stream + videoname;
        console.log("Downloading", url);
        axios({
            url: url,
            method: 'GET',
            responseType: 'blob'
            })
            .then((res) => {
                download(res.data, videoname);
                console.log("Res: ", res);
            })
            .catch((error) => {
                console.log("Error: ", error.message);
            })   
    }

    downloadFile = (videoname) => {
        let filename = videoname.substring(0, videoname.length - 4) + ".xlsx";
        let url = api_download_file + filename;
        console.log("Downloading", url);
        axios({
            url: url,
            method: 'GET',
            responseType: 'blob'
            })
            .then((res) => {
                download(res.data, filename);
                console.log("Res: ", res);
            })
            .catch((error) => {
                console.log("Error: ", error.message);
            })   
    }



    openModal = () =>{
        this.setState({
            modalIsOpen: true
        });
    }

    deleteVideo = (videoname) =>{
        console.log("Deleting: ", videoname);
        let url = api_delete + videoname;
        axios({
            url: url,
            method: 'DELETE'
        })
        .then((res) =>{
            console.log("delete response: ", res);
            this.closeModal();
            this.requestMockups();
        })
        .catch((error) => {
            console.log("deleting error: ", error.message);
        })
    }

    closeModal = () => {
        this.setState({
            modalIsOpen: false,
        });
    }

    render(){
        return(
            <div className="row container__modal">
                <div className="col-sm-6 container___video">
                    <div className="container__video--player ">
                    <ContinueModal
                            isOpen={this.state.modalIsOpen}
                            onRequestClose={this.closeModal}
                            data={this.state.videoname}
                            deleteVideo={this.deleteVideo}
                    />

                    <Player
                        playsInline
                        src={this.state.url}
                    />
                    </div> 
                    <hr className="col-sm-5"/>
                    <div className="container__video--description">
                        <div className="description__info">
                        </div>
                        <div className="download__buttons row">
                            <button id="downloadVideoBtn" className="btn btn-info button__video--card" onClick={()=>{this.downloadVideo(this.state.videoname)}}>
                                Download Video
                            </button>
                            <button id="downloadResultsBtn" className="btn btn-success button__video--card" onClick={() => {this.downloadFile(this.state.videoname)}}>
                                Download Results
                            </button>                         
                        </div>     
                    </div>
                </div>
                <div className="col-sm-5 container__list">
                    <ScrollList 
                        videos={this.state.videos} 
                        onDemand={this.updateVideoURL}
                        downloadVideo={this.downloadVideo}
                        downloadFile={this.downloadFile}
                        openDialog={this.openModal}  
                    />
                </div>
            </div>
        );
    }
}

export default videoLister;
