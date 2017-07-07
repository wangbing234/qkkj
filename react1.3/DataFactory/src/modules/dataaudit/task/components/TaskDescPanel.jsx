import React from 'react';
import {Form , FormItem} from 'bfd-ui/lib/Form2'
import DataTable from 'bfd-ui/lib/DataTable'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import { FormCategory,FormCategoryItem } from 'CommonComponent/component/formcategory'
import EditPanel from 'CommonComponent/component/bdoseditpanel'

import AjaxReq from '../ajax/AjaxReq'
import RuleConst from '../../utils/RuleConst'

const IS_ENABLED = 0;//是否是禁用，0是禁用，1是启用

class TaskDescPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.rules = {};
    this.pageSize = 100;
    this.state = { task: { taskName: "aaa", taskDesc: "test" },totalList:[] };
    this.tableData = {
      "totalList": [ ],
      "currentPage": 1,
      "totalPageNum": 500
    };
  }

  componentDidMount(){
    this.getTaskDescInfo();
  }

  /*面包屑切换*/
  breadCrumbChange(index){
    this.props.backToList();
  }

  getTaskDescInfo() {
    let that = this;
    AjaxReq.getTaskDescInfo( {
      id:this.props.taskData.id
    }, (data) => {
      data = data.data;
      let arr = data.task.messages;
      arr.map((item) => {
        //邮件组
        if(item.groupType == 0 ){
          data.task.mailGroup = item.groupName;
        }else{
          //短信组
          data.task.smsGroup = item.groupName;
        }
      });
      that.setState({...data});
    } );
  }

  /*设置表格列*/
  getColumn() {
    return [
      { title: "序号", key: "id" },
      { title: "规则名称", key: "ruleName",render(text){
        return <TextOverflow>
          <p style={{maxWidth:"100px",margin:"0px"}}>{text}</p>
        </TextOverflow>
      } },
      {
        title: '状态',
        key: 'enabled',
        width: "60px",
        render( text ){
          return text == IS_ENABLED ? "启用" : "禁用"
        }
      },
      {
        title: '规则类型',
        key: 'type',
        width: "180px",
        render( text ){
          return RuleConst.typeDic[ text ];
        }
      },
      { title: "数据库", key: "sourceDatabase",render(text){
        return <TextOverflow>
          <p style={{maxWidth:"100px",margin:"0px"}}>{text}</p>
        </TextOverflow>
      } },
      { title: "稽核表", key: "sourceTable",render(text){
        return <TextOverflow>
          <p style={{maxWidth:"100px",margin:"0px"}}>{text}</p>
        </TextOverflow>
      } },
      { title: "稽核表字段", key: "sourceColumn",render(text){
        return <TextOverflow>
          <p style={{maxWidth:"100px",margin:"0px"}}>{text}</p>
        </TextOverflow>
      } },
      { title: "参照数据库", key: "targetDatabase" ,render(text){
        return <TextOverflow>
          <p style={{maxWidth:"100px",margin:"0px"}}>{text}</p>
        </TextOverflow>
      }},
      { title: "参照表", key: "targetTable",render(text){
        return <TextOverflow>
          <p style={{maxWidth:"100px",margin:"0px"}}>{text}</p>
        </TextOverflow>
      } },
      { title: "参照表字段", key: "targetColumn",render(text){
        return <TextOverflow>
          <p style={{maxWidth:"100px",margin:"0px"}}>{text}</p>
        </TextOverflow>
      } }
    ];
  }

  render() {
    let column = this.getColumn();
    return (
      <EditPanel breadCrumbList={[{text:"稽核任务"},{text:"任务详情"}]}
                 history={this.props.history} onChange={this.breadCrumbChange.bind(this)}>
        <div className="edit-form ">
          <Form data={this.state.data} rules={this.rules}>
            <FormCategory>
              <FormCategoryItem name="基本信息">
                <FormItem label="任务名称" name="taskName">
                  <div className="label-span">{this.state.task.taskName}</div>
                </FormItem>
                <FormItem label="任务描述" name="taskDesc">
                  <div className="label-span">{this.state.task.taskDesc}</div>
                </FormItem>
              </FormCategoryItem>
              <FormCategoryItem name="消息提醒">
                <FormItem label="短信组" name="smsGroup">
                  <div className="label-span">{this.state.task.smsGroup}</div>
                </FormItem>
                <FormItem label="邮件组" name="mailGroup">
                  <div className="label-span">{this.state.task.mailGroup}</div>
                </FormItem>
              </FormCategoryItem>
              <FormCategoryItem name="稽核规则">
                <div className="bdos-table" style={{marginLeft:"-130px",marginRight:"-150px"}}>
                  <DataTable column={column} data={{totalList:this.state.totalList}} howRow={this.pageSize}/>
                </div>
              </FormCategoryItem>
            </FormCategory>
          </Form>
          <button className="btn btn-sm btn-default" style={{marginLeft:"70px"}} onClick={this.props.backToList}>返回
          </button>
        </div>
      </EditPanel>
    );
  }
}
export default TaskDescPanel