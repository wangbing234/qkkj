import React from 'react'
import AddRowTable from 'CommonComponent/component/addrowtable'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import RestrictInput from 'CommonComponent/component/restrictinput'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import { Select2 ,Option2} from 'bfd-ui/lib/Select2'
import   RegularConst from "CommonComponent/utils/RegularConst"
import  RestrictConst from "CommonComponent/utils/RestrictConst"
import  ValidateInput from  "CommonComponent/component/validateinput"
import AuthButton from 'CommonComponent/component/authbutton'
let that;
const Win = React.createClass({
  //初始化表单数据。
  getInitialState() {
    return {
      rowKey : {name: "row-key",comment: "", id: 1},
      cluColumns : [],
      ...this.props.data,
      validated:false
    }
  },
  /**
   * 基本的约束,外部写的组件,必须使用 getData 方法,否则框架获取不到数据
   * @returns {*}
   */
  getData() {
    return this.state;
  },

  vaildate()
  {

    this.state.validated=true;
    if(!that.state.tableIsSuccess)
      this.setState({});
    return that.state.tableIsSuccess;
  },

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState({...newState, validateState: false});
  },

  dataGridHandleChange(dataField,index,e){
    that.state.rowKey[dataField] = e.target.value;
    this.setState({rowKey: that.state.rowKey, validateState: false});
  },

  dataGridFieldHandleChange(dataField,index,e){
    that.state.cluColumns[index][dataField] = e.target.value;
    this.setState({cluColumns: that.state.cluColumns, validateState: false});
  },

  getInput(dataField,item,label){

    let rowIndex=0;
    let itemValue =that.state.rowKey[dataField]||"";
    let maxLength = 128;
    var _regExp={};
    let isRequired=false;
    if(dataField == "name"){
      _regExp.name=RestrictConst.NUM_START_STRING_UNDERLINE_32;
      isRequired=true;
      maxLength=32;
    }
    else if(dataField == "userPhone"){
      //_regExp=RegularConst.PHONE_STRING;
      maxLength=11;
    }
    let str = BaseValidate.validateInput({isRequired:isRequired,label,value:itemValue,maxLength,regExp:_regExp.name,regExpErrorStr:_regExp.tip});
    if(str)
    {
      that.state.tableIsSuccess=false;
    }
    let itemView ;
    if(dataField == "name"){
      let strict = RestrictConst.NUM_STRING_UNDERLINE_STAR;
      itemView = <ValidateInput className="form-control" type="text" restrict={strict}  value={itemValue}  validated={this.state.validated}
                                onChange={that.dataGridHandleChange.bind(that,dataField,rowIndex)} errorTip={str}/>;
    }
    else if(dataField == "userPhone"){
      let strict = RestrictConst.NUM;
      itemView = <ValidateInput className="form-control" type="text" restrict={strict} value={itemValue} validated={this.state.validated}
                                onChange={that.dataGridHandleChange.bind(that,dataField,rowIndex)} errorTip={str}/>;
    }
    else{
      itemView = <ValidateInput className="form-control" type="text"  value={itemValue} validated={this.state.validated}
                                onChange={that.dataGridHandleChange.bind(that,dataField,rowIndex)} errorTip={str}/>;
    }
    return itemView;
  },

  getInputField(dataField,item,label){
    let rowIndex = that.state.cluColumns.indexOf(item);
    let itemValue = rowIndex!=-1?that.state.cluColumns[rowIndex][dataField]:"";
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
    if(dataField == "name"){
      let strict = RestrictConst.NUM_STRING_UNDERLINE_STAR;
      itemView = <ValidateInput className="form-control" type="text" restrict={strict}  value={itemValue}  validated={this.state.validated}
                                onChange={that.dataGridFieldHandleChange.bind(that,dataField,rowIndex)} errorTip={str}/>;
    }
    else if(dataField == "userPhone"){
      let strict = RestrictConst.NUM;
      itemView = <ValidateInput className="form-control" type="text" restrict={strict} value={itemValue} validated={this.state.validated}
                                onChange={that.dataGridFieldHandleChange.bind(that,dataField,rowIndex)} errorTip={str}/>;
    }
    else{
      itemView = <ValidateInput className="form-control" type="text"  value={itemValue} validated={this.state.validated}
                                onChange={that.dataGridFieldHandleChange.bind(that,dataField,rowIndex)} errorTip={str}/>;
    }
    return itemView;
  },
  delClick(item){
    let rowIndex = that.state.cluColumns.indexOf(item);
    var arr = that.state.cluColumns;
    if(arr && arr.length > 0){
      arr.splice(rowIndex,1);
    }
    that.setState({cluColumns:arr});
  },

  upRecord(item){
   var arr= CommonUtil.upRecord(that.state.cluColumns,item);
    that.setState({cluColumns:arr});
  },

  downRecord(item){
    var arr=  CommonUtil.downRecord(that.state.cluColumns,item);
    that.setState({cluColumns:arr});
  },



  render() {
    that = this;
    that.state.tableIsSuccess=true;
    let tempRowKeyArray = {totalList:[that.state.rowKey],currentPage:1,totalPageNum:1000};
    let cluColumnsArray = {totalList:that.state.cluColumns,currentPage:1,totalPageNum:1000};
    //rowKey
    let rowKeyColumn = [
      {
        title: '列名',
        key: 'name',
        render(text,item){
          return (that.getInput(this.key,item,this.title));
        }
      },
      {
        title: '描述',
        key: 'comment',
        render(text,item){
          return (that.getInput(this.key,item,this.title));
        }
      }];

    //列簇
    let fieldList = [
      {
        title: '列簇',
        key: 'name',
        render(text,item){
          return (that.getInputField(this.key,item,this.title));
        }
      },
      //{
      //  title: '描述',
      //  key: 'comment',
      //  render(text,item){
      //    return (that.getInputField(this.key,item,this.title));
      //  }
      //},
      {
        title: '操作',
        key: 'operation',
        render(item,record){
          return (
                  <div style={{width:100}}>
                    <AuthButton  renderType="icon" type="arrow-up" onClick={that.upRecord.bind(this,item)} title="上移"></AuthButton>
                    <AuthButton  renderType="icon" type="arrow-down" onClick={that.downRecord.bind(this,item)} title="下移"></AuthButton>
                    <AuthButton  renderType="icon" type="trash"  onClick={that.delClick.bind(this,item)}> </AuthButton>
                  </div>
          );
        }
      }];

    //<span className="title_bar">row-key</span>
    //<AddRowTable data={tempRowKeyArray}    column={rowKeyColumn}  showPage="false"  isCanAdd="true" notRequire/>

    return (
       <div style={{maxHeight:400,overflowY: "auto", overflowX: "hidden"}}>
         <span className="title_bar">列簇信息</span>
         <AddRowTable data={cluColumnsArray} column={fieldList} showPage="false" notRequire/>
       </div>
    );
  }
});

export default Win;