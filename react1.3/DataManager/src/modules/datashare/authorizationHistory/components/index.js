import React from 'react'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'

import RestrictInput from 'CommonComponent/component/restrictinput'
import SearchInput from 'CommonComponent/component/searchinput'
import IconButton from 'CommonComponent/component/iconbutton'
import AuthButton from 'CommonComponent/component/authbutton'

import ApprovalForm from './pops/ApprovalForm'
import AjaxReq from '../../model/AjaxReq'
import CommonUtil from 'CommonUtil'
import EventName from 'EventName'

import TypeConst from '../../utils/TypeConst'
import SeeTable from 'SeeTable'

import '../../common/css/style.less'

class Index extends React.Component {

  constructor( prop ) {
    super( prop );
    this.pageSize = 10;
    this.currentPage = 1;
    this.selectList = [];
    this.state = {
      tenantId: '',
      status: 0,
      tableName: ''
    };
    /*EventEmitter.subscribe( EventName.CHANGE_NAVITEM, ( data ) => {
      if ( this.loadInterval && data.href.indexOf( "/datashare/authorizationhistory" ) != -1 ) {
        this.getList()
      }
    } );*/
  }

  /*组件实例化完成获取列表数据*/
  componentWillMount() {
    this.loadInterval = setInterval( this.getList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  handleChange( dataField, evt ) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState( { [dataField]: value } );
  }

  /**多选勾选**/
  handleCheckboxSelect( rows ) {
    this.selectList = [];
    rows.map( ( item ) => {
      this.selectList.push( item.id );
    } );
    this.setState( { ...this.state } );
  }

  /*获取表格数据*/
  getList() {
    let that = this;
    let param = {
      applyTenantId: this.state.tenantId,
      status: this.state.status,
      tableName: this.state.tableName,
      pageSize: this.pageSize,
      currentPage: this.currentPage
    };
    AjaxReq.getMyApprovalsTable( param, ( result ) => {
      if ( that.loadInterval ) {
        that.setState( { data: result.data } )
      }
    } )
  }

  /**查询**/
  search() {
    this.currentPage = 1;
    //查询列表,根据tenantId,tableName查询
    this.getList();
  }

  /*页码change处理*/
  pageChange( cpage ) {
    this.currentPage = cpage;
    this.getList();
  }

  showTable( data ) {
    //CommonUtil.seeTableDetails( data.tableName );
    this.refs.seeTable.setState( { tableName: data.tableName, database: data.database } );
    this.refs.seeTable.refs.modal.open();
  }

  /*回收*/
  recoverClick( items, isDisabled ) {
    if ( isDisabled ) return;
    items = items ? items : this.selectList;
    let that = this;
    let param = {
      ids: items.join( "," )
    };
    AjaxReq.backApplyTable( param, ( result ) => {
      that.getList();
    } )
  }

  /*查看*/
  seeApproval( ids, readOnly, agreenType, isDisabled ) {
    if ( isDisabled ) return;
    this.refs.approvalModal.open( ids, readOnly, agreenType );
  }

  getColumns() {
    let that = this;
    return [ {
      title: '表',
      key: 'tableName',
      render: ( text, record )=> {
        return <a href="javascript:void(0);" onClick={this.showTable.bind(this,record)}>{text}</a>;
      }
    },{
      title: '库',
      key: 'database'
    },  {
      title: '所属项目',
      key: 'projectCode'
    }, {
      title: '所属租户',
      key: 'tableTenantName'
    }, {
      title: '申请人',
      key: 'applyUser'
    }, {
      title: '状态',
      key: 'status',
      render( text ){
        return TypeConst.stateDic[ text ];
      }
    }, {
      title: '申请时间',
      key: 'applyTime',
      render( text ){
        return new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" );
      }
    }, {
      title: '批复时间',
      key: 'replyTime',
      render( text ){
        return text ? new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" ) : "";
      }
    }, {
      title: '操作',
      key: 'operation',
      width: '160px',
      render: ( item, text )=> {
        let applyStatus = item.status == TypeConst.status.ALREADY_PASSED ? true : false;
        let agreenDisabled = item.status != TypeConst.status.NO_APPROVAL ? true : false;
        let recoverDisabled = item.status != TypeConst.status.ALREADY_PASSED ? true : false;
        return (<div>
          <AuthButton renderType="a" disabled={agreenDisabled} onClick={that.seeApproval.bind(that,item.id,false,1,agreenDisabled)} title="同意">同意</AuthButton>
          <AuthButton renderType="a" href="javascript:void(0);" disabled={agreenDisabled}
                      onClick={that.seeApproval.bind(that,item.id,false,2,agreenDisabled)} title="驳回">驳回</AuthButton>
          <AuthButton renderType="a" href="javascript:void(0);" disabled={recoverDisabled}
                      onClick={that.recoverClick.bind(that,[item.id],recoverDisabled)} title="收回">收回</AuthButton>
          <AuthButton renderType="a" href="javascript:void(0);"
                      onClick={this.seeApproval.bind(this,item.id,true,9,false)} title="查看">查看</AuthButton>
        </div>);
      }
    } ];
  }

  render() {
    let column = this.getColumns();
    return (<div className="module-container data-share-div">
        {/*<div>
         <BreadCrumb msgArr={breadCrumbArr} history={this.props.history} />
         </div>*/}
        <div className="module-search" style={{height:'30px'}}>
          <button className="btn btn-sm btn-primary common-right" onClick={this.search.bind(this)}>查询</button>
          <RestrictInput
            type="text" value={this.state.tableName}
            className="form-control common-input common-right"
            onChange={this.handleChange.bind(this,"tableName")} placeholder="表名称"/>
          <Select
            value={this.state.status} className="common-margin-right common-right"
            onChange={this.handleChange.bind(this,'status')}>
            {
              TypeConst.statusArr.map( function ( item, index ) {
                return (
                  <Option key={index}
                          value={item.id}>{item.name}</Option>);
              } )
            }
          </Select>
          <Select
            value={this.state.tenantId} className="common-margin-right common-right"
            onChange={this.handleChange.bind(this,'tenantId')} searchable>
            {
              window.tenantArr.map( function ( item, index ) {
                return (<Option
                  key={index}
                  value={item.id}>{item.tenantName}</Option>);
              } )
            }
          </Select>
          {/*
           <IconButton
           disabled={this.selectList.length==0}
           data-code="1020102" renderType="icon"
           type="plus-square" onClick={this.agreenClick.bind(this,null)}>
           批量同意
           </IconButton>
           <IconButton
           disabled={this.selectList.length==0}
           data-code="1020102" renderType="icon"
           type="plus-square" onClick={this.rejectClick.bind(this,null)}>
           批量驳回
           </IconButton>
           <IconButton
           disabled={this.selectList.length==0}
           data-code="1020102" renderType="icon"
           type="plus-square" onClick={this.recoverClick.bind(this,null)}>
           批量收回
           </IconButton>*/}
        </div>
        <div className="module-table">
          <DataTable
            data={this.state.data} column={column}
            onPageChange={this.pageChange.bind(this)}
            showPage="true" howRow={this.pageSize}/>
        </div>
        <ApprovalForm ref="approvalModal" refreshList={this.getList.bind(this)}/>
        <SeeTable ref="seeTable"/>
      </div>
    )
  }
}

export default Index;
