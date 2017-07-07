import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import GridTitle from './GridTitle'
import GridScriptPie from './GridScriptPie'
import EventName from '../../../../containers/EventName'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import AjaxReq from '../model/AjaxReq'

const  scriptRuntimeTopMap= {
  python: {
    totalList: []
  },
  hive: {
    totalList: []
  },
  shell: {
    totalList: []
  },
  mr: {
    totalList: []
  },
  hbase: {
    totalList: []
  },
  'spark-sql': {
    totalList: []
  },
  ftp: {
    totalList: []
  },
  POWERSHELL: {
    totalList: []
  },
  sqoop: {
    totalList: []
  },
  spark: {
    totalList: []
  }
};
class GridScriptView extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
      scriptRunTimeTopTime_str: '',
      scriptRuntTimeTop: {totalList:[]},//饼图数据
      scriptRuntimeTopMap: scriptRuntimeTopMap,//点击饼图加载表格数据
      scriptRuntTimeTopList: {totalList: []}//表格数据
    }
  }

  componentDidMount(){
    this.getPieData();
    this.getTableList();
  }

  // 组件将要销毁时，将是否是卸载状态的标识至为true
  componentWillUnmount() {
    if(this.getPieDataReq){
      this.getPieDataReq.abort();
      this.getPieDataReq = null;
    }
    if(this.getListReq){
      this.getListReq.abort();
      this.getListReq = null;
    }
  }

  getTableList(){
    let that = this;
    let scriptTopDefaultParam = {tenant: window.currentTenant};
    this.getListReq = AjaxReq.getScriptTopDefaultData(scriptTopDefaultParam, function(result){
      if(result.data){
        // 保存默认list数据,点击返回按钮查看
        that.scriptRuntTimeTopList = result.data;
        // 脚本Top一进来默认list数据
        that.setState({
          scriptRuntTimeTopList: result.data
        });
      }else {
        that.setState({scriptRuntTimeTopList: {totalList:[]}});

      }
    });
  }

  getPieData(){
    let that = this;
    let scriptTopParam = {tenant: window.currentTenant};
    this.getPieDataReq = AjaxReq.getScriptTopData(scriptTopParam, function(result){
      if(result.data){
        // 脚本Top数据(除默认list)
        that.setState({
          scriptRunTimeTopTime_str: result.data.scriptRunTimeTopTime_str,
          scriptRuntTimeTop: result.data.scriptRuntTimeTop,//饼图数据
          scriptRuntimeTopMap: result.data.scriptRuntimeTopMap//点击饼图加载表格数据
        });
      }
    });
  }


  addScriptTab(item) {
    let record = {
      href: "/searchData/searchScript",
      title: "查找脚本",
      'data-icon':'search',
      taskCode:item.taskCode
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
        width: '40'
      },*/
      {
        title: '脚本',
        dataIndex: 'script_name',
        key: 'script_name',
        width: '180',
        render:(text,item)=>{
          return   <TextOverflow>
            <div style={{maxWidth:180}}>
              <a href="javascript:void(0);" onClick={that.addScriptTab.bind(that,item)}>{text}</a>
            </div>
          </TextOverflow>
        }
      },
      {
        title: '类型',
        dataIndex: 'script_type',
        key: 'script_type',
        width: '80'
      },
      {
        title: '运行时长',
        dataIndex: 'run_time_str',
        key: 'run_time_str',
        width: '80',
        render:(text)=>{
          return   <TextOverflow>
            <div style={{width:70}}>
              {text}
            </div>
          </TextOverflow>
        }
      }
    ];
  }

  //监听点击饼图事件
  update(params) {
    this.setState({
      scriptRuntTimeTopList:this.state.scriptRuntimeTopMap[params]
    });
  }

  // 脚本top-返回原始脚本表格top5
  goBackDefault() {
    this.setState({
      //保存的一进来默认数据
      scriptRuntTimeTopList: this.scriptRuntTimeTopList
    });
  }

  render() {
    let that = this;
    let column = this.getColumns();
    return (
      <div  style={{border:'1px solid #ccc',backgroundColor:'#fff', height:"100%",padding:'20px'}}>
        <GridTitle topTime_str={this.state.scriptRunTimeTopTime_str} title="脚本运行时长Top5"/>
        <div className="row">
          <div className="col-md-4" style={{paddingRight:'0px'}}>
            <GridScriptPie pieData={that.state.scriptRuntTimeTop} update={that.update.bind(that)} goBackDefault={that.goBackDefault.bind(this)}/>
            {/*<button className="btn btn-sm btn-primary common-left" style={{marginBottom:'7px',marginLeft:'7px'}} onClick={function(){that.props.goBackDefault()}}>返回</button>*/}
          </div>
          <div className="col-md-8" style={{marginTop:'0px', paddingLeft:'0px' }}>
            <DataTable column={column} howRow={10} data={this.state.scriptRuntTimeTopList}/>
          </div>
        </div>
      </div>
    );
  }
}

export default GridScriptView;