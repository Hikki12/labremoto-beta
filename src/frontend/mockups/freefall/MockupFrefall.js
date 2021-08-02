import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import ToogleButton from '../../components/ToogleButton';
import Table from '../../components/Table';
import RangeSlider from '../../components/RangeSlider';
import ClientIO from '../mockup-client/MockupIO-client';
import ModalQuiz from '../quiz/ModalQuiz';


class MockupFreefall extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			quizIsOpen: false,
			video: "",
			isMaster:false,
            viewers:0,
            vars: {},
			equation: null,
			times: ["-", "-", "-"]
		}

		this.image = React.createRef();

		this.sliderLabelValue = React.createRef();

		this.variables = {
            restart: React.createRef(),
            playBtn: React.createRef(),
		}
		this.minutes = 20*60000;
		this.closeTimer = setInterval(this.closeApp, this.minutes);
	}

	closeApp = () => {
		console.log("Closing app...");
		this.client.close()
		this.props.history.push("/home");
	}

	clearStopTimer(){
		if(this.closeTimer){
			clearTimeout(this.closeTimer)
			this.closeTimer = null;
		}
	}

	restartCloseTimer = () => {
		this.clearStopTimer();
		this.closeTimer = setInterval(this.closeApp, this.minutes);
	}


	// ---------------------- RANDOM CONDITIONS ----------------------------------
    randomSpeed = () => {
        const max = 100;
        const min = 30;
        let speed = Math.floor(Math.random() * (max - min) + min);
        this.variables.slider.current.setValue(speed);
        this.updateSliderLabel()
    }

    randomDir = () => {
        this.variables.dirBtn.current.checked = Math.random() < 0.5;
    }

    autoStart = (time=1000) => {
        
        setTimeout(()=>{
            this.variables.playBtn.current.setChecked(true);
            this.variables.lightBtn.current.setChecked(true);
            this.randomSpeed();
            this.randomDir();
            console.log("Auto Starting...");
            this.sendUpdates();
        }, time)
    }
	
	//----------------------------------------------------------------------

	componentDidMount(){
		this.client = new ClientIO(name="MAQUETA-FREEFALL");
		this.client.newFrameReady(this.displayImage);
		this.client.reciveUpdates(this.setRecivedVariables);
		this.client.adminControl(this.updateSocketInfo);
		this.client.wasStop(this.closeApp);
		this.client.identifyCallback = this.sendUpdates;	

		let mode = parseInt(this.props.match.params.mode);

		if(mode < 1) {
			
			//this.autoStart(2000);
		}
	}

	componentWillUnmount(){
		this.client.close();
		this.clearStopTimer();
	}
	
	classHide = () =>{
		let mode = this.props.match.params.mode;
		let hide = true;
		if (mode >=1 ){
			hide = false;
		}
		if(hide){
			return "hide"
		}
		else{
			return ""
		}
	}
	// -------------------------------------------------
	sendUpdates = () => {
		// setTimeout(()=>{
			let data = {
				PlayState: this.variables.playBtn.current.isChecked(),
				Restart: false
			}	
			this.client.sendToServer(data);	
			this.setState({
				vars: data
			});
			console.log("Data: ",data)
		// }, 200)sendUpdates
	}

	
	displayImage = (frame64) => {
		let image = 'data:image/jpeg;base64,' + frame64;
		this.setState({
			video: image
		});
	}

	setRecivedVariables = (variables) => {
		console.log("Recived Variables: ", variables);
		this.variables.playBtn.current.setChecked(variables["PlayState"]);
		// this.variables.restart.current.setChecked(variables["Restart"]);
		this.setState({
			equation: variables.equation,
			times: [variables.dt1, variables.dt2, variables.dt2]
		});
		//this.variables.lightBtn.current.setChecked(variables["LightState"]);
		//this.updateSliderLabel();
	}

	updateSocketInfo = (info) => {
		this.setState({
			viewers: info.viewers,
			isMaster: info.isMaster
		});
	}

	guiEvent = (id, value) => {
		console.log(id, value);
	}
	//--------------------------------------------------------------------------------------
  
	renderSocketInfo = () => {
        return(
            <div className="row">
                <div className="socket__info--element">
                   Viewers: {this.state.viewers}
                </div>
                {this.state.isMaster
                    ?<div className="socket__info--indicator__on">/Driver</div>
                    :<div className="socket__info--indicator__off">/Passenger</div>
                }
            </div>
        );
    }

	renderTitle = () => {
		return <div className="text-center h1">EXPERIMENTO</div>
	}

	renderImage = () => {
		return(
			<div className="col-12 text-center">
				<img className="img-fluid video" id="video-img" src={this.state.video}/>
			</div>
		);
	}

	renderLightControl = () => {
		return(
			<div className="col offset-md-1 mt-3">
				<ToogleButton
					ref={this.variables.lightBtn}
					onClass="btn btn-warning"
					offClass="btn btn-outline-warning nohover"
					onClick={this.sendUpdates}
				>
					Lámpara
				</ToogleButton>				
			</div>
		)
	}


	renderPlayer = () =>{
		return(
			<div className="row">
				{this.renderImage()}
				{/* {this.renderLightControl()} */}
			</div>
		)
	}

	renderPlayControls = () =>{
		return(
			<div className="row text-center mt-4">
				<div className="col">
					<ToogleButton
						ref={this.variables.playBtn}
						onClick={this.sendUpdates}
					>
						INICIAR
					</ToogleButton>
				</div>
				
				{/* <div className="col-3 ml-2">
				<ToogleButton 
				 	ref={this.variables.restart}
					onClass="btn btn-info"
					offClass="btn btn-outline-info nohover"
					onClick={this.sendUpdates}
				>
					RESTART
				</ToogleButton>
				</div> */}
			</div>
		)
	}

	renderInstructions(){
		let instructions = []
		try{
			let allinstructions =  this.props.location.state.info.instructions;
			let mode = this.props.match.params.mode;
			instructions = allinstructions[mode];
		}catch(e){
			
		}

		return(
			<div>
				{instructions.map((instruction, index) => {
					return(
						<p className="text-justify" key={`inst-${index}`}>
							{`${index + 1}-. ${instruction}`}
						</p>
					)
				})}
			</div>
		)
	}

	renderTable = () => {
		let mode = this.props.match.params.mode;
		let titles = ["distancia", "0cm", "30cm", "60cm", "90cm"];
        let rows = ["tiempo(s)"];  
        let cols = [1,2,3,4];
		let dt = this.state.times;
		let data = [[0, dt[0], dt[1], dt[2]]];
		
		// if(mode == 0 || mode == 2){
        //     titles = ["# Rotaciones", "Tiempo(s)", "Período (s)", "Frecuencia(Hz)"]
        //     rows = [5,10,15,20];
        //     cols = [1,2,3];
        // }
        // if(mode == 1){
        //     titles = ["Desplazamiento Angular (rad)", "Tiempo(s)", "Velocidad Angular (rad/s)"]
        //     rows = ["3pi","4pi","5pi","6pi","7pi"];
        //     cols = [1,2];
        // }
		return(
			<Table
			titles={titles}
			cols={cols}
			rows={rows}
			data={data}
			/>
		)
	}

	updateSliderLabel = () => {
		// let speed = (0.3*this.variables.slider.current.Value()).toFixed(1);
		// this.sliderLabelValue.current.innerHTML = `${speed} rpm`;
	}
	
	renderControls = () => {
		return(
			<div className={this.classHide()}>
				<p
					className="h1 text-muted text-right"
					ref={this.sliderLabelValue}
				>
					00.0 rpm
				</p>
				<br className="mt-4"/>
				<RangeSlider 
					ref={this.variables.slider}
					min="1" 
					max="100"
					defaultValue="0"
					onClick={this.sendUpdates}
					onChange={this.updateSliderLabel}
				/>
				<br className="mt-4"/>
				<ToogleButton
					ref={this.variables.dirBtn}
					checkedText="HORARIO"
					onClick={this.sendUpdates}
					onClass="btn btn-info"
					offClass="btn btn-outline-info nohover"
				>
					ANTIHORARIO
				</ToogleButton>
			</div>
		)
	}

	renderEquation = () => {
		let eqt = this.state.equation;
		if(!this.state.equation){
			eqt = "";
		}
		return(
			<div className="my-4">
				<Latex>
					{eqt}
				</Latex>
			</div>
		)
	}

	// MODAL QUIZ ----------------------------------------------
    openQuiz = () => {
		console.log("Opening.. quiz")
        this.setState({quizIsOpen: true});
    }

    closeQuiz = () => {
        this.setState({quizIsOpen: false});
    }

	renderModalQuiz = () => {
		return (
			<ModalQuiz
			isOpen={this.state.quizIsOpen}
			onRequestClose={this.closeQuiz}
			variables={this.state.vars}
			data={this.props.location.state.info}
			mode={this.props.match.params.mode}
			/>
		)

	}
	
	render(){
		return(
			<div className="container">
				{/* {this.renderModalQuiz()} */}
				<div className="row">
					<div className="col-sm-6">
						<div className="card">
							<div className="p-4">
								{this.renderTitle()}
								{this.renderPlayer()}
								{this.renderPlayControls()}
							</div>
						</div>
					</div>

					<div className="col-sm-6">
						<div className="card">
							<div className="p-4">
								{this.renderTable()}
								{this.renderEquation()}
								<button className="btn btn-primary mr-5" onClick={this.openQuiz}>Cuestionario</button>
								<hr/>
								{this.renderInstructions()}
								<hr className="col-10"/>
								{this.renderControls()}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

}

export default MockupFreefall;
