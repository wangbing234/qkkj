import React, { PropTypes } from 'react'
import classNames from 'classnames'
import TreeSelect from 'Base/TreeSelect'
import Tree from 'bfd-ui/lib/Tree'
import BfdRequest from 'CommonComponent/request/AjaxRequest'
import Util from 'CommonComponent/utils/CommonUtil'

const Demo = React.createClass({
  getInitialState(){
    return {
      value: 111,
      data: [{
        id: 1,
        name: '数据工厂',
        open: true,
        children: [{
          id: 11,
          name: 'adsdsd123123123123123123123'
        }, {
          id: 12,
          name: 'ioiod123123123123123123123'
        }, {
          id: 13,
          name: 'tutrutd123123123123123123123',
          children: [{
            id: 131,
            name: 'dasdd123123123123123123123'
          }]
        }]
      }, {
        id: 2,
        name: '配置中心',
      }, {
        id: 3,
        name: '配置中心2',
        children: [{
          id: 31,
          name: 'dsads'
        }]
      }]
    }

  },
  componentDidMount(){
    let url = `${window.Server.dataFactory}ide/task/mrFiles`;
    return BfdRequest.ajaxPost(url, {}, (result)=> {
      let data = result.data || {};
      let treeData = this.modifyMrTreeData(data.mrFileList)
      this.setState({mrTreeSelectData: treeData, path: data.path})
    }, null, false)
  },

  /**
   * 修改下Mr程序的下拉树数据
   */
  modifyMrTreeData(data) {
    return data && data.map(item=> {
        if (item.type === 1) {
          item.isParent = true;
        }
        return item;
      })
  },

  /**
   * 动态加载树节点,处理数据格式
   * @param result 返回的结果
   */
  filterTreeData(result) {
    if (result.data.mrFileList && result.data.mrFileList.length > 0) {
      this.setState({path: result.data.path})
      result.data.mrFileList.map((item)=> {
        if (item.type === 1) {
          item.isParent = true;
        }
      })
      return result.data.mrFileList;
    }
  },

  /**
   * 表单值绑定到state上
   * @param name 字段名
   * @param event 事件对象
   */
  handleChange(name, event) {
    let newState = {};
    //针对 多选框, 文本框
    if (event && event.target) {
      switch (event.target.type) {
        case "number":
          newState[name] = parseInt(event.target.value) || 0;
          break;
        case "checkbox":
          newState[name] = event.target.checked;
          break;
        default:
          newState[name] = event.target.value;
      }
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    this.setState(newState);
  },
  treeChange(data){
    //this.state.mrTreeSelectData = data;
    this.setState({mrTreeSelectData: data})
  }
  ,
  render(){

    return (
      <div>
        <TreeSelect
          placeholder="请选择目录"
          onChange={this.handleChange.bind(this,'value')}
          value={this.state.value}
          data={this.state.data}/>

        <TreeSelect
          value={this.state.proPath}
          valueField="fullName"
          defaultValue="DEMO"
          data={this.state.mrTreeSelectData||[]}
          dataFilter={this.filterTreeData}
          onTreeChange={this.treeChange}
          getUrl={item=>`${window.Server.dataFactory}ide/task/mrFiles?path=` + item.fullName}
          onChange={this.handleChange.bind(this,'proPath')}/>

      </div>
    )
  }
})

module.exports = Demo;