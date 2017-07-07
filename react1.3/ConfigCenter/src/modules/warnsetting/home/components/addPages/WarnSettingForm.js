/**
 * Created by zhongxia on 16/4/5.
 */
import React from 'react'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import { Select2 ,Option2} from 'bfd-ui/lib/Select2'
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'CommonComponent/component/bdosmessage'
import DataTable from 'bfd-ui/lib/DataTable'
import {BfdRequest,RestrictInput,AddRowTable} from 'CommonComponent'
import ValidateInput from  "CommonComponent/component/validateinput"
import ValidateSelect from  "CommonComponent/component/validateselect"
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import ENUM from 'WarnSettingEnum'
import Model from 'WarnSettingModel'
import '../../css/warnsetting.less'

let serverUrl = Server.jupiterWeb + 'configCenterApi/configCenter';
let that, isSuccess, validates, tableIsSuccess, viewType;
let firstItem = {name: ENUM.CHOOSE, id: ENUM.CHOOSE};
let levelArr = [{"name": "警告", "id": 1}, {"name": "错误", "id": 2}, {"name": "致命", "id": 3}];
let yzArr = [{"name": "范围", "id": 1}, {"name": "值", "id": 2}];
let statusArr = [{"name": "启用", "id": 1}, {"name": "停止", "id": 2}];
let emailArr = [];
let smsArr = [];

//数字正则
let numRegStr = /[0-9]+$/;
let numAndDian = /[.0-9]+$/;

let noAuthItem = {id:ENUM.NO_AUTHORITY,name:ENUM.NO_AUTHORITY};

class WarnSettingForm extends React.Component {
    constructor(prop) {
        super(prop);
        /*startValue = '';
         endValue = '';*/
        let dataTableArr = this.props.data.alertLevelConfig;
        let item = {level: "", yzType: "", yz: "", frequency: "", status: "", emailGroup: "", msgGroup: ""};
        viewType = this.props.operation;
        that = this;
        EventEmitter.subscribe("UPDATE_GROUP_USER",this.getEmaiMSG);
        this.rules = {
            cluster:value => {
                return BaseValidate.validateInput({isRequired:true,label:"集群",value:(value==ENUM.CHOOSE?"":value)});
            },
            group:value => {
                return BaseValidate.validateInput({isRequired:true,label:"组",value:(value==ENUM.CHOOSE?"":value)});
            },
            metric:value => {
                return BaseValidate.validateInput({isRequired:true,label:"监控项",value:(value==ENUM.CHOOSE?"":value)});
            },
            hostList:value => {
                return BaseValidate.validateInput({isRequired:true,label:"主机",value:(value==ENUM.CHOOSE?"":value)});
            }
        };

        this.state = {
            validateState: false,
            clusterArr: [ENUM.CHOOSE],
            groupArr: [ENUM.CHOOSE],
            metricArr: [ENUM.CHOOSE],
            hostArr: [],
            cluster: ENUM.CHOOSE,
            group: ENUM.CHOOSE,
            metric:ENUM.CHOOSE,
            hostList: [],
            ...this.props.data,
            alertLevelConfig: {totalList: dataTableArr ? dataTableArr : [item]}
        };
    }

    getEmaiMSG(){
        that.getEmailGroup();
        that.getMsgGroup();
    }

    baseValidateFunc(label, value, maxLen) {
        let str = "";
        /*if (!value || value == ENUM.CHOOSE || (value instanceof Array == true && value.length == 0)) {
         str = label + "不能为空!";
         } else*/ if (label == "阈值") {
            let arr = value.split("-");
            if (!arr[0]) {
                str = label + "开始值" + "不能为空";
            }
            if (!arr[1]) {
                str = label + "结束值" + "不能为空";
            }
            /*if (arr[0] && arr[1] && arr[0] > arr[1]) {

             }*/
            if (arr[0] && arr[1]) {
                if(arr[0] > arr[1]){
                    str = label + "开始值不能大于结束值";
                }
                if(maxLen && (arr[0].length > maxLen || arr[1].length > maxLen)){
                    str = "长度不能大于"+maxLen+"个字符";
                }
            }
        } /*else if (maxLen && value.length > maxLen) {
         str = label + "长度不能大于" + maxLen + "个字符";
         }*/
        return str;
    }

