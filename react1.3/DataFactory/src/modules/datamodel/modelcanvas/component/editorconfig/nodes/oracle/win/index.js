/***************************************************
 * 时间: 2016/7/20 14:31
 * 作者: bing.wang
 * 说明: oracle弹出主页面
 *
 ***************************************************/
import React from 'react'
import BaseWin from '../../common/BaseWin'
const Win = React.createClass({
  //初始化表单数据。
  getInitialState() {
    this.iDisabled=this.props.okButton=="1"?{disabled:true}:{};
    return {
      ...this.props.data
    }
  },

  /**
   * 基本的约束,外部写的组件,必须使用 getData 方法,否则框架获取不到数据
   * @returns {*}
   */
  getData() {
   let item= this.refs.baseWin.getData();
    return {
      tableInfo:{...item ,type:this.getTableType(item.tableType.toLowerCase())},
      tableType:item.tableType,
      edit:this.state.edit
    };
  },

  getTableType(tableType)
  {

    let type;
    if(tableType=="mysql")
    {
      type=3;
    }
    else if(tableType=="oracle") {
      type=4;
    }
    else {
      type=5;
    }
    return type;
  },

  vaildate()
  {
    return this.refs.baseWin.vaildate();
  },

  render() {
    let tableType=this.state.tableType;
    if(this.state.tableInfo)
      this.state.tableInfo.tableType=tableType;
    return (
      <BaseWin ref="baseWin"  viewType="rdbms" data={this.state.tableInfo}  iDisabled={this.iDisabled}/>
    );
  }
});

export default Win;