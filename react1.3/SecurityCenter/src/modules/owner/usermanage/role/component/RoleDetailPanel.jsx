/***************************************************
 * 时间: 2016/7/21 16:04
 * 作者: bing.wang
 * 说明: 角色详情页面
 *
 ***************************************************/
import React from 'react'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory'
import StepsSubmit from 'CommonComponent/component/stepssubmit'
import BaseRoleForm from './tab/subtab/BaseRoleForm'
import RoleUserInfo from './tab/subtab/RoleUserInfo'
import FunUserInfoForm from '../../user/component/tabs/FunUserInfoForm'
import ReourceUserInfoForm from '../../user/component/tabs/ReourceUserInfoForm'
import HiveTable from './tab/datatab/HiveTable'
import HbaseTable from './tab/datatab/HbaseTable'
import HdfsTable from './tab/datatab/HdfsTable'
import EditPanel from 'CommonComponent/component/bdoseditpanel'

class RoleDetailPanel  extends React.Component{

    constructor(prop) {
        super(prop);

        this.breadArr = [{
            text: '角色管理',
            url: ''//如果不需要跳转url可以为空或不写url
        }, {
            text: '角色详情',
            url: ''
        }];
    }

    render(){
        return (
            <div className="module-edit-container  common-container-border user-manager-role-detail-panel">
                <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelClick}>
                <FormCategory>
                    <FormCategoryItem name="基本信息">
                        <BaseRoleForm ref="baseUserInfo" {...this.props}/>
                    </FormCategoryItem>
                    <FormCategoryItem name="用户信息" >
                        <RoleUserInfo ref="roleUserInfo" {...this.props}/>
                    </FormCategoryItem>
                    <FormCategoryItem name="功能权限">
                        <FunUserInfoForm ref="funUserInfoForm" {...this.props} operatorType="role"/>
                    </FormCategoryItem>
                    <FormCategoryItem name="资源权限">
                        <ReourceUserInfoForm ref="reourceUserInfoForm" {...this.props}  operatorType="role"/>
                    </FormCategoryItem>
                    <FormCategoryItem name="HIVE权限" >
                        <HiveTable ref="hiveTable" {...this.props} operatorType="userRoleDetail"/>
                    </FormCategoryItem>
                    <FormCategoryItem name="HBASE权限">
                        <HbaseTable ref="hbaseTable" {...this.props} operatorType="userRoleDetail"/>
                    </FormCategoryItem>
                    <FormCategoryItem name="HDFS权限">
                        <HdfsTable ref="hdfsTable" {...this.props} operatorType="userRoleDetail"/>
                    </FormCategoryItem>
                </FormCategory>

                <button type="button" className="btn btn-default common-btn" style={{marginLeft: 171,marginTop:30}} onClick={this.props.cancelClick}>取消</button>
            </EditPanel>
            </div>
        );
    }
}

module.exports = RoleDetailPanel;