import React from 'react'
import echarts from 'echarts';

import CommonUtil from 'CommonComponent/utils/CommonUtil'
import Panel from '../common/Panel'
import AjaxReq from '../../ajax/AjaxReq'

class ExecuteTime extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  /*组件实例化时，初始化charts*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getChartsData("STATE_RUNNING"), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*获取图表数据*/
  getChartsData(state) {
    let that = this;
    AjaxReq.getRunningTimeCharts( {
      projectId: window.projectId,
      state:state
    }, ( data ) => {
      if ( that.loadInterval ) {
        data = data.data;
        let dateList = [];
        let valueList = [];
        let times;
        if ( data ) {
          data.map( ( item, index ) => {
            times = Number(item.diffTime)*1000;
            dateList.push( item.groupkey );
            valueList.push( {value:times,label:{} });
          } );
        }
        that.initCharts( dateList, valueList );
      }
    } );
  }

  /*初始化图表*/
  initCharts( dateList, valueList ) {
    let that = this;
    if ( this.refs.executeTimeCharts ) {
      let columnChart = echarts.init( this.refs.executeTimeCharts );
      if(columnChart) columnChart.setOption( this.setChartsOption(dateList, valueList) );
    }
  }

  /*设置charts的option*/
  setChartsOption( dateList, valueList ) {
    let that = this;
    return {
      tooltip : {
        trigger: 'axis',
        formatter: function (params, ticket, callback) {
          return CommonUtil.getTimers(params[0].value);
        }
      },
      legend: {
        data:['时长(s)']
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
          axisLabel :{
            formatter: function (value, index) {
              if (!value)return value;
              let str = value.replace(/-/g, "/");
              let _date = new Date(str);
              let year = _date.getFullYear();
              let month = _date.getMonth() < 10 ? '0' + (_date.getMonth() + 1) : _date.getMonth() + 1;
              let day = _date.getDate() < 10 ? '0' + _date.getDate() : _date.getDate();
              let _time = `${year}\n${month}-${day}`;
              return _time;
            }
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
          name:'时长(s)',
          type:'line',
          stack: '总量',
          itemStyle: {
            normal: {
              color: "#64b5f6"
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
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
  render() {
    return (
      <Panel
        title="执行时长趋势"
        style={{height:"400px"}}
        tabTitle="工作流监控"
        data-code="10216"
        history={this.props.history}
        urlName="/workflow/workflowMonitor"
        icon="gears"
        menuClickFunc={this.props.menuClickFunc}>
        <div ref="executeTimeCharts" style={{width:"100%",height:"100%"}}></div>
      </Panel>
    );
  }
}
export default ExecuteTime

