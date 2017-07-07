import React from 'react'

import { DateRange } from 'bfd-ui/lib/DatePicker'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import message from 'CommonComponent/component/bdosmessage'
import {BfdRequest} from 'CommonComponent'
import WarnSettingForm from './addPages/WarnSettingForm'
import AlarmList from './AlarmList'
import Model from 'WarnSettingModel'
import ENUM from 'WarnSettingEnum'
import BreadCrumb from 'CommonComponent/component/breadcrumb'
let that;
let serverUrl = Server.jupiterWeb+'configCenterApi/configCenter';
const LISTVIEW = "listView";
const FORMVIEW = "FormView";

class WarnSetting extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            viewType:LISTVIEW,
            operation: '',
            titleStr:'报警设置'
        };
        that = this;
    }

    /**保存报警配置**/
    saveConfig(obj){
         Model.saveWarnSetting(obj,(result) =>{
             message.success(ENUM.SAVESUCCESS);
             this.cancelHandler();
         });
    }

    /**表单提交保存回调函数**/
    submitHandler(data) {
        //调用后台保存方法
        this.saveConfig(data);
    }

    /**打开表单页面**/
    openHandler(operation,formData) {
        that.setState({viewType:FORMVIEW,titleStr:'新增报警项',operation:operation,formData: formData});
    }

    /**取消，返回列表**/
    cancelHandler(){
        this.setState({viewType:LISTVIEW,titleStr:'报警设置'});
    }
    render() {
        that = this;
        let breadCrumbArr = [{
            text: this.state.titleStr,
            url:''
        }];
        let comp;
        switch (this.state.viewType){
            case LISTVIEW:
                comp = <div className="module-container"><AlarmList openHandler={this.openHandler.bind(this)} /></div>;
                break;
            case FORMVIEW:
                comp = <div className="module-edit-container"><WarnSettingForm
                    data={this.state.formData} operation={this.state.operation}
                    cancelHandler={this.cancelHandler.bind(this)}
                    submitHandler={this.submitHandler.bind(this)}/></div>;
                break;
        }
        return (
            <div>
                {/*<div className="breadCrumbDiv">
                    <BreadCrumb msgArr={breadCrumbArr} history={this.props.history} />
                </div>*/}
                {comp}
            </div>
        );
    }
}

export default WarnSetting