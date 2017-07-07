import React from 'react';
import {BreadCrumb} from 'CommonComponent'
import ProtectList from './ProtectList'
import WorkflowEdit from './../../common/WorkflowEdit'
import ProtectHistory from './ProtectHistory'
import '../../css/style.less'

let breadCrumbArr = [ { text: "工作流" }, { text: "工作流维护" } ];
const LISTVIW = "listView";
const EDITVIEW = "editView";
const HISTORYVIEW = "historyView";
class ProtectIndex extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { currentView: LISTVIW };
  }


  openHistory(key) {
    this.setState( { currentView: HISTORYVIEW , projectKey:key} );
  }

  backToList(){
    this.setState({currentView:LISTVIW});
  }

  render() {
    let curView;
    if ( this.state.currentView == LISTVIW ) {
      curView = <ProtectList openHistory={this.openHistory.bind(this)}/>
    } else if ( this.state.currentView == EDITVIEW ) {
      curView = <WorkflowEdit/>
    } else {
      curView = <ProtectHistory backToList={this.backToList.bind(this)} projectKey={this.state.projectKey}/>
    }
    return (<div className="workflow-div">
      {/*<BreadCrumb msgArr={breadCrumbArr} history={this.props.history}/>*/}
      {curView}
    </div>);
  }
}
export default ProtectIndex