    /**table 输入项验证**/
    tableValidate(label, inputValue, maxLen,rangeType) {
        let str;
        if(rangeType == '1' && label=="阈值"){
            //特殊处理
            str = this.baseValidateFunc(label, inputValue, maxLen);
        }else {
            str = BaseValidate.validateInput({isRequired:true,label:label,value:inputValue,maxLength:maxLen});
        }

        return str;
    }

    /**Input框渲染**/
    getInput(key, text, label, record, maxLen = '', restrictStr = '') {
        let data = that.state.alertLevelConfig.totalList;
        var cIndex = data.indexOf(record);
        var inputValue = data[cIndex][key];
        let str = that.tableValidate(label, inputValue, maxLen,'');
        if (str) {
            tableIsSuccess = false;
        }
        return (
            <div style={{width:"100%"}}>
                <ValidateInput type="text" maxLen={maxLen} className="form-control" restrict={restrictStr}
                               disabled={viewType == 'detail'?true:false} validated={this.state.validated}
                               value={inputValue} onChange={that.tableInputHandleChange.bind(that,cIndex,key,'')}
                               errorTip={str}/>
            </div>
        );
    }

    /**Input框渲染**/
    getSInput(key, text, label, record, maxLen = '', restrictStr = '') {
        let data = that.state.alertLevelConfig.totalList;
        let cIndex = data.indexOf(record);
        let inputValue = data[cIndex][key];
        let arr = inputValue ? inputValue.split('-') : [];
        let startV = '';
        let endV = '';
        if (arr.length > 0) {
            startV = arr[0];
            endV = arr[1];
        }
        let str = that.tableValidate(label, inputValue, maxLen,data[cIndex].rangeType);
        if (str) {
            tableIsSuccess = false;
        }
        return (<div style={{width:"100%"}}>
            <ValidateInput type="text" className="form-control" maxLen={maxLen} restrict={restrictStr}
                           disabled={viewType == 'detail'?true:false} validated={this.state.validated}
                           style={{width:58,display:'inline'}} value={startV}
                           onChange={that.tableInputHandleChange.bind(that,cIndex,key,'start')}
                           errorTip={str}/>
            <span>-</span>
            <ValidateInput type="text" className="form-control" maxLen={maxLen} restrict={restrictStr}
                           disabled={viewType == 'detail'?true:false} validated={this.state.validated}
                           style={{width:58,display:'inline'}} value={endV}
                           onChange={that.tableInputHandleChange.bind(that,cIndex,key,'end')}
                           errorTip={str}/>
        </div>);
    }

    /**Select框渲染**/
    getSelect(key, text, dataSource, record, label) {
        let data = that.state.alertLevelConfig.totalList;
        let cIndex = data.indexOf(record);
        let inputValue = data[cIndex][key];
        let str = that.tableValidate(label, inputValue=="请选择"?inputValue="":inputValue, '');
        if (str) {
            tableIsSuccess = false;
        }

        return (

            <div style={{width:'100%'}}>
                <ValidateSelect refs="se" disabled={viewType == 'detail'?true:false} value={inputValue}
                                errorTip={str} dataProvider = {dataSource}
                                onChange={that.tableInputHandleChange.bind(that,cIndex,key,'')} validated={this.state.validated}>
                    {
                        dataSource.map(function (item, index) {
                            return (<Option2 key={index}
                                             value={item.hasOwnProperty("id")?item.id:item}>{item.hasOwnProperty("name") ? item.name : item}</Option2>);
                        })
                    }
                </ValidateSelect>
            </div>);
    }


