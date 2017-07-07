import React from 'react'
import Panel from '../common/Panel'
import CanvasSpace from 'CanvasSpace'

const DataScream = React.createClass({
  getInitialState() {
    return {}
  },
  render() {
    return (
      <Panel
        title="数据流图"
        tabTitle="模型设计"
        data-code="10206"
        history={this.props.history}
        urlName="/dataModel/modelCanvas"
        icon="database" menuClickFunc={this.props.menuClickFunc}>
        <div style={{height:"100%",overflow: "hidden", position: "relative"}}>
          <CanvasSpace type="fontPage"/>
        </div>
      </Panel>
    );
  }
});

export default DataScream;
