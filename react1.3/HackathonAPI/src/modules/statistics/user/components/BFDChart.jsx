/***************************************************
 * 时间: 16/7/6 14:54
 * 作者: zhongxia
 * 说明: 使用BFD-UI的折线图进行做报图展示
 ***************************************************/

import React, { PropTypes } from 'react'
import classNames from 'classnames'
import  DatePicker,{ DateRange } from 'bfd-ui/lib/DatePicker'
import LineChart from 'bfd-ui/lib/LineChart'

import Model from 'model/statistics'


let that;

class BFDChart extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      startTime: prop.isDateRange ? new Date(new Date() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd") : new Date().format("yyyy-MM-dd"),
      endTime: new Date().format("yyyy-MM-dd"),
      isLoad: false, //加载报图数据是否结束
      isDateRange: prop.isDateRange,  //时间选择器类型, 范围, 还是单个时间
      dayCols: {dtcount: '访问次数'},
      hourCols: {hrcount: '访问次数'},
      user: 'jupiter',
      remark: prop.isDateRange ? '近一星期访问数' : '今天访问情况',
      title: prop.isDateRange ? '用户近一周访问情况' : '用户日访问情况',
      ...prop.data
    };
  }

  componentDidMount() {
    console.log("componentDidMount")
    that.getLineChart(that.state.startTime, that.state.endTime)
  }

  componentWillUnmount() {
    that = null;
  }

  /**
   * 获取报图数据
   * @param startTime
   * @param endTime
   */
  getLineChart(startTime, endTime) {
    if (that.state.dataType === 0) { //获取总访问量
      Model.getUserDayStatistics({
        startDt: startTime,
        endDt: endTime,
        userName: that.state.idValue
      }, function (result) {
        that.setState({isLoad: true, data: result.data})
      })
    }

    else if (that.state.dataType === 1) { //获取天访问量
      Model.getUserHourStatistics({
        dt: startTime,
        userName: that.state.idValue
      }, function (result) {
        that.setState({isLoad: true, data: result.data})
      })
    }
  }

  /**
   * 查询报图数据
   */
  search() {
    console.log("search")
    that.setState({isLoad: false})
    that.getLineChart(that.state.startTime, that.state.endTime)
  }

  /**
   * 跳转回列表页面
   */
  closePage() {
    that.props.parent && that.props.parent.setState({isChart: false})
  }

  handleSelect(start, end) {
    let startTime = start ? new Date(start).format("yyyy-MM-dd") : new Date().format("yyyy-MM-dd");
    let endTime = end ? new Date(end).format("yyyy-MM-dd") : new Date().format("yyyy-MM-dd");
    //let startTime = new Date(start).format("yyyy-MM-dd");
    //let endTime = new Date(end).format("yyyy-MM-dd");
    that.setState({startTime: startTime, endTime: endTime})
  }

  /**
   * 渲染报图
   */
  renderLineChart() {
    if (that.state.data && that.state.data.length > 0) {
      if (that.state.isDateRange) {
        return (
          <LineChart style={{height: '100%'}}
                     category="date"
                     cols={that.state.dayCols}
                     data={that.state.data}/>
        )
      } else {
        return (
          <LineChart style={{height: '100%'}}
                     category="hour"
                     cols={that.state.hourCols}
                     data={that.state.data}/>
        )
      }
    } else {
      return <div className="no-data">没有数据!</div>
    }
  }

  /**
   * 渲染时间选择器
   */
  renderDateTime() {
    console.log("that.state.isDateRange", that.state.isDateRange)
    if (that.state.isDateRange) {
      return (<DateRange start={that.state.startTime}
                         end={that.state.endTime} style={{marginLeft:20}}
                         onSelect={that.handleSelect}/>)
    } else {
      return (<DatePicker date={that.state.startTime} style={{marginLeft:20}} onSelect={that.handleSelect}/>)
    }
  }

  render() {
    that = this;
    const style = {
      center: {
        textAlign: 'center'
      }
    }
    return (
      <div className="module-container">
        <h2>{that.state.title}</h2>

        <h5 style={{marginLeft:20,marginBottom:35}}>用户: <a style={{marginLeft:10}}>{that.state.user}</a></h5>

        <div className="module-search">
          {that.renderDateTime()}
          <button style={{marginLeft:15}} className="btn btn-sm btn-primary"
                  onClick={that.search}>查询
          </button>
        </div>

        <div style={{height: 250,marginBottom:20}}>
          {that.renderLineChart()}
        </div>

        <div style={style.center}>
          <h4>{that.state.remark}</h4>
        </div>

        <div style={style.center}>
          <button type="button"
                  className="btn btn-sm btn-primary" onClick={that.closePage}>返回
          </button>
        </div>
      </div>
    );
  }
}

export default BFDChart

