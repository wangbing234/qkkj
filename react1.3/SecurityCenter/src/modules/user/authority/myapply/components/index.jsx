/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:我的申请主页面
 *
 ***************************************************/
import React from 'react'
import MyApplyTable from './MyApplyTable'
import ApplyDataForm from './applywin/ApplyDataForm'
import '../../css/index.less'
let that;
class Index extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = { viewType:0};
    }

    render() {
        that=this;
        let displayForm;
        if(this.state.viewType==0)
            displayForm=<MyApplyTable mainPage={this} {...this.props}/>;
        else
            displayForm=<ApplyDataForm  mainPage={this} data={this.state.formData} viewType={this.props.viewType}/>;
        return (<div style={{paddingBottom:'20px'}}>{displayForm}</div>)
    }
}

module.exports = Index
