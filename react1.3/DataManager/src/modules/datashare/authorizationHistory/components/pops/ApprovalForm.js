import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import FormFooter from 'CommonComponent/component/formfooter'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import message from 'CommonComponent/component/bdosmessage'

import AjaxReq from '../../../model/AjaxReq'
class ApprovalForm extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
      data: {totalList: []}
    };
    this.rules = {
      data: value => {
        if (!value.totalList || (value.totalList && !value.totalList.length)) {
          return "申请内容不能为空！";
        }
      },
      applyReason: value => {
        return BaseValidate.validateInput({isRequired: false, label: "申请理由", value: value, maxLength: '255'});
      }
    }
  }

  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: value});
  }

  //submit按钮提交操作
  handleSubmit(isAgreen, e) {
    let that = this;
    let isSuccess = this.refs.form.validate(this.state.data);
    if (isSuccess) {
      AjaxReq.submitApplyTable({
        ids: this.ids,
        num: isAgreen ? 0 : 1,//0同意，1驳回
        replyReson: this.state.replyReson
      }, (data)=> {
        message.success(data.msg);
        that.close();
        that.props.refreshList();
      });
    }
    if (e) {
      e.preventDefault()
    }
    //调用保存方法
  }

  open(ids, readOnly, showAgreen) {
    this.ids = ids;
    this.readOnly = readOnly;
    this.showAgreen = showAgreen;
    this.setState({replyReson: "", applyReson: ""});
    this.getList(ids);
    this.refs.modal.open();
  }

  getList(ids) {
    let that = this;
    AjaxReq.getApplyDetail({
      ids: ids
    }, (data) => {
      data = data.data;
      let others = data.totalList && data.totalList.length > 0 ? data.totalList[0] : {}
      that.setState({data: data, ...others});
    });
  }

  close() {
    this.refs.modal.close();
  }

  getColumns() {
    /*applyTime: "2016-01-21 16:58:14"
     applyUser: "User1"
     approvalTime: "2016-01-21 16:58:14"
     key: "1"
     memorySize: "0.5G"
     owner: "租户2"
     project: "Project_2"
     status: "0"
     table: "table1"*/
    return [{
      title: '申请人',
      key: 'applyUser',
      render(text){
        return <TextOverflow>
          <p style={{width:'90px'}}>{text}</p>
        </TextOverflow>
      }
    }, {
      title: '所属租户',
      key: 'tableTenantName',
      render(text){
        return <TextOverflow>
          <p style={{width:'90px'}}>{text}</p>
        </TextOverflow>
      }
    }, {
      title: '表',
      key: 'tableName',
      render(text){
        return <TextOverflow>
          <p style={{width:'90px'}}>{text}</p>
        </TextOverflow>
      }
    }, {
      title: '所属项目',
      key: 'projectCode',
      render(text){
        return <TextOverflow>
          <p style={{width:'90px'}}>{text}</p>
        </TextOverflow>
      }
    }, {
      title: '存储量',
      key: 'memory',
      render(text){
        return <TextOverflow>
          <p style={{width:'60px'}}>{text}</p>
        </TextOverflow>
      }
    }];
  }

  /*设置底部按钮*/
  getFooterBtns() {
    if (!this.readOnly && this.showAgreen == 1) {
      return (
        <button
          className="btn btn-sm btn-primary"
          style={{marginRight:"10px"}}
          onClick={this.handleSubmit.bind(this,true)}>同意
        </button>
      )
    } else if (!this.readOnly && this.showAgreen == 2) {
      return (
        <button
          className="btn btn-sm btn-primary"
          style={{marginRight:"10px"}}
          onClick={this.handleSubmit.bind(this,false)}>驳回</button>
      );
    }
  }

  render() {
    let column = this.getColumns();
    let getBtns = this.getFooterBtns();
    let replyResonItem = this.readOnly ?
      <FormItem label="申请理由" name="applyReson">
        <RestrictTextarea
          className="form-control common-textarea"
          disabled={true}
          style={{width:'550px'}}
          value={this.state.applyReson}
          onChange={this.handleChange.bind(this,"applyReson")}/>
      </FormItem> : null;
    return (<div className="apply-authority-modal">
      <Modal ref="modal" className="width680">
        <ModalHeader>
          <h4>申请权限</h4>
        </ModalHeader>
        <ModalBody>
          <Form ref="form" rules={this.rules}>
            <FormItem label="申请内容" name="applyContent">
              <div className="module-table" style={{width:'550px'}}>
                <DataTable data={this.state.data} column={column} showPage="false"/>
              </div>
            </FormItem>
            <FormItem label="权限" name="readOnly">
              <Checkbox
                onChange={this.handleChange.bind(this,'readOnly')}
                checked={true}
                disabled={true}
              >只读</Checkbox>
            </FormItem>
            {replyResonItem}
            <FormItem label="批复" name="replyReson">
              <RestrictTextarea className="form-control common-textarea"
                                style={{width:'550px'}}
                                disabled={this.readOnly}
                                value={this.state.replyReson}
                                onChange={this.handleChange.bind(this,"replyReson")}/>
            </FormItem>
          </Form>
          <div style={{marginLeft:'100px'}}>
            {getBtns}
            <button className="btn btn-sm btn-primary" onClick={this.close.bind(this)}>关闭</button>
          </div>
        </ModalBody>

      </Modal>

    </div>)
  }
}

export default ApprovalForm;
