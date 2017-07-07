import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import GridTitle from './GridTitle'
import EventName from '../../../../containers/EventName'
import AjaxReq from './../model/AjaxReq'


class GridProjectView extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
      projectTopTime_str: '',
      projectTopList: {totalList:[]}
    }
  }

  componentDidMount(){
    this.getProject();
  }

  // 组件将要销毁时，将是否是卸载状态的标识至为true
  componentWillUnmount() {
    if(this.getDataReq){
      this.getDataReq.abort();
      this.getDataReq = null;
    }
  }

  getProject(sortNum){
    let defaultSort = 0;
    if(sortNum){
      defaultSort = sortNum;
    }
    let projectParam = {sort:defaultSort, tenant: window.currentTenant};

    this.getDataReq = AjaxReq.getProjectTopData(projectParam, (result) => {
      if( result.data) {
        this.setState({
          // 项目Top数据
          projectTopTime_str: result.data.projectTopTime_str,
          projectTopList: result.data.projectTopList
        });
      }
    });
  }






  addTableTab(item) {
    let record = {
      href: "/searchData/searchTable",
      title: "查找表",
      'data-icon':'search',
      // 项目代码传到打开详细项目信息页面
      projectCode: item['project_code']
    };
    EventEmitter.dispatch(EventName.addTab, record);
  }

  addScriptTab(item) {
    let that = this;
    let record = {
      href: "/searchData/searchScript",
      title: "查找脚本",
      'data-icon':'search',
      // 项目代码传到打开详细项目信息页面
      projectCode: item['project_code']
    };
    EventEmitter.dispatch(EventName.addTab, record)
  }

  addWorkflowTab(item) {
    let that = this;
    let record = {
      href: "/searchData/searchWorkflow",
      'data-icon':'search',
      title: "查找工作流",
      // 项目代码传到打开详细项目信息页面
      projectCode: item['project_code']
    };
    EventEmitter.dispatch(EventName.addTab, record)
  }

  getColumns() {
    let that = this;
    return [
      /*{
        title: '',
        dataIndex: 'index',
        key: 'index',
        width: '50'
      },*/
      {
        title: '项目',
        dataIndex: 'project_name',
        key: 'project_name'
      },
      {
        title: '表数',
        dataIndex: 'table_count',
        key: 'table_count',
        width: '80px',
        order: true,
        render(text, item) {
          return <a href="javascript:void(0);" onClick={function(){that.addTableTab(item)}}>{text}</a>;
        }
      },
      {
        title: '脚本数',
        dataIndex: 'script_count',
        key: 'script_count',
        width: '80px',
        order: true,
        render(text, item) {
          return <a href="javascript:void(0);" onClick={function(){that.addScriptTab(item)}}>{text}</a>;
        }
      },
      {
        title: '工作流数',
        dataIndex: 'workflow_cout',
        key: 'workflow_cout',
        width: '80px',
        order: true,
        render(text, item) {
          return <a href="javascript:void(0);" onClick={function(){that.addWorkflowTab(item)}}>{text}</a>;
        }
      }
    ];
  }

  // 点击排序事件刷新表格
  handleOrder(name, sort) {
    let sortNum;
    if(sort=='desc') { //降序
      switch (name){ //表/脚本/工作流
        case 'table_count':
          sortNum = 0;
          break;
        case 'script_count':
          sortNum = 2;
          break;
        case 'workflow_cout':
          sortNum = 4;
          break;
      }

    }else{
      switch (name){ //表/脚本/工作流
        case 'table_count':
          sortNum = 1;
          break;
        case 'script_count':
          sortNum = 3;
          break;
        case 'workflow_cout':
          sortNum = 5;
          break;
      }
    }
    this.getProject(sortNum);
  }

  render() {
    let column = this.getColumns();
    return (
      <div  style={{border:'1px solid #ccc',backgroundColor:'#fff',height:"100%",padding:'20px'}}>
        <GridTitle topTime_str={this.state.projectTopTime_str} title="项目Top5"/>
        <div style={{marginTop:'7px',marginBottom:'7px'}}>
           <DataTable onOrder={this.handleOrder.bind(this)} column={column} howRow={10} data={this.state.projectTopList}/>
        </div>
      </div>
    );
  }
}
export default GridProjectView;