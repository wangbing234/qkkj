import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Tabs from './Tabs'

const contextTypes = {
  tabs: PropTypes.instanceOf(Tabs)
}

/**
 * 选项卡自身节点
 */
const Tab = React.createClass({

  getInitialState() {
    return {
      index: this.context.tabs.state.tabCount
    }
  },

  componentWillMount() {
    this.context.tabs.state.tabCount++
  },

  componentWillUnmount() {
    this.context.tabs.state.tabCount--
  },

  handleClick(e) {
    e.preventDefault()
    const tabs = this.context.tabs
    tabs.setState({activeIndex: this.state.index})
    if (this.props.activeKey) {
      tabs.setState({activeKey: this.props.activeKey})
    }
    tabs.props.onChange && tabs.props.onChange(this.state.index, this.props.activeKey)
  },

  handleClose(e) {
    e.preventDefault()
    e.stopPropagation()
    const handleClose = this.context.tabs.props.handleClose
    handleClose && handleClose(this.state.index, this.props.activeKey)
  },

  render() {
    if (this.context.tabs.state.activeKey) {
      if (!this.props.activeKey) {
        throw new Error('既然 Tabs 采用 activeKey 方式，请给 Tab 组件 绑定 activeKey')
      }
    }
    let isActive
    if (this.props.activeKey) {
      isActive = this.props.activeKey === this.context.tabs.state.activeKey
    } else {
      isActive = this.state.index === this.context.tabs.state.activeIndex
    }
    const cxActive = classNames('bdos-tab', {'bdos-tab-current': isActive})
    return (
      <div className={cxActive}>
        <div className="bdos-tab-title" onClick={this.handleClick}>
          {this.props.children}
          {this.context.tabs.props.dynamic && !this.props.abolishClose ?
            <div className="bdos-tab-close" onClick={this.handleClose}></div> : ''}
        </div>

        {/*选项卡左右的弧度*/}
        <div className="bdos-tab-curves">
          <div className="bdos-tab-curves-left-shadow"></div>
          <div className="bdos-tab-curves-left-highlight"></div>
          <div className="bdos-tab-curves-left"></div>
          <div className="bdos-tab-curves-right-shadow"></div>
          <div className="bdos-tab-curves-right-highlight"></div>
          <div className="bdos-tab-curves-right"></div>
        </div>
      </div>
    )
  }
})

Tab.contextTypes = contextTypes

export default Tab