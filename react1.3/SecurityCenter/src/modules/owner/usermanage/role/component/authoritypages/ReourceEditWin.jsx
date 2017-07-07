/***************************************************
 * 时间: 2016/7/21 16:11
 * 作者: bing.wang
 * 说明: 资源权限编辑页面
 *
 ***************************************************/
import React from 'react'
import ReourceUserInfoForm from '../../../user/component/tabs/ReourceUserInfoForm'
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
            text: '资源权限',
            url: ''
        }];
    }

    /**
     *submit按钮提交操作
     * @param e
     */
    handleSubmit(e) {
        this.refs.reourceUserInfoForm.saveFunction(this.props.cancelClick);
    }

    render() {
        that=this;
        return (
            <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelClick}>
                <FormCategory>
                    <FormCategoryItem name="资源权限">
                <ReourceUserInfoForm ref="reourceUserInfoForm" {...this.props}  operatorType="role"/>
                <FormFooter style={{marginLeft:'100px',marginTop:"40px"}} submitClick={this.handleSubmit.bind(this)}
                            cancelClick={this.props.cancelClick}/>
                    </FormCategoryItem>
                </FormCategory>
            </EditPanel>
        );
    }
}

export default AuthorizeForm;