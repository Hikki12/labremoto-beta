import React from 'react';

class Table extends React.Component {
    constructor(props){
        super(props);
        this.data = Array(4).fill(null).map(() => Array(3).fill(0));
        this.titles = [1, 2, 3, 4]
        this.cols = [1, 2, 3];
        this.rows = [2,3,4];
    }

    onChangeTable = (row, col, e) => {
        if(this.props.onChangeTable){
            this.props.onChangeTable(row, col, e);
        }
    }

    renderTitles(){
        let titles = this.props.titles;
        if(!this.props.titles){
           titles = this.titles;
        }
        return(
            titles.map((title,index) =>{
                return (
                        <th 
                        className="text-center" 
                        scope="col"
                        key={`title-${index}`}
                        >
                            {title}
                        </th>
                );
            })
        );
    }

    renderCols(){
        let cols = this.props.cols;
        if(!this.props.cols){
            cols = this.cols;
        }
        return(
            cols.map((col, index) => {
                return(
                    <td key={`col-${index}`}>
                        <input className="text-center" onChange={(e) => this.onChangeTable(row, col, e)}/>
                    </td>                    
                )
            })
        )

    }

    renderBody(){
        let rows = this.props.rows;
        if(!this.props.rows){
            rows = this.rows;
        }
        return(
            rows.map((row, index) => {
                return(
                    <tr key={`row-${index}`}>
                        <th className="text-center" scope="row">{row}</th>
                        {this.renderCols()}
                    </tr>
                );
            })
        );
    }

    render(){
        return(
            <div className="table__container">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            {this.renderTitles()}
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderBody()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Table;