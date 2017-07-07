/****************************************************
 * create by qing.feng
 * time 2016/7/25 18:22
 * desc：数据增长趋势
 *****************************************************/
import React from 'react'
import echarts from 'echarts';
import Panel from '../common/Panel'
import AjaxReq from '../../ajax/AjaxReq'

class DataGrow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /*组件实例化时，初始化charts*/
  componentDidMount() {
    this.loadInterval = setInterval(this.getChartsData(), 100);
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval(this.loadInterval);
    this.loadInterval = false;
  }

  /*获取图表数据*/
  getChartsData() {
    let that = this;
    AjaxReq.getDataGrowCharts({
      project_code: window.projectCode
    }, (data) => {
      if (that.loadInterval) {
        data = data.data;
        let dateList = [];
        let valueList = [];
        if (data) {
          data.map((item, index) => {
            dateList.push(item.date);
            valueList.push(item.value);
          });
        }
        dateList.reverse();
        valueList.reverse();
        that.initCharts(dateList, valueList);
      }
    });
  }

  /*初始化图表*/
  initCharts(dateList, valueList) {
    let that = this;
    if (this.refs.dataGrowCharts) {
      let columnChart = echarts.init(this.refs.dataGrowCharts);
      if (columnChart) columnChart.setOption(this.setChartsOption(dateList, valueList));
      /*columnChart.on( 'click', function ( params ) {
       let isError = params.seriesName == "错误" ? true : false;
       that.getTableList( params.name, isError );
       } );*/
    }
  }

  /*设置charts的option*/
  setChartsOption(dateList, valueList) {
    let that = this;
    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['数据存储量大小']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
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
          data: dateList
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '数据存储量大小',
          type: 'line',
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
            }
          },
          data: valueList
        }
      ]
    };
  }

  moreClick(evt) {
    //打开数据管理界面
    let url = Server.dataManagerIndex;
    window.open(url);
  }

  render() {
    return (
      <Panel
        title="数据增长趋势" style={{height:"400px"}}
        data-code="103"
        history={this.props.history} menuClickFunc={this.moreClick}>
        <div ref="dataGrowCharts" style={{width:"100%",height:"100%"}}></div>
      </Panel>
    );
  }
}
export default DataGrow

