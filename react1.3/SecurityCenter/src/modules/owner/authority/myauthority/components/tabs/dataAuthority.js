/***************************************************
 * 时间: 2016/7/21 16:53
 * 作者: bing.wang
 * 说明: 数据权限页面
 *
 ***************************************************/
import React from 'react'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import DataTable from 'bfd-ui/lib/DataTable'
import DataAuthority_Form from './dataAuthorityForm';
import Ajax from '../../ajax/AjaxReq'
import {FormFooter} from 'CommonComponent'
import CommonModalWin from 'CommonModalWin'
import CommonDetailWin from 'CommonDetailWin'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import AuthorityStateTranfer from '../../../../common/AuthorityStateTranfer'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory'
import AdminBaseHive from 'AdminBaseHive'
import AdminBaseHbase from 'AdminBaseHbase'
import AdminBaseHdfs from 'AdminBaseHdfs'
let that;

class DataAuthority extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
        this.state = {dbType:"Hive",hiveData:{"totalList": []},hbaseData:{"totalList": []},hdfsData:{"totalList": []}}
    }

    componentDidMount() {
        that.getDataByUrl("hive");
        that.getDataByUrl("hbase");
        that.getDataByUrl("hdfs");
    }

    /**
     * 获取不同三种类型列表
     * @param type
     */
    getDataByUrl(type) {
        var parms={resourceType:type,currentPage:1,pageSize:10000,tenantId:window._currentUser.tenantId}
        Ajax.listPolicysByThree(parms,(data) => {
            that.fiterData(data.data,type);
        })
    }

    /**
     * 过滤数据
     * @param item
     * @param type
     */
    fiterData(item,type){

        item.totalList.map((item,index)=>{
            item=AuthorityStateTranfer.jsonTOState(item);
                if(type!="hdfs")
                {
                    item.database=item.resources.database.values;
                }
                else {
                    item.path=item.resources.path.values;
                }
            }
        );
        let key=type+"Data";
        that.state[key]=item;
        that.setState({});
    }

    /**
     * 处理申请
     * @param dbType
     * @param e
     */
    handlerApply(dbType,e) {
        that.refs.modal.setState({dbType:dbType,editorType:"1"});
        that.refs.modal.refs._modal.open();
    }

    /**
     * 编辑
     * @param dbType
     * @param record
     * @param e
     */
    ownerEdit(dbType,record,e){
        let formRef;
        let eRecord=$.extend(true,{},record);
        let parmsObj={data:eRecord,viewType:"see_ui"};
        switch (dbType){
            case "Hive":{
                formRef=this.refs.adminHive;
                eRecord.tenantName=eRecord.tenants?eRecord.tenants[0].tenantName:"";
                break;
            }
            case "Hbase":{
                formRef=this.refs.adminHbase;
                eRecord.tenantName=eRecord.tenants?eRecord.tenants[0].tenantName:"";
                break;
            }
            case "Hdfs":{
                eRecord.tenantId=[];
                for (let obj of eRecord.tenants) {
                    eRecord.tenantId.push(obj.tenantName);
                }
                formRef=this.refs.adminHdfs;
                parmsObj.resources=["path"];
                break;
            }
        }
        formRef.setState(parmsObj);
        formRef.refs._modal.open();
    }

    /**
     *申请点击提交
     */
    handleOk() {
        let _from=that.refs.modal.refs.child;
        if(_from.doVaildate())
        {
            let _data=_from.getData();
            Ajax.applyAuth(_data, (data) => {
                that.refs.modal.refs._modal.close();
                EventEmitter.dispatch("refresh_My_Apply");
            })
        }
    }


    /**
     * 获取列
     * @param dbType
     * @param e
     * @returns {*}
     */
    getColumns(dbType,e){
        let that=this;
        let hdfsColumns = [
            {
                title: "策略名称",
                key: 'policyName',
                width:'320px',
                render(text,reccord) {
                    return <a href="javascript:void(0);" onClick={that.ownerEdit.bind(that,dbType,reccord)}>{text}</a>;
                }
            }
        ];
        if(dbType=="Hdfs")
        {
            hdfsColumns.push({
                title: "文件目录",
                key: 'path',
                width:'500px',
                render(item, text){
                    let _database=text.path?text.path.join(" , "):"";
                    return <TextOverflow><div style={{maxWidth:"500px"}}>{_database}</div></TextOverflow>
                }
            });
        }
        else if(dbType=="Hbase" || dbType=="Hive")
        {
            hdfsColumns.push({
                title: "数据库名",
                key: 'database',
                width:'500px',
                render(item, text){
                    let _database=text.database?text.database.join(" , "):"";
                    return <TextOverflow><div style={{maxWidth:"500px"}}>{_database}</div></TextOverflow>
                }
            });
        }

        return hdfsColumns;
    }

    render() {
        return (<div>
                    <FormCategory>
                        <FormCategoryItem name="HIVE">
                                 <span style={{marginTop:10}}>
                                    <button style={{marginLeft:10}} className="btn btn-primary" onClick={this.handlerApply.bind(this,"Hive")}>申请
                                    </button>
                                </span>
                                <DataTable column={this.getColumns("Hive")} howRow={10} data={this.state.hiveData}/>
                        </FormCategoryItem>
                        <FormCategoryItem name="HBASE">
                              <span style={{marginTop:10}}>
                                <button style={{marginLeft:10}} className="btn btn-primary" onClick={this.handlerApply.bind(this,"Hbase")}>申请
                                </button>
                            </span>
                            <DataTable column={this.getColumns("Hbase")} howRow={10} data={this.state.hbaseData}/>
                        </FormCategoryItem>
                        <FormCategoryItem name="HDFS">
                             <span style={{marginTop:10}}>
                                <button style={{marginLeft:10}} className="btn btn-primary" onClick={this.handlerApply.bind(this,"Hdfs")}>申请
                                </button>
                            </span>
                            <DataTable column={this.getColumns("Hdfs")} howRow={10} data={this.state.hdfsData}/>
                        </FormCategoryItem>
                    </FormCategory>
            <CommonModalWin title="权限申请" ref="modal"  Child={DataAuthority_Form} className="win_margin_left0" submit={this.handleOk.bind(this)}/>
            <CommonDetailWin title="查看Hive策略"  ref="adminHive" Child={AdminBaseHive}/>
            <CommonDetailWin title="查看Hbase策略" ref="adminHbase"  Child={AdminBaseHbase}/>
            <CommonDetailWin title="查看Hdfs策略"  ref="adminHdfs"  Child={AdminBaseHdfs}/>
        </div>)
    }
}

export default DataAuthority;
