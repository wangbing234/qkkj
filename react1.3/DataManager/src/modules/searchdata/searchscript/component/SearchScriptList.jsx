import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import message from 'CommonComponent/component/bdosmessage'
import {BreadCrumb,SearchInput,LabelSelect} from 'CommonComponent'
import {RestrictInput} from 'CommonComponent'
import LeftTree from './LeftTree.jsx'
import EventName from 'EventName'
import AjaxReq from './../model/AjaxReq'
import ScriptInfoForm from './ScriptInfoForm';


let that;

let topAllInfo= {
    project_count:0,
    script_count:0,
    script_run_count:0,
    create_time:0,
    create_time_str:""
};
let topProjectInfo= {
    project_id:0,
    project_name:"",
    script_count:0,
    script_run_count:0,
    create_time:0,
    create_time_str:""
};

const LIST_VIEW = 'list_view';
const FORM_VIEW = 'form_view';

class SearchScriptList extends React.Component{

    constructor(prop) {
        super(prop);
        this.currentPage=1; //默认第1页
        this.sort = 0;
        this.state = {
            viewType: LIST_VIEW,
            selected:"all",
            topAllInfo: {
                project_count:0,
                script_count:0,
                script_run_count:0,
                create_time:0,
                create_time_str:""
            },
            topProjectInfo: {
                project_id:0,
                project_name:"",
                script_count:0,
                script_run_count:0,
                create_time:0,
                create_time_str:""
            },
            topInfo: 'topAllInfo',
            data: {
                totalList: [
                ]
            },
            ...prop, // 项目代码
            script_name: '' // 查找input的默认值

        }

        // 点击左侧树更新头部和表格信息
        EventEmitter.subscribe(EventName.UPDATE_SEARCH_SCRIPT_INFO, this.updateSearchScriptInfo.bind(this));
    }

    componentDidMount() {
        this.isUnmount = false;
        //this.getData();
    }

    componentWillUnmount() {
        this.isUnmount = true;
    }


    /**外部调用，SearchScript页面调用，由首页数据全景表存储量排行跳转过来**/
    openScriptDetail(taskCode){
        this.setState({viewType: LIST_VIEW});
        this.currentPage = 1;
        this.externaltaskCode = taskCode;
        //这里
        this.queryTableIsExist();

    }

    cancelHandler() {
        this.externaltaskCode = null;
        this.setState({viewType: LIST_VIEW});
        this.getData();
    }

    //项目Top5跳转过来查看
    externalSeeScript(projectCode){
        this.setState({projectCode:projectCode},()=>{
            this.getData();
        })
    }

    /**刷新数据**/
    getData() {
        if (this.state.projectCode && this.state.projectCode!="") {
            that.getProjectInfo();
            that.getList();
        } else {
            that.getAllInfo();
            that.getList();//脚本名，和projectCode都为空
        }
    }

    seeDetail(data) {
        that.setState({viewType: FORM_VIEW, formData: data});
    }

    getColumns(){
        let columns = [/*{
            title: '序号',
            key: 'index',
            width:'50px'
        },*/ {
            title: '名称',
            key: 'name',
            render:(text,item)=> {
                if(text){
                    return <a href="javascript:void(0);" onClick={this.seeDetail.bind(this,item)}>{text}</a>;
                }else{
                    return '-'
                }
            }
        }, {
            title: '状态',
            width:'15%',
            key: 'workFlowState'
        },{
            title: '创建人',
            width:'15%',
            key: 'createUser'
        },{
            title: '创建时间',
            width:'15%',
            key: 'createTimeStr',
            order: true
        },{
            title: '更新时间',
            width:'15%',
            key: 'updateTimeStr',
            order: true
        }];
        return columns;
    }

    // 获取All上部基本信息
    getAllInfo() {
        let that = this;
        let param = {tenant: window.currentTenant};
        AjaxReq.getAllInfo(param, function(result) {
            if(!that.isUnmount){
                if (result.data) {
                    that.setState({
                        topAllInfo: result.data,
                        topInfo: 'topAllInfo'
                    });
                } else if(!result.data){
                    that.setState({
                        topAllInfo: topAllInfo,
                        topInfo: 'topAllInfo'
                    });
                }
            }
        })
    }

    // 获取项目上部基本信息
    getProjectInfo() {
        let that = this;
        let param = {project_code:this.state.projectCode};
        AjaxReq.getProjectInfo(param, function(result) {
            if(!that.isUnmount){
                if ( result.data) {
                    that.setState({
                        topProjectInfo: result.data,
                        topInfo: 'topProjectInfo'
                    });
                } else if(!result.data){
                    that.setState({
                        topProjectInfo: topProjectInfo,
                        topInfo: 'topProjectInfo'
                    });
                }
            }
        })
    }

