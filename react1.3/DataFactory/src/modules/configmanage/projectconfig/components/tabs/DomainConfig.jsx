/****************************************************
 * create by qing.feng
 * time 2016/7/21 11:40
 * desc：项目配置-主题域配置
*****************************************************/
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import confirm from 'bfd-ui/lib/confirm'

import AddRowTable from 'CommonComponent/component/addrowtable'
import RestrictInput from 'CommonComponent/component/restrictinput'
import FormFooter from 'CommonComponent/component/formfooter'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import AuthButton from 'CommonComponent/component/authbutton'
import message from 'CommonComponent/component/bdosmessage'

import AjaxReq from '../../ajax/AjaxReq'


class DomainConfig extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { domainList: {} };
    this.deleteItem = this.deleteItem.bind(this);
  }



  /*删除主题域处理*/
  deleteLevel( item ) {
    let that = this;
    confirm( '确认删除吗', () => {
      if(item.id){
        that.deleteDomainReq( item );
      }else{
        that.deleteItem(item);
      }
    } )
  }


  /*删除主题域请求*/
  deleteDomainReq( item ) {
    let that = this;
    AjaxReq.deleteDomain( { id: item.id }, () => {
      message.success( "删除成功" );
      that.deleteItem(item);
    } );
  }

  /*从数组中删除匹配项*/
  deleteItem(item){
    let domainList = this.state.domainList.totalList;
    domainList.map( ( domainItem, index ) => {
      if ( domainItem === item ) {
        domainList.splice( index, 1 );
      }
    } );
    if(!domainList.length){
      domainList.push({});
    }
    this.setState( { ...this.state } );
  }

  /*上移处理*/
  goUp( item ) {
    let domainList = this.state.domainList.totalList;
    this.state.domainList.totalList = CommonUtil.upRecord( domainList, item );
    this.setState( { ...this.state } );
  }

  /*下移处理*/
  goDown( item ) {
    let domainList = this.state.domainList.totalList;
    this.state.domainList.totalList = CommonUtil.downRecord( domainList, item );
    this.setState( { ...this.state } );
  }
  /*输入框change处理，写入state中*/
  itemChangeHandle( isSelect, item, dataField, evt ) {
    if ( isSelect ) {
      item[ dataField ] = evt;
    } else {
      item[ dataField ] = evt.target.value;
    }
    this.setState( { ...this.state } );
  }
  /*弹出当前窗口*/
  open() {
    this.refs.domainConfigModal.open();
  }
  /*取消点击处理，关闭当前弹出窗口*/
  handleCancel() {
    this.refs.domainConfigModal.close();
  }
  /*保存点击处理，验证表格中填写信息，通过后直接保存到后台数据库*/
  handleSubmit() {
    let isSuccess = this.refs.domainConfigTable.validate();
    if ( isSuccess ) {
      let dmList = this.state.domainList.totalList;
      dmList.map( ( item ) => {
        if ( !item.projectCode ) {
          item.projectCode = window.projectCode;
        }
        if ( !item.hierarchyCode ) {
          item.hierarchyCode = this.state.levelCode;
        }
      } );
      let listStr = JSON.stringify( dmList );
      let that = this;
      AjaxReq.saveDomain( { saveList: listStr }, ( data ) => {
        that.handleCancel();
        that.props.refreshList();
      } );
    }
  }

  /*设置主题域配置的表格-列*/
  getDomainColumn() {
    let that = this;
    return [
      {
        title: "主题域", key: "name",
        isRequired: true, render( text, item ){
        return (
          <RestrictInput
            className="form-control input-width"
            type="text"
            value={text}
            retrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_32}
            onChange={that.itemChangeHandle.bind(that,false,item,'name')}
          />);
      }
      },
      {
        title: "描述",
        key: 'comment',
        render( text, item ){
          return (
            <RestrictInput
              className="form-control input-width"
              type="text"
              value={text}
              retrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
              onChange={that.itemChangeHandle.bind(that,false,item,'comment')}
            />);
        }
      },
      {
        title: "操作",
        key: 'operation',
        width:'120px',
        render( record ){
          let dmList = that.state.domainList.totalList;
          let deleteEnabled = record.type == 0 ? true : false;
          let upDisabled = (dmList[ 0 ] === record) ? true : false;
          let downDisabled = dmList[ dmList.length - 1 ] === record ? true : false;
          return (
            <div className="operation-td-div">
              <AuthButton
                renderType="a"
                disabled={deleteEnabled}
                onClick={that.deleteLevel.bind(that,record)}
                title="删除">删除</AuthButton>
              <AuthButton
                renderType="a"
                disabled={upDisabled}
                onClick={that.goUp.bind(that,record)} title="上移">上移</AuthButton>
              <AuthButton
                renderType="a"
                disabled={downDisabled}
                onClick={that.goDown.bind(that,record)} title="下移">下移</AuthButton>
            </div>
          );
        }
      }
    ];
  }

  render() {
    let domainColumn = this.getDomainColumn();
    return (
      <div className="domain-config">
        <Modal ref="domainConfigModal">
          <ModalHeader>
            <h4 className="modal-title">{this.props.title}</h4>
          </ModalHeader>
          <ModalBody>
            <div className="bdos-table">
              <AddRowTable
                ref="domainConfigTable"
                data={this.state.domainList}
                column={domainColumn}
                howRow={100} notRequire={true}/>
            </div>
            <FormFooter className="footer" btnStyle={{width:"70px"}}
                        submitClick={this.handleSubmit.bind(this)} cancelClick={this.handleCancel.bind(this)}/>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
export default DomainConfig