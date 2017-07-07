import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Tabs from './Tabs'

/**
 * 内容节点
 */
const TabPanel = React.createClass({

  getInitialState() {
    return {
      index: this.context.tabs.state.panelCount
    }
  },

  componentWillMount() {
    this.context.tabs.state.panelCount++
  },

  componentWillUnmount() {
    this.context.tabs.state.panelCount--
  },

  render() {
    if (this.context.tabs.state.activeKey) {
      warning(this.props.activeKey, 'No `activeKey`')
    }
    let isActive
    if (this.props.activeKey) {
      isActive = this.props.activeKey === this.context.tabs.state.activeKey
    } else {
      isActive = this.state.index === this.context.tabs.state.activeIndex
    }
    if (isActive) {
      this.children = this.props.children
    }
    return (
      <div className={classNames('tab-panel', {active: isActive})}>
        {isActive ? this.props.children : this.children}
      </div>
    )
  }
})

TabPanel.contextTypes = {
  tabs: PropTypes.instanceOf(Tabs)
}

export default TabPanel