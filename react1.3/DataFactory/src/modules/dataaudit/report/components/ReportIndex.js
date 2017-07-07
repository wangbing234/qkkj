/****************************************************
 * create by qing.feng
 * time 2016/7/20 14:47
 * desc：稽核报告-主入口
*****************************************************/
import React from 'react'
import ReportList from './ReportList'
import TaskDetail from './TaskDetail'
import {BreadCrumb} from 'CommonComponent'
import '../../css/style.less'

const LIST_VIEW = "list_view";
const INFO_VIEW = "info_view";
const ReportIndex = React.createClass( {
  getInitialState() {
    return {viewType:LIST_VIEW};
  },
  enterDetail(item){
    this.setState({viewType:INFO_VIEW,infoData:item});
  },
  getView(){
    if(this.state.viewType == LIST_VIEW){
      return <ReportList enterDetail={this.enterDetail}/>
    }else{
      return <TaskDetail backToList={this.backToList} taskData={this.state.infoData}/>
    }
  },
  backToList(){
    this.setState({viewType:LIST_VIEW});
  },
  render() {
    let view = this.getView();
    return (<div className="module-container data-audit-div">
      {view}
    </div>);
  }
} );

export default ReportIndex;
