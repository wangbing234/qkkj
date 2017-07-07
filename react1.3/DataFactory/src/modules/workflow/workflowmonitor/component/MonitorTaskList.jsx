import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import AuthButton from 'CommonComponent/component/authbutton'
import Util from 'CommonComponent/utils/CommonUtil'

import AjaxReq from '../ajax/AjaxReq'
import LogPanel from './pop/LogPanel'

class MonitorTaskList extends React.Component {
  constructor( props ) {
    super( props );
    this.pageSize = 100;
    this.currentPage = 1;
    this.state = {};
  }

  getList() {
    let that = this;
    let param = {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      processInstanceId: Number(this.props.data.id)
    };
    AjaxReq.getTaskInfoList( param, ( data )=> {
      if ( that.loadInterval ) {
        that.setState( { data: data.data } );
      }
    } );
  }

  pageChange( page ) {
    this.currentPage = page;
  }

  getColumn() {
    let that = this;
    return [
      {title:'序号', key:'sequence',width:'50px'},
      { title: "实例标识", key: "processInstanceId" },
      { title: "节点id", key: "id" },
      { title: "节点名称", key: "activitiName" },
      { title: "开始时间", key: "startTime",
        render( text, item ){
          return item.startTime ? new Date( Number( item.startTime ) ).format( "yyyy-MM-dd hh:mm:ss" ) : ""
        } },
      { title: "结束时间", key: "endTime",
        render( text, item ){
          return item.endTime ? new Date( Number( item.endTime ) ).format( "yyyy-MM-dd hh:mm:ss" ) : ""
        } },
      {
        title: "节点状态", key: "state", render( text ){
        let stateText = "";
        if ( text == "2" ) {
          stateText = "结束";
        } else if ( text == "1" ) {
          stateText = "执行中";
        } else if ( text == "4" ) {
          stateText = "暂停";
        } else if ( text == "8" ) {
          stateText = "停止";
        } else if ( text == "16" ) {
          stateText = "系统告警";
        } else if ( text == '32' ) {
          stateText = '综合状态';
        } else if ( text == "64" ) {
          stateText = '错误';
        }
        return stateText;
      }
      },
      {
        title: "时长", key: "exectTime", render( text ){
        return Util.getTimers(text);
      }
      },
      {
        title: '日志',
        key: 'operation',
        render( item ){
          return (
            <div>
              <AuthButton
                renderType="a"
                onClick={that.openLogHandle.bind(that,item)}
                title="查看">查看</AuthButton>
            </div>
          );
        }
      }
    ];
  }

  openLogHandle( item ) {
    this.refs.logPanel.open( item );
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  render() {
    let column = this.getColumn();
    return (
      <div className="module-container">
        <h4>节点执行实例信息</h4>
        <div className="module-table">
          <DataTable
            data={this.state.data}
            column={column}
            howRow={this.pageSize}
          ></DataTable>
        </div>

        <button
          className="btn btn-sm btn-default"
          style={{marginTop:"15px",marginBottom:"15px"}}
          onClick={this.props.backToList}>返回
        </button>

        <LogPanel ref="logPanel"/>
      </div>
    );
  }
}
export default MonitorTaskList