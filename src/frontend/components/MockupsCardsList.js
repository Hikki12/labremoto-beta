import React from 'react';
import MockupCard from './MockupCard';

class MockupsCardsList extends React.Component {

    render(){
        return(
            <>       
                {this.props.data.map((mockupInfo) => (
                    <MockupCard 
                        key={mockupInfo.id}
                        name={mockupInfo.name}
                        description={mockupInfo.description}
                        url={mockupInfo.url}
                    />
                ))}
            </>
        )   
    }
}

export default MockupsCardsList;