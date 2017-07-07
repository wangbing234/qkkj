/****************************************************
 * create by qing.feng
 * time 2016/7/20 14:46
 * desc：稽核报告-list界面
 *****************************************************/
import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import DataTable from 'bfd-ui/lib/DataTable'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import RestrictInput from 'CommonComponent/component/restrictinput'

import TaskDetail from './TaskDetail'
import echarts from 'echarts';
import AjaxReq from '../ajax/AjaxReq'

let statusDic = {"执行失败":"error","数据异常":"exception","正常":"success"};
let statusFlagDic = {error:"执行失败",exception:"数据异常",success:"正常"};
let statusColorDic = {error:"#e57373",exception:"#990000",success:"#64b5f6"};

class ReportList extends React.Component {
  constructor( props ) {
    super( props );
    this.preChartData = null;
    this.pageSize = 10;
    this.currentPage = 1;
    this.tableSearchDate = "";
    this.state = {
      countData: {},
      tableData: {
        totalList: []
      }
    };
  }

  /*组件实例化时，初始化charts*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getCountInfo(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*获取统计信息*/
  getCountInfo() {
    let that = this;
    AjaxReq.getReportCountInfo( {
      projectCode: window.projectCode//"ce98d8395afb423fa933b0cbff7fc3e4"//window.projectCode
    }, function ( data ) {
      data = data.data;

      if ( that.loadInterval ) {
        console.log( "report list ============", that );
        that.setState( { countData: data } );
        that.getChartsData();
      }
    } );
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
        that.setState( {
          ...that.state
        } );
        that.initCharts( dateList, normalList, errorList, execptionList );
        if ( dateList.length > 0 ) {
          this.charsItemSelect = statusFlagDic['exception'];
          that.getTableList( dateList[ dateList.length - 1 ],this.charsItemSelect);
        } else {
          that.setState( { tableData: { totalList: [] } } );
        }
      }
    } );
  }

  /*获取表格的数据*/
  getTableList( gdate, status ) {
    this.tableSearchDate = gdate;
    let that = this;
    if(statusDic[status] == 'exception'){
      that.isError = true;
    }else{
      that.isError = false;
    }
    AjaxReq.getReportList( {
      projectCode: window.projectCode,//"ce98d8395afb423fa933b0cbff7fc3e4",
      groupDate: gdate,
      result: statusDic[status],
      auditTable: this.state.taskName,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    }, ( tdata ) => {
      if ( that.loadInterval ) {
        that.setState( { tableData: tdata.data } );
      }
    } );
  }

  /*初始化图表*/
  initCharts( dateList, normalList, errorList,execptionList ) {
    let that = this;
    if ( this.refs.chars ) {
      let columnChart = echarts.init( this.refs.chars );
      columnChart.setOption( this.setChartsOption(dateList, normalList, errorList,execptionList ) );
      columnChart.on( 'click', function ( params ) {
        // 控制台打印数据的名称
        if ( this.preChartData ) {
          //取消高亮指定的数据图形
          /*columnChart.dispatchAction( {
           type: "downplay",
           seriesIndex: this.preChartData.seriesIndex,
           seriesName: this.preChartData.seriesName,
           dataIndex: this.preChartData.dataIndex
           } );*/
        }
        //高亮指定的数据图形
        /*columnChart.dispatchAction( {
         type: "highlight",
         seriesIndex: params.seriesIndex,
         seriesName: params.seriesName,
         dataIndex: params.dataIndex
         } );*/
        this.preChartData = params;
        this.charsItemSelect = params.seriesName;
        that.getTableList( params.name, params.seriesName );
      } );
    }
  }

  /*设置charts的option*/
  setChartsOption( dateList, normalList, errorList,execptionList ) {
    let that = this;
    return {
      title: {
        text: "任务趋势图",
        left: '20px',
        textStyle: {
          fontWeight: 'normal'
        }
      },
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

  /*日期切换处理*/
  handleDateSelect( start, end ) {
    this.setState( { start, end } )
  }

  /*进入任务报告详情界面*/
  enterDetail( item ) {
    this.props.enterDetail( item );
  }

  /*页码切换处理*/
  onPageChange( pageNum ) {
    this.currentPage = pageNum;
    this.getTableList( this.tableSearchDate, this.charsItemSelect );
  }

  /*查询处理*/
  searchHandle() {
    this.currentPage = 1;
    this.getChartsData();
  }

  /*查询输入框change事件处理，将数据写入state*/
  taskChange( evt ) {
    this.setState( { taskName: evt.target.value } );
  }

  /*设置表格列显示*/
  getColumn() {
    let that = this;
    let tColumn = [  {
      title: '规则名称',
      key: 'ruleName'
    },{
      title: '稽核任务',
      key: 'taskName',
      render( text, item ) {
        return <a href="javascript:void(0);" onClick={that.enterDetail.bind(that,item)}>{text}</a>
      }
    }, {
      title: '稽核表',
      key: 'auditTable'
    }, {
      title: '稽核结果',
      key: 'result',
      render( text ){
        return <span style={{color:statusColorDic[text]}}>{statusFlagDic[text]}</span>;
      }
    } ];
    if ( that.isError ) {
      tColumn = tColumn.concat(
        [ {
          title: '问题描述',
          key: 'describle'
        },
          {
            title: '异常数',
            key: 'exceptionNum'
          },
          {
            title: '总条数',
            key: 'allNum'
          },
          {
            title: '异常率',
            key: 'exceptionRate'
          } ]
      )
    }
    return tColumn;
  }

  /*界面渲染*/
  render() {
    let column = this.getColumn();
    let countData = this.state.countData;
    return (
      <div>
        <div
          className="alert alert-info" role="alert"
          style={{marginBottom:"10px",marginTop:"10px",paddingLeft:"27px",fontSize:"14px",color:"#3e88ab"}}>
          该项目共运行{countData.alltask}个稽核任务，{countData.allrule}条稽核规则，运行错误{countData.errortask}个任务，{countData.errorrule}
          个错误和预警规则
        </div>
        <div className="module-search common-margin-tb" style={{height:"30px"}}>
          <button
            type="button" className="btn btn-sm btn-primary common-margin-left"
            style={{float:"right"}} onClick={this.searchHandle.bind(this)}>查询
          </button>
          <RestrictInput
            className="form-control common-input module-search-right"
            style={{marginLeft:"10px"}}
            placeholder="输入稽核表名"
            value={this.state.taskName}
            onChange={this.taskChange.bind(this)}></RestrictInput>
          <DateRange style={{float:"right"}} start={this.state.start} onSelect={this.handleDateSelect.bind(this)}/>
        </div>
        <div className="bdos-edit" style={{margin:"0px",padding:"20px"}}>
          <div ref="chars" style={{width:"100%",height:300}}></div>
        </div>

        <div className="bdos-table" style={{marginTop:"10px"}}>
          <DataTable
            data={this.state.tableData} showPage="true"
            column={column} howRow={this.pageSize}
            onPageChange={this.onPageChange.bind(this)}
          ></DataTable>
        </div>
      </div>
    )
  }
}
export default ReportList