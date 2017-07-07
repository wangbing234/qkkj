import React from 'react'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'

import RestrictInput from 'CommonComponent/component/restrictinput'
import IconButton from 'CommonComponent/component/iconbutton'

import ApplyAuthority from './pops/applyAuthority'
import SeeTenant from 'SeeTenant'
import AjaxReq from '../../model/AjaxReq'
import CommonUtil from 'CommonUtil'
import EventName from 'EventName'
import SeeTable from 'SeeTable'
import '../../common/css/style.less'

class SubLayout extends React.Component {

  constructor( prop ) {
    super( prop );
    this.selectList = [];
    this.pageSize = 10;
    this.currentPage = 1;
    this.state = {
      id: '',
      tableName: ''
    };
    /*EventEmitter.subscribe(EventName.CHANGE_NAVITEM,(data) => {
      if ( this.loadInterval && data.href.indexOf("/datashare/sharelist")!=-1) {
        this.getList()
      }
    });*/
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

  getList() {
    let that = this;
    //查询列表,根据tenantId,tableName查询
    let param = {
      tenantid: this.state.id ? this.state.id : 0,
      tableName: this.state.tableName,
      pageSize: this.pageSize,
      currentPage: this.currentPage
    };
    AjaxReq.getShareList( param, ( result ) => {
      if ( that.loadInterval ) {
        result.data.totalList && result.data.totalList.map((item,index)=>{
          if(item.flag == 2 || item.flag == 1){//已申请的或自己创建的不能申请
            item.disabled = true;
          }
        });

        that.selectList = [];
        that.setState( { data: result.data } )
      }
    } )
  }

  /**查询**/
  search() {
    this.currentPage = 1;
    this.getList();
  }

  pageChange( cpage ) {
    this.currentPage = cpage;
    this.getList();
  }

  showModal( data ) {
    //CommonUtil.seeTableDetails( data.tableName );
    this.refs.seeTable.setState( { tableName: data.tableName, database: data.database } );
    this.refs.seeTable.refs.modal.open();
  }

  /**多选勾选**/
  handleCheckboxSelect( rows ) {
    this.selectList = [];
    rows.map( ( item ) => {
      if(item.flag != 2 && item.flag != 1)
      this.selectList.push( item.id );
    } );
    this.setState( { ...this.state } );
  }

  /**申请**/
  apply( data ) {
    data = data ? data : this.selectList;
    this.refs.applyModal.open( data );
  }

  /**授权租户数**/
  seeTenant( record ) {
    this.refs.seeTenantModal.open( record );
  }

  getColumns() {
    let oper = {
      title: '操作',
      key: 'operation',
      render: ( item, text )=> {
        //flag 0:可申请，1：自己创建的表 2：已申请的
        if ( item.flag == 0 ) {
          return (<div>
            <a href="javascript:void(0);" onClick={this.apply.bind(this,[item.id])}>申请</a>
          </div>);
        } else if ( item.flag == 1 ) {
          return '-';
        } else {
          return <span>已申请</span>
        }
      }

    };
    let columns = [
      {
        title: '表',
        key: 'tableName',
        render: ( text, data )=> {
          return <a href="javascript:void(0);" onClick={this.showModal.bind(this,data)}>{text}</a>;
        }
      },{
        title: '表中文',
        key: 'tableNameZh'
      },{
        title: '库',
        key: 'database'
      }, {
        title: '表所属租户',
        key: 'tenantName'
      }, {
        title: '创建人',
        key: 'createUser'
      }, {
        title: '授权租户数',
        key: 'authUserCount',
        render: ( text, item )=> {
          return (<div>
            <a href="javascript:void(0);" onClick={this.seeTenant.bind(this,item)}>{text}</a>
          </div>);
        }
      },{
        title: '共享时间',
        key: 'shareTime',
        render( text ){
          return text ? new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" ) : "";
        }
      }
    ];

    if ( window.BFD.userType != BFD.ENUM.UserType.ADMIN && window.BFD.userType != BFD.ENUM.UserType.SUPERADMIN ) {
      columns.push( oper );
    }

    return columns;
  }

  render() {
    let column = this.getColumns();

    let applyBtn;
    if ( window.BFD.userType == BFD.ENUM.UserType.OWNER || window.BFD.userType == BFD.ENUM.UserType.USER ) {
      applyBtn = <IconButton
        data-code="1020102" renderType="icon"
        type="plus-square"
        disabled={this.selectList.length==0}
        onClick={this.apply.bind(this,null)}>申请</IconButton>
    }
    let dataTypeCheck = applyBtn ? { onCheckboxSelect: this.handleCheckboxSelect.bind( this ) } : null;
    return (<div className="module-container data-share-div">
      <div className="module-search">
        <button className="btn btn-sm btn-primary common-right" onClick={this.search.bind(this)}>查询</button>
        <RestrictInput
          type="text" value={this.state.tableName}
          className="form-control common-input common-right"
          onChange={this.handleChange.bind(this,"tableName")} placeholder="表名称"/>
        <Select
          value={this.state.id} className="common-margin-right common-right"
          onChange={this.handleChange.bind(this,'id')} searchable>
          {
            window.tenantArr.map( function ( item, index ) {
              return (<Option
                key={index}
                value={item.id}>{item.tenantName}</Option>);
            } )
          }
        </Select>
        {applyBtn}
      </div>
      <div className="module-table">
        <DataTable
          data={this.state.data} column={column}
          showPage="true" howRow={this.pageSize}
          onPageChange={this.pageChange.bind(this)}
          {...dataTypeCheck}
        />
      </div>
      <ApplyAuthority ref="applyModal" refreshList={this.getList.bind(this)}/>
      <SeeTenant ref="seeTenantModal"/>
      <SeeTable ref="seeTable"/>
    </div>)
  }
}

export default SubLayout;
