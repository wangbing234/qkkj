import React from 'react';
import {Select, Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

import EditPanel from 'CommonComponent/component/bdoseditpanel'
import CommonUtil from 'CommonComponent/utils/CommonUtil'

import AjaxReq from '../ajax/AjaxReq'
import RuleConst from '../../utils/RuleConst'
const resultDic = {
  all: "全部",
  success: "正常",
  error: "执行失败",
  exception: "数据异常"
};
class TaskResultPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.statusList = [
      {
        id: "all",
        name: resultDic.all
      },
      {
        id: "success",
        name: resultDic.success
      }, {
        id: "error",
        name: resultDic.error
      }, {
        id: "exception",
        name: resultDic.exception
      } ];
    this.pageSize = 10;
    this.currentPage = 1;
    this.state = {
      status: "all",
      data: {
        "totalList": [ ],
        "currentPage": 1,
        "totalPageNum": 500
      }
    };
  }

  /*实例初始化后，获取数据*/
  componentDidMount() {
    this.getTaskResult();
  }

  /*获取稽核任务- 结果数据*/
  getTaskResult() {
    let that = this;
    AjaxReq.getTaskResult( {
      id: this.props.data.id,
      pageSize: this.pageSize,
      currentPage: this.currentPage,
      auditResult: this.state.status
    }, ( data ) => {
      that.setState( { data: data.data } );
    } );
  }

  /*状态更改处理*/
  selectChange( value ) {
    this.setState( { status: value } );
  }

  /*页码更改，请求新页码数据*/
  pageChange( pageNum ) {
    this.currentPage = pageNum;
    this.getTaskResult();
  }

  /*查询处理*/
  search() {
    this.currentPage = 1;
    this.getTaskResult();
  }

  /*面包屑切换*/
  breadCrumbChange(index){
    this.props.backToList();
  }

  /*表格列渲染*/
  getColumn() {
    return [
      { title: "序号", key: "id" },
      { title: "规则名称", key: "ruleName",render(text){
        return <TextOverflow>
          <p style={{maxWidth:"100px",margin:"0px"}}>{text}</p>
        </TextOverflow>
      } },
      {
        title: "规则类型", key: "ruleType", render( text ){
        return RuleConst.typeDic[ text ];
      }
      },
      { title: "稽核表", key: "auditTable" ,render(text){
        return <TextOverflow>
          <p style={{maxWidth:"100px",margin:"0px"}}>{text}</p>
        </TextOverflow>
      }},
      {
        title: "开始时间", key: "startTime",
        render( text ){
          return new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" );
        }
      },
      {
        title: "结束时间", key: "endTime",
        render( text ){
          return new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" );
        }
      },
      {
        title: "时长(s)", key: "runningTime",
        render( text, item ){
          return CommonUtil.getTimers( text );
        }
      },
      {
        title: "稽核结果", key: "result", render( text ){
        return resultDic[ text ];
      }
      },
      { title: "问题描述", key: "describle",render(text){
        return <TextOverflow>
          <p style={{maxWidth:"100px",margin:"0px"}}>{text}</p>
        </TextOverflow>
      } }
    ];
  }

  render() {
    let column = this.getColumn();
    return (
      <EditPanel
        breadCrumbList={[{text:"稽核任务"},{text:"查看结果"}]}
        onChange={this.breadCrumbChange.bind(this)}>
        <div className="module-container">
          <div style={{height:"30px"}}>
            <button
              className="btn btn-sm btn-primary" style={{float:"right"}}
              onClick={this.search.bind(this)}>查询
            </button>
            <Select
              style={{float:"right",marginRight:"10px",width:"200px"}}
              placeholder="请选择稽核结果"
              value={this.state.status}
              onChange={this.selectChange.bind(this)}
            >
              {
                this.statusList.map((item,index) => {
                  return <Option key={index} value={item.id}>{item.name}</Option>
                  })
                }
            </Select>
          </div>
          <div className="module-table">
            <DataTable
              data={this.state.data} showPage="true"
              column={column} howRow={this.pageSize}
              onPageChange={this.pageChange.bind(this)}
            ></DataTable>
          </div>
          <button
            className="btn btn-sm btn-default"
            style={{marginTop:"20px"}}
            onClick={this.props.backToList}>返回
          </button>
        </div>
      </EditPanel>
    );
  }
}
export default TaskResultPanel