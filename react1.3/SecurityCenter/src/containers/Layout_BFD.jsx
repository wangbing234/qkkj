import React from 'react'
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { Nav, NavItem } from 'bfd-ui/lib/Nav'
import BFDTabs from 'CommonComponent/component/tabs'
import SplitPane from 'CommonComponent/component/splitpane'
// components
import EventName from 'EventName'
import CommonUtil from 'CommonComponent/utils/CommonUtil'

import Auth from 'CommonComponent/utils/Auth'
// nav config
import {AdminNav,OwnerNav,UserNav} from  'CommonComponent/config/menu/SecurityCenter'

let tabs = [];
const Layout = React.createClass({
  getInitialState() {
    return {}
  },

  menuClick(props, evt) {
    let hashKey = props.href;
    console.log(hashKey, props)
    let bfdTabs = this.refs.bfdTabs;
    if (!(props.children && props.children.length > 0) && !bfdTabs.checkHasTheTab(hashKey)) {
      tabs.push({panel: hashKey, name: props.title, icon: props['data-icon']});
    }
    bfdTabs.setState({tabs: tabs, currentKey: hashKey});
    if (evt) evt.stopPropagation();
  },


  componentDidMount(){
    switch (window.BFD.userType) {
      case BFD.ENUM.UserType.SUPERADMIN: //超级管理员
      case BFD.ENUM.UserType.ADMIN: //管理员
        this.props.history.pushState(null, '/admin/tenant');
        this.refs.itemInitAdmin.handleClick();
        break;
      case BFD.ENUM.UserType.OWNER: //租户所有者
        this.props.history.pushState(null, '/owner/userManage/user');
        this.refs.itemInitOwner.handleClick();
        break;
      case BFD.ENUM.UserType.USER: //普通用户
        this.props.history.pushState(null, '/user/authority/myauthority');
        this.refs.itemInitUser.handleClick();
        break;
      default: //默认普通用户
        this.refs.itemInitUser.handleClick();
        break;
    }
  },
  /**
   * 关闭所有选项卡
   */
  closeAll() {
    tabs = [];
    this.refs.bfdTabs.closeAll();
  },
  /**
   * 渲染超级管理员下的左侧导航菜单
   * @return {[component]} [返回左侧的导航组件]
   */
  renderAdmin() {
    return Auth.getNavComp(AdminNav, this.menuClick)
  },

  /**
   * 渲染租户所有者下的左侧导航菜单
   * @return {[component]} [返回左侧的导航组件]
   */
  renderOwner(){
    return Auth.getNavComp(OwnerNav, this.menuClick)
  },

  /**
   * 渲染普通用户下的左侧导航菜单
   * @return {[component]} [返回左侧的导航组件]
   */
  renderUser(){
    return Auth.getNavComp(UserNav, this.menuClick)
  },
  ///**
  // * 渲染超级管理员下的左侧导航菜单
  // * @return {[component]} [返回左侧的导航组件]
  // */
  //renderAdmin() {
  //  return (
  //    <Nav onItemClick={this.menuClick}>
  //      <NavItem ref="itemInitAdmin" href="/admin/usermanage" icon="users" title="用户管理"/>
  //      <NavItem href="/admin/tenant" icon="cog" title="租户管理"/>
  //      <NavItem href="/admin/authority" icon="key" title="权限管理">
  //        <NavItem href="/admin/authority/datapolicy" title="数据策略" key="数据策略"/>
  //        <NavItem href="/admin/authority/authoritysp" title="权限审批" key="权限审批"/>
  //        <NavItem href="/admin/authority/list" title="查看权限" key="查看权限"/>
  //      </NavItem>
  //      <NavItem href="/admin/useraudit" icon="search-plus" title="用户审计">
  //        <NavItem href="/admin/useraudit/data" title="数据审计" key="数据审计"/>
  //        <NavItem href="/admin/useraudit/platform" title="平台审计" key="平台审计"/>
  //        {/*<NavItem href="/admin/useraudit/login" title="登录审计" key="登录审计"/>*/}
  //      </NavItem>
  //    </Nav>);
  //},
  ///**
  // * 渲染租户所有者下的左侧导航菜单
  // * @return {[component]} [返回左侧的导航组件]
  // */
  //renderOwner() {
  //  return (
  //    <Nav onItemClick={this.menuClick}>
  //      <NavItem href="/owner/userManage" icon="users" title="用户管理">
  //        <NavItem ref="itemInitOwner" href="/owner/userManage/user" title="用户" key="用户管理"/>
  //        <NavItem href="/owner/userManage/role" title="角色" key="角色管理"/>
  //      </NavItem>
  //
  //      <NavItem href="/owner/authority" icon="key" title="权限管理">
  //        <NavItem href="/owner/authority/datapolicy" title="数据策略" key="数据策略"/>
  //        <NavItem href="/owner/authority/myauthority" title="我的权限" key="我的权限"/>
  //        <NavItem href="/owner/authority/authoritysp" title="权限审批" key="权限审批"/>
  //        <NavItem href="/owner/authority/list" title="查看权限" key="查看权限"/>
  //      </NavItem>
  //
  //      <NavItem href="/admin/useraudit" icon="search-plus" title="用户审计">
  //        <NavItem href="/admin/useraudit/data" title="数据审计" key="数据审计"/>
  //        <NavItem href="/admin/useraudit/platform" title="平台审计" key="平台审计"/>
  //        {/*<NavItem href="/admin/useraudit/login" title="登录审计" key="登录审计"/>*/}
  //      </NavItem>
  //      {/*<NavItem href="/" icon="zoom-in" title="用户审计">
  //       <NavItem href="/owner/useraudit/data" title="数据审计" key="数据审计"/>
  //       <NavItem href="/owner/useraudit/platform" title="平台审计" key="平台审计"/>
  //       <NavItem href="/owner/useraudit/login" title="登录审计" key="登录审计"/>
  //       </NavItem>*/}
  //
  //      <NavItem href="/owner/tenant" icon="cog" title="租户管理">
  //        <NavItem href="/owner/tenant/tenantbaseinfo" title="基础信息" key="基础信息"/>
  //        {/* <NavItem href="/owner/tenant/tenantconfig" title="租户配置" key="租户配置"/>*/}
  //      </NavItem>
  //    </Nav>
  //  );
  //},
  ///**
  // * 渲染普通用户下的左侧导航菜单
  // * @return {[component]} [返回左侧的导航组件]
  // */
  //renderUser() {
  //  return (
  //    <Nav onItemClick={this.menuClick}>
  //      <NavItem href="/user/authority" icon="key" title="权限管理">
  //        <NavItem ref="itemInitUser" href="/user/authority/myauthority" title="我的权限" key="我的权限"/>
  //        <NavItem href="/user/authority/myapply" title="我的申请" key="我的申请"/>
  //      </NavItem>
  //    </Nav>);
  //},

  render() {
    let menu;
    let roleType = window.BFD.userType = CommonUtil.getCurrentUserType();
    switch (roleType) {
      case BFD.ENUM.UserType.SUPERADMIN: //超级管理员
      case BFD.ENUM.UserType.ADMIN:
        menu = this.renderAdmin();
        break;
      case BFD.ENUM.UserType.OWNER: //租户所有者
        menu = this.renderOwner();
        break;
      case BFD.ENUM.UserType.USER: //普通用户
        menu = this.renderUser();
        break;
      default: //默认普通用户
        menu = this.renderUser();
        break;
    }
    return (
      <div className="layout-main security-center">
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
                     closeAll={this.closeAll}/>
          </div>
        </SplitPane>
      </div>)
  }
});

module.exports = Layout;
