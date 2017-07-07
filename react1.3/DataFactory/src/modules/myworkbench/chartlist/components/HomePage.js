import React from 'react'

import TaskMoniter from './children/TaskMoniter'
import DataAudit from './children/DataAudit'
import ScriptFb from './children/ScriptFb'
import DataScream from './children/DataScream'
import ExecuteTime from './children/ExecuteTime'
import DataGrow from './children/DataGrow'

import loading from 'CommonComponent/component/loading'

import '../css/style.less'
const HomePage = React.createClass( {
  getInitialState() {
    return {}
  },
  componentDidMount(){
    loading.show(false);
  },
  monitorTaskItemClick(type){
    this.refs.executeTimePanel.getChartsData(type);
  },
  render() {
    return (<div className="container weork-bench-div" style={{width:"100%",height:"100%"}}>
      <div className="row myworkbench-common-margin">
        <div className="col-md-12">
          <TaskMoniter
            history={this.props.history}
            menuClickFunc={this.props.menuClickFunc}
            monitorTaskItemClick={this.monitorTaskItemClick}
          />
        </div>
      </div>
      <div className="row myworkbench-common-margin">
        <div className="col-md-7">
          <DataAudit history={this.props.history} menuClickFunc={this.props.menuClickFunc}/>
        </div>
        <div className="col-md-5">
          <DataScream history={this.props.history} menuClickFunc={this.props.menuClickFunc}/>
        </div>
      </div>
      <div className="row myworkbench-common-margin">
        <div className="col-md-4">
          <ScriptFb history={this.props.history} menuClickFunc={this.props.menuClickFunc}/>
        </div>
        <div className="col-md-4">
          <ExecuteTime
            ref="executeTimePanel"
            history={this.props.history}
            menuClickFunc={this.props.menuClickFunc}
          />
        </div>
        <div className="col-md-4">
          <DataGrow history={this.props.history}/>
        </div>
      </div>

    </div>)
  }
} );

export default HomePage;
