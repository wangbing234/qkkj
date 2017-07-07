import React from 'react'
import {Select, Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import confirm from 'bfd-ui/lib/confirm'
import message from 'CommonComponent/component/bdosmessage'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import IconButton from 'CommonComponent/component/iconbutton'
import AuthButton from 'CommonComponent/component/authbutton'

import AjaxReq from '../ajax/AjaxReq'

let that;
let pageSize = 15;
let currentPage = 1;
let delItem;

const HbaseType = "HBase";
const HiveType = "Hive";

const column = [
  {
    title: '资源类型',
    key: 'resourceType',
    render( text, item ){
      return item.resourceType.name;
    }
  }, {
    title: '资源名称',
    key: 'resourceName',
    render( text ){
      return <span title={text}>{text}</span>
    }
  }, {
    title: 'IP/主机名',
    key: 'host'
  }, {
    title: '服务端口',
    key: 'port',
    render( text ){
      if ( text ) {
        return text
      } else {
        return "";
      }
    }
  }, {
    title: '创建时间',
    key: 'createTimeStr'
  }, {
    title: '更新时间',
    key: 'updateTimeStr'
  }, {
    title: '创建人',
    key: 'createUser'
  }, {
    title: '操作',
    key: 'operation',
    render( item, text ){
      let controllView;
      //当用户不是管理员，且不是自己创建的资源时不允许编辑删除
      if ( !item.isSub ) {
        controllView = <AuthButton
          renderType="a"
          onClick={that.addOrEditHandler.bind(that,{formData: item.configXml,resourceId:item.id,createUser:item.createUser,isLook:true},true)}
          title="详情">详情</AuthButton>
      } else {
        let deleteItem = [HbaseType,HiveType].indexOf( item.resourceType.name ) != -1 ? null:
          <AuthButton
            renderType="a"
            data-code="1050104"
            onClick={that.delHandler.bind(that,item)}
            title="删除">删除</AuthButton>
        controllView = <div>
          <AuthButton
            renderType="a"
             onClick={that.addOrEditHandler.bind(that,{formData: item.configXml,resourceId:item.id,createUser:item.createUser,isLook:true},true)}
            title="详情">详情</AuthButton>
          <AuthButton
            renderType="a"
            data-code="1050105"
             onClick={that.addOrEditHandler.bind(that,{formData: item.configXml,resourceId:item.id},true)}
            title="编辑">编辑</AuthButton>
          {deleteItem}
        </div>
      }
      return controllView;
    }
  } ]

class ListForm extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      pageSize: 10,
      resourceName: '',
      resourceType: 0
    };
    that = this;
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getListByUrl(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*获取列表数据*/
  getListByUrl() {
    if ( !this.props.typeList ) {
      return;
    }
    let resourceId = this.state.resourceType ? this.state.resourceType : 0;
    AjaxReq.getResourceList( currentPage, pageSize, resourceId, this.state.resourceName, ( resultData )=> {
      if ( this.loadInterval ) {
        that.setState( { ...that.state, data: resultData.data } );
      }
    } );
  }

  /*资源类型改变时，将改变的值写到state中存储*/
  typeHandleChange( value ) {
    this.setState( { resourceType: value } );
  }

  /*资源名称改变时，将改变的值写到state中存储*/
  handleChange( e ) {
    this.setState( { resourceName: e.target.value } );
  }

  /*点击查询的处理方法*/
  searchHandler() {
    currentPage = 1;
    this.getListByUrl();
  }

  /*点击新增/编辑的处理方法*/
  addOrEditHandler( item, isEdit ) {
    this.props.openHandler( item, isEdit );
  }

  /*点击删除的处理方法*/
  delHandler( item ) {
    delItem = item;
    confirm( '确认删除吗', () => {
      that.delItemUrl();
    } )
  }

  /*分页切换处理*/
  onPageChange( nextPage ) {
    currentPage = nextPage;
    this.getListByUrl();
  }

  /*后台交互删除数据*/
  delItemUrl() {
    console.log( "delete item : ", delItem );
    AjaxReq.deleteResourceItem( delItem, ( resultData )=> {
      message.success( resultData.msg );
      that.getListByUrl();
    } )
  }

  /*组件渲染*/
  render() {
    that = this;
    let typeList = this.props.typeList || [ {} ];
    return (<div>
      <div className="module-search">
        <IconButton
          data-code="1050102"
          renderType="icon"
          type="plus-square"
          onClick={this.addOrEditHandler.bind(this,{},false)}>新增
        </IconButton>
        <button
          className="btn btn-sm btn-primary"
          style={{marginLeft:"10px",float:"right"}}
          onClick={this.searchHandler.bind(this)}> 查询
        </button>
        <Select
          defaultValue="0"
          value={this.state.resourceType}
          onChange={this.typeHandleChange.bind(this)}
          style={{float:"right"}}>
          {typeList.map((item,index) => {
            return <Option key={index} value={item.id}>{item.name}</Option>
            })}
        </Select>
        <RestrictInput
          type="text"
          className="form-control common-input"
          placeholder="请输入资源名称关键字"
          style={{float:"right"}}
          value={this.state.resourceName}
          onChange={this.handleChange.bind(this)}
          restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE}/>


      </div>
      <div className="module-table operatioinTable">
        <DataTable
          data={this.state.data}
          onPageChange={this.onPageChange.bind(this)}
          showPage="true"
          column={column}
          howRow={pageSize}></DataTable>
      </div>
    </div>);
  }
}
export default ListForm