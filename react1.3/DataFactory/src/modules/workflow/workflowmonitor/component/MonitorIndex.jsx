import React from 'react';
import {BreadCrumb} from 'CommonComponent'
import MonitorList from './MonitorList'
import WorkflowEdit from './../../common/WorkflowEdit'
import MonitorTaskList from './MonitorTaskList'

import '../../css/style.less'


let breadCrumbArr = [ { text: "工作流" }, { text: "工作流监控" } ];
const LISTVIW = "listView";
const INSTANCELIST = "instanceList";
const EDITVIEW = "editView";
class MonitorIndex extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { currentView: LISTVIW };
  }

  addWorkflow( e ) {
    this.setState( { currentView: EDITVIEW, isEdit: false } );
  }

  toInstanceInfo( item ) {
    this.setState( { currentView: INSTANCELIST, instanceDate:item } );
  }
  backToList(){
    this.setState( { currentView: LISTVIW} );
  }
  render() {
    let curView;
    if ( this.state.currentView == LISTVIW ) {
      curView = <MonitorList addWorkflow={this.addWorkflow.bind(this)} toInstanceInfo={this.toInstanceInfo.bind(this)}/>
    } else if(this.state.currentView == INSTANCELIST) {
      curView = <MonitorTaskList backToList={this.backToList.bind(this)} data={this.state.instanceDate}/>
    } else {
      curView = <WorkflowEdit/>
    }
    return  <div calssName="workflow-div">
      {curView}
    </div>;
  }
}
export default MonitorIndex