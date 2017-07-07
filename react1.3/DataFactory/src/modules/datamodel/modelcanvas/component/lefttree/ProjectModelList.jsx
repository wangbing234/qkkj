/***************************************************
 * 时间: 2016/7/20 14:31
 * 作者: bing.wang
 * 说明: 项目列表
 *
 ***************************************************/
import React from 'react'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import Ajax from '../../ajax/AjaxReq'
import JavaDircory from '../../common/JavaDircory'
import message from 'CommonComponent/component/bdosmessage'
let that;
let ALL_TYPE_HOSTS={code:"",cnName:"全部项目"};
let ALL_TYPE_TALENT={id: '', tenantName: '全部租户'};
let SPILT_STRING="------spiltabcdefgString-----";
class ProjectModelList extends React.Component {
    constructor(prop) {
        super(prop);
        this.selectList=[];
        this.state = {
            pageSize: 10,
            tenant: '',
            tenantValue:"",
            tableName:"",
            currentProject:"",
            currentPage:0,
        };
        this.tenantArr=[ALL_TYPE_TALENT],
            this.projectList=[ALL_TYPE_HOSTS],
            this.projectListArray={totalList:[]},
        this.column = [
          {
            title: '表名',
            key: 'tableName'
        }, {
            title: '表中文名',
            key: 'tableNameCn'
        }, {
            title: '类型',
            key: 'tableType'
        }, {
            title: '创建人',
            key: 'createUser'
        }, {
            title: '创建时间',
            key: 'createTime'
        }]
    }

    componentDidMount() {
        let that=this;
        //this.tenantListAjax = Ajax.getTenantList((result) => {
        //    if(result && result.length > 0){
        //        result.unshift(ALL_TYPE_TALENT);
        //        if(that){
        //            that.tenantArr=result
        //            that.setState()
        //        }
        //    }
        //})
        this.queryProjectList();
        this.getDataByUrl(1);
    }


    getDataByUrl(cpage){
        let that=this;
        this.state.currentPage=cpage;
        Ajax.selectList(this.state,(data)=>{
            that.projectListArray=data;
            that.setState()
        })
    }

    /**
     *  点击选择
     */
    handleSelect(){
        let seleceds=this.getSelectIds();
        if(seleceds)
        {
            Ajax.saveOtherProjectTable({projectCode:window.projectCode,tableCodes:seleceds},(data)=>{
                EventEmitter.dispatch(JavaDircory.LIST_IMPORTTREE_QUERY);
                that.cancelClick();
            })
        }
    }

    /*复选框change 处理*/
    handleCheckboxSelect(selectItems) {
        this.selectList = selectItems;
        this.setState();
    }

    getSelectIds()
    {
        let deleteArray=this.selectList;
        let deleteiDs="";
        if(deleteArray.length>0)
        {
            deleteiDs= CommonUtil.spiltArrayToString(deleteArray,"tableCode",",");
        }
        else
            message.danger("请选择列表！");
        return deleteiDs;
    }

    /**
     *  处理关闭
     */
    cancelClick(){
        this.props.cancelClick();
    }

    /**
     *  选择变化公用方法
     */
    handleChange(name, event) {
        if (event && event.target) {
            this.state[name] = name === "checked" ? event.target.checked : event.target.value;
        } else {
            this.state[name] = event; '菜单'
        }
        this.setState();
    }

    telantChange(name, event) {
        this.handleChange(name, event);
        let rSpiltString=event.split(SPILT_STRING);
        this.state.tenant=rSpiltString[0];
        this.state.tenantName=rSpiltString[1];
        this.queryProjectList();
    }


    queryProjectList(){
        let that=this;
        this.selectProjectAjax = Ajax.selectProject(this.state,(result) => {
            result.unshift(ALL_TYPE_HOSTS);
            if(result && result.length > 0){
                if(that){
                    that.projectList=result;
                    that.setState()
                }
            }
        })
    }


    /**
     *  点击搜索处理
     */
    searchHandler() {
        this.getDataByUrl(1);
    }

    /**
     *  分页改变处理
     */
    onPageChange(nextPage) {
        this.state.currentPage = nextPage;
        this.getDataByUrl(nextPage);
    }

    render() {
        that=this;
        let disableItem=this.selectList.length==0?{disabled:true}:{}
        return (
            <div className="module-container"  style={{marginTop: 0}}>
                <div className="btns-div dropdown-menu-container">
                    {/**<Select value={this.state.tenantValue}  placeholder="请选择租户"
                            onChange={this.telantChange.bind(this,'tenantValue')}>
                        {this.tenantArr.map((item,index) => {
                            let rValue=item.tenantId +SPILT_STRING+ item.tenantName;
                            return <Option   value={item.tenantId?rValue:""}>{item.tenantName}</Option>
                        })}
                    </Select>
                    **/}
                    <Select value={this.state.currentProject} onChange={this.handleChange.bind(this,'currentProject')}  style={{marginTop:-2,height:32,width:200}}>
                        {this.projectList.map((item,index) => {
                            return <Option   value={item.code}>{item.cnName}</Option>
                        })}
                    </Select>

                    <RestrictInput type="text" className="form-control common-input" placeholder="输入表名称"
                                   value={this.state.tableName}  style={{marginLeft:10,width:200}}
                                   onChange={this.handleChange.bind(this,'tableName')} restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE}/>



                    <button className="btn btn-default" onClick={this.cancelClick.bind(this)} style={{float:"right"}} >取消</button>
                    <button className="btn btn-primary" style={{marginRight:10,width:70,float:"right"}}  {...disableItem}
                            onClick={this.handleSelect.bind(this)}>选择</button>
                    <button className="btn btn-primary" style={{marginRight:10,width:70,float:"right"}}  onClick={this.searchHandler.bind(this)}>查询</button>
                </div>


                <div className="module-table" style={{minHeight:"350px"}}>
                    <DataTable data={this.projectListArray}
                               onPageChange={this.onPageChange.bind(this)}
                               showPage="true"
                               column={this.column}
                               onCheckboxSelect={this.handleCheckboxSelect.bind(this)}
                               howRow={this.state.pageSize}></DataTable>

                </div>
            </div>
        );
    }
}

export default ProjectModelList