    /**Select框渲染**/
    getEmailSelect(key, text, dataSource, record, label) {
        let data = that.state.alertLevelConfig.totalList;
        let cIndex = data.indexOf(record);
        //4932 配置中心》报警设置》报警项，当某个邮件组或短信组的权限被移除后，应该在显示框中显示：“该资源无权限或已被移除”
        let preValue = data[cIndex][key];
        let firstItem;
        if(dataSource && preValue && dataSource.length > 0){
            var isHave=true;
            dataSource.map(function (item, index) {
                if(item.id == preValue){
                    isHave = false;
                }
            });
            if(isHave && preValue!=ENUM.CHOOSE){
                preValue = ENUM.NO_AUTHORITY;
                firstItem = preValue;
                //$("#seemail").value = firstItem;
            }
        } else {
            preValue = ENUM.CHOOSE;
        }


        let inputValue = preValue;
        let str = that.tableValidate(label, inputValue=="请选择"?"":inputValue, '');
        let isHaveError;
        if((!record.emailGroup || record.emailGroup == ENUM.CHOOSE ) && (!record.smsGroup || record.smsGroup == ENUM.CHOOSE)){
            isHaveError = false;
            tableIsSuccess = false;
        }else {
            isHaveError = true;
            //tableIsSuccess = true;//先删除
        }

        return (
            <div style={{width:'100%'}}>
                <ValidateSelect id="seemail" disabled={viewType == 'detail'?true:false} value={inputValue}
                                isErrorEnable = {isHaveError} errorTip={str} dataProvider = {dataSource}
                                onChange={that.tableInputHandleChange.bind(that,cIndex,key,'')} validated={this.state.validated}>
                    <Option2 value={firstItem?firstItem:ENUM.CHOOSE}>{firstItem?firstItem:ENUM.CHOOSE}</Option2>
                    {
                        dataSource.map(function (item, index) {
                            return (<Option2 key={index}
                                             value={item.hasOwnProperty("id")?item.id:item}>{item.hasOwnProperty("name") ? item.name : item}</Option2>);
                        })
                    }
                </ValidateSelect>
            </div>);
    }


    /**
     * index 索引
     * dateField
     * soe star或end
     * e 值
     * **/
    tableInputHandleChange(index, dateField, soe, e) {
        let value;
        if (e && e.target) {
            value = e.target.value;
        } else {
            value = e;
        }


        var obj = that.state;
        //阈值类型切换时清空阈值
        if(dateField == 'rangeType'){
            obj.alertLevelConfig.totalList[index].rangeValue = "" ;
        }
        //rangeType为范围的时候开始-结束值需要特殊处理，
        if (dateField == 'rangeValue' && soe) {
            let startValue = '';
            let endValue = '';
            let trangeValue = obj.alertLevelConfig.totalList[index][dateField];
            let arr = trangeValue.split("-");
            if(arr.length == 2){
                startValue = arr[0];
                endValue = arr[1];
            }
            if (soe == 'start') {
                startValue = value;
            } else if (soe == 'end') {
                endValue = value;
            }
            obj.alertLevelConfig.totalList[index][dateField] = startValue + '-' + endValue;
        } else {
            obj.alertLevelConfig.totalList[index][dateField] = value;
        }
        this.setState({data: obj, validateState: false});
    }

    /**表单change**/
    handleChange(dataField, value) {
        var obj = that.state;
        obj[dataField] = value;
        this.setState({data: obj});
        switch (dataField) {
            case 'cluster':
                this.clearDataSource(this.state.groupArr);
                this.state.group = ENUM.CHOOSE;
                this.state.metric = ENUM.CHOOSE;
                this.state.hostList = [ENUM.CHOOSE];
                this.getGroup(value);
                break;
            case 'group':
                this.clearDataSource(this.state.metricArr);
                this.state.metric = ENUM.CHOOSE;
                this.state.hostList = [ENUM.CHOOSE];
                this.getMetric(value);
                break;
            case 'metric':
                this.clearDataSource(this.state.hostArr);
                this.state.hostList = [ENUM.CHOOSE];
                this.getHost(value);
                break;
            case 'hostList':
                if (this.state.hostList.length >= 1 && (this.state.hostList.indexOf(ENUM.CHOOSE) != -1)) {
                    this.state.hostList.splice(0, 1);
                    //this.setState({hostList:this.state.hostList});
                }
                break;
        }
    }

    /**数组开头添加-请选择-**/
    addFirst(arr, isKeyObj = false) {
        if (isKeyObj) {
            arr.unshift(firstItem);
        } else {
            arr.unshift(ENUM.CHOOSE);
        }
    }

    clearDataSource(arr){
        arr.splice(1,arr.length-1);
        return arr;
    }



    componentDidMount() {
        //查询短信组、邮件组、集群
        that.getCluster();
        that.getEmaiMSG();
    }

