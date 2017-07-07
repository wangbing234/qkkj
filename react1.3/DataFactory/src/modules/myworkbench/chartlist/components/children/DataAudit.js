/****************************************************
 * create by qing.feng
 * time 2016/7/26 10:19
 * desc：项目首页- 数据稽核图表
 *****************************************************/
import React from 'react'
import echarts from 'echarts';
import Panel from '../common/Panel'
import AjaxReq from '../../ajax/AjaxReq'
let statusColorDic = {error:"#e57373",exception:"#990000",success:"#64b5f6"};
class DataAudit extends React.Component {
  constructor( props ) {
    super( props );
    this.preChartData = null;
    this.state = {};
  }

  /*组件实例化时，初始化charts*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getChartsData(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*获取图表数据*/
  getChartsData() {
    let that = this;
    AjaxReq.getChartsList( {
      projectCode: window.projectCode,//"ce98d8395afb423fa933b0cbff7fc3e4",
      startDate: this.state.start ? new Date( this.state.start ).format( "yyyy-MM-dd" ) : "",
      endDate: this.state.end ? new Date( this.state.end ).format( "yyyy-MM-dd" ) : "",
      auditTable: this.state.taskName
    }, ( data ) => {
      if ( that.loadInterval ) {
        data = data.data;
        let dateList = [];
        let normalList = [];
        let errorList = [];
        let execptionList = [];
        if ( data ) {
          data.map( ( item, index ) => {
            dateList.push( item.groupDate );
            normalList.push( item.success ? item.success : "" );
            errorList.push( item.error ? item.error : "" );
            execptionList.push( item.exception ? item.exception : "" );
          } );
        }
        that.initCharts( dateList, normalList, errorList, execptionList );
      }
    } );
  }

  /*初始化图表*/
  initCharts( dateList, normalList, errorList,execptionList ) {
    let that = this;
    if ( this.refs.dataAuditCharts ) {
      let columnChart = echarts.init( this.refs.dataAuditCharts );
      columnChart.setOption( this.setChartsOption(dateList, normalList, errorList,execptionList ) );
    }
  }

  /*设置charts的option*/
  setChartsOption( dateList, normalList, errorList,execptionList ) {
    let that = this;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        right: '50px',
        data: [ '正常', '数据异常','执行失败' ]
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        borderColor:"#f5f5f5",
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisLine:{
          show:false
        },
        axisTick:{
          show:false
        },
        data: dateList
      },
      yAxis: {
        type: 'value',
        axisLine:{
          show:false
        },
        axisTick:{
          show:false
        }
      },
      series: [
        {
          name: '正常',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          itemStyle: {
            normal: {
              color: statusColorDic["success"]
            }
          },
          data: normalList
        },
        {
          name: '数据异常',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          itemStyle: {
            normal: {
              color: statusColorDic['exception']
            }
          },
          data: execptionList
        },
        {
          name: '执行失败',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          itemStyle: {
            normal: {
              color: statusColorDic['error']
            }
          },
          data: errorList
        }
      ]
    };
  }

  render() {
    /**urlName配置对应跳转的页面**/
    return (
      <Panel
        title="数据稽核" history={this.props.history}
        tabTitle="稽核报告"
        data-code="10213"
        urlName="/dataaudit/report" icon="bold"
        menuClickFunc={this.props.menuClickFunc}>
        <div ref="dataAuditCharts"  style={{width:"100%",height:"100%"}}></div>
      </Panel>
    );
  }
}
export default DataAudit
