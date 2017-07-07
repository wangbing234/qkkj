import React from 'react'
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router'
import { Nav, NavItem } from 'bfd-ui/lib/Nav'
//import SplitPane from 'CommonComponent/component/SplitPane'
import SplitPane from 'Base/SplitPane'

// components


class Layout extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {}
  }

  componentDidMount() {
    console.log("window.CurrentUser", window._currentUser)
  }

  /**
   * 左侧导航菜单
   * @return {[component]} [返回左侧的导航组件]
   */
  renderNav() {
    return (
      <Nav>
        <NavItem href="/home" icon="folder-open" title="首页"/>
        <NavItem href="/components" icon="folder-open" title="组件列表"/>
        <NavItem href="/log" icon="folder-open" title="更新日志"/>
      </Nav>
    )
  }

  render() {
    console.log("window.CurrentUser", window._currentUser)
    let menu = this.renderNav()
    return (
      <div className="layout-main">
        <SplitPane style={{height:'100%'}} showClose={true} split="vertical" maxSize={200} defaultSize={175}>
          <div className="layout-sidebar" style={{height:'100%'}}>
            {menu}
          </div>
          <div className="layout-content" style={{height:'100%'}}>
            {this.props.children}
          </div>
        </SplitPane>
      </div>
    )
  }
}

export default Layout
