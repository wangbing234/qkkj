/****************************************************
 * create by qing.feng
 * time 2016/7/22 10:59
 * desc：工作流维护- 定时计划界面
 *****************************************************/
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import DefineChoosePanel from './../tabs/DefineChoosePanel'
import ScriptPanel from './../tabs/ScriptPanel'
import FormFooter from 'CommonComponent/component/formfooter'
import message from 'CommonComponent/component/bdosmessage'
import AjaxReq from './../ajax/AjaxReq'

class DefineTimePanel extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { data: { totalActive: 0 } };
  }

  /*实例化的时候，将数据写入对应的tab页面中*/
  componentDidMount() {
    this.setData( this.data )
  }

  /*弹出当前窗口，并写入数据*/
  open( inforData, taskData ) {
    this.taskData = taskData;
    this.data = inforData;
    this.refs.modal.open();
    this.setData( inforData );
  }

  /*写入数据*/
  setData( data ) {
    if ( !data )return;
    let _data = { isNew: data.isNew, totalActive: 0 };
    if ( !data.isNew ) {
      //解析数据
      if ( data.data.type == "u" ) {
        _data.totalActive = 1;
        this.dateData = null;
        this.scriptData = data.data;
        if(this.refs.choosePanel)this.refs.choosePanel.isNew = true;
      } else {
        this.scriptData = null;
        this.dateData = data.data;
        if(this.refs.choosePanel)this.refs.choosePanel.isNew = false;
      }
    }else{
      this.dateData = null;
      this.scriptData = null;
      if(this.refs.choosePanel){
        this.refs.choosePanel.isNew = true;
        this.refs.choosePanel.initState();
      }
      if(this.refs.scriptPanel){
        this.refs.scriptPanel.initState();
      }
    }
    this.setState( { ..._data } );
  }

  /*点击保存时调用，先进行验证，在进行保存*/
  saveHandle() {
    if ( this.state.totalActive ) {
      if ( this.refs.scriptPanel.validate() ) {
        let scriptParam = this.refs.scriptPanel.getFormData();
        scriptParam.type = "u";
        scriptParam.fromDate = "";
        scriptParam.toDate = "";
        let sParam = this.getParam( scriptParam );
        this.saveReq( sParam );
      }
    } else {
      let choosePanel = this.refs.choosePanel;
      let that = this;
      if ( choosePanel.validate() ) {
        let cParam = that.getTabType();
        cParam.name = "";
        let param = that.getParam( cParam );
        this.saveReq( param );
      }
    }
  }

  /*设置保存时的请求参数*/
  getParam( formData ) {
    let jsonObj = {
      processCode: this.taskData.key,
      projectId: window.projectId,
      timerParas: [],
      remark: '',
      isValid: "true",
      ...formData
    };
    if ( !this.state.isNew ) {
      jsonObj.timerId = `${this.data.data.timerId}`;
    }
    let param = {
      projectId: window.projectId,
      json: JSON.stringify( jsonObj )
    };
    return param;
  }

  /*向后端发送保存请求*/
  saveReq( param ) {
    let that = this;
    if ( this.state.isNew ) {
      AjaxReq.saveTimerInfo( param, ( data ) => {
        message.success( "保存成功" );
        that.cancelHandle();
        this.props.refreshList();
      } );
    } else {
      AjaxReq.updateTimerInfo( param, ( data ) => {
        message.success( "更新成功" );
        that.cancelHandle();
        this.props.refreshList();
      } );
    }

  }

  /*定时器与脚本tab页之间的切换*/
  tabsChange( newIndex ) {
    this.setState( { totalActive: newIndex } );
  }

  /*获取当前tab页参数*/
  getTabType() {
    return this.refs.choosePanel.getFormData();
  }

  /*关闭当前弹出窗口*/
  cancelHandle() {
    this.refs.modal.close();
  }

  render() {
    return (
      <Modal ref="modal">
        <ModalHeader>
          <h4 className="modal-title">定时计划</h4>
        </ModalHeader>
        <ModalBody>
          <Tabs activeIndex={this.state.totalActive} onChange={this.tabsChange.bind(this)}>
            <TabList>
              <Tab>定时器选择</Tab>
              <Tab>自定义脚本</Tab>
            </TabList>
            <TabPanel>
              <DefineChoosePanel ref="choosePanel" data={this.dateData}/>
            </TabPanel>
            <TabPanel>
              <ScriptPanel ref="scriptPanel" data={this.scriptData}/>
            </TabPanel>
          </Tabs>
          <FormFooter
            style={{marginLeft:"100px"}} submitClick={this.saveHandle.bind(this)}
            cancelClick={this.cancelHandle.bind(this)}></FormFooter>
        </ModalBody>
      </Modal>
    );
  }
}
export default DefineTimePanel