    /**查询集群列表**/
    getCluster() {
        Model.getCluster((result) => {
            that.addFirst(result.totalList);
            that.setState({clusterArr: result.totalList});
            let cluster = that.state.cluster;
            if (cluster != '') {
                that.getGroup(cluster);
            }
        });
    }

    /**查询邮件组**/
    getEmailGroup() {
        Model.getEmailGroup((result) => {
            //that.addFirst(result.totalList);
            emailArr = result.totalList;
        });
    }


    /**查询短信组**/
    getMsgGroup() {
        Model.getSmsGroup((result) => {
            //that.addFirst(result.totalList);
            smsArr = result.totalList;
        });
    }

    /**查询组**/
    getGroup(cluster) {
        let param = `&cluster=${cluster}`;
        Model.getGroup(param, (result) => {
            this.addFirst(result.totalList);
            that.setState({groupArr: result.totalList});
            let group = that.state.group;
            if (group != '') {
                that.getMetric(group);
            }
        });
    }

    /**查询监控项**/
    getMetric(group) {
        let param = `&cluster=${this.state.cluster}&group=${group}`;
        Model.getWarnItem(param, (result) => {
            that.addFirst(result.totalList);
            that.setState({metricArr: result.totalList});
            let metric = that.state.metric;
            if ( metric != '') {
                that.getHost(metric);
            }
        });
    }

    /**查询主机**/
    getHost(metric) {
        let param = `&cluster=${this.state.cluster}&group=${this.state.group}&metric=${metric}`;
        Model.getHost(param, (result) => {
            //that.addFirst(result.totalList, true);
            that.setState({hostArr: result.totalList});
        });
    }

    //submit按钮提交操作
    handleSubmit(e) {
        e.preventDefault();
        this.setState({validateState: true});

        /*if (this.state.hostList.length > 1 && this.state.hostList.indexOf(ENUM.CHOOSE) != -1) {
         this.state.hostList.remove(0);
         }*/

        var objData = {
            cluster: this.state.cluster, group: this.state.group,
            metric: this.state.metric, hostList: this.state.hostList
        };
        var dataObj;
        if(viewType == "add") {
            dataObj = objData;
        }else if (viewType == "update"){
            dataObj = {id:this.state.id,...objData};
        }
        let alertMsg = {alertMsg: JSON.stringify(dataObj)};
        let tableDataIsNull = true;//表格数据是否为空
        if(this.state.alertLevelConfig.totalList.length == 0){
            tableDataIsNull = false;
            message.danger('请填写级别配置信息');
            return ;
        }
        if(this.refs.baseForm.validate(this.state) && tableIsSuccess && tableDataIsNull){
            console.log('表单验证通过');
            //回调保存方法
            that.props.submitHandler({
                alertConfig: JSON.stringify(dataObj), levelList: JSON.stringify(this.state.alertLevelConfig.totalList)
            });
        } else {
            this.state.validated=true;
            console.log('表单验证失败');
        }

    }

    //获取验证是否通过状态，并存放到isSuccess数组中。
    isSuccess(flag) {
        isSuccess.push(flag);
    }

    setFirstSelectItem(arr,field){
        let value;
        if(arr.length == 1){
            value = arr[0];
            //this.refs[field].value = value;
            let obj = {};
            obj[field] = value;
            this.setState(obj);
        }
    }


    //新增行
    addItem() {
        if (viewType == 'detail') {
            that.preventDefault();
            return;
        }
        //let item = {level: "", yzType: "", yz: "", frequency: "", status: "", emailGroup: "", msgGroup: ""};
        if (that.state.alertLevelConfig.totalList.length > 3) {
            that.state.alertLevelConfig.totalList.pop();
            message.danger('最多添加三条级别配置信息');
        }

    }

    /**删除行**/
    delItem(item) {
        var data = that.state.alertLevelConfig.totalList;
        let rowIndex = data.indexOf(item);
        if (data && data.length > 0) {
            data.splice(rowIndex, 1);
        }
        that.setState({alertLevelConfig: that.state.alertLevelConfig});
    }

