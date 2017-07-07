import React from 'react'
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { Nav, NavItem } from 'bfd-ui/lib/nav'
import BFDTabs from 'CommonComponent/component/tabs'

import ENUM from 'commom/Enum'

let tabs = [];
class Layout extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {}
    EventEmitter.subscribe(ENUM.EVENTNAME.ADDTAB, this.addTab)
  }

  componentWillUnmount() {
    EventEmitter.remove(ENUM.EVENTNAME.ADDTAB)
  }

  /**
   * 添加选项卡
   * @param param
   */
  addTab(param, evt) {
    evt && evt.stopPropagation && evt.stopPropagation()
    let hashKey = param.href;
    let bfdTabs = this.refs.bfdTabs;
    let tabId = hashKey.split('?')[0]
    if (tabId && tabId != "/" && !bfdTabs.checkHasTheTab(tabId)) {
      tabs.push({panel: tabId, name: param.title, icon: param.icon});
    }
    bfdTabs.setState({tabs: tabs, currentKey: tabId});
  }

  menuClick(props, evt) {
    evt && evt.stopPropagation && evt.stopPropagation()
    if (props.subIcon) {
      let hashKey = props.href;
      let bfdTabs = this.refs.bfdTabs;
      if (hashKey && hashKey != "/" && !bfdTabs.checkHasTheTab(hashKey)) {
        tabs.push({panel: hashKey, name: props.title, icon: props.subIcon});
      }
      bfdTabs.setState({tabs: tabs, currentKey: hashKey});
    }
  }

  componentDidMount() {
    this.props.history.pushState(null, '/apimanager/mysql')
    this.refs.itemInit.handleClick();
  }

  /**
   * 左侧导航菜单
   * @return {[component]} [返回左侧的导航组件]
   */
  renderNav() {
    return (
      <Nav onItemClick={this.menuClick.bind(this)}>
        <NavItem href="/apimanager1" icon="desktop" title="API管理">
          <NavItem ref="itemInit" href="/apimanager/mysql" subIcon="desktop" title="mysql" key="mysql"/>
          <NavItem href="/apimanager/hbase" title="hbase" subIcon="desktop" key="hbase"/>
        </NavItem>

        <NavItem href="/usermanager1" icon="user" title="用户中心">
          <NavItem href="/usermanager/user" subIcon="user" title="用户" key="用户"/>
          <NavItem href="/usermanager/role" subIcon="user" title="角色" key="角色"/>
        </NavItem>

        <NavItem href="/apiservice/home" icon="dropbox" subIcon="dropbox" title="API服务" key="API服务"/>

        <NavItem href="/statistics1" icon="bar-chart" title="统计">
          <NavItem href="/statistics/api" title="API访问统计" subIcon="bar-chart" key="API访问统计"/>
          <NavItem href="/statistics/user" title="用户统计" subIcon="bar-chart" key="用户统计"/>
        </NavItem>

        <NavItem href="/resourceconfig/home" icon="cog" subIcon="cog" title="资源配置" key="资源配置"/>
      </Nav>
    );
  }


  render() {
    let menu = this.renderNav();
    let children = this.props.children || []
    return (
      <div className="layout-main">
        <div className="layout-sidebar">
          {menu}
        </div>
        <div className="layout-content">
          <BFDTabs id="bfd-tab-style1" ref="bfdTabs" tabChildren={children}/>
        </div>
      </div>
    )
  }
}

export default Layout

