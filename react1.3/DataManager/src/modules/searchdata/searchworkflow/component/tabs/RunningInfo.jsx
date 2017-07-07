import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import LineChart from 'bfd-ui/lib/LineChart'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import message from 'CommonComponent/component/bdosmessage'
import AjaxReq from '../../model/AjaxReq'
import ENUM from 'ENUM'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import {Echarts} from 'Echarts'

let that;
let columns;
let data = {
  totalList: [
    {id: "1", processCode: '1182222', startTime: "2016-02-12", endTime: "2016-02-22", runningTime: "40", status: '0'},
    {id: "1", processCode: '1395322', startTime: "2016-02-12", endTime: "2016-02-22", runningTime: "30", status: '0'},
    {id: "1", processCode: '1345322', startTime: "2016-02-12", endTime: "2016-02-22", runningTime: "50", status: '0'},
    {id: "1", processCode: '1005322', startTime: "2016-02-12", endTime: "2016-02-22", runningTime: "30", status: '0'}],
  "currentPage": 1,
  "totalPageNum": 2
};

const lineChartData = [{
  times: 300,
  date: '2016-01-01'
}, {
  times: 500,
  date: '2016-01-02'
}, {
  times: 700,
  date: '2016-01-03'
}, {
  times: 1000,
  date: '2016-01-04'
}];

class RunningInfo extends React.Component {

  constructor(prop) {
    super(prop);
    that = this;
    this.currentPage = 1;
    this.endDate = (new Date()).getTime();
    this.startDate = (new Date()).getTime()-7*24*60*60*1000;

    this.state = {}
  }

  handleSelect(start,end) {
    this.startDate = start;
    this.endDate = end;
    if(start && end){
      if ((end - start) > 30*24*60*60*1000){
        message.danger("开始时间、结束时间区间间隔不能超过30天");
      } else {
        message.close();
        //查询后台数据
        this.search();
      }
    }
  }

  seeDetail(data){

  }

  componentDidMount(){
    this.search();
  }

  /**查询**/
  search(){
    let startDateStr = new Date(this.startDate).format("yyyy-MM-dd");
    let endDateStr = new Date(this.endDate).format("yyyy-MM-dd");
    let param = {projectCode: that.props.projectCode,processKey:that.props.processKey, startTime:`${startDateStr} 00:00:00`,endTime:`${endDateStr} 23:59:59`,currentPage:that.currentPage,pageSize:ENUM.PAGE_SIZE};
    AjaxReq.getWfRunningInfo(param, (result) => {
      if(that){
        let dateList = [];
        let valueList = [];
        result.totalList.map((item,index)=>{
          item.startTime = item.startTime?new Date(item.startTime).format("yyyy-MM-dd hh:mm:ss"):"";
          item.endTime = item.endTime?new Date(item.endTime).format("yyyy-MM-dd hh:mm:ss"):"";
          dateList.push(item.startTime);
          valueList.push(item.exectTime/1000);
        });
        dateList.reverse();
        valueList.reverse();
        that.renderChart(dateList,valueList);
        that.setState({data: result})
      }
    })
  }

  getColumn() {
    return [
      {title: '执行标识', key: 'id'},
      {title: '流程编码', key: 'processCode'},
      {title: '开始时间', key: 'startTime'},
      {title: '结束时间', key: 'endTime'},
      {title: '运行时长', key: 'exectTime',
        render:((text,record)=>{
          return CommonUtil.getTimers(text);
        })
      },
      {title: '状态', key: 'state',
        render(text){
          let stateStr;
          switch(text){
            case 1:
              stateStr = '运行中';
              break;
            case 2:
              stateStr = '暂停';
              break;
            case 3:
              stateStr = '完成';
              break;
            case 4:
              stateStr = '终止';
              break;
            case 5:
              stateStr = '失败';
              break;
          }
          return stateStr;
        }
      },
      {
        title: '操作', key: 'operation',
        render(record,text) {
          let projectId = record.projectId;
          let processInstanceId = record.id;
          let urlStr = `${Server.securityCenter}pages/Europa/ActiviMonitor.html?processInstanceId=${processInstanceId}&projectId=${projectId}`;
          return <a href={urlStr}target="_blank">查看</a>;
        }
      }];
  }

  setOption(dateList,valueList){
    let that = this;
    return {
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        x:'right',
        data:['时长(秒)']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          axisLine:{
            show:false
          },
          axisTick:{
            show:false
          },
          data : dateList
        }
      ],
      yAxis : [
        {
          type : 'value',
          axisLine:{
            show:false
          },
          axisTick:{
            show:false
          }
        }
      ],
      series : [
        {
          name:'时长(秒)',
          type:'line',
          smooth:true,
          //stack: '时长(毫秒)',
          itemStyle: {
            normal: {
              color: "#64b5f6"
            }
          },
          areaStyle: {
            normal: {
              color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0, color: 'rgba(100,181,246, 0.8)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(100,181,246, 0.2)' // 100% 处的颜色
              }], true)//"#64b5f6"
            }},
          data:valueList
        }
      ]
    };
  }

  renderChart(dateList,valueList) {
    let that = this;
    if ( this.refs.lineChart ) {
      var myChart = Echarts.init(this.refs.lineChart);
      // 绘制图表
      myChart.setOption(this.setOption(dateList,valueList));
    }
  }

  render() {
    that = this;
    let column = this.getColumn();
    return (<div>
      <DateRange onSelect={this.handleSelect.bind(this)} start={this.startDate} end={this.endDate}/>
      <div>
        <div ref="lineChart" style={{height:"260px"}}></div>
        {/*<LineChart category="startTime" cols={{exectTime:'时长(毫秒)'}} data={this.state.data?this.state.data.totalList:[]} style={{height:'150px'}}/>*/}
      </div>
      <div className="module-table">
        <DataTable column={column} data={this.state.data} showPage="true" howRow={10}/>
      </div>
    </div>);
  }
}

export default RunningInfo;