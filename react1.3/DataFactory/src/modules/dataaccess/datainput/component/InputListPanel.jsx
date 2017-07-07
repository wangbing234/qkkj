/****************************************************
 * create by qing.feng
 * time 2016/7/26 15:03
 * desc：数据接入-列表界面
 *****************************************************/
import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'

import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import IconButton from 'CommonComponent/component/iconbutton'
import AuthButton from 'CommonComponent/component/authbutton'
import message from 'CommonComponent/component/bdosmessage'

import TypeConst from '../../utils/TypeConst'
import AjaxReq from '../../ajax/AjaxReq'
class InputListPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.selectList = [];
    this.dataSourceList = [];
    this.pageSize = 10;
    this.currentPage = 1;
    this.state = { hivedb: 0 };
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getDbList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*获取数据源列表*/
  getDbList() {
    let that = this;
    AjaxReq.getDataSourceList( { typeName: "" }, ( data ) => {
      that.dataSourceList = [ { id: 0, name: "全部" } ];
      that.dataSourceList = that.dataSourceList.concat( data.data );
      if ( that.loadInterval ) {
        that.setState( {...that.state} );
        that.getList();
      }
    } );
  }

  /*获取列表数据*/
  getList() {
    let that = this;
    AjaxReq.getList( {
      projectCode: window.projectCode,
      dataSource: this.state.hivedb == 0 ? "" : this.state.hivedb,
      name: this.state.resourceName,
      pageSize: this.pageSize,
      pageNo: this.currentPage
    }, ( data ) => {
      if ( that.loadInterval ) {
        that.selectList = [];
        that.setState( { data: data.data } );
      }
    } );
  }

  /*多选操作*/
  handleCheckboxSelect( items ) {
    let that = this;
    this.selectList = [];
    items.map( ( item, index ) => {
      that.selectList.push( item.code );
    } );
    this.setState( { ...this.state } );
  }

  /*查询处理*/
  searchHandler() {
    this.currentPage = 1;
    this.getList();
  }

  /*数据源change处理*/
  typeHandleChange( value ) {
    this.setState( { ...this.state, hivedb: value } );
  }

  /*资源名称change处理*/
  handleChange( e ) {
    this.setState( { ...this.state, resourceName: e.target.value } );
  }

  /*添加菜单点击事件处理*/
  dbItemClick( type, e ) {
    this.props.addRole( { typeCode: type } );
    this.refs.addNewDropdown.close()
  }


  /*删除接口*/
  popDelete( e ) {
    let that = this;
    confirm( '确认删除吗？', () => {
      let param = { codes: that.selectList.join( "," ) };
      AjaxReq.deleteAccess( param, ( data )=> {
        message.success( "删除成功" );
        that.selectList = [];
        that.getList();
      } );
    } )
  }

  /*编辑处理*/
  editHandle( item,isLook ) {
    let that = this;
    AjaxReq.getAccessInfo( {
      code: item.code
    }, ( data ) => {
      that.props.addRole( data.data,isLook );
    } );
  }

  /*页码change处理*/
  pageChange( pageNum ) {
    this.currentPage = pageNum;
    this.getList();
  }

  /*设置表格列*/
  getTableColumn() {
    let that = this;
    return [
      {
        title: '资源名称',
        key: 'name',
        render(text,item){
          return <a href="javascript:void(0);" onClick={that.editHandle.bind(that,item,true)}>{text}</a>
        }
      }, {
        title: '数据源名称',
        key: 'datasourceName'
      }, {
        title: '同步类型',
        key: 'syncType',
        render( text ){
          return TypeConst.dataAccess_typeDic[ text ];
        }
      }, {
        title: '是否增量',
        key: 'isIncreaseImport',
        render( text ){
          return text == TypeConst.ISINCREASEIMPORT ? "是" : "否";
        }
      }, {
        title: '创建时间',
        key: 'createTime',
        render( text ){
          return text ? new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" ) : "";
        }
      }, {
        title: '更新时间',
        key: 'updateTime',
        render( text ){
          return text ? new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" ) : "";
        }
      }, {
        title: '创建人',
        key: 'createUser'
      }, {
        title: '操作',
        key: 'operator',
        render( text, item ){
          return (
            <AuthButton
              renderType="a"
              data-code="1020304" title="编辑"
              onClick={that.editHandle.bind(that,item,false)}>编辑</AuthButton>
          );
        }
      } ];
  }

  render() {
    let column = this.getTableColumn();
    let disabledDelete = this.selectList && this.selectList.length > 0 ? false : true;
    return (
      <div>
        <div className="module-search dropdown-menu-container">
          <Dropdown ref="addNewDropdown">
            <DropdownToggle>
              <IconButton
                data-code="1020302" renderType="icon"
                type="plus-square">新增</IconButton>
            </DropdownToggle>
            <DropdownMenu>
              <Option value={TypeConst.DB} onClick={this.dbItemClick.bind(this,TypeConst.DB)}>DB</Option>
              <Option value={TypeConst.FTP} onClick={this.dbItemClick.bind(this,TypeConst.FTP)}>FTP</Option>
            </DropdownMenu>
          </Dropdown>
          <IconButton
            data-code="1020303" renderType="icon"
            disabled={disabledDelete} type="trash"
            onClick={this.popDelete.bind(this)}>删除</IconButton>
          <button
            className="btn btn-sm btn-primary"
            style={{marginLeft:"10px",float:"right"}}
            onClick={this.searchHandler.bind(this)}> 查询
          </button>
          <Select value={this.state.hivedb} onChange={this.typeHandleChange.bind(this)}
                  style={{width:"200px",float:"right"}}>
            {this.dataSourceList.map((item,index) => {
              return <Option key={index} value={item.id}>{item.name}</Option>
              })}
          </Select>
          <RestrictInput
            type="text" className="form-control common-input" placeholder="资源名称"
            style={{float:"right"}} value={this.state.resourceName}
            onChange={this.handleChange.bind(this)}
            restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE}/>
        </div>
        <div className="module-table">
          <DataTable
            data={this.state.data} showPage="true"
            column={column} howRow={this.pageSize}
            onPageChange={this.pageChange.bind(this)}
            onCheckboxSelect={this.handleCheckboxSelect.bind(this)}
          ></DataTable>
        </div>
      </div>
    );
  }
}
export default InputListPanel;