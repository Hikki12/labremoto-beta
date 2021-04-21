import React from 'react';
import MockupBase from './MockupBase';
import { getVideosList } from './MockupBaseContainer';

class MockupBaseContainer extends React.Component {


	render(){
		return(
			<MockupBase
				videosList={this.state.videos}
                
			/>
		);
	}
}

export default MockupBaseContainer;