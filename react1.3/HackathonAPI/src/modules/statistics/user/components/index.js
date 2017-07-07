/***************************************************
 * 时间: 16/6/14 14:15
 * 作者: zhongxia
 * 说明: 数据资源管理[目前不需要做, 产品经理还没有确定]
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
//BFD-UI组件库
import DataTable from 'bfd-ui/lib/DataTable'
import Chart from './BFDChart'

import Model from 'model/statistics'

let that;
const columns = [
  {
    title: '用户名',
    key: 'idValue',
    width: '400px'
  }, {
    title: '访问总数',
    key: 'hiscount',
    render: function (text, item) {
      return (
        <a href="javascript:void(0);"
           onClick={that.goToChart.bind(that,item,true)}>{text}</a>
      )
    }
  }, {
    title: '当天访问数',
    key: 'dtcount',
    render: function (text, item) {
      return (
        <a href="javascript:void(0);"
           onClick={that.goToChart.bind(that,item,false)}>{text}</a>
      )
    }
  }, {
    title: '当前一小时访问数',
    key: 'hrcount'
  }
]

/**
 * 版本历史
 */
class UdfManage extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      tbData: {
        totalList: [],
        pageNum: 1,
        totalPageNum: 0
      },
      isChart: false   //是否为添加用户页面
    };
  }

  componentDidMount() {
    this.getTableData()
  }

  componentWillUnmount() {
    that = null
  }

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  /**
   * 获取表格数据
   * @param userName 用户名
   */
  getTableData(userName, pageNum) {
    let param = param || {}
    param.userName = userName;
    param.pageSize = that.state.pageSize;
    param.pageNum = pageNum || that.state.pageNum;

    Model.getUserStatistics(param, function (result) {
      that && that.setState({tbData: result.data})
    })
  }

  search() {
    that.getTableData(that.state.userName)
  }

  /**
   * 跳转到报图部分
   */
  goToChart(item, isDateRange) {
    console.log("isDateRange", isDateRange)
    //设置是 总访问量, 还是天访问量, 报图获取数据接口不一样
    item.dataType = isDateRange ? 0 : 1;
    console.log("isDateRange", isDateRange, item)
    that.setState({data: item, isChart: true, isDateRange: isDateRange})
  }

  /**
   * 表格翻页
   */
  onPageChange(pageNum) {
    that.setState({pageNum: pageNum})
    that.getTableData(that.state.userName, pageNum);
  }

  /**
   * 渲染表格列表
   * @returns {XML}
   */
  renderTable() {
    return (
      <div className="module-container" style={{display:this.props.display}}>
        <div className="module-search" style={{float:'right'}}>
          <input style={{float:'left'}}
                 className="form-control"
                 placeholder="请输入关键字"
                 value={this.state.userName}
                 onChange={this.handleChange.bind(this,'userName')}/>
          <button className="btn btn-sm btn-primary"
                  onClick={this.search}>查询
          </button>
        </div>
        <div className="module-table notOperatorCol" style={{marginTop:0}}>
          <DataTable column={columns} showPage="true" howRow={10}
                     onPageChange={that.onPageChange.bind(that)}
                     data={this.state.tbData}/>
        </div>
      </div>)
  }

  /**
   * 渲染报图
   * @returns {XML}
   */
  renderChart() {
    return (<Chart parent={that} data={that.state.data} isDateRange={that.state.isDateRange}/>)
  }


  render() {
    that = this;
    let jsx = that.renderTable();
    if (that.state.isChart) {
      jsx = that.renderChart()
    }
    return (
      <div>
        {jsx}
      </div>
    )
  }
}

export default UdfManage