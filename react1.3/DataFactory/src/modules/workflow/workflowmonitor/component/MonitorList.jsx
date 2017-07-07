/****************************************************
 * create by qing.feng
 * time 2016/7/21 18:11
 * desc：工作流监控-列表页
 *****************************************************/
import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import DateRange from 'bfd-ui/lib/DatePicker/DateRange'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import confirm from 'bfd-ui/lib/confirm'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import AuthButton from 'CommonComponent/component/authbutton'
import message from 'CommonComponent/component/bdosmessage'
import CommonUtil from 'CommonComponent/utils/CommonUtil'

import AjaxReq from '../ajax/AjaxReq'

const PROCESS_STATE_RUNNING = 1;//流程正在执行
const PROCESS_STATE_PAUSE = 2;//流程暂停
const PROCESS_STATE_END = 3;//流程结束
const PROCESS_STATE_STOP = 4;//流程停止
const PROCESS_STATE_ERROR = 5;//流程错误

class MonitorList extends React.Component {
  constructor( props ) {
    super( props );
    this.selectList = [];
    this.pageSize = 10;
    this.currentPage = 1;
    this.statusTypeList = [
      { key: "", name: "全部" },
      { key: PROCESS_STATE_RUNNING, name: "运行中" },
      { key: PROCESS_STATE_PAUSE, name: "暂停" },
      { key: PROCESS_STATE_END, name: "完成" },
      { key: PROCESS_STATE_STOP, name: "终止" },
      { key: PROCESS_STATE_ERROR, name: "失败" }
    ];
    this.state = {
      selected: "",
      data: {
        totalList: [], //表格数据
        "currentPage": 1,//当前页
        "totalPageNum": 500//总页数

      }
    };
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

  /*组件更新的时候，设置表格行双击事件*/
  /*componentDidUpdate() {
    let that = this;
    let tableBody = $( ".last-td-div" ).find( "tbody" );
    let trList = $( tableBody ).find( "tr" );
    trList.map( ( index, item ) => {
      $( item ).dblclick( () => {
        that.tableItemDbClick( that.state.data.totalList[ index ] );
      } );
    } );
  }*/

  /*工作流状态下拉框change切换处理*/
  typeHandleChange( value ) {
    this.setState( { ...this.state, selected: value } );
  }

  /*页码change处理*/
  onPageChange( page ) {
    this.currentPage = page;
    this.getList();
  }

  /*查询处理*/
  searchHandler() {
    this.currentPage = 1;
    this.getList();
  }

  /*复选框选择处理*/
  setSelect( item, e ) {
    item.isCheck = !item.isCheck;
    if ( item.isCheck ) {
      this.selectList.push( item.code );
    } else {
      let selectList = this.selectList;
      this.selectList.filter( ( sitem, index ) => {
        if ( item.code === sitem ) {
          selectList.splice( index, 1 );
        }
      } );
    }
    this.setState( {} );
  }

  /*工作流名称修改处理*/
  handleChange( evt ) {
    this.setState( { resourceName: evt.target.value } );
  }

  /*列表-编辑处理*/
  editHandle( item ) {
    let url = `${Server.workflowUrl}ActiviEditer.html?projectId=${window.projectId}&key=${item.processCode}&projectCode=${window.projectCode}&projectName=${window.projectName}`
    window.open( url );
  }

  lookWorkflow( item ) {
    let url = `${Server.workflowUrl}ActiviMonitor.html?processInstanceId=${item.id}&projectId=${window.projectId}`
    window.open( url );
  }

  /*重跑*/
  rerun( item ) {
    let that = this;
    AjaxReq.rerunWorkflow( { projectId: window.projectId, processInstanceId: Number( item.id ) }, ( result ) => {
      message.success( "重跑成功" );
      that.getList();
    } );
  }

  /*恢复*/
  reversion( item ) {
    let that = this;
    AjaxReq.resumeWorkflow( { projectId: window.projectId, processInstanceId: Number( item.id ) }, ( result ) => {
      that.getList();
    } );
  }

  /*暂停*/
  pauseFlow( item ) {
    let that = this;
    AjaxReq.pauseWorkflow( { projectId: window.projectId, processInstanceId: Number( item.id ) }, ( result ) => {
      that.getList();
    } );
  }

  /*结束/中止*/
  endFlow( item ) {
    let that = this;
    AjaxReq.endWorkflow( { projectId: window.projectId, processInstanceId: Number( item.id ) }, ( result ) => {
      that.getList();
    } );
  }

  /*开始时间-结束时间change处理*/
  handleSelect( start, end ) {
    console.log( start, end )
    this.setState( { startTime: start, endTime: end } );
  }

  /*获取监控列表数据*/
  getList() {
    let that = this;
    let param = {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      projectId: window.projectId,
      processKey: this.state.resourceName,
      flowState: `${this.state.selected}`,
      startTime: this.state.startTime ? new Date( Number( this.state.startTime ) ).format( "yyyy-MM-dd" ) : "",
      endTime: this.state.endTime ? new Date( Number( this.state.endTime ) ).format( "yyyy-MM-dd" ) : ""
    };
    AjaxReq.getProcessList( param, ( data ) => {
      console.log( data );
      if ( that.loadInterval ) {
        that.selectList = [];
        that.setState( { ...that.state, data: data.data } );
      }
    } );
  }

  /*表格双击事件处理*/
  tableItemDbClick( item ) {
    this.props.toInstanceInfo( item );
  }

  /*设置表格列*/
  getTableColumn() {
    let that = this;
    return [
      {
        title: '执行标识',
        key: 'id',
        width: '80px'
      }, {
        title: '工作流编码',
        key: 'processCode',
        render(text){
          return (
            <TextOverflow>
              <p style={{maxWidth: "100px",margin:"0px"}}>{text}</p>
            </TextOverflow>
          )
        }
      }, {
        title: '工作流名称',
        key: 'processName',
        render( text, item ){
          let _view =  <TextOverflow>
            <div style={{maxWidth: "100px"}}>
              <AuthButton
                renderType="a"
                data-code="1021606"
                href="javascript:void(0);"
                onClick={that.lookWorkflow.bind(that,item)}>{text}</AuthButton>
            </div>
          </TextOverflow>
          return _view ? _view : text;
        }
      }, {
        title: '开始时间',
        key: 'startTime',
        render( text, item ){
          return item.startTime ? new Date( Number( item.startTime ) ).format( "yyyy-MM-dd hh:mm:ss" ) : ""
        }
      }, {
        title: '结束时间',
        key: 'endTime',
        render( text, item ){
          return item.endTime ? new Date( Number( item.endTime ) ).format( "yyyy-MM-dd hh:mm:ss" ) : ""
        }
      }, {
        title: '时长',
        key: 'exectTime',
        width: '100px',
        render( text, item ){
          return CommonUtil.getTimers( text );
        }
      }, {
        title: '运行版本号',
        key: 'runVersion',
        render( text ){
          return text ? text : "";
        }
      }, {
        title: '启动流程',
        key: 'parentProcessName'
      }, {
        title: '状态',
        key: 'state',
        width: '70px',
        render( text, item ){
          return that.statusTypeList.map( ( tItem ) => {
            if ( tItem.key == text ) {
              return tItem.name;
            }
          } );
        }
      }, {
        title: '操作',
        key: 'operation',
        render( item ) {
          let operationView = null;
          let aStyle = { marginLeft: "10px" };
          //
          if ( item.state == PROCESS_STATE_RUNNING ) {/*运行中*/
            operationView =
              <div style={{display:"inline-block",marginLeft:"0px"}}>
                <AuthButton
                  renderType="a"
                  style={aStyle} data-code="1021603"
                  onClick={that.pauseFlow.bind(that,item)}
                  title="暂停">暂停</AuthButton>
                <AuthButton
                  renderType="a"
                  style={aStyle} data-code="1021605"
                  onClick={that.endFlow.bind(that,item)}
                  title="结束">结束</AuthButton>
              </div>;
          } else if ( item.state == PROCESS_STATE_PAUSE ) {/*暂停*/
            operationView =
              <div style={{display:"inline-block",marginLeft:"0px"}}>
                <AuthButton
                  renderType="a"
                  data-code="1021604"
                  style={aStyle}
                  onClick={that.reversion.bind(that,item)}
                  title="恢复">恢复</AuthButton>
                <AuthButton
                  renderType="a"
                  style={aStyle} data-code="1021605"
                  onClick={that.endFlow.bind(that,item)}
                  title="结束">结束</AuthButton>
              </div>;
          } else if ( item.state == PROCESS_STATE_END ) {/*完成*/
            operationView = <AuthButton
              renderType="a"
              onClick={that.rerun.bind(that,item)}
              data-code="1021602"
              title="重跑">重跑</AuthButton>;
          } else if ( item.state == PROCESS_STATE_STOP ) {/*中止*/
            operationView = null;
          } else if ( item.state == PROCESS_STATE_ERROR ) {/*失败*/
            operationView = <AuthButton
              data-code="1021604"
              renderType="a"
              onClick={that.reversion.bind(that,item)}
              title="恢复">恢复</AuthButton>;
          }
          return (
            <div>
              <AuthButton
                renderType="a"
                data-code="1021606"
                onClick={that.editHandle.bind(that,item)}
                title="编辑">编辑</AuthButton>
              {operationView}
              <AuthButton
                renderType="a"
                onClick={that.tableItemDbClick.bind(that,item)}
                title="节点">节点</AuthButton>
            </div>
          );
        }
      } ]
  }

  render() {
    let column = this.getTableColumn();
    return (<div className="module-container">
      <div className="btns-div"
           style={{height:"30px"}}>
        <button
          className="btn btn-sm btn-primary"
          style={{marginLeft:"10px",float:"right"}}
          onClick={this.searchHandler.bind(this)}> 查询
        </button>
        <Select
          defaultValue="0" value={this.state.selected}
          onChange={this.typeHandleChange.bind(this)}
          style={{width:"200px",float:"right"}}>
          {this.statusTypeList.map((item,index) => {
            return <Option key={index} value={item.key}>{item.name}</Option>
            })}
        </Select>
        <DateRange
          style={{float:"right",marginRight:"10px"}}
          onSelect={this.handleSelect.bind(this)}
          start={this.state.startTime}
          end={this.state.endTime}></DateRange>
        <RestrictInput
          type="text" className="form-control common-input" placeholder="请输入工作流编码或名称"
          style={{float:"right",width:"200px"}} value={this.state.resourceName}
          onChange={this.handleChange.bind(this)} restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE}/>
      </div>
      <div className="module-table">
        <div>
          <DataTable
            column={column} howRow={this.pageSize} data={this.state.data}
            onPageChange={this.onPageChange.bind(this)} showPage="true"/>
        </div>
      </div>
    </div>);
  }
}
export default MonitorList