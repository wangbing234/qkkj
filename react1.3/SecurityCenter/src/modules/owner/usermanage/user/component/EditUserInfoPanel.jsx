/***************************************************
 * 时间: 2016/7/21 16:00
 * 作者: bing.wang
 * 说明: 编辑用户信息主页面
 *
 ***************************************************/
import React from 'react'
import UserInfoFormCommon from './tabs/UserInfoFormCommon'
import {FormFooter} from 'CommonComponent'
import Ajax from '../ajax/AjaxReq'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
class UserInfoPanel  extends React.Component{

    constructor(prop) {
        super(prop);
        this.breadArr = [{
            text: '用户管理',
            url: ''//如果不需要跳转url可以为空或不写url
        }, {
            text: '新增用户',
            url: ''
        }];
    }

    /**
     * 提交处理
     */
    handleSubmit(){
        if (this.refs.userInfoFormCommon.doVaildate()) {
            console.log('表单验证通过');
          ;
          //let rData=  {type:'0',user:this.refs.userInfoFormCommon.getData()};
          let info = this.refs.userInfoFormCommon.getData();

            Ajax.editUser(info,(data)=>{
                this.props.cancelClick();
            })
        } else {
            console.log('表单验证失败');
        }
    }

    render(){
        return (
            <div  className="module-edit-container  common-container-border" style={{paddingBottom:30}}>
                <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelClick}>
                <UserInfoFormCommon isEdit={true}  ref="userInfoFormCommon" {...this.props}/>
                <FormFooter style={{marginLeft:'100px',marginTop:"40px"}} submitClick={this.handleSubmit.bind(this)}
                            cancelClick={this.props.cancelClick}></FormFooter>
                </EditPanel>
            </div>
        );
    }
}

module.exports = UserInfoPanel;