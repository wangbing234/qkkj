import React from 'react';

class GridTitle extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {}
  }

  render() {
    return (
      <div style={{height:'55px',width:'95%',textAlign:"left"}}>
        <div style={{fontSize:"15px",fontWeight:'bold'}}>  {this.props.title} (最近更新时间:  {this.props.topTime_str})
        </div>
      </div>
    );
  }
}

export default GridTitle;