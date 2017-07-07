/***************************************************
 * 时间: 2016/7/21 16:00
 * 作者: bing.wang
 * 说明: 用户列表
 *
 ***************************************************/
import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import {Modal,ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import ResetPasswordForm from '../../common/ResetPasswordForm';
import {RestrictInput} from 'CommonComponent'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import Ajax from '../ajax/AjaxReq'
import confirm from 'bfd-ui/lib/confirm'
import message from 'CommonComponent/component/bdosmessage'
import AuthButton from 'CommonComponent/component/authbutton'

let that;
const USER_EDIT_USER = 'user_edit_user';// 用户/用户管理界面的唯一类型标识
const USER_RESOUCE_DATA_AUTH = 'user_resouce_data_auth';// 编辑资源权限
const USER_EDIT_FUN_AUTH = 'user_edit_fun_auth';// 编辑功能权
const USER_DETAIL_USER = 'user_detail_user';// 编辑功能权限


const statusArr = [{id: '', name: '全部状态'},
    {id: 0, name: '启用'},
    {id: 1, name: '禁用'}
];


class UserManageList  extends React.Component{

    constructor(prop) {
        super(prop);
        that = this;
        this.state = {
            status: '',
            pagination: {},
            role: "",
            tableData:{totalList:[]},
           roleList: [{id: "", roleName: '全部角色'}],
            loading: false
        };

        this.columns = [
            {title: '用户名称', key: 'userName', render(text, record){
                return (<a href="javascript:void(0);" onClick={that.props.editUserByType.bind(that,record,USER_DETAIL_USER)}> {text} </a>);}},
            {title: '状态', key: 'status', order: true, render(text, record){
                let statusString="";
                if(text==0)
                {
                    statusString="启用";
                }
                else  if(text==1)
                {
                    statusString="禁用";
                }
                return statusString;
            }},
            {title: '创建时间', key: 'createTime'},
            {title: '更新时间', key: 'updateTime'},
            {title: '操作', key: 'operation',width:'180px', render(text, record) {


                let enableLabel,enableType;
                if (text.status == 1) {
                    enableLabel = "启用";
                    enableType = "ban";
                } else if (text.status == 0) {
                    enableLabel = "禁用";
                    enableType = "play-circle";
                }


                return (<div style={{lineHeight:'21px'}}>
                         <AuthButton renderType="a" type="edit" onClick={that.props.editUserByType.bind(that,text,USER_EDIT_USER)} title="编辑">编辑</AuthButton>
                         <Dropdown style={{verticalAlign:'top'}}>
                             <DropdownToggle>
                                 <AuthButton renderType="a"   title="授权">授权</AuthButton>
                             </DropdownToggle>
                             <DropdownMenu>
                                 <AuthButton renderType="option" onClick={that.props.editUserByType.bind(that,text,USER_EDIT_FUN_AUTH)} title="功能">功能</AuthButton>
                                 <AuthButton renderType="option" onClick={that.props.editUserByType.bind(that,text,USER_RESOUCE_DATA_AUTH)} title="资源">资源</AuthButton>
                             </DropdownMenu>
                         </Dropdown>
                        <AuthButton renderType="a" type={enableType}  onClick={that.changeStatus.bind(that,text)} title={enableLabel} >{enableLabel}</AuthButton>
                        <AuthButton renderType="a" onClick={that.resetPassword.bind(this,text)} title="重置密码">重置密码</AuthButton>
                      </div>);
            }}
        ];
    }

    componentDidMount() {
        that. getAllUser();
        that.getDataByUrl(1);
    }

    /**
     * 解锁
     * @param reacod
     * @param e
     */
    clearLock(reacod,e){
        $(e.target).prev("span").remove();
        $(e.target).remove();
    }


    /**
     * 获取角色列表
     */
    getAllUser() {
        var info11={ "tenantId":window._currentUser.tenantId};//租户id
        Ajax.listRolesByTenant(info11,(data) => {
            let array=this.state.roleList.concat(data.data);
            that.setState({roleList: array});
        });
        that.setState({});
    }

    /**
     * 重置密码，弹出窗口
     * **/
    resetPassword(text,e){
        that.refs.resetPwdModal.open();
        that.refs.resetPwdModal.setState({data:text});
    }

    /**
     * 重置密码提交
     * **/
    submitResetPassword(){
        this.closeHandler();
    }

    /**
     * 关闭密码窗体
     * **/
    closeHandler(){
        this.refs.resetPwdModal.close();
    }


    /**
     * 下拉修改
     * @param field
     * @param select
     */
    selectChange(field,select){
        this.setState({[field]:select});
    }

    /**
     * 输入修改
     * @param field
     * @param e
     */
    textChange(field,e){
        this.setState({[field]:e.target.value});
    }


    /**
     * 点击查询处理
     * @param e
     */
    search(e) {
        that.getDataByUrl(1);
    }

    /**
     * 获取用户列表
     * @param page
     */
    getDataByUrl(page) {
        var info14={
            roleId:this.state.role,
            "status":this.state.status,
            "userName":this.state.userNameTxt,
            "currentPage":page,
            "pageSize":"15"
        };
        Ajax.listByTenant(info14,(data) => {
            that.setState({tableData: data.data,page});
        });
    }

    /**
     * 分页修改
     * @param nextPage
     */
    onPageChange(nextPage){
        that.getDataByUrl(nextPage);
    }

    /**
     * 修改密码
     **/
    changePassword(data,e) {
        Ajax.changePassword({userName:data.userName,userPassword:data.userPassword},(result) => {
            that.refs.resetPwdModal.close();
            that.getDataByUrl(1)
            message.success("重置密码成功");
        })
    }

    /**
     * 修改状态
     * @param data
     * @param e
     */
    changeStatus(data,e)
    {
        if(data.status == '0') {
            confirm(`确定禁用用户${data.userName}吗?`, () => {
                this.disOrEnable(data);
            })
        }
        else{
            this.disOrEnable(data);
        }
    }

    /**启用或禁用**/
    disOrEnable(data){
        Ajax.changeStatus({userName:data.userName,status:data.status == '0'?"1":"0"},(result) => {
            that.getDataByUrl(1)
        })
    }

    render(){
        that = this;
        return(
            <div className="module-container">
                <div className="module-search">
                    <button className="btn btn-sm btn-primary" onClick={this.props.addUser}>新增用户</button>
                    <div className="module-search-right">
                        <Select  value={this.state.role} className="common-margin-right"  onChange={this.selectChange.bind(this,'role')}>
                            {
                                this.state.roleList.map(function (item, index) {
                                    return (<Option key={index} value={item.id}>{item.roleName}</Option>);
                                })
                            }
                        </Select>
                        <Select value={this.state.status} className="common-margin-right"  onChange={this.selectChange.bind(this,'status')}>
                            {
                                statusArr.map(function (item, index) {
                                    return (<Option key={index}  value={item.id}>{item.name}</Option>);
                                })
                            }
                        </Select>

                        <button className="btn btn-sm btn-primary common-right" onClick={that.search.bind(that)}>查询</button>

                        <RestrictInput type="text" value={this.state.userNameTxt} className="form-control common-input common-right"
                                       onChange={this.textChange.bind(this,'userNameTxt')}  placeholder="请输入用户关键字"/>

                    </div>
                </div>


                <div className="module-table operatioinTable">
                    <DataTable column={this.columns} data={this.state.tableData} onPageChange={this.onPageChange} showPage="true" howRow={15}/>
                </div>



                <ResetPasswordForm ref="resetPwdModal" changePassword={this.changePassword.bind(this)}/>
            </div>
        );
    }
}

module.exports = UserManageList;
