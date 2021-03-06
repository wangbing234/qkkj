/**
 * 时间: 16/4/26 15:57
 * 作者: zhongxia
 * 说明: 工具栏组件,节点可以拖拽到工作区间,并把拖拽的节点配置传递过去
 * 依赖: 基于Jquery [TODO:后期可能移除Jquery]
 */
import React from 'react'
import './css/toolbar.less'

let that;
class ToolBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    that = this;
  }

  componentDidMount() {
    this.initToolbar()
  }

  /**
   * 在render到DOM节点后，设置可以拖拽
   */
  initToolbar() {
    require.ensure(['./js/toolbar.js'], function (require) {
      const {Drag, hideOrShow, dragNode2Paper} = require('./js/toolbar.js')

      // 设置拖拽功能，以及工具栏缩收功能
      new Drag({bar: document.getElementById('_dlgTitle'), target: document.getElementById('_dlg')})
      hideOrShow()

      dragNode2Paper(that.props.paper, function (ev, data) {  //使用事件派发的方式
        window.EventEmitter.dispatch(that.props.dispatchEventName, {ev: ev, data: data})
      })
    })
  }

  /**
   * [耦合度更高,弃用]使用该方法,需要从父类传递 context 到子类这边
   * @param ev
   * @param data
   */
  createNode(ev, data) {
    let parent = that.context.parent;
    data.config = parent.getConfigByKeyAndValue(parent.props.config.node, 'id', data.id);
    parent.createNode(ev.layerX, ev.layerY, data);
  }

  /**
   * 渲染图元工具栏节点
   * @param group 分组对象
   * @param nodes 节点数组
   * @returns {*}
   */
  renderNodes(group, nodes) {
    nodes = nodes || []
    return nodes.map(function (node, index) {
      // 根据分组，把图元添加到相对应的位置
      if (group.id === node.rGroup) {
        return (
          <img key={index}
               draggable="true"
               src={node.tImage}
               alt={node.label}
               title={node.toolTip}
               data-id={node.id}/>
        )
      }
    })
  }

  /**
   * 渲染图元工具栏分组
   * @param config 图元工具栏的配置
   * @returns {Array}
   */
  renderToolBar(config) {
    const groups = config.group || []
    const nodes = config.node || []
    const that = this
    return groups.map(function (group, gIndex) {
      return (
        <div key={gIndex} className="dialog-group">
          <div className="dialog-group-title notSelect" data-show="1">
            <span>{group.label}</span>
            <span className="arrow"></span>
          </div>
          <div className="dialog-group-content">
            {that.renderNodes(group, nodes)}
          </div>
        </div>)
    })
  }

  /**
   * 渲染图元工具栏组件
   * @returns {XML}
   */
  render() {
    const {config, title} = this.props
    return (
      <div id="_dlg" className="bdos-dialog" onselectstart="return false">
        <div id="_dlgTitle" className="dialog-title notSelect">{title}</div>
        <div id="_dlgContent" className="dialog-content">
          {this.renderToolBar(config)}
        </div>
      </div>
    )
  }
}


ToolBar.propTypes = {
  dispatchEventName: React.PropTypes.string.isRequired,
}
ToolBar.defaultProps = {
  title: '工具栏',
  paper: 'paper',
  config: {
    groups: [],
    nodes: []
  }
}

export default ToolBar