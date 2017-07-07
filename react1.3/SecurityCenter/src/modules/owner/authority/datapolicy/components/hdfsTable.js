/***************************************************
 * 时间: 2016/7/21 15:46
 * 作者: bing.wang
 * 说明: hdfs
 *
 ***************************************************/
import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import DataTableCache from 'bfd-ui/lib/DataTableCache'
import confirm from 'bfd-ui/lib/confirm'
import {RestrictInput} from 'CommonComponent'
import BaseTableEditor from './common/BaseTableEditor'
import HdfsBaseWin from '../../../usermanage/role/component/tab/datatab/win/HdfsBaseWin'
import Ajax from '../ajax/AjaxReq'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import AuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import CancalPage from 'CancalPage'
import CommonDetailWin from 'CommonDetailWin'
import AuthButton from 'CommonComponent/component/authbutton'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import SeeUser from 'SeeUser'
import SeeRole from 'SeeRole'
import CommonUtil from 'CommonComponent/utils/CommonUtil'

class Hdfs extends React.Component{

    constructor(prop){
        super(prop);
        this.selectList=[];
        this.state = {pageSize: 15,isShowForm:0,title:'HDFS',data:{totalList:[]}};
        this.breadArr = [{
            text: 'Hdfs数据权限',
            url: ''//如果不需要跳转url可以为空或不写url
        }, {
            text: '策略详情',
            url: ''
        }];
    }

    componentDidMount() {
        this.getDataByUrl(1);
    }

    /**
     * 获取hdfs列表
     * @param currentPage
     */
    getDataByUrl(currentPage) {

    let that=this;
        var parms = {
            resourceType: "hdfs",
            currentPage: currentPage,
            pageSize: this.state.pageSize
        }
        if(this.props.viewType=="userMyView")
        {
            Ajax.listPolicysUserByThree(parms,(data) => {
                that.fiterData(data.data);
            })
        }
        else {
            parms.tenantId=window._currentUser.tenantId;
            Ajax.listPolicysByThree(parms, (data) => {
                that.fiterData(data.data);
            })
        }
    }

    /**
     * 过滤显示
     * @param item
     */
    fiterData(item){
        item.totalList.map((item,index)=>{item=AuthorityStateTranfer.jsonTOState(item)});
        this.setState({data:item});
    }

    /**
     * 编辑
     * @param item
     */
    ownerEdit(item){
        if(this.props.viewType=="userMyView"  || this.props.viewType=="telantSp")
        {
            this.refs._modalHive.setState({data:$.extend(true,{},item),disabled:true});
            this.refs._modalHive.refs._modal.open();
        }
        else
        {
            this.setState({isShowForm:this.props.viewType=="view"?2:1,formData: $.extend(true,{},item)});
        }

    }

    /**
     * 删除
     **/
    del() {
        confirm('此策略已授权用户/角色，如果删除权限将不可用，是否确定删除？', () => {
            console.log("删除操作");
        })
    }


    /**
     * 查看租户
     */
    seeTenant() {
        //弹出查看用户界面
        this.refs.seeTenantModal.open();
    }

    /**
     * 查看用户
     */
    seeUser(){
        //弹出查看用户界面
        this.refs.usermodal.open();
    }

    /**
     * 查看角色
     */
    seeRole(){
        //弹出查看角色界面
        this.refs.rolemodal.open();
    }

    /**
     * 查看用户
     * @param type
     * @param data
     */
    viewHander(type,data){
        if(type=="user")
        {
            this.refs.usermodal.open();
            this.refs.usermodal.setObjectArray(data.users);
        }

        else{
            this.refs.rolemodal.open();
            this.refs.rolemodal.setObjectArray(data.roles);
        }
    }

    /**
     * 新增策略
     */
    addPolicy() {
        this.setState({isShowForm:1,formData:{}})
    }

    /**删除**/
    del(item) {
        let that=this;
        confirm('此策略已授权用户/角色，如果删除权限将不可用，是否确定删除？', () => {
            var parms={id:item.id};
            Ajax.deletePolicy(parms,(data) => {
                that.getDataByUrl(1);
            })
        })
    }


    /**
     * 提交
     * @param e
     */
    submitHandler(e){
        this.setState({isShowForm:0})
        this.getDataByUrl(1);
    }

    /**
     * 表单取消事件
     */
    cancleHandler(){
        this.setState({isShowForm:0})
    }

    /**
     * 点击查询
     * @param e
     */
    searchClickHandler(e){
        this.getDataByUrl(1);
    }

    /**
     * 功用修改
     * @param field
     * @param e
     */
    textChange(field,e){
        this.setState({[field]:e.target.value});
    }

    renderForm() {
        return (<div>
            <BaseTableEditor   resourcesType="HDFS" data={this.state.formData}  resources={["path"]} baseInfo={HdfsBaseWin} submitHandler={this.submitHandler.bind(this)} cancelClick={this.cancleHandler.bind(this)}/>
                 </div>)
    }

