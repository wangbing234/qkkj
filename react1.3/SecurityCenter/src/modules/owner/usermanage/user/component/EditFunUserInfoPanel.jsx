/***************************************************
 * 时间: 2016/7/21 16:00
 * 作者: bing.wang
 * 说明: 编辑功能权限
 *
 ***************************************************/
import React from 'react'
import FunUserInfoForm from './tabs/FunUserInfoForm'
import Ajax from '../ajax/AjaxReq'
import {FormFooter} from 'CommonComponent'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
class UserInfoPanel  extends React.Component{

    constructor(prop) {
        super(prop);
        this.breadArr = [{
            text: '用户',
            url: ''//如果不需要跳转url可以为空或不写url
        }, {
            text: '功能授权',
            url: ''
        }];
    }


    /**
     * 提交处理
     */
    handleSubmit(){
        let that=this;
        this.refs.funUserInfoForm.saveFunction((data)=>{
            that.props.cancelClick();
        })

    }

    render(){
        return (
            <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelClick}>
                <FormCategory>
                        <FormCategoryItem name="功能授权">
                                <div className="module-edit-container  common-container-border user_manager_fun_panel" style={{paddingBottom:30}}>
                                    <FunUserInfoForm  ref="funUserInfoForm" {...this.props}/>
                                    <FormFooter style={{marginLeft:'100px',marginTop:"40px"}} submitClick={this.handleSubmit.bind(this)} cancelClick={this.props.cancelClick}></FormFooter>
                                </div>
                        </FormCategoryItem>
                </FormCategory>
            </EditPanel>
        );
    }
}

module.exports = UserInfoPanel;