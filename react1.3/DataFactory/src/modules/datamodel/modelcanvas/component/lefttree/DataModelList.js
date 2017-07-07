/***************************************************
 * 时间: 2016/7/20 14:31
 * 作者: bing.wang
 * 说明: 数据模型列表
 *
 ***************************************************/
import React from 'react'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTable from './DataTable'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import Ajax from '../../ajax/AjaxReq'
import message from 'CommonComponent/component/bdosmessage'
import TypeConst from '../../../common/TypeConst'

let that;
class DataModelList extends React.Component {
    constructor(prop) {
        super(prop);
        this.selectList=[];
        this.state = {
            filterTable:false,
            pageSize: 10,
            currentPage:0,
            tableType:"hive",
            pagingConfigList:{totalList: []},
            projectCode:window.projectCode,
            name:""
        };

        this.isHbase=false;
        this.hierarchyCodeArray = [],//层级
        this.alertConfigList = {totalList: []}//总数据

    }


    getColumn(){
        let columArray= [
            {
                title: '表名',
                key: 'tableName'
            },
            {
                title: '数据库',
                key: 'dbName'
            },{
                title: '层级',
                key: 'hierarchyName'
            },{
                title: '类型',
                key: 'tableType'
            }];

        if(!this.isHbase)
        {
            columArray.push({
                title: '创建人',
                key: 'createUser'
            });
            columArray.push({
                title: '创建时间',
                key: 'createTime'
            })
        }

        return columArray;
    }

    componentDidMount() {
        this.loadTableHander();
        let that=this;
        Ajax.queryHierarchyCode((data)=>{
            that.hierarchyCodeArray=data;
            that.setState()
        })
    }

    /**
     * 加载表处理
     */
    loadTableHander()
    {
        let that=this;
        let cPage=this.state.currentPage=0;
        Ajax.loadTable($.extend(true,{},this.state),(data)=>{
            that.alertConfigList=data;
            that.isHbase=(that.state.tableType=="hbase");
            that.pagingData();
        })
    }

    /**
     *假分页方法
     * @param currentPage
     */
    pagingData(){
           let _totalList=that.alertConfigList.totalList||[];
           let pagingConfigListState= $.extend({},that.alertConfigList,false);
            let cP=this.state.currentPage-1;
            let cPage=(cP<0?0:cP)*this.state.pageSize;
            pagingConfigListState.totalList=_totalList.slice(cPage,cPage+this.state.pageSize);
            this.setState({pagingConfigList:pagingConfigListState});
    }

    /**
     *  点击选择
     */
    submit(fun){
        if(!that.selectList)
        {
            message.danger("请选择列表！");
            return;
        }
        let table=[];
        for (let obj of that.selectList) {
            table.push({tableName:obj.tableName,dbName:obj.dbName,hierarchyCode:obj.hierarchyCode,tableType:obj.tableType});
        }
        let parms={table:JSON.stringify(table)}
        Ajax.saveLoadTable(parms,(data)=>{
            if(fun){
                fun();
                EventEmitter.dispatch(TypeConst.REFRESH_COMMON_MODEL_TREE);
            }
            that.cancelClick();
        })
    }

    /**
     *  点击取消
     */
    cancelClick(){
        this.props.cancelClick();
    }

    /**
     *  处理改变
     */
    handleChange(name, event) {
        if (event && event.target) {
            this.state[name] = name === "checked" ? event.target.checked : event.target.value;
        } else {
            this.state[name] = event; '菜单'
        }
        that.setState();
    }

    /**
     *  数据库修改切换
     */
    handleDbTypeChange(name, event) {
       this.handleChange(name, event);
    }


    /**
     *  搜索处理
     */
    searchHandler() {
        that.getDataByUrl(1);
    }

    /*复选框change 处理*/
    handleCheckboxSelect(selectItems) {
        this.selectList = selectItems;
        this.setState();
    }

    /**
     *  分页修改
     */
    onPageChange(nextPage) {
        this.state.currentPage = nextPage;
        this.pagingData()
    }


    handleSubmit(){
        this.props.owner.handleSubmit();
    }


    /**
     * 过滤表
     * @param target
     */
    handleChangeFiter({ target }) {
       this.state.filterTable=target.checked;
    }

    render() {
        that=this;
        let disableItem=this.selectList.length==0?{disabled:true}:{}
        return (
            <div className="module-container" style={{marginTop: 0}}>
                <div className="btns-div dropdown-menu-container">
                                <Checkbox onChange={this.handleChangeFiter.bind(this)}>过滤临时表</Checkbox>
                                <Select value={this.state.tableType} style={{marginLeft:10}} placeholder="请选择类型"
                                        onChange={this.handleDbTypeChange.bind(this,'tableType')}>
                                    <Option    key="hive" value="hive">Hive</Option>
                                    <Option    key="hbase" value="hbase">HBase</Option>
                                </Select>

                                <Select value={this.state.hierarchyCode} style={{marginLeft:10}} placeholder="请选择层级"
                                        onChange={this.handleChange.bind(this,'hierarchyCode')}>
                                    <Option  key="" value="">全部</Option>
                                    {this.hierarchyCodeArray.map((item,index)=>{return (<Option key={item.code} value={item.code}>{item.name}</Option>)})}
                                </Select>

                                <RestrictInput type="text" className="form-control common-input" placeholder="输入表名称"
                                    value={this.state.name}  style={{marginLeft:10,width:200,float:"right"}}
                                               onChange={this.handleChange.bind(this,'name')} restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE}/>
                </div>
                <div className="btns-div dropdown-menu-container" style={{margin:"17px 20px 15px 3px"}}>
                    <button className="btn btn-primary" style={{marginRight:10,width:70}}  onClick={this.loadTableHander.bind(this)}>查询</button>
                    <button className="btn btn-primary" style={{marginRight:10,width:70}} {...disableItem}
                            onClick={this.handleSubmit.bind(this)}>选择</button>
                    <button className="btn btn-default" onClick={this.cancelClick.bind(this)}>取消</button>
                </div>

                <div className="module-table">
                    <DataTable data={this.state.pagingConfigList} onPageChange={this.onPageChange.bind(this)}
                               column={this.getColumn()}  showPage="true" onCheckboxSelect={this.handleCheckboxSelect.bind(this)}
                               howRow={this.state.pageSize}/>
                 </div>
                </div>
        );
    }
}

export default DataModelList