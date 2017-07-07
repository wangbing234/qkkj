import React from 'react';
import Transfer from 'bfd-ui/lib/Transfer'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import FormFooter from 'CommonComponent/component/formfooter'
import message from 'CommonComponent/component/bdosmessage'

import UserTransfer from './UserTransfer'
import AjaxReq from '../../../model/AjaxReq'

class ShareToUserOrRole extends React.Component {

  constructor( prop ) {
    super( prop );
    this.activeIndex = 0;
    this.state = {};
  }

  handleChange( dataField, evt ) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState( { [dataField]: value } );
  }


  //submit按钮提交操作
  handleSubmit( e ) {
    let that = this;
    let list = this.activeIndex?this.refs.roleTf.setComponentToData():this.refs.userTf.setComponentToData();
    let param = {
      flag:this.activeIndex,
      tableName:this.data.tableName,
      database:this.data.database,
      applyTenantId:this.data.applyTenantId,
      users:list.join(',')
    }
    AjaxReq.saveShareUsers(param,(data) => {
      message.success(data.msg);
      that.close();
      that.props.refreshList();
    });
    if ( e ) {
      e.preventDefault()
    }
    //调用保存方法
  }

  open( data ) {
    this.data = data;
    this.activeIndex = 0;
    this.setState({...this.state});
    this.refs.modal.open();
  }

  close() {
    this.refs.modal.close();
  }

  tabChange(index, key){
    this.activeIndex = index;
    if(index && this.refs.roleTf){
      this.refs.roleTf.getTargetList();
    }else if(this.refs.userTf){
      this.refs.userTf.getTargetList();
    }
  }

  render() {
    return (<div style={{height:'300px'}}>
      <Modal ref="modal">
        <ModalHeader>
          <h4>申请权限</h4>
        </ModalHeader>
        <ModalBody>
          <Tabs onChange={this.tabChange.bind(this)}>
            <TabList>
              <Tab>用户</Tab>
              <Tab>角色</Tab>
            </TabList>
            <TabPanel>
              <UserTransfer ref="userTf" flag="user" data={this.data}></UserTransfer>
            </TabPanel>
            <TabPanel>
              <UserTransfer ref="roleTf" flag="role" data={this.data}></UserTransfer>
            </TabPanel>
          </Tabs>
          <FormFooter
            submitLabel="提交" style={{textAlign:'center'}}
            submitClick={this.handleSubmit.bind(this)}
            cancelClick={this.close.bind(this)}/>

        </ModalBody>

      </Modal>

    </div>)
  }
}

export default ShareToUserOrRole;
