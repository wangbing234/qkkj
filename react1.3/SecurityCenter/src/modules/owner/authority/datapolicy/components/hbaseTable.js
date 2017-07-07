/***************************************************
 * 时间: 2016/7/21 15:46
 * 作者: bing.wang
 * 说明: hbase
 *
 ***************************************************/
import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import DataTableCache from 'bfd-ui/lib/DataTableCache'
import HiveBaseWin from '../../../usermanage/role/component/tab/datatab/win/HbaseBaseWin'
import HiveTableEditor from './common/BaseTableEditor'
import {RestrictInput} from 'CommonComponent'
import Ajax from '../ajax/AjaxReq'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import AuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import CancalPage from 'CancalPage'
import AuthButton from 'CommonComponent/component/authbutton'
import CommonDetailWin from 'CommonDetailWin'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import SeeUser from 'SeeUser'
import SeeRole from 'SeeRole'
import CommonUtil from 'CommonComponent/utils/CommonUtil'

class HBase extends React.Component{
    constructor(prop){
        super(prop);
        this.selectList=[];
        this.state = {pageSize: 15,isShowForm:0,data:{totalList:[]}}

        this.breadArr = [{
            text: 'Hbase数据权限',
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
     * 编辑公用处理
     * @param item
     * @param e
     */
    ownerEdit(item,e) {
        if(this.props.viewType=="userMyView"  || this.props.viewType=="telantSp")
        {
            this.refs._modalHive.setState({data:$.extend(true,{},item),disabled:true});
            this.refs._modalHive.refs._modal.open();
        }
        else {
            this.setState({isShowForm: this.props.viewType == "view" ? 2 : 1, formData: $.extend(true,{},item)})
        }
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
     * 删除
     **/
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
     * 新增策略处理
     */
    addPolicy() {
        this.setState({isShowForm:1,formData:{}})
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
     * 查看租户
     */
    seeTenant() {
        this.refs.seeTenantModal.open();
    }

    /**
     * 表单取消事件
     */
    cancleHandler(){
        this.setState({isShowForm:0})
    }

    /**查询**/
    searchClickHandler(e){
        this.getDataByUrl(1);
    }

    onPageChange(page){
        this.getDataByUrl(page)
    }

    /**
     * 提交处理
     **/
    submitHandler(e){
        this.setState({isShowForm:0})
        this.getDataByUrl(1);
    }

    /**
     * 查询hbase列表
     **/
    getDataByUrl(currentPage) {
        var parms={resourceType:"hbase",currentPage:currentPage,pageSize:this.state.pageSize}

        let that=this;
        if(this.props.viewType=="userMyView")
        {
            Ajax.listPolicysUserByThree(parms,(data) => {
                that.fiterData(data.data);
            })
        }
        else
        {
            parms.tenantId=window._currentUser.tenantId;
            Ajax.listPolicysByThree(parms,(data) => {
                that.fiterData(data.data);
            })
        }

    }

    /**
     * 过滤资源列表，显示数据
     **/
    fiterData(item){
        item.totalList.map((item,index)=>{item=AuthorityStateTranfer.jsonTOState(item)});
        this.setState({data:item});
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


    /**
     * 动态获取列表
     **/
    getColumns(flag)
    {
        let that=this;
        let userFormObject={
            title: "用户",
            key: 'user',
            render(text, record) {
                let dString=CommonUtil.spiltArrayToString(record.users,"userName",",");
                return  <TextOverflow><div>{dString}</div></TextOverflow>;
            }
        };
        let roleFormObject={
            title: "角色",
            key: 'role',
            render(text, record) {
                let rString=CommonUtil.spiltArrayToString(record.roles,"roleName",",");
                return  <TextOverflow><div>{rString}</div></TextOverflow>;
            }
        };
        const ownerColumns = [
            {
                title: '策略名称',
                key: 'policyName',
                render(text,reccord) {
                    return <a href="javascript:void(0);" onClick={that.ownerEdit.bind(that,reccord)}>{text}</a>;
                }
            }, /*{
                title: 'Hbase源',
                key: 'resourceName'
            },*/ {
                title: '命名空间',
                key: 'database',
                render(item, text){
                    let _database=text.database?text.database.join(" , "):"";
                    return  <TextOverflow>
                        <div style={{maxWidth:'200px'}}>{_database}</div>
                    </TextOverflow>;
                }
            }, {
                title: '表',
                key: 'table' ,
                render(item, text){
                    let _table=text.table?text.table.join(" , "):"";
                    return  <TextOverflow>
                        <div style={{maxWidth:'200px'}}>{_table}</div>
                    </TextOverflow>;
                }
            }, {
                title: '列簇',
                key: 'column-family',
                render(item, text){
                    return  <TextOverflow>
                        <div style={{maxWidth:'200px'}}>{text['column-family'].join(" , ")}</div>
                    </TextOverflow>;
                }
            }];

        let otherView;
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
            ownerColumns[3]=userFormObject
            ownerColumns.push(roleFormObject);
            ownerColumns.push( {
                title: '更新时间',
                key: 'updateTime',
                render:(text)=>{
                    let date = text?new Date(text).format("yyyy-MM-dd hh:mm:ss"):'';
                    return <span>{date}</span>
                }
            });
            ownerColumns.push({
                title: '操作',
                key: 'operation',
                width:'90px',
                render(text, record) {
                    return (<div style={{lineHeight:"21x"}}>
                     <AuthButton renderType="a" type="edit" onClick={that.ownerEdit.bind(that,text)} title="编辑">编辑</AuthButton>
                    <AuthButton  data-code="1021002"  renderType="a"   onClick={that.del.bind(that,text)} type="trash"  title="删除">删除</AuthButton>
                     </div>);
                }
            })
        }

        if(flag)
        {
            ownerColumns.splice(ownerColumns.length-1,1);
        }

        return ownerColumns;
    }


    renderForm(){
        return (<div>
            <HiveTableEditor resourcesType="HBase" data={this.state.formData} baseInfo={HiveBaseWin} resources={["database","column","column-family","table"]} submitHandler={this.submitHandler.bind(this)} cancelClick={this.cancleHandler.bind(this)}/>
        </div>)
    }

    textChange(field,e){
        this.setState({[field]:e.target.value});
    }

    /**渲染**/
    renderDetailForm(){
        return (  <CancalPage cancelClick={this.cancleHandler.bind(this)}>
            <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.cancleHandler.bind(this)}>
            <HiveBaseWin data={this.state.formData} disabled="disabled"/>
            </EditPanel>
        </CancalPage>
          )
    }

    renderTable(){
        let that=this;
        let addPolicyView=null;
        if(["view","userMyView","telantSp"].indexOf(this.props.viewType)==-1)
        {
            addPolicyView=  <button type="button" className="btn btn-primary btn-w100" onClick={this.addPolicy.bind(this)}>新增策略</button>
        }
        else if("userMyView"==this.props.viewType){
            addPolicyView= <button type="button" className="btn btn-primary btn-w100" onClick={this.props.applyData.bind(this,"hbase")}>申请</button>
        }
        else if("telantSp"==this.props.viewType){
            addPolicyView= this.props.applyerNameForm;
        }

        //审批模块增加策略
        let dataTable;
        if(this.props.viewType=="telantSp") {
            dataTable= <DataTableCache data={this.state.data} onPageChange={this.onPageChange.bind(this)} column={this.getColumns(true)} onCheckboxSelect={this.handleCheckboxSelect.bind(this)} howRow={this.state.pageSize} showPage="true"/>
        }
        else{
            dataTable= <DataTable data={this.state.data} column={this.getColumns()} onPageChange={this.onPageChange.bind(this)}  howRow={this.state.pageSize} showPage="true"/>
        }

        let toolStyle={}
        if("view"==this.props.viewType)
        {
            toolStyle={display:"none"}
        }
        let cName = ["userMyView","view"].indexOf(this.props.viewType)>-1?'':'module-container';
        return (<div className={cName} style={{paddingBottom:'20px'}}>
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
            <CommonDetailWin title="Hbase数据详情"   ref="_modalHive" Child={HiveBaseWin}/>
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

export default HBase;

