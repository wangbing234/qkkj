import React from 'react';
import {Form, FormItem} from 'bfd-ui/lib/Form2'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import {Select, Option} from 'bfd-ui/lib/Select2'
import { FormCategory,FormCategoryItem } from 'CommonComponent/component/formcategory'
import FormFooter from 'CommonComponent/component/formfooter'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import message from 'CommonComponent/component/bdosmessage'
import EditPanel from 'CommonComponent/component/bdoseditpanel'

import AjaxReq from '../ajax/AjaxReq'
class TaskInfo extends React.Component {
  constructor( props ) {
    super( props );
    let that = this;
    this.smsList = [];
    this.mailList = [];
    this.rules = {
      taskName( value ){
        let isError = BaseValidate.validateInput( { label: "任务名称", value, isRequired: true } );
        if(isError){
          return isError;
        }else if(that.nameIsRepeat){
          return "任务名称不能重复！";
        }
        return "";
      },
      taskDesc( value ){
        return BaseValidate.validateInput( { label: "任务描述", value, maxLength: 255 } );
      }
      /*messages( value ){
        return BaseValidate.validateInput( { label: "消息提醒方式", value, isRequired: true } );
      },
      smsGroup( value ){
        //1 短信组
        if ( that.state.data.messages && that.state.data.messages.indexOf( 1 ) != -1  && typeof( value) != "number") {
          return "短信组不能为空！";
        }
      },
      mailGroup( value ){
        //0 邮件组
        if ( that.state.data.messages && that.state.data.messages.indexOf( 0 ) != -1 && typeof( value) != "number") {
          return "邮件组不能为空！";
        }
      }*/
    };

    this.state = { data: that.setDataToState( that.props.taskData ) };
    //this.state = { data: { messageType: [  ] } };
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval(this.getGroups(), 100);
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount () {
    this.loadInterval && clearInterval(this.loadInterval);
    this.loadInterval = false;
  }

  setDataToState( data ) {
    this.nameIsRepeat = false;
    this.isNew = false;
    if ( !data ) {
      this.isNew = true;
      return {};
    }
    let obj = { ...data };
    obj.messages = [];
    if ( !data.messages ) data.messages = [];
    data.messages.map( ( item, index ) => {
      if ( item.groupType == 0 ) {
        obj.messages.push( 0 );
        obj.mailGroup = item.groupId;
      }
      if ( item.groupType == 1 ) {
        obj.messages.push( 1 );
        obj.smsGroup = item.groupId;
      }
    } );
    return obj;
  }

  changeHandle( dataField, value ) {
    let data = this.state.data;
    if(dataField == "taskName"){
      this.nameIsRepeat = false;
    }
    if ( value && value.target ) {
      data[ dataField ] = value.target.value;
    } else {
      data[ dataField ] = value;
    }

    this.setState( {...this.state} );
  }

  /*select change 处理*/
  selectChange( dataField , refName, value){
    let data = this.state.data;
    data[ dataField ] = value;
    this.refs[refName].validate(value);
    if ( dataField == 'messages' ) {
      if(value.indexOf(1) != -1 && value.indexOf(0) != -1){
      }else if(value.indexOf(1) != -1){
        data.mailGroup = "";//如果value为1, 清空邮件选择项
      }else if(value.indexOf(0) != -1){
        data.smsGroup = "";//如果value为0, 清空短信选择项
      }else{
        data.mailGroup = "";//如果value为1, 清空邮件选择项
        data.smsGroup = "";//如果value为0, 清空短信选择项
      }
      this.refs.smsFormItem.validate(data.smsGroup);
      this.refs.mailFormItem.validate(data.mailGroup);
    }
    this.setState( {...this.state} );
  }

  /*保存任务*/
  saveForm() {
    let isSuccess = this.refs.taskInfoForm.validate( this.state.data );
    if ( isSuccess ) {
      let param = this.setStateToData();
      AjaxReq.saveTaskInfo(param,(data) => {
        message.success("保存成功");
        this.props.backToList();
      });
    }
  }

  getGroups() {
    let that = this;
    AjaxReq.getGroups( {}, ( data ) => {
      that.mailList = data.data.mailList;
      that.smsList = data.data.smsList;
      if(that.loadInterval){
        that.setState( {} );
      }

    } );
  }

  /*将需要保存的数据进行拼接成后端需要的格式*/
  setStateToData() {
    let data = {};
    let that = this;
    data.task = {
      taskName: that.state.data.taskName,
      taskDesc: that.state.data.taskDesc,
      projectCode: window.projectCode,
      id: that.state.data.id
    };
    data.messages = [];
    if(this.state.data.messages){
      this.state.data.messages.map( ( item, index ) => {
        if ( item == 0 ) {
          let mailItem = that.filterItem( that.mailList, "id", that.state.data.mailGroup );
          data.messages.push( {
            groupId: mailItem.id,
            groupName: mailItem.name,
            groupType: 0
          } );
        } else {
          let smsItem = that.filterItem( that.smsList, "id", that.state.data.smsGroup );
          data.messages.push( {
            groupId: smsItem.id,
            groupName: smsItem.name,
            groupType: 1
          } );
        }
      } );
    }
    return data;
  }

  filterItem( arr, key, value ) {
    let fItem = null;
    arr.filter( ( item ) => {
      if ( item[ key ] == value ) {
        fItem = item;
      }
    } );
    return fItem;
  }

  /*校验名称重复*/
  checkRepeat(){
    let _data = this.state.data;
    let that = this;
    let param = {
      taskId:_data.id,
      taskName:_data.taskName,
      projectCode:window.projectCode
    };
    AjaxReq.validateNameRepeat({data:JSON.stringify(param)},(data) => {
      that.nameIsRepeat = Boolean(data.data);
      that.refs.nameFormItem.validate(_data.taskName);
    });
  }

  /*面包屑切换*/
  breadCrumbChange(index){
    this.props.backToList();
  }

  render() {
    return (
    <EditPanel
      breadCrumbList={[{text:"稽核任务"},{text:this.isNew?"新增任务":"编辑任务"}]}
      history={this.props.history} onChange={this.breadCrumbChange.bind(this)}>
      <FormCategory>
        <FormCategoryItem name="基本信息">
          <div className="single-column-form edit-form">
            <Form ref="taskInfoForm" data={this.state.data} rules={this.rules} labelWidth={150}>
              <FormItem label="任务名称" ref="nameFormItem" required name="taskName">
                <RestrictInput
                  restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                  className="form-control" type="text"
                  value={this.state.data.taskName}
                  onChange={this.changeHandle.bind(this,"taskName")}
                  tipString="只能输入中文、字母、数字、下划线，长度不超过64个字符"
                  onBlur={this.checkRepeat.bind(this)}
                />
              </FormItem>
              <FormItem label="任务描述" name="taskDesc">
                <RestrictTextarea
                  className="form-control" type="text"
                  value={this.state.data.taskDesc}
                  onChange={this.changeHandle.bind(this,"taskDesc")}
                  style={{height:"60px"}}/>
              </FormItem>
              <FormItem ref="messageFormItem" label="消息提醒方式" name="messages">
                <CheckboxGroup
                  selects={this.state.data.messages}
                  onChange={this.selectChange.bind(this,"messages","messageFormItem")}>
                  <Checkbox value={1}>短信</Checkbox>
                  <Checkbox value={0}>邮件</Checkbox>
                </CheckboxGroup>
              </FormItem>
              <FormItem label="短信组" ref="smsFormItem" name="smsGroup">
                <Select
                  searchable
                  disabled={this.state.data.messages && this.state.data.messages.indexOf(1) != -1? false:true}
                  value={this.state.data.smsGroup}
                  placeholder="请选择"
                  onChange={this.selectChange.bind(this,"smsGroup","smsFormItem")}>
                  {
                    this.smsList.map((item,index) => {
                      return <Option key={index} value={item.id}>{item.name}</Option>
                      })
                    }
                </Select>
              </FormItem>
              <FormItem label="邮件组" ref="mailFormItem" name="mailGroup">
                <Select
                  searchable
                  disabled={this.state.data.messages && this.state.data.messages.indexOf(0) != -1? false:true}
                  value={this.state.data.mailGroup}
                  placeholder="请选择"
                  onChange={this.selectChange.bind(this,"mailGroup","mailFormItem")}>
                  {
                    this.mailList.map((item,index) => {
                      return <Option key={index} value={item.id}>{item.name}</Option>
                      })
                    }
                </Select>
              </FormItem>
            </Form>
          </div>
        </FormCategoryItem>

      </FormCategory>
      <FormFooter
        style={{marginLeft:"323px"}}
        submitClick={this.saveForm.bind(this)}
        cancelClick={this.props.backToList}/>
    </EditPanel>

    );
  }
}
export default TaskInfo