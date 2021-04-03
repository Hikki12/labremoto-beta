import React from 'react';

class MCUControls extends React.Component {

    render() {
        return(
            <div>
                <div className="row">
                    <div className="col-lg-3">
                        <button className="btn btn-primary">R=3cm</button>
                    </div>
                    <div className="col-lg-3">
                        <button className="btn btn-success">R=6cm</button>
                    </div>
                    <div className="col-lg-3">
                        <button className="btn btn-warning">R=9cm</button> 
                    </div>          
                </div>  
                <div>
                    <label htmlFor="customRange1" className="form-label">Example range</label>
                    <input type="range" className="form-range" id="customRange1"/>
                </div>

            </div>
        )
    }

}

export default MCUControls;