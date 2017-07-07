/***************************************************
 * 时间: 2016/7/21 16:39
 * 作者: bing.wang
 * 说明: 基本信息
 *
 ***************************************************/
import React from 'react'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory'
import HiveRoleInfo from './BaseRoleInfo'
import HiveUserInfo from './BaseUserInfo'
import {FormFooter} from 'CommonComponent'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import AuthorityStateTranfer from '../../../../common/AuthorityStateTranfer'
import Ajax from '../../ajax/AjaxReq'
let that=this;
class BaseTableEditor  extends React.Component{
    constructor(prop) {
        super(prop);
        this.breadArr = [{
            text: '数据权限',
            url: ''//如果不需要跳转url可以为空或不写url
        }, {
            text: '策略编辑'+this.props.resourcesType,
            url: ''
        }];
    }

    /**
     * 验证
     */
    vaildate(){
        if (that.doVaildate()) {
            console.log('表单验证通过');
            that.props.parent.nextStep();
        } else {
            console.log('表单验证失败');
        }
    }

    /**
     * submit按钮提交操作
     * @param e
     */
    handleSubmit(e) {
        let result= that.refs.baseUserInfo.doVaildate();
        if(result)
        {
            var resultData= AuthorityStateTranfer.stateToJson({...that.refs.baseUserInfo.getData(), ...{users:that.refs.userInfo.getData()},...{roles:that.refs.roleInfo.getData()}},
                that.props.resources)
            Ajax.addPolicy(resultData,function(data):void{
                that.props.submitHandler();
            });
        }
    }

    render() {
        that=this;
        let BaseInfo=this.props.baseInfo;
        return (
            <div>
            <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelClick}>
                <FormCategory>
                    <FormCategoryItem name="策略基本信息">
                        <BaseInfo ref="baseUserInfo" {...this.props}/>
                    </FormCategoryItem>
                    <FormCategoryItem name="授权角色">
                        <HiveRoleInfo ref="roleInfo" {...this.props}/>
                    </FormCategoryItem>
                    <FormCategoryItem name="授权用户" >
                        <HiveUserInfo ref="userInfo" {...this.props} clazz="BaseTableEditor"/>
                    </FormCategoryItem>
                </FormCategory>
            </EditPanel>
            <FormFooter style={{marginLeft:'100px',marginTop:'25px'}} submitClick={this.handleSubmit}
        cancelClick={this.props.cancelClick}></FormFooter>
                </div>
        );
    }
}

module.exports = BaseTableEditor;