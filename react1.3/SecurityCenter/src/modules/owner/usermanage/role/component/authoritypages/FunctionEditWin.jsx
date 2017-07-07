/***************************************************
 * 时间: 2016/7/21 16:11
 * 作者: bing.wang
 * 说明: 功能编辑页面
 *
 ***************************************************/
import React from 'react'
import FunUserInfoForm from '../../../user/component/tabs/FunUserInfoForm'
import {FormFooter} from 'CommonComponent'
import Ajax from '../../ajax/AjaxReq'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
let that;
class AuthorizeForm  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state={};
        this.breadArr = [{
            text: '角色',
            url: ''//如果不需要跳转url可以为空或不写url
        }, {
            text: '功能权限',
            url: ''
        }];
    }

    /**
     * submit按钮提交操作
     * @param e
     */
    handleSubmit(e) {
        this.refs.funUserInfoForm.saveFunction(this.props.cancelClick);
    }

    render() {
        that=this;
        return (
            <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelClick}>
                <FormCategory>
                    <FormCategoryItem name="功能权限">
                <FunUserInfoForm ref="funUserInfoForm" {...this.props} operatorType="role"/>
                <FormFooter style={{marginLeft:'100px',marginTop:"40px"}} submitClick={this.handleSubmit.bind(this)} cancelClick={this.props.cancelClick}/>
                    </FormCategoryItem>
                </FormCategory>
            </EditPanel>
        );
    }
}

export default AuthorizeForm;