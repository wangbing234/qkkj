import React from 'react'
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { Nav, NavItem } from 'bfd-ui/lib/nav'

// components


const Layout = React.createClass({
  getInitialState() {
    return {}
  },
  /**
   * 渲染超级管理员下的左侧导航菜单
   * @return {[component]} [返回左侧的导航组件]
   */
  renderNav() {
    return (<Nav>
      <NavItem href="/main" icon="home" title="首页"/>
      <NavItem href="/editor" icon="cog" title="拖拽框架DEMO">
        <NavItem href="/editor/edit" title="可编辑"/>
        <NavItem href="/editor/onlyread" title="不可编辑"/>
      </NavItem>
      <NavItem href="/doc" icon="book" title="使用说明">
        <NavItem href="/module1/sub1" title="API1"/>
        <NavItem href="/module1/sub2" title="API2"/>
        <NavItem href="/module1/sub3" title="API3"/>
      </NavItem>
    </Nav>);
  },
  render() {
    let menu = this.renderNav();
    return (
      <div className="ant-layout-topaside">
        <div className="ant-layout-wrapper">
          <div className="ant-layout-container">

            <aside className="ant-layout-sider">
              {menu}
            </aside>

            <div className="ant-layout-content" style={{height:600}}>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>)
  }
})

export default Layout
