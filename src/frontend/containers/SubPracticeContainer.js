import React from 'react';
import SubPracticeCard from '../components/SubPracticeCard';


const SubPracticeContainer = (props) => {
    return(
        <div className="row">
            {props.data.subpractices.map((current) =>{
                return(
                    <SubPracticeCard data={current} url={props.url}/>
                )
            })}
        </div>
    );
}

export default SubPracticeContainer;