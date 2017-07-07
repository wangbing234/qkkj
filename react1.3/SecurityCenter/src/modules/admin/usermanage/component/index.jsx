import React from 'react'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import message from 'CommonComponent/component/bdosmessage'
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import UserInfoForm from './UserInfoForm'
import AjaxReq from '../model/AjaxReq'
import AdminEnum from 'AdminEnum'
import RestrictInput from 'CommonComponent/component/restrictinput'
import AuthButton from 'CommonComponent/component/authbutton'
import IconButton from 'CommonComponent/component/iconbutton'
import ResetPasswordForm from '../common/ResetPasswordForm'
import ChangeTenant from './pops/ChangeTenant.jsx'
import EventName from 'EventName'


let that;
const tenantList = [{id: '', tenantName: '全部租户'}
];
/* render 界面的唯一类型标识 */
const ADD_USER = 'add_user';//用户管理界面-新增用户界面的唯一类型标识
const USER_LIST = 'user_list';// 用户/用户管理界面的唯一类型标识
const superAdminRole = [
  {id: 1, name: '管理员'},
  {id: 2, name: '租户成员'},
  {id: 3, name: '系统用户'},
  {id: '', name: '全部用户类型'}
];
const adminRole = [
  {id: 2, name: '租户成员'},
  {id: '', name: '全部用户类型'}
];
//userType 0:超级管理员，1:管理员，2其它（role_name判断是 租户所有者（租户里的管理员（role_name="租户所有者"））、普通用户（role_name=""））

const statusArr = [{id: '', name: '全部状态'},
  {id: 0, name: '启用'},
  {id: 1, name: '禁用'},
  {id: 2, name: '锁定'}
];

let record;

class UserManage extends React.Component {

