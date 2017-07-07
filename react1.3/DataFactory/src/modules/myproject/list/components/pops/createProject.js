import React from 'react'

import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import FormFooter from  'CommonComponent/component/formfooter'
import AjaxReq from '../../../ajax/AjaxReq'

let CreateProject = React.createClass({
  /*弹出框弹出*/
  open(isNew){
    this.isNew = isNew;
    this.refs.modal.open();
  },
  /*写入数据*/
  setData(data){
    this.nameIsRepeat = false;
    this.cnNameIsRepeat = false;
    this.setState({title: data.title, data: data ? data.data : {}});
  },
  /*数据change时的处理*/
  handleChange(dataField, evt){
    let infoData = this.state.data;
    if (dataField == "enName") {
      this.nameIsRepeat = false;
    }
    if (dataField === "cnName") {
      this.cnNameIsRepeat = false;
    }
    infoData[dataField] = evt.target.value;
    this.setState({});
    if (evt) evt.stopPropagation();
  },
  /*初始化state及验证规则*/
  getInitialState() {
    let that = this;
    this.rules = {
      cnName(value) {
        let isError = BaseValidate.validateInput({
          isRequired: true,
          label: "项目名称",
          value: value
        });
        if (isError) {
          return isError
        } else if (that.cnNameIsRepeat) {
          return "项目名称不能重复！";
        }
        return "";
      },
      enName(value){
        let isError = BaseValidate.validateInput({label: "项目编码", value, isRequired: true});
        if (isError) {
          return isError;
        } else if (that.nameIsRepeat) {
          return "项目编码不能重复！";
        }
        return "";
      },
      description(value){
        return BaseValidate.validateInput({
          isRequired: false,
          label: "项目描述",
          maxLength: 128,
          value: value
        });
      }
    }
    return {data: {}}
  },

  //保存处理
  handleSubmit(evt) {
    const formSuccess = this.refs.projectForm.validate(this.state.data);
    if (formSuccess) {    //验证通过
      //this.checkProjectName();
      this.save();
    }
    evt.preventDefault();
  },
  /*校验项目编码重名*/
  checkProjectName(){
    let _data = this.state.data;
    let that = this;
    AjaxReq.validateProjectCode({
      id: _data.id ? _data.id : "",
      name: _data.enName
    }, (data) => {
      that.nameIsRepeat = Boolean(data.data);
      that.refs.nameFormItem.validate(_data.enName);
    });
  },
  /**
   * 校验 项目名称 CnName
   */
  checkProjectCnName(){
    let _data = this.state.data;
    let that = this;
    AjaxReq.validateCnName({
      id: _data.id ? _data.id : "",
      name: _data.cnName
    }, (data) => {
      that.cnNameIsRepeat = Boolean(data.data);
      that.refs.cnNameFormItem.validate(_data.cnName);
    });
  },
  /*保存到后台，成功后并返回列表并查询*/
  save(){
    let that = this;
    AjaxReq.saveProject(this.state.data, (data) => {
      that.refs.modal.close();
      that.props.refreshProject();
    });
  },
  /*关闭弹出框*/
  handleCancel() {
    this.refs.modal.close();
  },
  /*渲染弹出框*/
  render() {
    return (
      <Modal ref="modal" style={{width:"700px"}}>
        <ModalHeader>
          <h4 className="modal-title">{this.state.title}</h4>
        </ModalHeader>
        <ModalBody>
          <div className="single-column-form myproject-edit-container">
            <Form ref="projectForm" horizontal rules={this.rules}>
              <FormItem label="项目编码" name="enName" ref="nameFormItem" required>
                <RestrictInput
                  type="text" className="form-control" style={{height:"30px"}}
                  restrict={RestrictConst.NUM_STRING_UNDERLINE_16} disabled={!this.isNew}
                  value={this.state.data.enName} onChange={this.handleChange.bind(this,"enName")}
                  onBlur={this.checkProjectName}
                />
              </FormItem>
              <FormItem label="项目名称" ref="cnNameFormItem" required name="cnName">
                <RestrictInput
                  type="text" className="form-control" style={{height:"30px"}}
                  restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_24}
                  onBlur={this.checkProjectCnName}
                  value={this.state.data.cnName} onChange={this.handleChange.bind(this,"cnName")}
                />
              </FormItem>
              <FormItem label="项目描述" name="description">
                <RestrictTextarea
                  rows="4" className="form-control" style={{height:"60px"}}
                  value={this.state.data.description}
                  onChange={this.handleChange.bind(this,"description")}/>
              </FormItem>
              {/*<FormItem label="引入项目:" name="inportProjectName">
               <div className="input-group">
               <input type="text" className="form-control" value={this.state.importProject}/>
               <a href="javascript:void(0);" className="file">选择文件
               <input type="file" name="" id=""  accept=".rar,.zip"/>
               </a>
               </div>
               </FormItem>*/}
            </Form>
            <FormFooter
              className="myproject-createProject-controllBar" btnStyle={{width:"70px"}}
              submitClick={this.handleSubmit} cancelClick={this.handleCancel}/>
          </div>

        </ModalBody>
      </Modal>

    );
  }
});
export default CreateProject;
