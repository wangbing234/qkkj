/****************************************************
 * create by qing.feng
 * time 2016/7/22 17:03
 * desc：规则配置-查看结果界面
 *****************************************************/
import React from 'react';
import {Form, FormItem} from 'bfd-ui/lib/Form2'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'

import CommonUtil from 'CommonComponent/utils/CommonUtil'

import AjaxReq from '../../ajax/AjaxReq'
import RuleConst from '../../../utils/RuleConst'
const resultDic = {
  all: "全部",
  success: "正常",
  error: "执行失败",
  exception: "数据异常"
};
class RuleResultPanel extends React.Component {
  constructor( props ) {
    super( props );
    let that = this;
    this.rules = { };
    this.state = {data:{}};
  }

  /*弹出当前窗口*/
  open( data ) {
    this.refs.resultPanelModal.open();
    let that = this;
    AjaxReq.getRuleResult( {
      id: data.id
    }, ( _data ) => {
      _data = _data.data?_data.data:{};
      that.setState({data:_data});
    } );
  }

  /*如果运行结果错误，额外多2条查看项*/
  getErrorFormItem(){
    let _data = this.state.data;
    if(_data.result == "exception"){
      return <FormItem label="问题描述" name="describle">
          <div className="label-span">{_data.describle}</div>
        </FormItem>
    }
  }

  render() {
    let _data = this.state.data;
    let errorItem = this.getErrorFormItem();
    return (
      <div>
        <Modal ref="resultPanelModal">
          <ModalHeader>
            <h4 className="modal-title">运行结果</h4>
          </ModalHeader>
          <ModalBody>
            <div className="edit-form ">
              <Form rules={this.rules}>
                <FormItem label="规则名称" name="ruleName">
                  <div className="label-span">{_data.ruleName}</div>
                </FormItem>
                <FormItem label="规则类型" name="ruleType">
                  <div className="label-span">{RuleConst.typeDic[_data.ruleType]}</div>
                </FormItem>
                <FormItem label="稽核结果" name="ruleResult">
                  <div className="label-span" style={{color:_data.result=='success'?'#666':'#f00'}}>{resultDic[_data.result]}</div>
                </FormItem>
                {errorItem}
                <FormItem label="开始时间" name="startTime">
                  <div className="label-span">{_data.startTime?new Date( Number( _data.startTime ) ).format( "yyyy-MM-dd hh:mm:ss" ):""}</div>
                </FormItem>
                <FormItem label="结束时间" name="endTime">
                  <div className="label-span">{_data.endTime?new Date( Number( _data.endTime ) ).format( "yyyy-MM-dd hh:mm:ss" ):""}</div>
                </FormItem>
                <FormItem label="持续时长" name="times">
                  <div className="label-span">{CommonUtil.getTimers(_data.runningTime)}</div>
                </FormItem>
                <FormItem label="规则脚本" name="ruleScript">
                  <div className="textarea-span">{_data.executeSql}</div>
                  <label style={{color:"#f00",marginTop:"10px"}}>{_data.result == "error"?"SQL异常，请重新配置！":""}</label>
                </FormItem>
              </Form>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
export default RuleResultPanel