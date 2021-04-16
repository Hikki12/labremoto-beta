import React from 'react';
import MockupCard from './MockupCard';

class MockupsCardsList extends React.Component {

    render(){
        return(
            <div> 
                     
                {this.props.data.map((mockupInfo) => (
                    
                    <MockupCard 
                        key={mockupInfo.id}
                        name={mockupInfo.name}
                        description={mockupInfo.description}
                        url={mockupInfo.url}
                        descriptions={mockupInfo.descriptions}
                    />
                ))}
            </div>
        )   
    }
}

export default MockupsCardsList;