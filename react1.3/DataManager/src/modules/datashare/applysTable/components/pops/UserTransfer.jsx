/****************************************************
 * create by qing.feng
 * time 2016/8/3 15:28
 * desc：用户/角色穿梭框
 *****************************************************/
import React from 'react';
import Transfer from 'bfd-ui/lib/Transfer'
import Util from 'CommonComponent/utils/CommonUtil'

import AjaxReq from '../../../model/AjaxReq'

class UserTransfer extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      sourceData: [],
      targetData: []
    };
  }

  componentWillMount() {
    //先获取已授权的用户/角色列表
    this.getTargetList();
  }

  /*取已授权的用户/角色列表*/
  getTargetList() {
    let that = this;
    let flag = this.props.flag;
    let data = this.props.data;
    if ( !data ) {
      return;
    }
    let param = {
      tableName: data.tableName,
      database: data.database,
      applyTenantId: data.applyTenantId
    };
    //先获取已授权的用户/角色列表
    let targetList;
    if ( flag === "user" ) {
      AjaxReq.getTargetUser( param, ( data )=> {
        data = data.data;
        targetList = that.setTransferData( data.totalList,'id','shareUser' )
        that.setState( { targetData: targetList ? targetList : [] } );
        that.getSourceList();
      } )
    } else {
      AjaxReq.getTargetRole( param, ( data )=> {
        data = data.data;
        targetList = that.setTransferData( data.totalList,'id','roleName'  );
        that.setState( { targetData: targetList ? targetList : [] } );
        that.getSourceList();
      } )
    }

  }

  setTransferData( list, key,labelField ) {
    let resultList = [];
    list.map( ( item ) => {
      if ( item[key] ) {
        resultList.push( { id: item[key], label: item[ labelField ] } );
      }
    } );
    return resultList;
  }

  //获取全部的用户/角色列表
  getSourceList() {
    let that = this;
    let flag = this.props.flag;
    let data = this.props.data;
    //获取全部的用户/角色列表
    let sourceList;
    if ( flag === "user" ) {
      AjaxReq.getSourceUser( {
        userName: data.applyUser
      }, ( data )=> {
        sourceList = that.setTransferData( data.data, "id","userName" );
        sourceList = Util.removeFormOtherArray( sourceList, that.state.targetData, "label" );
        that.setState( { sourceData: sourceList } );
      } )
    } else {
      AjaxReq.getSourceRole( {
        tenantId: data.applyTenantId
      }, ( data )=> {
        sourceList = that.setTransferData( data.data, "id", "roleName" )
        sourceList = Util.removeFormOtherArray( sourceList, that.state.targetData, "label" );
        that.setState( { sourceData: sourceList } );
      } )
    }

  }

  /*将组件数据写入data中并返回 保存使用*/
  setComponentToData() {
    let list = [];
    this.state.targetData.map( ( item ) => {
      list.push( item.label );
    } );
    return list;
  }

  handleSearch( label, keyValue ) {
    return label.indexOf( keyValue ) != -1;
  }

  render() {
    return (
      <div style={{height:'280px',marginLeft:'50px'}}>
        <Transfer
          height={200} title={this.props.flag === "user"?"已选的用户":"已选的角色"} sdata={this.state.sourceData}
          tdata={this.state.targetData} onSearch={this.handleSearch.bind(this)}/>
      </div>
    );
  }
}
export default UserTransfer