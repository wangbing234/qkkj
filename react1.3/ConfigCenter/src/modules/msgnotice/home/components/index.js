import React from 'react'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import message from 'CommonComponent/component/bdosmessage'
import confirm from 'bfd-ui/lib/confirm'
import {BfdRequest,StepsContainer} from 'CommonComponent'
import BreadCrumb from 'CommonComponent/component/breadcrumb'
import RestrictInput from 'CommonComponent/component/restrictinput'
import StringDiv from 'CommonComponent/component/stringdiv'
import MsgNotiveForm from './addPages/MsgNotiveForm'
import ManagerUser from './addPages/ManagerUser'
import MsNoticeDetail from './addPages/MsNoticeDetail'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import IconButton from 'CommonComponent/component/iconbutton'
import AuthButton from 'CommonComponent/component/authbutton'

const LISTVIEW = "listView";
const INFOVIEW = "infoView";
const DETAILVIEW = "detailView";
let that;


const column = [
    {
        title: '消息组名称',
        key: 'groupName'
    }, {
        title: '类型',
        key: 'groupType'
    }, {
        title: '创建时间',
        key: 'createTime',  render(item, text){
            var dataString=new Date(parseInt(item)).format("yyyy-MM-dd hh:mm:ss");
            return (
                <div>
                    {dataString}
                </div>
            )
        }
    }, {
        title: '更新时间',
        key: 'updateTime',  render(item, text){
            var dataString=new Date(parseInt(item)).format("yyyy-MM-dd hh:mm:ss");
            return (
                <div>
                    {dataString}
                </div>
            )
        }
    },
    {
        title: '创建人',
        key: 'addedByUserId'
    },
    {
        title: '备注',
        key: 'remark',
        render(item, text){
            return ( <StringDiv value= {item}/> )
        }
    }, {
        title: '操作',
        key: 'operation',
        render(item, text){
            return (
                <div>
                    <a href="javascript:void(0)" onClick={that.detailHandler.bind(this,item)}>详情</a>
                    <AuthButton  renderType="a"   data-code="1050205" onClick={that.editHandler.bind(this,item)}>编辑</AuthButton>
                    <AuthButton  renderType="a"   data-code="1050204" onClick={that.delHandler.bind(this,item)}>删除</AuthButton>
                </div>
            )
        }
    }]

class MsgNotice extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
        this.state = {
            pageSize: 15,
            viewType:LISTVIEW,
            resourceType: 'all',
            groupName:"",
            titleStr:"消息提醒",
            groupType:"",
            resourceName: ''
        };
    }

    componentDidMount() {
        that.getDataByUrl(1);
    }

    //获取
    getDataByUrl(page) {
        let url=`${Server.authority}messageGroup/getAll/${page}/${this.state.pageSize}?groupType=${this.state.groupType}&groupName=${this.state.groupName}&userName=${window.userName||"jupiter"}`;
        url=encodeURI(url);
        BfdRequest.ajaxGetData(url,(data) => {
            that.setState({data: data,page});
        });
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

    handleSelect(start, end) {
        this.setState({start})
    }

    searchHandler() {
        that.getDataByUrl(1);
    }


    editHandler(item) {
        console.log("editHandler", item)
        that.setState({formData: item,viewType:INFOVIEW,needSubmitBtn:true})
    }

    detailHandler(item) {
        console.log("detailHandler", item)
        that.setState({formData: item,viewType:DETAILVIEW})
    }

    delHandler(item) {
        confirm('是否删除该条记录?', () => {
            let url=`${Server.authority}messageGroup/delete/${item.id}?userName=${window.userName||"jupiter"}`;
            BfdRequest.ajaxGet(url,(data) => {
                that.getDataByUrl(1);
                message.success(data.msg);
            });
        })
    }


    addHandler() {
        that.setState({formData: {},viewType:INFOVIEW,needSubmitBtn:false})
    }

    onPageChange(nextPage) {
        that.getDataByUrl(nextPage);
    }



    handleCancel(){
        that.state.msgNotiveForm={};
        that.setState({viewType:LISTVIEW,msgNotiveForm:{}});
    }

    submitClick(data,step){
        that.saveMsgNotiveForm(data);
    }

    doSubmitClick(data){
        EventEmitter.dispatch("UPDATE_GROUP_USER");
        that.handleCancel();
        that.getDataByUrl(1);
    }

    saveMsgNotiveForm(data) {
        var allData=$.extend(true,{group:data.step0},data.step1);
        let urlAll=`${Server.authority}messageGroup/saveOrUpdateGroupAndUser?userName=${window.userName||"jupiter"}`;
        BfdRequest.ajaxPost(urlAll,{"data":JSON.stringify(allData)},that.doSubmitClick);
    }


    renderList(){
        return (
            <div>
                <div className="module-search">
                    <IconButton
                        data-code="1050202"
                        renderType="icon"
                        type="plus-square"
                        onClick={this.addHandler.bind(this)}>新增
                    </IconButton>
                    <button  className="btn btn-sm btn-primary" style={{marginLeft:"10px",float:"right"}} onClick={this.searchHandler.bind(this)}> 查询
                    </button>

                    <Select value={this.state.groupType}  style={{float:"right"}} onChange={this.handleChange.bind(this,'groupType')}>
                        <Option value="">全部消息组</Option>
                        <Option value="0">邮件组</Option>
                        <Option value="1">短信组</Option>
                    </Select>

                    <RestrictInput type="text"  style={{float:"right"}} className="form-control common-input"  placeholder="请输入消息组名称" value={this.state.groupName}
                                   onChange={this.handleChange.bind(this,'groupName')}  restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE} />

                </div>
                <div className="module-table operatioinTable">
                    <DataTable data={this.state.data}
                               onPageChange={this.onPageChange}
                               showPage="true"
                               column={column}
                               howRow={this.state.pageSize}></DataTable>
                </div>
            </div>
        );
    }


    //步骤条渲染
    renderWin() {
        var stepArray=[
            {title:"新增消息组",ui:(<MsgNotiveForm  ref="msgNotiveForm"  data={this.state.formData} oldGroupName={this.state.formData.groupName} listPage={this}/>)},
            {title:"管理用户",  ui:(<ManagerUser     ref="managerUser"   data={this.state.formData}  listPage={this}/>)}]
        return (
                    <div  className="resourcemanage-edit module-border " style={{paddingLeft:0,padding:"15px 0px"}}>
                         <StepsContainer ref="stepsContainer" parent={this}  stepArray={stepArray} needSubmitBtn={that.state.needSubmitBtn} currentStep={0} submitClick={this.submitClick} cancelClick={this.handleCancel}/>
                    </div>
        );
    }

    //步骤条渲染
    renderDetail() {
        return (
            <div className="resourcemanage-edit module-border " style={{paddingLeft:0,padding:"15px 0px"}}>
                <MsNoticeDetail formData={this.state.formData} listPage={this}/>
                <button type="button" className="btn btn-sm btn-default" style={{marginLeft:140}}
                        onClick={this.handleCancel.bind(this)}>取消
                </button>
            </div>
        );
    }

    render() {
        that=this;
        let breadCrumbArr = [{
            text: this.state.titleStr,
            url:''
        }];
        that = this;
        let view;
        switch (this.state.viewType){
            case LISTVIEW:
                view = this.renderList();
                break;
            case  INFOVIEW:
                view =this.renderWin();
                break;
            case  DETAILVIEW:
                view =this.renderDetail();
                break

        }

        return (<div className="module-container"> {view} </div>);
    }
}
export default MsgNotice