/***************************************************
 * 时间: 2016/7/21 16:11
 * 作者: bing.wang
 * 说明: 数据权限编辑页面
 *
 ***************************************************/
import React from 'react'
import DataInfoForm from '../tab/DataInfoForm'
import {FormFooter} from 'CommonComponent'
import message from 'CommonComponent/component/bdosmessage'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
let that;
class DataEditWin  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state={};
        this.breadArr = [{
            text: '角色',
            url: ''//如果不需要跳转url可以为空或不写url
        }, {
            text: '数据权限',
            url: ''
        }];
    }

    /**
     * submit按钮提交操作
     * @param e
     */
    handleSubmit(e) {
        that.refs.dataInfoForm.saveData(this.props.cancelClick);
    }

    render() {
        that=this;
        return (
            <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelClick}>
                <FormCategory>
                    <FormCategoryItem name="数据权限">
                <DataInfoForm ref="dataInfoForm" style={{marginLeft:"-120px",marginRight:"-150px"}} {...this.props}/>
                <FormFooter style={{marginLeft:'100px',marginTop:"40px"}} submitClick={this.handleSubmit.bind(this)}
                            cancelClick={this.props.cancelClick.bind(this)}/>
                    </FormCategoryItem>
                </FormCategory>
            </EditPanel>
        );
    }
}

export default DataEditWin;