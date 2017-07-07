import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import AddRowTable from 'CommonComponent/component/addrowtable'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import RestrictInput from 'CommonComponent/component/restrictinput'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import { Select2 ,Option2} from 'bfd-ui/lib/Select2'
import   RegularConst from "CommonComponent/utils/RegularConst"
import  RestrictConst from "CommonComponent/utils/RestrictConst"
import  ValidateInput from  "CommonComponent/component/validateinput"
import ValidateSelect from  "CommonComponent/component/validateselect"
import Ajax from '../ajax/AjaxReq'
let that;
const Win = React.createClass({
    //初始化表单数据。
    getInitialState() {
        return {
            ...this.props.data,
            validated:false
        }
    },

    componentDidMount() {
    },
    /**
     * 基本的约束,外部写的组件,必须使用 getData 方法,否则框架获取不到数据
     * @returns {*}
     */
    getData() {
        return this.state;
    },

    /**
     * 用用验证
     * @returns {boolean}
     */
    doVaildate()
    {
        this.state.validated=true;
        if(!that.state.tableIsSuccess)
            this.setState({});
        return that.state.tableIsSuccess;
    },

    /**
     * 公用修改处理
     * @param name
     * @param event
     */
    handleChange(name, event) {
        let newState = {};
        if (event && event.target) {
            newState[name] = name === "checked" ? event.target.checked : event.target.value;
        } else {
            newState[name] = event;
        }
        this.setState({...newState, validateState: false});
    },

    /**
     * 表格修改处理
     * @param dataField
     * @param index
     * @param data
     * @param e
     */
    dataGridHandleChange(dataField,index,data,e){
        data[index][dataField] = e.target?e.target.value:e;
        this.setState({validateState: false});
    },

    /**table 输入项验证**/
    tableValidate(label, inputValue, maxLen,rangeType) {
        let str;
        str = BaseValidate.validateInput({isRequired:true,label:label,value:inputValue,maxLength:maxLen});
        return str;
    },

    /**
     * 获取验证表单
     * @param dataField
     * @param item
     * @param label
     * @param arrList
     * @returns {*}
     */
    getInputField(dataField,item,label,arrList){
        let rowIndex = arrList.indexOf(item);
        let itemValue = rowIndex!=-1?arrList[rowIndex][dataField]:"";
        let maxLength = 128;
        var _regExp={};
        if(dataField == "name"){
        }
        else if(dataField == "comment"){
        }
        let str = BaseValidate.validateInput({isRequired:true,label,value:itemValue,maxLength,regExp:_regExp.name,regExpErrorStr:_regExp.tip});
        if(str)
        {
            that.state.tableIsSuccess=false;
        }
        let itemView ;
        if(dataField == "name"){
            itemView = <ValidateInput className="form-control" type="text" disabled value={itemValue} validated={this.state.validated}
                                      onChange={that.dataGridHandleChange.bind(that,dataField,rowIndex,arrList)} errorTip={str}/>;
        }
        else if(dataField == "comment"){
            itemView = <ValidateInput className="form-control" type="text"  value={itemValue} validated={this.state.validated}
                                      onChange={that.dataGridHandleChange.bind(that,dataField,rowIndex,arrList)} errorTip={str}/>;
        }
        return itemView;
    },

    /**
     * 默认提交方法
     * @param fun
     */
    submit(fun){
        let partionString="";
        for (let obj of that.state.baseColumns) {
            partionString += "/"+(obj.name + "=" + obj.comment)
        }
        Ajax.addPartitionValue({tableCode:this.props.code,partition:partionString.slice(1)},(data)=>{
            fun();
        });

    },

    /**
     * 删除处理
     * @param item
     * @param dataListArray
     */
    delClick(item,dataListArray){
        let rowIndex = dataListArray.indexOf(item);
        if(dataListArray && dataListArray.length > 0){
            dataListArray=dataListArray.splice(rowIndex,1);
        }
        that.setState();
    },




    render() {
        that = this;
        that.state.tableIsSuccess=true;
        let partitionArray=[];
        for (let obj of this.props.partition) {
            partitionArray.push({name:obj,comment:""})
        }

        that.state.baseColumns=that.state.baseColumns||partitionArray;
        let tempRowKeyArray = {totalList:that.state.baseColumns,currentPage:1,totalPageNum:1000};
        let rowKeyColumn = [
            {
                title: '分区名',
                key: 'name',
                render(text,item){
                    return (that.getInputField(this.key,item,this.title,that.state.baseColumns));
                }
            },

            {
                title: '分区值',
                key: 'comment',
                render(text,item){
                    return (that.getInputField(this.key,item,this.title,that.state.baseColumns));
                }
            }
        ];


        return (
            <div style={{maxHeight:400,overflowY: "auto", overflowX: "hidden"}}>
                <AddRowTable data={tempRowKeyArray}    column={rowKeyColumn}  showPage="false" isCanAdd={true} notRequire/>
            </div>
        );
    }
});

export default Win;