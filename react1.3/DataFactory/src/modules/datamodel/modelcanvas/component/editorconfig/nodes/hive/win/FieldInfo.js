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
import  JavaDircory from "../../../../../common/JavaDircory"
import AuthButton from 'CommonComponent/component/authbutton'
let that;
const Win = React.createClass({
  //初始化表单数据。
  getInitialState() {
      let cState={ ...this.props.data,validated:false};
    return cState;
  },
  /**
   * 基本的约束,外部写的组件,必须使用 getData 方法,否则框架获取不到数据
   * @returns {*}
   */
  getData() {
      //let thisState=$.extend(true,{},this.state)
      //thisState.baseColumns= thisState.baseColumns.filter(item=>(item.isAdded!=true));
      //thisState.parColumns= thisState.parColumns.filter(item=>(item.isAdded!=true));
      return this.state;
  },

    /**
     * 用用验证
     * @returns {boolean}
     */
  vaildate()
  {
    this.state.validated=true;
    if(!this.state.tableIsSuccess)
      this.setState({});
    return this.state.tableIsSuccess && this.state.baseColumns.length!=0;
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

    /**Select框渲染**/
    getSelect(key, text, dataSource, record, label,data) {
        let disabedForm=record.isAdded?{disabled:true}:{};
        let cIndex = data.indexOf(record);
        let inputValue = data[cIndex][key];
        let str = that.tableValidate(label, inputValue=="请选择"?inputValue="":inputValue, '');
        if (str) {
            that.state.tableIsSuccess = false;
        }
        return (
            <div style={{width:'100%'}}>
                <ValidateSelect value={inputValue}  errorTip={str} {...disabedForm}
                                onChange={that.dataGridHandleChange.bind(that,key,cIndex,data)} validated={this.state.validated}>
                    {
                        dataSource.map(function (item, index) {
                            return (<Option2 key={index} value={item.name}>{item.name}</Option2>);
                        })
                    }
                </ValidateSelect>
            </div>);
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
        let disabedForm=item.isAdded?{disabled:true}:{}
    let rowIndex = arrList.indexOf(item);
    let itemValue = rowIndex!=-1?arrList[rowIndex][dataField]:"";
    let maxLength = 128;
    var _regExp={};
        let isRequired=false;
    if(dataField == "name"){
      _regExp.name=RestrictConst.NUM_START_STRING_UNDERLINE_32;
        //_regExp.tip="只能输入字母、数字、下划线，且必须以字母开头；长度不超过32个字符";
      maxLength=32;
        isRequired=true;
    }
    else if(dataField == "userPhone"){
      _regExp=RegularConst.PHONE_STRING;
      maxLength=11;
    }
    let str = BaseValidate.validateInput({isRequired:isRequired,label,value:itemValue,maxLength,regExp:_regExp.name,regExpErrorStr:_regExp.tip});
    if(str)
    {
      that.state.tableIsSuccess=false;
    }
    let itemView ;
    if(dataField == "userEmail"){
      let strict = RestrictConst.EMAIL_STRING;
      itemView = <ValidateInput className="form-control" type="text" restrict={strict} {...disabedForm} value={itemValue}  validated={this.state.validated}
                                onChange={that.dataGridHandleChange.bind(that,dataField,rowIndex,arrList)} errorTip={str}/>;
    }
    else if(dataField == "userPhone"){
      let strict = RestrictConst.NUM;
      itemView = <ValidateInput className="form-control" type="text" restrict={strict}  {...disabedForm} value={itemValue} validated={this.state.validated}
                                onChange={that.dataGridHandleChange.bind(that,dataField,rowIndex,arrList)} errorTip={str}/>;
    }
    else{
      itemView = <ValidateInput className="form-control" type="text"  value={itemValue} {...disabedForm} validated={this.state.validated}
                                onChange={that.dataGridHandleChange.bind(that,dataField,rowIndex,arrList)} errorTip={str}/>;
    }
    return itemView;
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

    /**
     * 上移处理
     * @param item
     * @param dataListArray
     */
  upRecord(item,dataListArray){
    dataListArray= CommonUtil.upRecord(dataListArray,item);
    that.setState();
  },

    /**
     * 下移处理
     * @param item
     * @param dataListArray
     */
  downRecord(item,dataListArray){
    dataListArray=  CommonUtil.downRecord(dataListArray,item);
    that.setState();
  },



  render() {
    that = this;
    that.state.tableIsSuccess=true;
      that.state.baseColumns=that.state.baseColumns||[];
      that.state.parColumns=that.state.parColumns||[];
    let tempRowKeyArray = {totalList:that.state.baseColumns,currentPage:1,totalPageNum:1000};
    let tempFieldListArray = {totalList:that.state.parColumns,currentPage:1,totalPageNum:1000};
    let rowKeyColumn = [
      {
        title: '列名',
        key: 'name',
        render(text,item){
          return (that.getInputField(this.key,item,this.title,that.state.baseColumns));
        }
      },
        {
            title: '类型',
            key: 'dataType',
            render(text, record){

                return that.getSelect(this.key, text, JavaDircory.DATA_TYPE_ARRAY, record, this.title,that.state.baseColumns);
            }
        },
      {
        title: '描述',
        key: 'comment',
        render(text,item){
          return (that.getInputField(this.key,item,this.title,that.state.baseColumns));
        }
      },
      {
        title: '操作',
        key: 'operation',
        render(item,record){
            let delForm;
            if(item.isAdded!=true  && that.props.okButton!="1")
            {
                delForm=<div style={{width:100}}>
                    <AuthButton  renderType="icon" type="arrow-up" onClick={that.upRecord.bind(that,item,that.state.baseColumns)} title="上移"></AuthButton>
                    <AuthButton  renderType="icon" type="arrow-down" onClick={that.downRecord.bind(that,item,that.state.baseColumns)} title="下移"></AuthButton>
                    <AuthButton  renderType="icon" type="trash"  onClick={that.delClick.bind(that,item,that.state.baseColumns)}> </AuthButton>
                </div>
            }
          return delForm;
        }}
    ];

    let fieldList = [
      {
        title: '列名',
        key: 'name',
        render(text,item){
          return (that.getInputField(this.key,item,this.title,that.state.parColumns));
        }
      },
        {
            title: '类型',
            key: 'dataType',
            render(text, record){
                return that.getSelect(this.key, text, JavaDircory.DATA_TYPE, record, this.title,that.state.parColumns);
            }
        },
        {
        title: '描述',
        key: 'comment',
        render(text,item){
          return (that.getInputField(this.key,item,this.title,that.state.parColumns));
        }
      },
      {
        title: '操作',
        key: 'operation',
        render(item,record){
            let delForm;
            if(that.props.isEdit && that.props.okButton!="1")
            {
                delForm=<div style={{width:100}}>
                    <AuthButton  renderType="icon" type="arrow-up" onClick={that.upRecord.bind(that,item,that.state.parColumns)} title="上移"></AuthButton>
                    <AuthButton  renderType="icon" type="arrow-down" onClick={that.downRecord.bind(that,item,that.state.parColumns)} title="下移"></AuthButton>
                    <AuthButton  renderType="icon" type="trash"  onClick={that.delClick.bind(that,item,that.state.parColumns)}> </AuthButton>
                </div>
            }
            else {
                    delForm=<div style={{width:100}}/>
            }
             return delForm
        }
      }];
      let isCanAddColumn=this.props.okButton!="1"?{isCanAdd:false}:{isCanAdd:true};
      let isCanAdd=(this.props.isEdit && this.props.okButton!="1")?{isCanAdd:false}:{isCanAdd:true};
    return (
        <div  className="field_grid_div">
          <span className="title_bar">字段信息</span>
          <AddRowTable data={tempRowKeyArray}    column={rowKeyColumn} {...isCanAddColumn}  showPage="false" notRequire={false}/>
            <div style={{heigth:15}}/>
          <span className="title_bar">分区信息</span>
          <AddRowTable data={tempFieldListArray} column={fieldList} showPage="false" {...isCanAdd} notRequire={true}/>
        </div>
    );
  }
});

export default Win;