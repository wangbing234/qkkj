/****************************************************
 * create by qing.feng
 * time 2016/7/20 14:45
 * desc：稽核报告- 单个任务报告详情界面
 *****************************************************/
import React from 'react'
import {Form, FormItem} from 'bfd-ui/lib/Form2'
import DataTable from 'bfd-ui/lib/DataTable'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import { FormCategory,FormCategoryItem } from 'CommonComponent/component/formcategory'
import RuleConst from '../../utils/RuleConst'
import Ajax from '../ajax/AjaxReq'

const resultDic = {
  all: "全部",
  success: "正常",
  error: "执行失败",
  exception: "数据异常"
};

class TaskDetail extends React.Component {
  constructor( props ) {
    super( props );
    this.rules = {};
    this.pageSize = 1000000000;
    this.currentPage = 1;
    this.state = {
      data: {
        totalList: [  ],
        "currentPage": 1,
        "totalPageNum": 20
      }
    };
  }

  /*组件实例化时，访问数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getList(),100);
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*获取列表数据*/
  getList() {
    let that = this;
    Ajax.getReportDetail( {
      taskInstanceId: this.props.taskData.taskInstanceId
    }, ( data ) => {
      data = data.data;
      if(that.loadInterval) that.setState( { data: data } );
    } );
  }

  /*面包屑切换*/
  breadCrumbChange(index){
    this.props.backToList();
  }

  /*表格页码切换处理*/
  pageChange( curPage ) {
    this.currentPage = curPage;
  }

  /*设置表格-列*/
  getColumn() {
    return [ {
      title: '规则名称',
      key: 'ruleName',
    }, {
      title: '规则类型',
      key: 'ruleType',
      render( text ){
        return RuleConst.typeDic[ text ];
      }
    }, {
      title: '稽核表',
      key: 'auditTable'
    }, {
      title: '开始时间',
      key: 'startTime',
      render( text ){
        return new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" );
      }
    }, {
      title: '结束时间',
      key: 'endTime',
      render( text ){
        return new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" );
      }
    }, {
      title: '稽核结果',
      key: 'result',
      render( text ){
        return text == "success" ? "正确" : <span className="audit_red_color">{resultDic[text]}</span>;
      }
    } ];
  }

  /*设置每个formItem项*/
  getErrorItemView() {
    let itemStyle = { height: "30px", lineHeight: "30px" };
    return this.state.data.totalList.map( ( item, index )=> {
      var styleName;
      switch ( item.result ) {
        case 'exception':
        case 'error':
          styleName = "audit_red_color";
          break;
        default:
          break;
      }
      return (
        <FormCategoryItem key={index} name={item.ruleName}>
          <FormItem label="稽核结果" name="result">
            <span className={styleName} style={itemStyle}>{resultDic[item.result]}</span>
          </FormItem>
          <FormItem label="结果描述" name="desc">
            <p style={{lineHeight:"30px",minHeight:"30px"}}>{item.describle}</p>
          </FormItem>
        </FormCategoryItem>
      )
    } )
  }

  render() {
    let itemsView = this.getErrorItemView();
    let column = this.getColumn();
    let taskData = this.props.taskData;
    let taskTitle = ["error","exception"].indexOf(taskData.result) != -1 ?
      <span className="audit_red_color">{resultDic[taskData.result]}</span>:<span>{resultDic[taskData.result]}</span>
    let exceptionSpan = taskData.result == 'exception'? <span>稽核总条数
                <strong>&nbsp;{taskData.allNum}</strong>，异常条数<strong>&nbsp;{taskData.exceptionNum}</strong>，问题率
              <strong>&nbsp;{taskData.exceptionRate}</strong></span>:null;
    return (
      <div className="task-report-detail">
        <EditPanel breadCrumbList={[{text:"稽核报告"},{text:"任务结果明细"}]}
                   history={this.props.history} onChange={this.breadCrumbChange.bind(this)} >
          <div style={{marginLeft:"20px",marginRight:"20px"}}>
            <div
              className="alert alert-info" role="alert"
              style={{marginBottom:"20px",marginTop:"20px",paddingLeft:"27px",fontSize:"14px",color:"#3e88ab"}}>
              <strong>&nbsp;{taskData.taskName}</strong>稽核结果{taskTitle}。开始时间
              <strong>&nbsp;{new Date(Number(taskData.startTime)).format("yyyy-MM-dd hh:mm")}</strong>，结束时间
              <strong>&nbsp;{new Date(Number(taskData.endTime)).format("yyyy-MM-dd hh:mm")}</strong>。{exceptionSpan}
            </div>
            <div className="bdos-table">
              <DataTable
                data={this.state.data}
                column={column} howRow={this.pageSize}
              ></DataTable>
            </div>
          </div>
          <FormCategory>
            <Form className="edit-form" rules={this.rules} style={{marginTop:"30px"}}>
              { itemsView }
            </Form>
          </FormCategory>

          <button
            className="btn btn-sm btn-default"
            style={{marginTop:"20px",marginLeft:"85px"}}
            onClick={this.props.backToList}>返回
          </button>
        </EditPanel>
      </div>
    );
  }
}
export default TaskDetail
