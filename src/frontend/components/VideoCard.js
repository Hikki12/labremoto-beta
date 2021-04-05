import React from 'react';
import './styles/VideoCard.css';

class VideoCard extends React.Component {
    constructor(props){
        super(props);
        this.cardClicked = this.cardClicked.bind(this);
    }

    cardClicked(){
        console.log("Was cliked!");
    }
    
    render() {
        return(     
            <div className="vcard__container row" onClick={this.cardClicked}>
                {console.log("Rendering:", this.props.data)}
                <div className="vcard__image">

                </div>
                <div className="vcard__info">
                    <div className="vcard__info--title">
                        <h1 className="video__title title">{this.props.data}</h1>
                    </div>
                    <div className="vcard__info--buttons">
                        <button className="btn button__video--card">Download</button>
                        <button className="btn btn-success button__video--card">Download</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default VideoCard;