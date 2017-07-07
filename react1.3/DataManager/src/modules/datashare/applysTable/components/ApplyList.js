import React from 'react'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import DataTable from 'bfd-ui/lib/DataTable'

import RestrictInput from 'CommonComponent/component/restrictinput'
import AuthButton from 'CommonComponent/component/authbutton'

import ApplyAuthority from './pops/ApplyAuthority'
import ShareToUserOrRole from './pops/ShareToUserOrRole'
import AjaxReq from '../../model/AjaxReq'
import CommonUtil from 'CommonUtil'
import EventName from 'EventName'
import TypeConst from '../../utils/TypeConst'
import SeeTable from 'SeeTable'

class ApplyList extends React.Component {

  constructor( prop ) {
    super( prop );
    this.pageSize = 10;
    this.currentPage = 1;
    this.state = {
      tenantId: '',
      status: TypeConst.status.ALL,
      tableName: '',
      data: {
        totalList: [ ],
        "currentPage": 1,//当前页
        "totalPageNum": 50//总页数
      }
    }
    /*EventEmitter.subscribe( EventName.CHANGE_NAVITEM,(data) => {
      if ( this.loadInterval && data.href.indexOf( "/datashare/applyhistory" ) != -1 ) {
        this.getList()
      }
    } );*/
  }


  /*组件实例化完成获取列表数据*/
  componentWillMount () {
    this.loadInterval = setInterval( this.getList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    //EventEmitter.remove(EventName.CHANGE_NAVITEM);
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  handleChange( dataField, evt ) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState( { [dataField]: value } );
  }

  /*获取列表数据*/
  getList() {
    let that = this;
    //flag=0&state=0&tableName=d&applyTenant=&currentPage=1&pageSize=3
    let param = {
      flag: this.props.flag,
      applyTenantId: this.state.tenantId ? this.state.tenantId : 0,
      tableName: this.state.tableName,
      pageSize: this.pageSize,
      currentPage: this.currentPage
    };
    //flag=0我的申请,flag=1 他人申请
    if ( !this.props.flag ) {
      param.status = Number( this.state.status );
    } else {
      param.status = 0;
    }
    AjaxReq.getApplysTable( param, ( result ) => {
      if ( that.loadInterval ) {
        result.data.totalList = result.data.totalList ? result.data.totalList : []
        that.listData = result.data.totalList;
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

  pageChange( cpage ) {
    this.currentPage = cpage;
    this.getList();
    /*if ( this.props.flag && window.BFD.userType === BFD.ENUM.UserType.USER ) {
      let startIndex = this.currentPage * this.pageSize - 1;
      let _listData = this.listData.slice( startIndex, startIndex + this.pageSize );
      _listData = _listData ? _listData : [];
      this.setState( { data: { ...this.state.data, totalList: _listData } } );
    } else {
      this.getList();
    }*/
  }

  /**查看表**/
  seeTable( data ) {
    //CommonUtil.seeTableDetails( data.tableName );
    this.refs.seeTable.setState( { tableName: data.tableName, database: data.database } );
    this.refs.seeTable.refs.modal.open();
  }

  /**查看权限申请**/
  seeApply( data ) {
    this.refs.applyAuthority.open( data );
  }

  /**分享给用户**/
  shareToUser( data ) {
    this.refs.shareToUserOrRole.open( data );
  }

  getColumns() {
    return [ {
      title: '表',
      key: 'tableName',
      render: ( text, record )=> {
        return <a href="javascript:void(0);" onClick={this.seeTable.bind(this,record)}>{text}</a>;
      }
    }, {
      title: '库',
      key: 'database'
    }, {
      title: '所属项目',
      key: 'projectCode'
    }, {
      title: '所属租户',
      key: 'tableTenantName'
    }, {
      title: '创建人',
      key: 'tableCreateUser'
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
        return text ? new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" ) : "";
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
      render: ( record, text )=> {
        let share;
        let shareDisabled = record.status === TypeConst.status.ALREADY_PASSED ? false : true;
        if ( window.BFD.userType == BFD.ENUM.UserType.OWNER ) {
          share = <AuthButton renderType="a" disabled={shareDisabled} onClick={this.shareToUser.bind(this,record)} title="分享">分享</AuthButton>
        }
        return (<div>
          {share}
          <AuthButton renderType="a" onClick={this.seeApply.bind(this,record)} title="查看">查看</AuthButton>
        </div>);
      }
    } ];
  }


  render() {
    let column = this.getColumns();
    let stateItem = this.props.flag ?
      null : <Select
      value={this.state.status} className="common-margin-right common-right"
      onChange={this.handleChange.bind(this,'status')}>
      {
        TypeConst.statusArr.map( ( item, index ) => {
          return (<Option
            key={index}
            value={item.id}>{item.name}</Option>);
        } )
      }
    </Select>
    return (<div className="module-container">
      {/*<div>
       <BreadCrumb msgArr={breadCrumbArr} history={this.props.history} />
       </div>*/}
      <div className="module-search" style={{height:'30px'}}>
        <button className="btn btn-sm btn-primary common-right" onClick={this.search.bind(this)}>查询</button>
        <RestrictInput
          type="text" value={this.state.tableName}
          className="form-control common-input common-right"
          onChange={this.handleChange.bind(this,"tableName")} placeholder="表名称"/>
        {stateItem}
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
      </div>
      <div className="module-table">
        <DataTable
          data={this.state.data}
          column={column} showPage="true"
          howRow={this.pageSize}
          onPageChange={this.pageChange.bind( this )}
        />
      </div>
      <ApplyAuthority ref="applyAuthority"/>
      <ShareToUserOrRole ref="shareToUserOrRole" refreshList={this.getList.bind(this)}/>
      <SeeTable ref="seeTable"/>
    </div>)
  }
}

export default ApplyList;
