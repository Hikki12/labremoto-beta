import React from 'react';
import MockupBase from '../base/MockupBase';

class MockupMCU extends React.Component {

	render() {
		return(
	        <>
	            <MockupBase 
					name="MAQUETA-FREFALL" 
					mode={this.props.match.params.mode}
				/>
	        </>
    	)
	}

}

export default MockupMCU;