  constructor(prop) {
    super(prop);
    that = this;
    this.page = 1;
    this.isSuperAdmin = window._currentUser.userType == BFD.ENUM.UserType.SUPERADMIN;
    this.state = {
      viewType: USER_LIST,
      tenantArr: tenantList, //测试用,
      role:this.isSuperAdmin?"":2,
      tenantId: '',
      status: '',
      listArr: '',
      userArr: {totalList: []},
      userName: '',
      record: {}
    };

    // 监听新增租户，查询租户列表数据，否则租户数据无刷新
    //EventEmitter.subscribe(EventName.ADD_TENANT, this.getTenantList.bind(this));
  }

  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: value});
  }

  componentDidMount() {
    //查询租户list,用于所有租户下拉框
    this.getTenantList();
    //查询用户list
    this.getUserList();
  }


  componentWillUnmount() {
    that = null;
    if(this.tenantListAjax){
      this.tenantListAjax.abort();
      this.tenantListAjax = null;
    }
    if(this.userListAjax){
      this.userListAjax.abort();
      this.userListAjax = null;
    }
  }


  /**新增用户**/
  addUserUI() {
    record = {viewType: 'add'};
    this.setState({viewType: ADD_USER});
  }

  /*查看用户**/
  seeUserUI(data) {
    record = {...data,viewType:'see'};//{viewType:'edit',userName:data.user_name,tenantId:data.tenantId,userPassword:data.user_password,ensurePassword:data.user_password,phoneNumber:data.phone_number,userType:data.user_type,status:String(data.status),email:data.email};
    this.setState({viewType: ADD_USER});
  }

  /**编辑用户**/
  editUserUI(data) {
    record = {...data,viewType:'edit'};//{viewType:'edit',userName:data.user_name,tenantId:data.tenantId,userPassword:data.user_password,ensurePassword:data.user_password,phoneNumber:data.phone_number,userType:data.user_type,status:String(data.status),email:data.email};
    this.setState({viewType: ADD_USER});
  }

  /**重置密码**/
  resetPasswordUI(data) {
    that.refs.resetPwdModal.open();
    that.refs.resetPwdModal.initFunc(data.userName);
  }

  /**变更租户**/
  changeTenantUI(data) {
    that.refs.changeTenantModal.setData(data);
    that.refs.changeTenantModal.open();
  }

  /**取消**/
  cancelAddUser(value) {
    this.setState({viewType: USER_LIST});
  }

  /**关闭重置密码框**/
  closeHandler() {
    this.refs.resetPwdModal.close();
  }

  onPageChange(page) {
    this.page = page;
    this.getUserList();
  }

  /**-------------------后台请求START---------------------------**/
  /**查询用户list**/
  getUserList() {
    let that = this;
    let param = {
      userType: this.state.role,
      tenantId: this.state.tenantId,
      userName: $.trim(this.state.userName),
      status: this.state.status,
      currentPage: this.page,
      pageSize: AdminEnum.PAGE_SIZE
    };
    this.userListAjax = AjaxReq.getUserList(`data=${JSON.stringify(param)}`, (result) => {
      if (that) {
        that.setState({userArr: result});
      }
    });
  }

  //查询租户list
  getTenantList() {
    let that = this;
    this.tenantListAjax = AjaxReq.getTenantList((result) => {
      if (result && result.length > 0) {
        result.unshift({id: '', tenantName: '全部租户'});
        if (that) {
          that.setState({tenantArr: result})
        }
      }
    })
  }

  /**禁用、启用、解锁**/
  disableEnable(data) {
    let obj;
    if (data.status == '0') {//禁用
      obj = {type: '1', user: {userName: data.userName, status: 1}};
    } else if (data.status == '1') {//启用
      obj = {type: '2', user: {userName: data.userName, status: 0}};
    } else if (data.status == '2') {//解锁
      obj = {type: '4', user: {userName: data.userName, status: 0}};
    }
    AjaxReq.editUser(`data=${JSON.stringify(obj)}`, (result) => {
      this.setState({viewType: USER_LIST});
      this.getUserList();
    })
  }

  //新增保存用户//放到UserManageList里this
  addSaveUser(obj) {
    //调用保存用户接口，保存成功，查询用户列表
    AjaxReq.addUser(obj, (result) => {
      message.success("新增用户成功");
      this.setState({viewType: USER_LIST});
      this.getUserList();
    })
  }

  //编辑保存用户//放到UserManageList里this
  editSaveUser(obj) {
    //调用编辑保存用户接口，保存成功，查询用户列表
    AjaxReq.editUser(obj, (result) => {
      message.success("修改用户成功");
      this.setState({viewType: USER_LIST});
      this.getUserList();
    })
  }

  /**重置密码**/
  resetPwd(obj) {
    AjaxReq.editUser(obj, (result) => {
      message.success("密码重置成功");
      this.closeHandler();
      this.getUserList();
    })
  }

  /**变更租户**/
  changeTenant(obj) {
    AjaxReq.changeTenant(obj, (result) => {
      message.success("变更租户成功");
      this.refs.changeTenantModal.close();
      this.getUserList();
    })
  }


  /**
   * 修改密码
   **/
  changePassword(data) {
    AjaxReq.changePassword(data, (result) => {
      message.success(result.msg);
      that.refs.resetPwdModal.close();
      that.getUserList();
    })
  }

  /**
   * 修改状态
   * @param data
   * @param e
   */
  changeStatus(data, e) {
    if(data.status == '0'){
      confirm(`确定禁用用户${data.userName}吗?`, () => {
        this.disOrEnable(data);
      })
    }else {
      this.disOrEnable(data);
    }

  }

  /**启用或禁用**/
  disOrEnable(data){
    AjaxReq.changeStatus({userName: data.userName, status: data.status == '0' ? "1" : "0"}, (result) => {
      that.getUserList();
    })
  }

  /**-------------------------后台请求END----------------------------**/

  getColumns() {
    return [
      {title: '用户名称', key: 'userName',
        render:((text,record)=>{
          return <AuthButton renderType="a" onClick={this.seeUserUI.bind(this,record)} title="查看">{text}</AuthButton>
        })
      },
      {
        title: '状态', key: 'status',
        render(text){
          let statusName;
          switch (text) {
            case 0:
              statusName = '启用';
              break;
            case 1:
              statusName = '禁用';
              break;
            case 2:
              statusName = '锁定';
              break;

          }
          return statusName;
        }
      },
      {title: '租户',
        key: 'tenantName',
        render:((text)=>{
          return text?text:'--------'
        })
      },
      {
        title: '用户类型', key: 'userType',
        render(text, record) {
          let roleName;
          switch (text) {
            case 0:
              roleName = '超级管理员';
              break;
            case 1:
              roleName = '管理员';
              break;
            case 2:
              roleName = '租户成员';
              break;
            case 3:
              roleName = '系统用户';
              break;
          }
          return (<span>{roleName}</span>);
        }

      },
      {title: '创建时间', key: 'createTime'},
      {title: '更新时间', key: 'updateTime'},
      {
        title: '操作', key: 'operation',width:'220px', render(record, text) {
        if(record.userType == 3){
          return <AuthButton renderType="a" onClick={that.editUserUI.bind(that,record)} title="编辑">编辑</AuthButton>
        } else {
          let enableLabel, unlock;
          if (record.status == 1) {
            enableLabel = "启用";
          } else if (record.status == 0) {
            enableLabel = "禁用";
          }
          //else if (record.status == 2){
          //	unlock = <AuthButton
          //			renderType="icon" type="unlock"
          //			onClick={that.changeStatus.bind(that,record)} title="解锁"/>
          //}

          let changTenant;
          //2:租户所有者或普通用户  isTenantOwner如果为0表示不是租户所有者，1为租户所有者,
          if (record.userType == 2 && record.isTenantOwner == 0) {
            changTenant = <AuthButton renderType="a"
                                      disabled={false} onClick={that.changeTenantUI.bind(that,record)} title="变更租户">变更租户</AuthButton>;
          } else {
            changTenant = <AuthButton renderType="a"
                                      disabled={true} title="变更租户">变更租户</AuthButton>;
          }

          return (<div>
            <AuthButton renderType="a" onClick={that.editUserUI.bind(that,record)} title="编辑">编辑</AuthButton>
            <AuthButton renderType="a" onClick={that.changeStatus.bind(that,record)} title={enableLabel}>{enableLabel}</AuthButton>
            <AuthButton renderType="a" onClick={that.resetPasswordUI.bind(that,record)} title="重置密码">重置密码</AuthButton>
            {changTenant}
            {/*{unlock}*/}
          </div>);
        }

      }
      }
    ];
  }

  renderTenant() {
    return <Select value={that.state.tenantId} className="common-margin-right"
                   onChange={that.handleChange.bind(that,'tenantId')} searchable>
      {
        that.state.tenantArr.map(function (item, index) {
          return (<Option key={index}
                          value={item.id}>{item.tenantName}</Option>);
        })
      }
    </Select>;
  }

  renderRole(){
    return <Select value={that.state.role} className="common-margin-right"
                   onChange={that.handleChange.bind(that,'role')}>
      {
        superAdminRole.map(function (item, index) {
          return (<Option key={index}
                          value={item.id}>{item.name}</Option>);
        })
      }
    </Select>;
  }

  renderList() {
    let tenantUI;
    let roleUI;
    if(this.isSuperAdmin){//只有超级管理员才显示角色下拉框，租户成员显示没什么意义，因为只有租户成员角色
      roleUI = this.renderRole();
    }
    if(that.state.role == 2){//租户成员，只有租户成员才显示租户列表
      tenantUI = this.renderTenant();
    } else {
      this.state.tenantId = '';
    }
    return (<div className="module-container">
      <div className="module-search" style={{height:'30px'}}>
        <IconButton
          data-code="" renderType="icon"
          type="plus-square" onClick={this.addUserUI.bind(this)}>新增</IconButton>
        <div className="module-search-right">
          {roleUI}
          {tenantUI}
          <Select value={that.state.status} className="common-margin-right"
                  onChange={that.handleChange.bind(that,'status')}>
            {
              statusArr.map(function (item, index) {
                return (<Option key={index}
                                value={item.id}>{item.name}</Option>);
              })
            }
          </Select>
          <button className="btn btn-sm btn-primary common-right" onClick={that.onPageChange.bind(that,1)}>查询</button>
          <RestrictInput type="text" value={that.state.userName} className="form-control common-input common-right"
                         onChange={that.handleChange.bind(that,"userName")} placeholder="请输入用户名关键字"/>
        </div>
      </div>
      <div className="module-table">
        <DataTable column={that.getColumns()} data={that.state.userArr} onPageChange={that.onPageChange.bind(this)}
                   showPage="true"
                   howRow={AdminEnum.PAGE_SIZE}/>
      </div>

      <ResetPasswordForm ref="resetPwdModal" changePassword={this.changePassword.bind(this)}/>
      <ChangeTenant ref="changeTenantModal" tenantArr={that.state.tenantArr}
                    changeTenant={this.changeTenant.bind(this)}/>

    </div>)
  }

  render() {
    let renderView;
    that = this;
    switch (this.state.viewType) {
      case USER_LIST:
        renderView = this.renderList();
        break;
      case ADD_USER:
        renderView = <div><UserInfoForm ref="superAdmin_modal" saveClick={this.addSaveUser.bind(this)}
                                        editClick={this.editSaveUser.bind(this)}
                                        cancelClick={this.cancelAddUser.bind(this)}
                                        data={record} tenantArr={this.state.tenantArr}/></div>;
        break;
      default:
        break;
    }
    return (<div>
        {/*<BreadCrumb msgArr={this.state.breadArr} history={this.props.history}/>*/}
        {renderView}
      </div>
    );
  }
}

export default UserManage;