    render() {
        tableIsSuccess = true;
        isSuccess = [];
        const column = [
            {
                title: '级别',
                key: 'level',
                render(text, record){
                    return that.getSelect('level', text, levelArr, record, this.title);
                }
            }, {
                title: '阈值类型',
                key: 'rangeType',
                render(text, record){
                    return that.getSelect('rangeType', text, yzArr, record, this.title);
                }
            }, {
                title: '阈值',
                key: 'rangeValue',
                render(text, record){
                    if (record.rangeType == 1) {
                        return that.getSInput('rangeValue', text, this.title, record, 9, numAndDian);
                    } else {
                        return that.getInput('rangeValue', text, this.title, record, 9, numAndDian);
                    }
                }
            }, {
                title: '频率(分钟)',
                key: 'sendFre',
                render(text, record){
                    return that.getInput('sendFre', text, this.title, record, '', numRegStr);
                }
            }, {
                title: '状态',
                key: 'status',
                render(text, record){
                    return that.getSelect('status', text, statusArr, record, this.title);
                }
            }, {
                title: '邮件组',
                key: 'emailGroup',
                render(text, record){
                    return that.getEmailSelect('emailGroup', text, emailArr, record, this.title);
                }
            }, {
                title: '短信组',
                key: 'smsGroup',
                render(text, record){
                    return that.getEmailSelect('smsGroup', text, smsArr, record, this.title);
                }
            }, {
                title: '操作',
                key: 'operation',
                render(record, text){
                    return (<div style={{width:50}}><a href="javascript:void(0)" style={{width:40}}
                                                       disabled={viewType != 'detail'?false:true}
                                                       onClick={that.delItem.bind(that,record)}>删除</a></div>);
                }
            }];

        return (
            <div className="module-border warn-setting-edit">
                <Form horizontal isSuccess={this.isSuccess} sytle={{width:950}}
                      rules = {this.rules} ref="baseForm">
                    <FormItem label="集群"  required name="cluster">
                        <Select2 value={that.state.cluster} disabled={viewType == 'add'?false:true}
                                 onChange={that.handleChange.bind(this,'cluster')} placeholder="select your beverage">
                            {
                                this.state.clusterArr.map((item, index)=> {
                                    return <Option2 key={index} value={item}>{item}</Option2>
                                })
                            }
                        </Select2>
                    </FormItem>
                    <FormItem label="组" required name="group">
                        <Select2 value={that.state.group} disabled={viewType == 'add'?false:true}
                                 onChange={that.handleChange.bind(this,'group')}>
                            {
                                this.state.groupArr.map((item, index)=> {
                                    return <Option2 key={index} value={item}>{item}</Option2>
                                })
                            }
                        </Select2>
                    </FormItem>
                    <FormItem label="监控项" required name="metric">
                        <Select2 value={that.state.metric} disabled={viewType == 'add'?false:true}
                                 onChange={this.handleChange.bind(this,'metric')}>
                            {
                                this.state.metricArr.map((item, index)=> {
                                    return <Option2 key={index} value={item}>{item}</Option2>
                                })
                            }
                        </Select2>
                    </FormItem>
                    <FormItem label="主机" required name="hostList">
                        <MultipleSelect values={that.state.hostList} disabled={viewType == 'detail'?true:false}
                                        onChange={this.handleChange.bind(this,'hostList')}>
                            {

                                this.state.hostArr.map((item, index)=> {
                                    return <Option key={index} value={item.name}>{item.name}</Option>
                                })
                            }
                        </MultipleSelect>
                    </FormItem>
                    {/*<FormItem label="级别：" required>
                     <div className="module-table">
                     <AddRowTable data={this.state.alertLevelConfig} column={column} addItem={this.addItem}/>
                     </div>
                     </FormItem>*/}
                </Form>
                <div className="hr">级别</div>
                <div>
                    <AddRowTable data={this.state.alertLevelConfig} column={column} addItem={this.addItem}
                                 isCanAdd={viewType == 'detail'?true:false} notRequire = {viewType == 'detail'?true:false}/>
                </div>

                <div className="table-btns">
                    <button type="button" className="btn btn-sm btn-primary ws-input-margin-right"
                            disabled={viewType == 'detail'?true:false}
                            onClick={this.handleSubmit.bind(this)}>提交
                    </button>
                    <button type="button" className="btn btn-sm btn-default"
                            onClick={this.props.cancelHandler}>取消
                    </button>
                </div>
            </div>
        );
    }
}

export default WarnSettingForm