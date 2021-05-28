import React from 'react';
import RangeSlider from '../../components/RangeSlider';


class MCUControls extends React.Component {
    constructor(){
        super();
        
    }
    render() {
        return(
            <div>
                <div>
                    <RangeSlider />
                </div>

            </div>
        )
    }

}

export default MCUControls;