    /**渲染**/
    renderDetailForm(){
        return ( <CancalPage cancelClick={this.cancleHandler.bind(this)}>
            <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.cancleHandler.bind(this)}>
            <HdfsBaseWin data={this.state.formData} disabled="disabled"/>
            </EditPanel>
        </CancalPage>)
    }


    /**
     * 动态获取列表
     * @returns {*}
     */
    getColumns(flag)
    {
        let that=this;
        let userFormObject={
            title: "用户",
            key: 'user',
            maxWidth:"120px",
            render(text, record) {
                let dString=CommonUtil.spiltArrayToString(record.users,"userName",",");
                return  <TextOverflow><div style={{maxWidth:"98%"}}>{dString}</div></TextOverflow>;
            }
        };
        let roleFormObject={
            title: "角色",
            key: 'role',
            maxWidth:"120px",
            render(text, record) {
                let rString=CommonUtil.spiltArrayToString(record.roles,"roleName",",");
                return  <TextOverflow><div style={{maxWidth:"98%"}}>{rString}</div></TextOverflow>;
            }
        };
        const ownerColumns = [
            {
                title: '策略名称',
                width:'280px',
                key: 'policyName',
                maxWidth:'280px',
                render(text, record) {
                    return <TextOverflow>
                        <a style={{display:"block",maxWidth:'98%'}}
                          href="javascript:void(0);" onClick={that.ownerEdit.bind(that,record)}>{text}</a>
                      </TextOverflow>
                }
            }, {
                title: '文件目录',
                key: 'path' ,
                width:'280px',
                maxWidth:'280px',
                render(item, text){
                    let dString=text.path?text.path.join(" , "):"";
                    return  <TextOverflow>
                        <div style={{maxWidth:'98%'}}>{dString}</div>
                    </TextOverflow>;
                }
            }
        ];

        let otherView;

        if(!this.props.viewType)
        {
            ownerColumns.push(userFormObject);
        }

         if(this.props.viewType=="view"){
            ownerColumns.push(userFormObject);
             ownerColumns.push(roleFormObject);

        }
        else if(this.props.viewType=="userMyView")
        {
            //啥也没有
        }
        else if(this.props.viewType=="telantSp")
        {
            ownerColumns.push({title: '操作',width:'50px', key: 'operation',
                render(text, record) {
                    return <AuthButton renderType="a" type="edit" onClick={that.ownerEdit.bind(that,text)} title="编辑">编辑</AuthButton>
                }
            })
        }
        else {
             ownerColumns.push(roleFormObject);
            ownerColumns.push( {
                title: '更新时间',
                key: 'updateTime',
                width:'142px',
                maxWidth:'142px',
                render:(text)=>{
                    let date = text?new Date(text).format("yyyy-MM-dd hh:mm:ss"):'';
                    return <TextOverflow><p style={{maxWidth:"98%"}}>{date}</p></TextOverflow>
                }
            });
            ownerColumns.push({
                title: '操作',
                key: 'operation',
                width:'90px',
                render(text, record)
                {
                    return ( <div style={{lineHeight:"21x"}}>
                             <AuthButton renderType="a" type="edit" onClick={that.ownerEdit.bind(that,text)} title="编辑">编辑</AuthButton>
                    <AuthButton  data-code="1021002"  renderType="a"   onClick={that.del.bind(that,text)} type="trash"  title="删除">删除</AuthButton>
                </div>
                    );
                }
            })
        }
        if(flag)
        {
            ownerColumns.splice(ownerColumns.length-1,1);
        }
        return ownerColumns;
    }

    onPageChange(page){
        this.getDataByUrl(page)
    }

    /**
     * 表格数据修改
     * @param value
     * @param item
     * @param key
     */
    /*复选框change 处理*/
    handleCheckboxSelect(selectItems) {
        this.selectList = selectItems;
        this.setState();
    }

    getSelectList(){
        return this.selectList;
    }


    renderTable() {
        let that=this;
        let addPolicyView=null;

        if(["view","userMyView","telantSp"].indexOf(this.props.viewType)==-1)
        {
            addPolicyView=  <button type="button" className="btn btn-primary btn-w100" onClick={this.addPolicy.bind(this)}>新增策略</button>
        }
        else if("userMyView"==this.props.viewType){
            addPolicyView= <button type="button" className="btn btn-primary btn-w100" onClick={this.props.applyData.bind(this,"hdfs")}>申请</button>
        }
        else if("telantSp"==this.props.viewType){
            addPolicyView= this.props.applyerNameForm;
        }

        let dataTable;
        if("telantSp"==this.props.viewType)
        {
            dataTable=<DataTableCache data={this.state.data}  onPageChange={this.onPageChange.bind(this)}  onCheckboxSelect={this.handleCheckboxSelect.bind(this)}  column= {this.getColumns(true)} howRow={this.state.pageSize} showPage="true"/>;
        }
        else{
            dataTable=<DataTable data={this.state.data}  onPageChange={this.onPageChange.bind(this)}   column= {this.getColumns()} howRow={this.state.pageSize} showPage="true"/>;
        }

        let toolStyle={}
        if("view"==this.props.viewType)
        {
            toolStyle={display:"none"}
        }
        let cName = ["userMyView","view"].indexOf(this.props.viewType)>-1?'':'module-container';
        return (

            <div className={cName} style={{paddingBottom:'20px'}}>
               <div className="module-search" style={{height:30,...toolStyle}}>
                   <div className="module-search-left">
                       {addPolicyView}
                   </div>
                   {/*<div className="module-search-right"  style={{display:"none"}}>
                       <button className="btn btn-sm btn-primary common-right" onClick={that.searchClickHandler.bind(that)}>查询</button>
                       <RestrictInput type="text" value={this.state.userNameTxt} className="form-control common-input common-right"
                                      onChange={this.textChange.bind(this,'userNameTxt')}  placeholder="请输入用户关键字"/>
                   </div>*/}
               </div>
                <div className="module-table">
                    {dataTable}
                </div>
                <CommonDetailWin title="Hbase数据详情"   ref="_modalHive" Child={HdfsBaseWin}/>
            </div>)
    }

    render(){
        let comps ;
        if (this.state.isShowForm==1) {
            comps = this.renderForm();
        } else  if (this.state.isShowForm==0){
            comps = this.renderTable();
        }
        else  if (this.state.isShowForm==2){
            comps = this.renderDetailForm();
        }
        return (<div>

            {comps}

            <SeeUser ref="usermodal"/>
            <SeeRole ref="rolemodal"/>
        </div>)
    }
}

export default Hdfs;
