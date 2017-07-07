import React from "react";
import DataTable from 'bfd-ui/lib/DataTable'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import RestrictInput from 'CommonComponent/component/restrictinput'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import LeftTree from '../../common/LeftTree.jsx'
import WorkflowForm from './WorkflowForm.jsx'
import AjaxReq from '../model/AjaxReq'
import ENUM from 'ENUM'
import EventName from 'EventName'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

let that;

const LIST_VIEW = 'list_view';
const FORM_VIEW = 'form_view';

class WorkflowList extends React.Component {

  constructor(prop) {
    super(prop);
    this.currentPage = 1;
    this.state = {
      viewType: LIST_VIEW,
      tableName: ''
    };
    // 监听改变上部信息事件
    EventEmitter.subscribe(EventName.UPDATE_PROJECT_DESC_INFO, this.updateTopInfo.bind(this));
    that = this;
    this.projectCode = this.props.projectCode;
  }

  componentDidMount() {
    this.loadInterval = setInterval( this.updateInfo(), 100 );
  }

  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  // 首页点击项目工作流,更新projectCode
  /*componentWillReceiveProps(nextProps){
    if(nextProps.projectCode != undefined){
      that = this;
      this.projectCode = nextProps.projectCode;
      this.updateInfo();
    }
  }*/

  /**外部调用，Index页面调用，由首页数据全景表存储量排行跳转过来**/
  openWfByProjectCode(projectCode){
    this.setState({viewType: LIST_VIEW});
    this.projectCode = projectCode;
    this.currentPage = 1;
    this.updateInfo();
  }


  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]:$.trim(value)});
  }

  onPageChange(cpage) {
    this.currentPage = cpage;
    this.search();
  }

  seeDetail(data) {
    //data.projectCode = that.projectCode;
    that.setState({viewType: FORM_VIEW, formData: data});
  }

  // 改变上部信息
  updateTopInfo(param) {
    //if(param is ) 判断数据类型，如果是对象，如果是array
    this.currentPage = 1;
    if (typeof(param) == "string") {
      this.projectCode = param;
    } else {
      switch (param.length) {
        // All
        case 1:
          this.projectCode = '';
          break;
        // 项目级
        case 2:
          this.projectCode = param[1].project_code;
          break;
      }
    }
    this.updateInfo();
  }


  /**更新项目描述，及表格信息**/
  updateInfo(){
    this.getProjectDescInfo();
    this.search();
  }

  /**查询项目描述信息**/
  getProjectDescInfo() {
    let param = {projectCode:this.projectCode?this.projectCode:'',tenant:window.currentTenant};
    this.descAjax = AjaxReq.getProjectDescInfo(param, (result) => {
      if(this.loadInterval){
        this.setState({projectDescInfo: result})
      }
    })
  }


  /**查询
   * curPage:当前页,点击查询时从第一页开始，才传这个参数，其它不需要传
   * tenantId：租户Id**/
  search(curPage) {
    let that = this;
    let param = {
      tenantId:window.currentTenant,
      projectCode: that.projectCode?that.projectCode:'',
      processKey: that.state.tableName?that.state.tableName:'',
      currentPage: curPage?curPage:that.currentPage,
      pageSize: ENUM.PAGE_SIZE
    };
    this.listAjax = AjaxReq.getWorkFlowList(param, (result) => {
      if(this.loadInterval){
        if(result && result.totalList.length!=0){
          this.setState({data: result})
        } else {
          this.setState({data: {totalList:[]}})
        }

      }
    })
  }

  handleActive(data) {
    console.log(data)
  }

  cancelHandler() {
    this.setState({viewType: LIST_VIEW});
  }


  getColumns() {
    return [
      /*{
        title: '序号',
        key: 'sequence',
        width: '50px'
      },*/
      {
      title: '编码',
      key: 'key',
        render(text, record) {
          if (text) {
            return   <TextOverflow>
              <div style={{maxWidth:100}}>
                <a href="javascript:void(0);" onClick={that.seeDetail.bind(that,record)}>{text}</a>
              </div>
            </TextOverflow>;
          } else {
            return '-'
          }
        }
    }, {
      title: '名称',
      key: 'name',
        render:(text)=>{
          return   <TextOverflow>
            <div style={{maxWidth:100}}>
              {text}
            </div>
          </TextOverflow>

        }
    }, {
      title: '描述',
      key: 'remark',
        render:(text)=>{
          return   <TextOverflow>
            <div style={{maxWidth:100}}>
              {text}
            </div>
          </TextOverflow>
        }
    }, {
      title: '状态',
      key: 'flowState',//0：未上线 1：已上线  2：已下线
      render:(text)=>{
        return CommonUtil.getWfState(text);
      }
    }, {
      title: '创建人',
      width:'10%',
      key: 'createUser',
        render:(text)=>{
          return   <TextOverflow>
            <div style={{width:100}}>
              {text}
            </div>
          </TextOverflow>
        }
    }, {
      title: '创建时间',
      key: 'createTime',
      width:'15%',
      render(text){
        if(text){
          return new Date(text).format("yyyy-MM-dd hh:mm:ss");
        }
        return '';
      }
    }, {
      title: '更新时间',
      width:'15%',
      key: 'updateTime',
      render(text){
        if(text){
          return new Date(text).format("yyyy-MM-dd hh:mm:ss");
        }
        return '';
      }
    }];
  }

  renderList() {
    let column = this.getColumns();
    return (<div>
      <div className="panel">
        <ul>
          <li>项目数(个):&nbsp;{this.state.projectDescInfo ? this.state.projectDescInfo.project_count : ''}</li>
          <li>工作流总数(个):&nbsp;{this.state.projectDescInfo ? this.state.projectDescInfo.workflow_count : ''}</li>
          <li>在调度工作流数(个):&nbsp;{this.state.projectDescInfo ? this.state.projectDescInfo.workflow_run_count : ''}</li>
          <li>(最近更新时间:&nbsp;{this.state.projectDescInfo ? this.state.projectDescInfo.create_time_str : ''})</li>
        </ul>
      </div>
      <div className="module-search" style={{height:'30px'}}>
        <button className="btn btn-sm btn-primary common-right" onClick={this.search.bind(this,1)}>查询</button>
        <RestrictInput type="text" value={this.state.tableName} className="form-control common-input common-right"
                       onChange={this.handleChange.bind(this,"tableName")} placeholder="工作流编码"/>
      </div>
      <div className="module-table">
        <DataTable data={this.state.data} column={column} onPageChange={this.onPageChange.bind(this)} showPage="true" howRow={10}/>
      </div>


    </div>);
  }


  render() {
    that = this;
    let comp;
    if (this.state.viewType == LIST_VIEW) {
      comp = this.renderList();
    } else if (this.state.viewType == FORM_VIEW) {
      comp = <WorkflowForm data={this.state.formData} cancel={this.cancelHandler.bind(this)}/>;
    }
    return (<div>
      {comp}
    </div>)
  }
}

export default WorkflowList;