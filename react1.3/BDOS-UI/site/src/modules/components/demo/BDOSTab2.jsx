import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'Base/bdostabs'

export default React.createClass({

  getInitialState() {
    return {
      tabs: [{
        name: '新建页签A'
      }, {
        name: '新建页签B'
      }]
    }
  },

  handleClose(index) {
    const tabs = this.state.tabs
    tabs.splice(index, 1)
    this.setState({tabs, activeIndex: tabs.length - 1})
  },

  handleAdd(e) {
    e.preventDefault()
    const tabs = this.state.tabs
    tabs.push({
      name: '新建页签' + String.fromCharCode((67 + Math.random() * 24).toFixed(0))
    })
    this.setState({tabs, activeIndex: tabs.length - 1})
  },

  handleChange(activeIndex) {
    this.setState({activeIndex})
  },

  render() {
    return (
      <Tabs dynamic handleClose={this.handleClose} activeIndex={this.state.activeIndex}
            onChange={this.handleChange}>
        <TabList autoWidth={true}>
          {this.state.tabs.map((tab, i) => <Tab key={i}>{tab.name}</Tab>)}
          <li>
            <a href="" onClick={this.handleAdd}>+</a>
          </li>
        </TabList>
        {this.state.tabs.map((tab, i) => <TabPanel key={i}>{'我是' + tab.name}</TabPanel>)}
      </Tabs>
    )
  }
})