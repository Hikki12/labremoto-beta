import React from 'react';
import './styles/VideoCard.css';


class VideoCard extends React.Component {
    constructor(props){
        super(props);
    }

    cardClicked = () => {
        let url = this.props.data;
        this.props.onDemand(url);
    }

    downloadVideo = () => {
        this.props.downloadVideo(this.props.data);
    }

    downloadFile = () => {
        this.props.downloadFile(this.props.data);
    }
    
    deleteVideo = () => {
        this.props.deleteVideo(this.props.data);
    }

    openDialog = () => {
        this.props.openDialog();
    }

    render() {
        return(     
            <div className="vcard__container row" tabIndex="1" onClick={this.cardClicked}>
                <div className="vcard__image">
                    <h1 className="text-center">MCU</h1>
                </div>
                <div className="vcard__info">
                    <div className="vcard__info--title">
                        <h1 className="video__title title">{this.props.data}</h1>
                    </div>
                    <div className="vcard__info--buttons row">
                        <div className="col-md-4">
                            <button className="btn btn-info" onClick={this.downloadVideo} type="button">Download</button>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-success" onClick={this.downloadFile}>Download</button>
                        </div>
                        <div className="col-md-1 offset-md-1">
                            <button className="btn btn-danger" onClick={this.openDialog} type="button">x</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VideoCard;