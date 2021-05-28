import React from 'react';

class MockupBaseControls extends React.Component {
    constructor(){
      super();
    }
    render(){
      return(
        <div className="row view__container">
          <div className="col-sm-6">
              <div className="card">
                  <div className="card-body">
                      Hola
                  </div>
              </div>
          </div>
          </div>
      )
    }
}

export default MockupBaseControls;