/****************************************************
 * create by qing.feng
 * time 2016/7/26 16:27
 * desc：项目首页- 任务监控
 *****************************************************/
import React from 'react'
import Percentage from 'bfd-ui/lib/Percentage'
import Panel from '../common/Panel'
import AjaxReq from '../../ajax/AjaxReq'

class TaskMoniter extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.setState({});
    this.loadInterval = setInterval( this.getChartsData(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*获取图表数据*/
  getChartsData() {
    let that = this;
    AjaxReq.getTaskMonitorCharts( {
      projectId: window.projectId
    }, ( data ) => {
      if ( that.loadInterval ) {
        data = data.data;
        let _state = this.state;
        data.map( ( item, index ) => {
          _state[ item.key ] = item;
        } );
        that.setState( { ..._state } );
      }
    } );
  }

  /*charts item 点击处理*/
  itemClick( type ) {
    this.props.monitorTaskItemClick( type );
  }

  render() {
    let measureStyle = { width: 130, height: 130,margin:"0 auto", marginBottom: 20 };
    let commonColor = { backColor: "#f0f0f0", textColor: "#666" };
    return (
      <Panel
        title="任务监控" history={this.props.history}
        tabTitle="工作流监控"
        data-code="10216"
        urlName="/workflow/workflowMonitor" icon="gears"
        menuClickFunc={this.props.menuClickFunc}>
        <div className="row project-home-workflow-monitor" style={{marginTop:"20px"}}>
          <div
            className="col-md-3 home-taskMonitor-item-container"
            onClick={this.itemClick.bind(this,"STATE_RUNNING")}
          >
            <div style={measureStyle}>
              <Percentage
                percent={this.state.STATE_RUNNING?this.state.STATE_RUNNING.percent:0}
                foreColor="#64b5f6" {...commonColor}></Percentage>
            </div>
            <div className="text-center" style={{marginTop:"20px"}}>
              <span className="status-text">运行中</span>
              <h4 className="status-num">{this.state.STATE_RUNNING ? this.state.STATE_RUNNING.count : 0}</h4>
            </div>
          </div>
          <div className="col-md-3 home-taskMonitor-item-container">
            <div style={measureStyle}>
              <Percentage
                percent={this.state.STATE_WAITRUN?this.state.STATE_WAITRUN.percent:0}
                foreColor="#ffcd40" {...commonColor}
                onClick={this.itemClick.bind(this,"STATE_WAITRUN")}
              ></Percentage>
            </div>
            <div className="text-center">
              <span className="status-text">待运行</span>
              <h4 className="status-num">{this.state.STATE_WAITRUN ? this.state.STATE_WAITRUN.count : 0}</h4>
            </div>
          </div>
          <div className="col-md-3 home-taskMonitor-item-container" >
            <div style={measureStyle}>
              <Percentage
                percent={this.state.STATE_END?this.state.STATE_END.percent:0}
                foreColor="#81c784"  {...commonColor}
                onClick={this.itemClick.bind(this,"STATE_END")}
              ></Percentage>
            </div>
            <div className="text-center">
              <span className="status-text">已完成</span>
              <h4 className="status-num">{this.state.STATE_END ? this.state.STATE_END.count : 0}</h4>
            </div>
          </div>
          <div className="col-md-3 home-taskMonitor-item-container">
            <div style={measureStyle}>
              <Percentage
                percent={this.state.STATE_ERROR?this.state.STATE_ERROR.percent:0}
                foreColor="#e57373" {...commonColor}
                onClick={this.itemClick.bind(this,"STATE_ERROR")}
              ></Percentage>
            </div>
            <div className="text-center">
              <span className="status-text">失败</span>
              <h4 className="status-num">{this.state.STATE_ERROR ? this.state.STATE_ERROR.count : 0}</h4>
            </div>
          </div>
        </div>
      </Panel>
    );
  }
}
export default TaskMoniter
