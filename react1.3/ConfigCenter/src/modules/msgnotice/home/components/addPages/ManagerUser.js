/**
 * Created by zhongxia on 16/4/7.
 */
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import  RestrictConst from "CommonComponent/utils/RestrictConst"
import   RegularConst from "CommonComponent/utils/RegularConst"
import  ValidateInput from  "CommonComponent/component/validateinput"
import message from 'CommonComponent/component/bdosmessage'
//TODO:穿梭框有问题,需要等修改
import  Transfer  from 'bfd-ui/lib/Transfer'
import {BfdRequest,CommonUtil,Collapse,AddRowTable,RestrictInput,BaseValidate} from 'CommonComponent'
let that;
class ManagerUser extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
        this.state = {
            sourceData: [],
            targetData: [],
            tempUserList:[],
            oldTempUser:[],
            removeTempUsers:[],
            selectGroupUser:[],
            tableIsSuccess:false,
            validated:false,
            ...this.props.data
        };
    }

    handleChange(name, event) {
        let newState = {};
        if (event && event.target) {
            newState[name] = name === "checked" ? event.target.checked : event.target.value;
        } else {
            newState[name] = event;
        }
        this.setState(newState);
    }

    delClick(item){
        let rowIndex = that.state.tempUserList.indexOf(item);
        var arr = that.state.tempUserList;
        if(arr && arr.length > 0){
            if(item.id){
                that.state.removeTempUsers.push(item);
            }
            arr.splice(rowIndex,1);
        }
        that.setState({tempUserList:arr});
    }

    getSaveUser()
    {
        return that.getAddingId(that.state.targetData,that.state.selectGroupUser);
    }

    getRemovedUser()
    {
        return that.getAddingId(that.state.selectGroupUser,that.state.targetData);
    }

    cacheStep(stepData)
    {

    }


    vaildate()
    {
        this.state.validated=true;
        if(!that.state.tableIsSuccess)
            this.setState({});
        else
        {
            var labelString;
            var groupType=that.props.listPage.refs.stepsContainer.state.stepState.step0.groupType
            var isSuccessEP= CommonUtil.hasSameFieldValue(that.state.tempUserList,groupType=="邮件组"?"userEmail":"userPhone");
            if(isSuccessEP)
            {
                labelString=groupType=="邮件组"?"电子邮件":"手机";
                message.danger(`${labelString}不能重复！`);
                return false;
            }
            var isSameUser= CommonUtil.hasSameFieldValue(that.state.tempUserList,"userName");
            if(isSameUser)
            {
                labelString="用户";
                message.danger(`${labelString}不能重复！`);
                return false;
            }

        }

        return that.state.tableIsSuccess;
    }

    saveData()
    {
        var userIds=that.getRemovedUser();
        var userAddIds=that.getSaveUser();
        var removeTempUserIds= CommonUtil.spiltArrayToString(that.state.removeTempUsers,"id",",");//移出的临时用户
        var addTempUsersArray=[];//增加的临时信息
        var updateTempUsers=[];//修改过临时信息
        var isEmail=that.props.listPage.refs.stepsContainer.state.stepState.step0.groupType=="邮件组";
        for (var it of that.state.tempUserList) {
            if(!it.id)
            {
                addTempUsersArray.push(it);
            }
            else
            {
                for (var oit of that.state.oldTempUser) {
                    if(oit.id==it.id)
                    {
                        if((isEmail && oit.userEmail.toUpperCase()!=it.userEmail.toUpperCase()) ||
                            (!isEmail && oit.userPhone!=it.userPhone)  ||
                            oit.userName.toUpperCase()!=it.userName.toUpperCase())
                            updateTempUsers.push(it);
                    }
                }
            }

        }
        return {addUserIds:userAddIds,removeUserIds:userIds,removeTempUsers:removeTempUserIds,addTempUsers:addTempUsersArray,updateTempUsers:updateTempUsers}
    }

    initStep() {
        that.getAllUsers();
    }

    getAllUsers()
    {
        //编辑
        if(that.state.id)
        {
            let urlRight=Server.authority+`messageGroupUserRef/${that.state.id}?api-json=isMessaeRequest`;
            BfdRequest.ajaxGetData(urlRight,that.getAllPartSuccess);
            let tempUserUrl=Server.authority+`messageUserTemp/${that.state.id}?api-json=isMessaeRequest`;
            BfdRequest.ajaxGetData(tempUserUrl,that.getTempUserSuccess);
        }
        //新增
        else {
            that.getAllPartSuccess([]);
        }

    }

    getTempUserSuccess(data)
    {
        that.state.oldTempUser=that.deepCopy(data);
        that.setState({tempUserList:data});
    }



    getAllUsersSuccess(data)
    {
        data.map(
              (item,index) => {
                 item.label=item.name;
             })
         let resultData= CommonUtil.removeFormOtherArray(data,that.state.selectGroupUser,"id");
        that.setState({ sourceData: resultData});
    }

    getAllPartSuccess(data)
    {
            data.map(
                (item,index) => {
                    item.label=item.name;
                 })
        that.state.selectGroupUser=that.deepCopy(data);
        that.setState({ targetData: data});
        let urlAll=`${Server.authority}messageGroupUserRef/getAllUsers?userName=${window.userName||"jupiter"}&api-json=isMessaeRequest`;
        BfdRequest.ajaxGetData(urlAll,that.getAllUsersSuccess);
    }

    deepCopy(source) {
        return $.extend(true,[],source);
    }

    getAddingId(formArray,toArray){
        var resultArray=[];
        formArray.map(
            (formItem,index) => {
              if(!that.isHasItem(formItem,toArray))
                    resultArray.push(formItem);
         })
       return CommonUtil.spiltArrayToString(resultArray,"id",",")
    }

    isHasItem(item,tArray){
        let isItemLabel=false;
        for (var toItem of tArray) {
            if(toItem.id==item.id){
                isItemLabel=true;
                break;
            }
        }
        return isItemLabel;
    }

    tOnchange()
    {
        return true;
    }


    dataGridHandleChange(dataField,index,e){
        that.state.tempUserList[index][dataField] = e.target.value;
        this.setState({tempUserList: that.state.tempUserList, validateState: false});
    }


    getInput(dataField,item,label){
        let rowIndex = that.state.tempUserList.indexOf(item);
        let itemValue = rowIndex!=-1?that.state.tempUserList[rowIndex][dataField]:"";
        let maxLength = 128;
        var _regExp={};
        if(dataField == "userEmail"){
            _regExp=RegularConst.EMAIL_STRING;
            maxLength=64;
        }
        else if(dataField == "userPhone"){
            _regExp=RegularConst.PHONE_STRING;
            maxLength=11;
        }
        let str = BaseValidate.validateInput({isRequired:true,label,value:itemValue,maxLength,regExp:_regExp.name,regExpErrorStr:_regExp.tip});
        if(str)
        {
            that.state.tableIsSuccess=false;
        }
        let itemView ;
        if(dataField == "userEmail"){
            let strict = RestrictConst.EMAIL_STRING;
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
    }

    handleSearch(label, keyValue) {
             return label.toUpperCase().indexOf(keyValue.toUpperCase()) != -1;
    }

    render() {
        that=this;
        that.state.tableIsSuccess=true;
        let tempUserListArray = {totalList:that.state.tempUserList,currentPage:1,totalPageNum:1000};
        let tempUserListColumn = [
            {title:"联系人",key:"userName",render(text,item){
                return (that.getInput("userName",item,this.title));
            }}];
        //如果是邮件
        if(that.props.listPage.refs.stepsContainer.state.stepState.step0.groupType=="邮件组")
        {
            tempUserListColumn.push({title:"电子邮件",key:"userEmail",render(text,item){
                return (that.getInput("userEmail",item,this.title));
            }});
        }
        else{//如果是短信
            tempUserListColumn.push({title:"手机",key:"userPhone",render(text,item){
                return (that.getInput("userPhone",item,this.title));
            }});
        }
        //最后的操作
        tempUserListColumn.push({title:"操作",key:"operation",render(item,record){
            return (
                <div style={{width:50,paddingTop:5,float: "right"}}>
                    <a href="javascript:void(0)" style={{width:40}} onClick={that.delClick.bind(this,item)}>删除</a>
                </div>);
        }});

        return (
            <div  className="container" style={{minHeight:300}} >
                    <div className="col-md-12" style={{paddingLeft:75,minHeight:220}}>
                        <Transfer height={200} title={"已选的用户"} sdata={this.state.sourceData} onChange={that.tOnchange.bind(this)} onSearch={this.handleSearch}  tdata={this.state.targetData}/>
                    </div>
                    <div  className="col-md-12" style={{height:25}}/>
                    <div style={{marginLeft: -10,paddingBottom:10,borderBottom:"1px dotted #e9e9e9",paddingLeft:25}} >其它用户</div>
                    <div  className="col-md-11" style={{marginTop:20, paddingLeft:-20,paddingBottom:30}}>
                        <AddRowTable data={tempUserListArray} showPage="false" column={tempUserListColumn} notRequire/>
                    </div>
            </div>);
    }
}

export default ManagerUser