import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'

import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import IconButton from 'CommonComponent/component/iconbutton'
import AuthButton from 'CommonComponent/component/authbutton'
import message from 'CommonComponent/component/bdosmessage'

import TypeConst from '../../utils/TypeConst'
import AjaxReq from '../../ajax/AjaxReq'

class OutputListPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.selectList = [];
    this.pageSize = 10;
    this.currentPage = 1;
    this.state = {};
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getDbTypeList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*获取数据库类型列表数据*/
  getDbTypeList() {
    let that = this;
    AjaxReq.getDatabaseTypeList( {}, ( data )=> {
      data = data.data;
      data.map( ( item ) => {
        TypeConst.dataSourceTypeIdDic[ item.typeId ] = item.name;
        TypeConst.dataSourceTypeDic[ item.name ] = item.typeId;
      } );
      if ( that.loadInterval ) {
        that.getList();
      }
    } );
  }

  /*获取列表数据*/
  getList() {
    let that = this;
    AjaxReq.getExportList( {
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
        title: '源表名/目录',
        key: 'hiveTableName',
        render(text,item){
          return item.storageType == TypeConst.importType?item.hiveTableName:item.hdfsUrl;
        }
      }, {
        title: '导出类型',
        key: 'datasourceType',
        render( text, item ){
          let str = TypeConst.dataSourceTypeIdDic[ Number( text ) ]
          return str ? str : TypeConst.dataAccess_typeDic[ item.syncType ];
        }
      }, {
        title: '目标表/目录',
        key: 'tableName',
        render( text, item ){
          return item.typeCode == TypeConst.DB ? item.tableName : item.ftpDir;
        }
      }, {
        title: '创建时间',
        key: 'createTime',
        render( text ){
          return text?new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" ):"";
        }
      }, {
        title: '更新时间',
        key: 'updateTime',
        render( text ){
          return text?new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" ):"";
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
              data-code="1020406" title="编辑"
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
        <div className="module-search dropdown-menu-container" style={{marginTop:"10px", height:"30px"}}>
          <Dropdown ref="addNewDropdown">
            <DropdownToggle>
              <IconButton
                data-code="1020404" renderType="icon"
                type="plus-square">新增</IconButton>
            </DropdownToggle>
            <DropdownMenu>
              <Option value={TypeConst.DB} onClick={this.dbItemClick.bind(this,TypeConst.DB)}>DB</Option>
              <Option value={TypeConst.FTP} onClick={this.dbItemClick.bind(this,TypeConst.FTP)}>FTP</Option>
            </DropdownMenu>
          </Dropdown>
          <IconButton
            data-code="1020405" renderType="icon"
            disabled={disabledDelete} type="trash"
            onClick={this.popDelete.bind(this)}>删除</IconButton>
          <button
            className="btn btn-sm btn-primary"
            style={{marginLeft:"10px",float:"right"}}
            onClick={this.searchHandler.bind(this)}> 查询
          </button>
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
export default OutputListPanel;