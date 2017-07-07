import React from 'react';
import PieChart from 'bfd-ui/lib/PieChart'
// 引入 ECharts 主模块
import {Echarts} from 'Echarts'

class GridScriptPie extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {}
  }

  // 组件将要销毁时，将是否是卸载状态的标识至为true
  componentWillUnmount() {
    this.isUnmount = true
  }

  componentDidMount() {
    this.isUnmount = false;
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart() {
    let that = this;
    var myChart = Echarts.init(document.getElementById('main'));
    var option = {
      color: ['#7986cb', '#4fc3f7', '#d38fc5', '#4db6ac', '#64b5f6', '#ff8a65',
        '#4dd0e1', '#f48fb1', '#81c784', '#b39ddb', '#ffcd40', '#aed581'],
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: { // 图例
        show: false,
        orient: 'horizontal',
        y: 'bottom',
        padding: 8,
        data: this.props.pieData.totalList
      },
      series: [
        {
          name: '脚本类型',
          type: 'pie',
          radius: ['35%', '60%'],
          avoidLabelOverlap: false,
          center: ['50%', '50%'],
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '4',
                fontWeight: 'bold'
              }
            }
          },
          data: this.props.pieData.totalList
        }
      ]
    };
    // 绘制图表
    myChart.setOption(option);
    myChart.on('click', (param) => {
      // 第一次点击
      if (!this.scriptType) {
        //刷新datatable
        that.props.update(param.name);
        this.scriptType = param.name;
      } else if (this.scriptType == param.name) {
        //再次点击相同的脚本返回默认列表
        that.props.goBackDefault();
        this.scriptType = '';
      } else {
        //点击不同脚本刷新datatable
        that.props.update(param.name);
        this.scriptType = param.name;
      }
    });
  }

  render() {
    return <div id="main" style={{height:'180px', width:'100%'}}></div>;
  }

}

export default GridScriptPie;