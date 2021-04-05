import React from 'react';
import { Player } from 'video-react'; 
import axios from 'axios';
import ScrollList from './ScrollList';
import './styles/videoLister.css';
import "video-react/dist/video-react.css"; // import css

const api = "http://localhost:3000/list/videos/mcu";
  
class videoLister extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            videos: null
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
                    videos: res.data,
                })               
            })
    }

    render(){
        return(
            <div className="row container__modal">
                <div className="col-sm-6 container___video">
                    <div className="container__video--player ">
                    <Player
                        playsInline
                        src="http://localhost:3000/stream/video/mcu/test.mp4"
                    />
                    </div> 
                    <hr className="col-sm-5"/>
                    <div className="container__video--description">
                        <div className="description__info">
                        </div>
                        <div className="download__buttons row">
                            <button id="downloadVideoBtn" className="btn btn-info button__video--card">
                                Download Video
                            </button>
                            <button id="downloadResultsBtn" className="btn btn-success button__video--card">
                                Download Results
                            </button>                         
                        </div>     
                    </div>
                </div>
                <div className="col-sm-5 container__list">
                    <ScrollList videos={this.state.videos}/>
                </div>
            </div>
        );
    }
}

export default videoLister;
