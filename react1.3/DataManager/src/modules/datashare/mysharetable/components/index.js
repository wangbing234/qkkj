import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import confirm from 'bfd-ui/lib/confirm'

import RestrictInput from 'CommonComponent/component/restrictinput'
import SearchInput from 'CommonComponent/component/searchinput'
import message from 'CommonComponent/component/bdosmessage'
import AuthButton from 'CommonComponent/component/authbutton'
import IconButton from 'CommonComponent/component/iconbutton'

import SeeTenant from 'SeeTenant'
import AjaxReq from '../../model/AjaxReq'
import CommonUtil from 'CommonUtil'
import EventName from 'EventName'
import SeeTable from 'SeeTable'
import '../../common/css/style.less'

class SubLayout extends React.Component {

  constructor( prop ) {
    super( prop );
    this.pageSize = 10;
    this.currentPage = 1;
    this.selectList = [];
    this.state = {
      tableName: ''
    };
    /*EventEmitter.subscribe( EventName.CHANGE_NAVITEM, ( data ) => {
      if ( this.loadInterval && data.href.indexOf( "/datashare/mysharetable" ) != -1 ) {
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

  /**查询**/
  search() {
    this.currentPage = 1;
    this.getList();
  }

  getList() {
    let that = this;
    //查询列表,根据tableName查询
    let param = {
      tableName: this.state.tableName,
      pageSize:this.pageSize,
      currentPage:this.currentPage
    };
    AjaxReq.getMyShareTableList( param, ( result ) => {
      if ( that.loadInterval ) {
        that.setState( { data: result.data } )
      }
    } )
  }

  showModal( data ) {
    //CommonUtil.seeTableDetails( data.tableName );
    this.refs.seeTable.setState({tableName:data.tableName,database:data.database});
    this.refs.seeTable.refs.modal.open();
  }

  handleCheckboxSelect( rows ) {
    this.selectList = [];
    rows.map((item) => {
      this.selectList.push(item.id);
    });
    this.setState( { ...this.state } );
    //this.setState( { selectRowArr: data } );
  }

  pageChange(cpage){
    this.currentPage = cpage;
    this.getList();
  }

  /**取消共享**/
  cancelShare( data ) {
    let that = this;
    data = data? data:this.selectList;
    //data为选中的数据
    confirm( '是否取消共享？取消后，其他租户下用户将失去对表的读权限。', () => {
      AjaxReq.cancelShareTable({ids:data.join(",")},(data) => {
        message.success(data.msg);
        that.getList();
      });
    } )
  }

  /**授权租户数**/
  seeTenant( record ) {
    this.refs.seeTenantModal.open(record);
  }


  getColumns() {
    let columns = [
      {
        title: '表',
        key: 'tableName',
        render: ( text, data )=> {
          return <a href="javascript:void(0);" onClick={this.showModal.bind(this,data)}>{text}</a>;
        }
      }, {
        title: '表中文',
        key: 'tableNameZh'
      }, {
        title: '库',
        key: 'database'
      }, {
        title: '所属项目',
        key: 'projectCode'
      }, {
        title: '创建人',
        key: 'createUser'
      }, {
        title: '授权租户数',
        key: 'authUserCount',
        render: ( text, record )=> {
          return (<div>
            <a href="javascript:void(0);" onClick={this.seeTenant.bind(this,record)}>{text}</a>
          </div>);
        }
      }, {
        title: '表创建时间',
        key: 'tableCreateTime',
        render(text){
          return text?new Date(Number(text)).format("yyyy-MM-dd hh:mm:ss"):"";
        }
      }, {
        title: '操作',
        key: 'operation',
        render: ( record, text )=> {
          return (<div>
            <AuthButton renderType="a" href="javascript:void(0);" onClick={this.cancelShare.bind(this,[record.id])} title="取消共享">取消共享</AuthButton>
          </div>);
        }

      }
    ];
    return columns;
  }

  render() {
    let column = this.getColumns();
    return (<div className="module-container  data-share-div">
      {/*<div style={{marginBottom:20,marginTop:20,paddingLeft:25}}>
       <BreadCrumb msgArr={breadCrumbArr} history={this.props.history} />
       </div>*/}
      <div className="module-search">
        <button className="btn btn-sm btn-primary common-right" onClick={this.search.bind(this)}>查询</button>
        <RestrictInput type="text" value={this.state.tableName} className="form-control common-input common-right"
                       onChange={this.handleChange.bind(this,"tableName")} placeholder="表名称"/>
        <IconButton
          disabled={this.selectList.length==0}
          data-code="1020102" renderType="icon"
          type="plus-square"
          onClick={this.cancelShare.bind(this,null)}>取消共享
        </IconButton>
      </div>
      <div className="module-table">
        <DataTable
          data={this.state.data} column={column} showPage="true" howRow={this.pageSize}
          onCheckboxSelect={this.handleCheckboxSelect.bind(this)}
          onPageChange={this.pageChange.bind(this)}
        />
      </div>
      <SeeTenant ref="seeTenantModal"/>
      <SeeTable ref="seeTable"/>
    </div>)
  }
}

export default SubLayout;