    //查询脚本是否存在，存在返回数据
    queryTableIsExist(){
        let param = {taskCode:this.externaltaskCode};
        AjaxReq.getList(param, function(result) {
            if(!that.isUnmount){
                if ( result.data && result.data.totalList.length!=0) { // 有数据加载,方便调试
                    if (that.externaltaskCode) {
                        result.data.totalList.map(function (item, index) {
                            if (that.externaltaskCode == item.code) {
                                that.seeDetail(item);
                            }
                        });
                    }
                } else {
                    message.success('此脚本已不存在!');
                    that.externaltaskCode = null;
                }
            }
        });
    }



    // 获取列表信息
    //taskCode,查询表是否有时，param只需要传一个taskCode即可
    getList() {
        let that = this;
        let param = {tenant: window.currentTenant, limit:10, pageNum:this.currentPage, projectCode:this.state.projectCode,taskName:this.state.script_name,sort:this.sort};
        AjaxReq.getList(param, function(result) {
            if(!that.isUnmount){
                if ( result.data && result.data.totalList.length!=0) { // 有数据加载,方便调试
                    that.setState({
                        data: result.data
                    });
                }else {
                    that.setState({
                        data: {totalList:[]}
                    });
                }
            }
        })
    }

    // 切换datatable页数触发
    onPageChange(page){
        // 更新页码状态
        this.currentPage = page;
        this.getList();
    }

    // 输入框输入查询脚本名字script_name
    handleChange(dataField, evt) {
        let value = evt && evt.target ? evt.target.value : evt;
        this.setState({[dataField]: $.trim(value)});
    }

    // 查询列表,不区分大小写
    search(){
        this.currentPage = 1;
        this.getList();
    }

    // 排序触发事件
    handleOrder(name, sort){
        let that = this;
        if(sort=='desc') { //降序
            switch (name){ //存储量/创建时间
                case 'createTimeStr':
                    this.sort = 0;
                    break;
                case 'updateTimeStr':
                    this.sort = 2;
                    break;
            }

        } else {
            switch (name){ //存储量/创建时间
                case 'createTimeStr':
                    this.sort = 1;
                    break;
                case 'updateTimeStr':
                    this.sort = 3;
                    break;
            }
        }

        //调用排序接口
        this.getList();
        /*let param = {tenant: window.currentTenant, limit:10, pageNum:this.currentPage, projectCode:this.state.projectCode,sort:this.sort};
        AjaxReq.getListOrder(param, function(result) {
            that.setState({
                data: result.data
            });
        });*/
    }

    updateSearchScriptInfo(projectCode){
        this.currentPage = 1;
        if(!this.isUnmount){
            this.setState({projectCode:projectCode},()=>{
                this.getData();
            });
        }
    }

    renderList(){
        that = this;
        let column = this.getColumns();
        let topAllUl = <ul>
            <li>项目数(个):<span>{this.state.topAllInfo.project_count}</span></li>
            <li>脚本总数(个): <span>{this.state.topAllInfo.script_count}</span></li>
            <li>在调度脚本数(个):<span>{this.state.topAllInfo.script_run_count}</span></li>
            <li>(最近更新时间:<span>{this.state.topAllInfo.create_time_str}</span>)</li>
        </ul>;
        let topProjectUl = <ul>
            <li>项目名:<span>{this.state.topProjectInfo.project_cnName}</span></li>
            <li>脚本总数(个):<span>{this.state.topProjectInfo.script_count}</span></li>
            <li>在调度脚本数(个):<span>{this.state.topProjectInfo.script_run_count}</span></li>
            <li>(最近更新时间:<span>{this.state.topProjectInfo.create_time_str}</span>)</li>
        </ul>;
        let topUl;
        switch (this.state.topInfo) {
            case 'topAllInfo':
                topUl = topAllUl;
                break;
            case 'topProjectInfo':
                topUl = topProjectUl;
                break;
        }
        return (
          <div>
              {/**上部基本信息**/}
              <div className="panel">
                  {topUl}
              </div>
              {/**筛选表名**/}
              <div className="module-search" style={{height:'30px'}}>
                  <button className="btn btn-sm btn-primary common-right" onClick={this.search.bind(this)}>查询</button>
                  <RestrictInput type="text" value={this.state.script_name} className="form-control common-input common-right"
                                 onChange={this.handleChange.bind(this,"script_name")} placeholder="脚本名称或脚本创建人"/>
              </div>
              {/**查询结果表格**/}
              <div className="module-table">
                  <DataTable data={this.state.data} column={column} onOrder={this.handleOrder.bind(this)} onPageChange={this.onPageChange.bind(this)} showPage="true" howRow={10}/>
              </div>
          </div>
        );
    }

    render(){
        let comp;
        if (this.state.viewType == LIST_VIEW) {
            comp = this.renderList();
        } else if (this.state.viewType == FORM_VIEW) {
            comp = <ScriptInfoForm
              data={this.state.formData.code}
              typeCode={this.state.formData.typeCode}
              cancel={this.cancelHandler.bind(this)}/>;
        }
        return (<div>
            {comp}
        </div>)

    }
}

export default SearchScriptList;