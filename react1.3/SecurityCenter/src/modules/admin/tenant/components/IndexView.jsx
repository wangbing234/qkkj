import React from 'react'
import EditPage from './EditPage'
import DataTable from 'bfd-ui/lib/DataTable'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import RestrictInput from 'CommonComponent/component/restrictinput'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import IconButton from 'CommonComponent/component/iconbutton'
import AuthButton from 'CommonComponent/component/authbutton'
import SeeTenant from './pops/SeeTenant.jsx'
import BaseInfoEdit from './pops/BaseInfoEdit.jsx'
import ChangeTenant from './pops/ChangeTenant.jsx'
import FunctionAuthorityEdit from './pops/FunctionAuthorityEdit.jsx'
import ResourceAuthorityEdit from './pops/ResourceAuthorityEdit.jsx'
import DataAuthorityEdit from './pops/DataAuthorityEdit.jsx'
import AjaxReq from '../model/AjaxReq'
import AdminEnum from 'AdminEnum'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
//import {BreadCrumb} from 'CommonComponent'

let that;
const LIST = 'list';
const ADD_TENANT = 'add_tenant';
const EDIT_TENANT = 'edit';
const CHANGE_TENANT = 'change_tenant';
const FUNC_AUTHORITY = 'func_authority';
const RESOURCE_AUTHORITY = 'resource_authority';
const DATA_AUTHORITY = 'data_authority';
const SEE_TENANT = 'see_tenant';

let editRecord;
let ownerRecord;//查看租户用
let roleId;//查看租户用


