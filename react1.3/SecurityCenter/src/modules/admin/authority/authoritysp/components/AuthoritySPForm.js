/***************************************************
 * 时间: 2016/7/20 11:06
 * 作者: lijun.feng
 * 说明: 权限审批form
 ***************************************************/
import React from 'react';
import AuthoritySPFunc from './authform/AuthoritySPFunc'
import AuthoritySPData from './authform/AuthoritySPData'
import AdminEnum from 'AdminEnum'

let that;
let isSee;//是否显示审批人等信息

class AuthoritySPForm extends React.Component{
    constructor(prop) {
        super(prop);
        that = this;
        isSee = this.props.data.status != 0;
        this.state = {  ...this.props.data,viewType:this.props.viewType};
    }

    renderFuncAuthority(){
        return <AuthoritySPFunc isApproval = {this.isApproval()} isFun="true" cancel={that.props.cancel} data={this.state} isSee={isSee}/>
    }

    renderDataAuthority(){
        return <AuthoritySPData isApproval = {this.isApproval()} cancel={that.props.cancel} data={this.state} isSee={isSee}/>
    }

    renderResourceAuthority(){
        return <AuthoritySPFunc isApproval = {this.isApproval()} isFun="false" cancel={that.props.cancel} data={this.state} isSee={isSee}/>
    }

    //判断是否是审批
    isApproval(){
        return this.state.status == AdminEnum.APPROVAL
    }

    render() {
        that = this;
        let comp;
        switch (this.state.applyType) {
            case AdminEnum.FUNC_AUTHORITY:
                comp = this.renderFuncAuthority();
                break;
            case AdminEnum.DATA_AUTHORITY:
                comp = this.renderDataAuthority();
                break;
            case AdminEnum.RESOURCE_AUTHORITY:
                comp = this.renderResourceAuthority();
                break;
        }
        return(<div> {comp} </div>);
    }
}

export default AuthoritySPForm;
