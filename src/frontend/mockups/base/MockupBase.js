import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MockupBase.css';
import MockupClientIO from '../mockup-client/MockupIO-client';
import RadioButton from '../components/RadioButton';
import ModalVideo from '../components/ModalVideo';



class MockupBase extends React.Component {
    
    clientIO;

    variables = {
        Radio: 1,
        Steps: 0,
        LightState:false,
        PlayState: false,
        Recording: false,
    }

    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
        };
        console.log("State: ", this.state)
        this.videoImg = React.createRef();

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        this.clientIO = new MockupClientIO(name="MAQUETA-MCU");
        this.clientIO.newFrameReady(this.displayVideoImage.bind(this));
        this.clientIO.reciveUpdates(this.reciveFromServer.bind(this));
    }

    reciveFromServer(variables){
        console.log("Reciving variables", variables);
    }

    componentWillUnmount(){
        this.clientIO.close();
    }

    displayVideoImage(frame64) {
        this.videoImg.current.src = 'data:image/jpeg;base64,' + frame64;
    }

    openModal(){
        this.setState({modalIsOpen: true});
    }

    closeModal(){
        this.setState({modalIsOpen: false});
    }

    render() {
        return(
            <div className="section">
                
                <ModalVideo 
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                />

                <div className="section__title">
                     {this.props.name
                     ?<div className="title mockup__title">{this.props.name}</div>
                     :<div className="title mockup__title">Mockup Name</div>
                     }             
                </div>
     
                <div className="row view__container">
                     <div className="col-sm-6 image__container">
                        <div className="image__container--elements ">
                                <img className="video" id="video-img" ref={this.videoImg}/>
                                <div className="light__container">
                                    <input id="lightBtn" type="checkbox"/>
                                    <label htmlFor="lightBtn"></label>
                                </div>
                                <button className="btn btn-success" onClick={this.openModal}>Results</button>
                        </div>
                     </div>
                     
                     <div className="col-sm-6 controls__container">
                        <div className="controls__container--elements">

                                <h5 className="card-title text-center"><strong> Controles de la maqueta</strong> </h5>
                                <p className="card-text text-center">
                                    <i>Seleccione la acción.</i>
                                </p>
                                <div className="clockwise__container">
                                        <input id="clockwiseBtn" type="checkbox"/>
                                        <label htmlFor="clockwiseBtn"></label>
                                        <div className="curve-arrow"></div>
                                    </div>
                                    <div className="radios__container">
                                        <div className="radios__container--button">
                                            <input type="radio" id="r1Btn" name="selector" defaultChecked/>
                                            <label htmlFor="r1Btn">R = 3cm</label>
                                            <div className="check"></div>
                                        </div>
                                        <div className="radios__container--button">
                                            <input type="radio" id="r2Btn" name="selector"/>
                                            <label htmlFor="r2Btn">R = 6cm</label>
                                            <div className="check"></div>
                                        </div>
                                        <div className="radios__container--button">
                                            <input type="radio" id="r3Btn" name="selector"/>
                                            <label htmlFor="r3Btn">R = 9cm</label>
                                            <div className="check"></div>
                                        </div>
                                    </div>
                                <div className="slider__container">
                                        <div className="slider__container--label-container">
                                            <span id="sliderLabelValue">0.0</span>
                                           
                                        </div>
                                        <input id="speedSlider" className="rs-range" type="range" step="1" min="0" max="200"
                                        defaultValue="0"/>
                                        <div className="box-minmax">
                                            <span>0</span><span>60</span>
                                        </div>
                                </div>

                                <div className="play__box">
                                        <div className="play__container">
                                            <input id="playBtn" type="checkbox" defaultValue="None"/>
                                            <label htmlFor="playBtn" tabIndex="1"></label>
                                            <div className="labelBtn" id="playLabel">INICIAR</div>
                                        </div>
                                        <div className="record__container">
                                            <input id="recordBtn" type="checkbox" />
                                            <label htmlFor="recordBtn"></label>
                                            <div className="labelBtn" id="recordLabel">GRABAR</div>
                                        </div>
                                    </div>
                                    <div id="msg">PRESIONE INICIAR</div>
                                    <div className="recordTime__container">
                                        <span>Record Time (seg): </span>
                                        <input type="number" defaultValue="20" id="timeInput" name="tentacles" min="10"
                                            max="100"/>
                                    </div>
                        </div>
                     </div>
                </div>
     
            </div>
         );
    }

}

export default MockupBase;
