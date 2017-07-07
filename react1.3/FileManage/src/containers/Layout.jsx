import React from 'react'
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { Nav, NavItem } from 'bfd-ui/lib/Nav'
import BFDTabs from 'CommonComponent/component/tabs'
import SplitPane from 'CommonComponent/component/splitpane'

import Auth from 'CommonComponent/utils/Auth'

import ENUM from 'Commom/Enum'
import NavConfig from  'CommonComponent/config/menu/FileManage'

let tabs = [];
class Layout extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {}
    EventEmitter.subscribe(ENUM.EVENTNAME.ADDTAB, this.addTab)
  }

  componentDidMount() {
    this.props.history.pushState(null, '/filemanage/home')
    this.refs.itemInit && this.refs.itemInit.handleClick();
  }

  componentWillUnmount() {
    EventEmitter.remove(ENUM.EVENTNAME.ADDTAB)
  }

  /**
   * 添加选项卡
   * @param param
   */
  addTab(param) {
    let hashKey = param.href;
    let bfdTabs = this.refs.bfdTabs;
    let tabId = hashKey.split('?')[0]
    if (tabId && tabId != "/" && !bfdTabs.checkHasTheTab(tabId)) {
      tabs.push({panel: tabId, name: param.title});
    }
    bfdTabs.setState({tabs: tabs, currentKey: tabId});
  }

  menuClick(props, e) {
    if (e) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation();
      window.event ? window.event.returnValue = false : e.preventDefault();
    }

    let hashKey = props.href;
    let bfdTabs = this.refs.bfdTabs;
    if (hashKey && hashKey != "/" && !bfdTabs.checkHasTheTab(hashKey)) {
      tabs.push({panel: hashKey, name: props.title, icon: props.icon});
    }
    bfdTabs.setState({tabs: tabs, currentKey: hashKey});
  }

  /**
   * 关闭所有选项卡
   */
  closeAll() {
    tabs = [];
    this.refs.bfdTabs.closeAll();
  }

  /**
   * 左侧导航菜单
   * @return {[component]} [返回左侧的导航组件]
   */
  renderNav() {
    return Auth.getNavComp(NavConfig, this.menuClick.bind(this))
  }


  render() {
    let menu = this.renderNav();
    return (
      <div className="layout-main">
        <SplitPane style={{height:'100%'}}
                   showClose={true}
                   split="vertical"
                   minSize={150}
                   maxSize={200}
                   defaultSize={175}>
          <div className="layout-sidebar" style={{height:'100%'}}>
            {menu}
          </div>
          <div className="layout-content" style={{height:'100%'}}>
            <BFDTabs id="bfd-tab-style1" ref="bfdTabs"
                     tabChildren={this.props.children}
                     closeAll={this.closeAll.bind(this)}/>
          </div>
        </SplitPane>
      </div>
    )
  }
}

export default Layout

