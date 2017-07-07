/****************************************************
 * create by qing.feng
 * time 2016/7/26 14:15
 * desc：脚本分布图表
*****************************************************/
import React from 'react'
import echarts from 'echarts';
import PieChart from 'bfd-ui/lib/PieChart'
import Panel from '../common/Panel'
import AjaxReq from '../../ajax/AjaxReq'

const pieColors = [
  '#7986cb','#4fc3f7',
  '#d38fc5','#4db6ac',
  '#64b5f6','#ff8a65',
  '#4dd0e1','#f48fb1',
  '#81c784','#b39ddb',
  '#ffcd40','#aed581'
];
class ScriptFb extends React.Component{
  constructor(props){
    super(props);
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
    AjaxReq.getScriptFbCharts( {
      projectCode: window.projectCode
    }, ( data ) => {
      if ( that.loadInterval ) {
        data = data.data;
        let nameList = [];
        let valueList = [];
        if ( data && data.length) {
          data.map( ( item, index ) => {
            nameList.push( item.name );
            valueList.push( {
              name:item.name,
              value:item.value
            } );
          } );
          that.initCharts( nameList, valueList );
        }
        //that.setState( {} );
      }
    } );
  }

  /*初始化图表*/
  initCharts( nameList, valueList ) {
    let that = this;
    if ( this.refs.scriptFbCharts ) {
      let columnChart = echarts.init( this.refs.scriptFbCharts );
      if(columnChart) columnChart.setOption( this.setChartsOption( nameList, valueList ) );
      /*columnChart.on( 'click', function ( params ) {
       let isError = params.seriesName == "错误" ? true : false;
       that.getTableList( params.name, isError );
       } );*/
    }
  }

  /*设置charts的option*/
  setChartsOption( nameList, valueList ) {
    let that = this;
    return {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: nameList
      },
      color:pieColors,
      series: [
        {
          name:'脚本分布',
          type:'pie',
          radius: ['50%', '65%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data:valueList
        }
      ]
    };
  }

  render() {
    return (
      <Panel
        title="脚本分布" style={{height:"400px"}}
        tabTitle="脚本管理"
        data-code="10210"
        history={this.props.history}
        urlName="/ide/ide" icon="file-code-o"
        menuClickFunc={this.props.menuClickFunc}>
        <div ref="scriptFbCharts"  style={{width:"100%",height:"100%"}}>
          <span style={{position:"absolute",bottom:"50%",left:"40%"}}>暂无数据</span>
        </div>
      </Panel>
    );
  }
}
export default ScriptFb