class IndexView extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
    this.page = 1;
    EventEmitter.subscribe('tentant_change_List_State', this.changeListState);
    this.state = {
      type: LIST,
      tenantName: '',
      tenantArr: {totalList: []}//表格
    };

  }

  componentDidMount() {
    //查询租户列表
    this.search();
  }

  componentWillUnmount() {
    that = null;
    if(this.tenantListAjax){
      this.tenantListAjax.abort();
      this.tenantListAjax = null;
    }
  }

  handleChange(dataField, evt) {
    this.setState({[dataField]: evt.target.value});
  }

  onPageChange(page) {
    this.page = page;
    this.search();
  }

  changeListState(data) {
    that.setState({...data});
  }

  addTenant() {
    //,breadArr: breadArrCreate
    that.setState({type: ADD_TENANT, currentStep: 0});
  }

  authorityUser(type, data) {
    switch (type) {
      case "0"://功能权限
        that.setState({type: FUNC_AUTHORITY, roleId: data.roleId});
        break;
      /*case "1"://资源权限
       that.setState({type: RESOURCE_AUTHORITY});
       break;*/
      case "1"://数据权限
        that.setState({type: DATA_AUTHORITY,editData:data, tenantId: data.id});
        break;

    }

  }

  seeTenant(data) {
    editRecord = {
      id: data.id,
      tenantId: data.tenantId,
      tenantName: data.tenantName,
      queueId: data.queueId,
      comment: data.comment
    };
    /*"userName":"journey",
     "userPassword":"825193156",
     "email":"jupiter@126.com",
     "phoneNumber":"13724567888",
     "userType":"2"*/
    ownerRecord = {userName: data.userName, email: data.email, phoneNumber: data.phoneNumber};
    roleId = data.roleId;
    that.setState({type: SEE_TENANT});
  }

  editTenantUI(data) {
    /*tenantId:'',
     tenantName:'',
     queueId:'',
     comment:''*/
    editRecord = {
      id: data.id,
      tenantId: data.tenantId,
      tenantName: data.tenantName,
      queueId: data.queueId,
      comment: data.comment
    };
    that.setState({type: EDIT_TENANT});
  }

  createUser() {
    that.setState({type: 'edit', currentStep: 0});
  }

  changeTenantUI(data) {
    let changeTenantRecord = {
      id: data.id,
      tenantId: data.tenantId,
      tenantName: data.tenantName,
      oldUserId: data.userId,
      oldUserName: data.userName,
      newUserId: '',
      newUserName: data.userName
    };
    that.refs.changeTenantModal.getAllUserByTenant(changeTenantRecord);

  }

  search() {
    let that = this;
    let data = {tenantName: $.trim(this.state.tenantName), currentPage: this.page, pageSize: AdminEnum.PAGE_SIZE};
    this.tenantListAjax = AjaxReq.getTenantList(`data=${JSON.stringify(data)}`, (result)=> {
      if (that) {
        that.setState({tenantArr: result})
      }
    });
  }


  deleteUI() {

  }

  cancelClick() {
    this.setState({type: LIST});
    this.search();
  }

  getColumns() {
    return [{
      title: '租户名称',
      key: 'tenantName',
      render(text, record) {
        return <div><a data-key={text } href="javascript:void(0);"
                       onClick={that.seeTenant.bind(that,record)}>{ text }</a></div>;
      }
    }, {
      title: '成员',
      key: 'members'
    }, {
      title: '租户所有者',
      key: 'userName'
    }, {
      title: '队列等级',
      key: 'queueName'
    }, {
      title: '租户描述',
      key: 'comment',
      render:((text,record)=>{
        return <TextOverflow>
          <div style={{maxWidth:'200px'}}>{text}</div>
        </TextOverflow>;
    })
    }, {
      title: '创建时间',
      key: 'createTime'
    }, {
      title: '更新时间',
      key: 'updateTime'
    }, {
      title: '操作',
      key: 'operation',
      width:'200px',
      render(record, text) {
        return (<div className="tenantmanage-admin dropdown-menu-container" style={{lineHeight:'21px'}}>
          <AuthButton renderType="a" onClick={that.editTenantUI.bind(that,record)} title="编辑">编辑</AuthButton>
          <AuthButton renderType="a"  onClick={that.changeTenantUI.bind(that,record)} title="变更租户所有者">变更租户所有者</AuthButton>
          <Dropdown style={{verticalAlign:'top'}}>
            <DropdownToggle>
              <AuthButton renderType="a" title="授权">授权</AuthButton>
            </DropdownToggle>
            <DropdownMenu>
              <AuthButton renderType="option" onClick={that.authorityUser.bind(that,'0',record)} title="功能">功能</AuthButton>
              {/*<li><a href="javascript:void(0);" onClick={that.authorityUser.bind(that,'1',record)}>资源</a></li>*/}
              <AuthButton renderType="option" onClick={that.authorityUser.bind(that,'1',record)} title="数据">数据</AuthButton>
            </DropdownMenu>
          </Dropdown>
          {/*<a href="javascript:void(0);" onClick={that.deleteUI.bind(that,record)}> 删除 </a>*/}
        </div>);
      }
    }];
  }

  renderList() {
    let column = this.getColumns();
    return (<div className="module-container">
      <div className="module-search">
        <IconButton data-code="" renderType="icon"
          type="plus-square" onClick={this.addTenant}>新增租户</IconButton>
        <div className="common-right">
          <button className="btn btn-sm btn-primary common-right" onClick={this.onPageChange.bind(this,1)}>查询</button>
          <RestrictInput type="text" className="form-control common-right common-margin-right"
                         placeholder="请输入租户名称关键字"
                         onChange={this.handleChange.bind(this,"tenantName")}/>
        </div>
      </div>
      <div className="module-table operatioinTable">
        <DataTable column={column} data={this.state.tenantArr} onPageChange={that.onPageChange.bind(this)}
                   showPage="true"
                   howRow={AdminEnum.PAGE_SIZE}/>
      </div>

    </div>);
  }


  render() {
    that = this;
    let comp;
    switch (this.state.type) {
      case LIST://列表
        //breadCurArr = breadArr;
        comp = this.renderList();
        break;
      case ADD_TENANT://新增租户
        //breadCurArr = breadArrCreate;
        comp = <EditPage currentStep={this.state.currentStep} cancel={this.cancelClick.bind(this)}/>;
        break;
      case EDIT_TENANT://编辑
        comp = <BaseInfoEdit ref="baseInfoEdit" cancel={this.cancelClick.bind(this)} data={editRecord}/>;
        break;
      case FUNC_AUTHORITY://功能权限
        comp = <FunctionAuthorityEdit cancel={this.cancelClick.bind(this)} roleId={this.state.roleId}/>;
        break;
      case RESOURCE_AUTHORITY://资源权限
        comp = <ResourceAuthorityEdit cancel={this.cancelClick.bind(this)}/>;
        break;
      case DATA_AUTHORITY://数据权限
        comp = <DataAuthorityEdit cancel={this.cancelClick.bind(this)} data={this.state.editData} tenantId={this.state.tenantId}/>;
        break;
      case SEE_TENANT://查看租户，点击租户名字时
        comp = <SeeTenant cancel={this.cancelClick.bind(this)} tenantData={editRecord} ownerData={ownerRecord}
                          roleId={roleId}/>;
        break;

    }
    return (<div className={this.state.type==LIST?'module-container':'module-edit-container'}>
      {/*<BreadCrumb msgArr={breadCurArr} history={this.props.history}/>*/}
      {comp}
      <ChangeTenant ref="changeTenantModal" cancel={this.cancelClick.bind(this)}/>
    </div>);
  }
}

export default IndexView;