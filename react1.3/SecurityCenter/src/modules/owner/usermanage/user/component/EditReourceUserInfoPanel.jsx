/***************************************************
 * 时间: 2016/7/21 16:00
 * 作者: bing.wang
 * 说明: 编辑资源主页面
 *
 ***************************************************/
import React from 'react'
import ReourceUserInfoForm from './tabs/ReourceUserInfoForm'
import {FormFooter} from 'CommonComponent'
import Ajax from '../ajax/AjaxReq'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
class UserInfoPanel  extends React.Component{

    constructor(prop) {
        super(prop);
        this.breadArr = [{
            text: '用户',
            url: ''//如果不需要跳转url可以为空或不写url
        }, {
            text: '资源权限',
            url: ''
        }];
    }

    /**
     * 提交处理
     */
    handleSubmit(){
        this.refs.reourceUserInfoForm.saveFunction(this.props.cancelClick);
    }

    render(){
        return (
            <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelClick}>
                <FormCategory>
                    <FormCategoryItem name="资源权限">
            <div  className="module-edit-container  common-container-border" style={{paddingBottom:30}}>
                <ReourceUserInfoForm  ref="reourceUserInfoForm" {...this.props}/>
                <FormFooter style={{marginLeft:'100px',marginTop:"40px"}} submitClick={this.handleSubmit.bind(this)}
                            cancelClick={this.props.cancelClick}></FormFooter>
            </div>
                    </FormCategoryItem>
                </FormCategory>
            </EditPanel>
        );
    }
}

module.exports = UserInfoPanel;