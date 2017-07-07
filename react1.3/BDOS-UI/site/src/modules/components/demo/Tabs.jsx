import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Tabs, TabList, Tab, TabPanel } from 'Base/Tabs'
import IDE from 'Base/IDE'

//import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'

export default React.createClass({

  getInitialState() {
    let uuid = this.generatorUUID();
    return {
      activeKey: uuid,
      tabs: [{
        name: '新建页签A',
        tabChildren: <IDE></IDE>,
        uuid: uuid
      }, {
        name: '新建页签B',
        tabChildren: <IDE></IDE>,
        uuid: this.generatorUUID()
      }]
    }
  },

  /**
   * 生成UUID
   * @param len 指定生成项的长度
   * @param radix 范围  比如设置 2 , 就只会生成 0101010之类的
   * @returns {string}
   */
  generatorUUID(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  },
  handleClose(index, key) {
    let newState = {};
    let tabs = this.state.tabs;
    newState.tabs = tabs.filter((tab)=> {
      return tab.uuid !== key;
    })
    let uuid = newState.tabs.length > 0 && newState.tabs[newState.tabs.length - 1].uuid;
    if (uuid) newState.activeKey = uuid;

    this.setState(newState)

  },

  handleAdd(e) {
    e.preventDefault()
    const tabs = this.state.tabs
    tabs.push({
      name: '新建页签' + String.fromCharCode((67 + Math.random() * 24).toFixed(0)),
      tabChildren: <IDE></IDE>,
      uuid: this.generatorUUID()
    })
    this.setState({tabs, activeKey: tabs[tabs.length - 1].uuid})
  },

  handleChange(activeIndex, key) {
    console.info("activeIndex", activeIndex, key)
    this.setState({activeKey: key})
  },

  render() {
    const style = {
      float: 'left',
      height: 25,
      marginLeft: 18,
      border: '1px solid black',
      textAlign: 'center',
      cursor: 'pointer',
    }
    return (
      <Tabs dynamic
            handleClose={this.handleClose}
            activeKey={this.state.activeKey}
            onChange={this.handleChange}>
        <TabList>
          {this.state.tabs.map((tab, i) => <Tab activeKey={tab.uuid} key={tab.uuid}>{tab.name}</Tab>)}
          <li style={style} onClick={this.handleAdd}>
            添加
          </li>
        </TabList>
        {this.state.tabs.map((tab, i) => {
          return <TabPanel key={tab.uuid} activeKey={tab.uuid}>
            {tab.tabChildren}
          </TabPanel>
        })}
      </Tabs>
    )
  }
})
