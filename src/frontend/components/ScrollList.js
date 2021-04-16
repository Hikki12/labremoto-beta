import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { List, AutoSizer } from 'react-virtualized';
import VideoCard from './VideoCard';
import './styles/ScrollList.css';

const listStyle = { overflowX: false, overflowY: false };

const rowStyle = {
  overflow: 'hidden',
  height: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  lineHeight: '25px',
  textAlign: 'left',
};


class ScrollList extends React.Component {
    list = React.createRef();

    constructor(props){
      super(props);
    }


    handleScroll = e => {
        const { scrollTop, scrollLeft } = e.target;
        const { Grid } = this.list.current;
        Grid.handleScrollEvent({ scrollTop, scrollLeft });
      };
    

    renderRow = ({ index, key, isScrolling, style }) => {
        //const { countries } = this.props;
        return (
          <div key={key} style={style}>
              <VideoCard 
              data={this.props.videos[index]}
              onDemand={this.props.onDemand}
              downloadVideo={this.props.downloadVideo}
              downloadFile={this.props.downloadFile}
              openDialog={this.props.openDialog}
              />
          </div>
        );
      };


    render(){
        if(!this.props.videos){
          return(
            <div className="scroll__container">
              Waiting...
            </div>
          );
        }else {
          return(

            <div className="scroll__container" style={{ width: 500, height: 550 }}>
                {/* <div className="scroll__buttons--container">

                </div> */}

                <AutoSizer className="sizer__container">
                {({ height, width }) => (
                <Scrollbars
                onScroll={this.handleScroll}
                style={{ height, width }}
                autoHide
                
                >
                    <List
                    height={height}
                    width={width}
                    rowHeight={150}
                    rowRenderer={this.renderRow}
                    style={listStyle}
                    ref={this.list}
                    rowCount={this.props.videos.length}
                    className="scroll__items"
                    />
                </Scrollbars>
                )}
                </AutoSizer>
            </div>
        );
        }
    }
}

export default ScrollList;