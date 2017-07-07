import React from 'react'
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { Nav, NavItem } from 'bfd-ui/lib/Nav'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import BFDTabs from 'CommonComponent/component/tabs'
import SplitPane from 'CommonComponent/component/splitpane'
import EventName from 'EventName'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import Auth from 'CommonComponent/utils/Auth'
// nav config
import {AdminNav,OwnerNav,UserNav} from  'CommonComponent/config/menu/DataManager'


let tabs = [];
const Layout = React.createClass({
  getInitialState() {
    // 监听添加标签事件
    window.currentTenant = '';// 初始化租户Id为All
    EventEmitter.subscribe(EventName.addTab, this.addTab);
    return {}
  },
  componentWillUnmount() {
    EventEmitter.remove(EventName.addTab);
  },
  componentDidMount(){
    this.refs.itemInit.handleClick();
  },
  // 切换租户
  handleChange(dataField, evt) {
    let value = evt ? evt : ""; // 请选择选项为All选项
    this.setState({[dataField]: value});
    window.currentTenant = value;
    //发送事件
    EventEmitter.dispatch(EventName.CHANGE_TENANT, value);
    console.log([dataField] + ':' + value);
  },

  addTab(param){
    event.stopPropagation();
    let hashKey = param.href;
    let bfdTabs = this.refs.bfdTabs;
    let tabId = hashKey.split('?')[0]
    if (tabId && tabId != "/" && !bfdTabs.checkHasTheTab(tabId)) {
      tabs.push({panel: tabId, name: param.title, icon: param['data-icon']});
    }
    bfdTabs.setState({tabs: tabs, currentKey: tabId});
    let obj;
    if(param.tableName){
      obj = {tableName: param.tableName, table: param.table};
    } else if (param.projectCode){
      obj = {projectCode: param.projectCode};
    } else if (param.taskCode){
      obj = {taskCode:param.taskCode};
    }
    //改变路由
    this.props.history.pushState(obj, hashKey);
  },
  // 点击左侧导航
  menuClick(props, evt) {
    let hashKey = props.href;
    let bfdTabs = this.refs.bfdTabs;
    if (!(props.children && props.children.length > 0) && !bfdTabs.checkHasTheTab(hashKey)) {
      tabs.push({panel: hashKey, name: props.title, icon: props['data-icon']});
    }
    bfdTabs.setState({tabs: tabs, currentKey: hashKey});
    if (evt) evt.stopPropagation();
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

  renderTenantSelect(){
    return (
      <Select value={this.state.userType} style={{width:'160px',margin:'10px 15px'}}
              onChange={this.handleChange.bind(this,'userType')} defaultOption={<Option>请选择租户</Option>} searchable>
        {
          window.tenantArr.map(function (item, index) {
            return (<Option
              key={index}
              value={item.id}>{item.tenantName}</Option>);
          })
        }
      </Select>
    );
  },

  render() {
    let menu;
    let tenantSelect;
    /*SUPERADMIN: "0",// 超级管理员
      ADMIN: "1",// 管理员
      OWNER: "2",// 租户所有者
      USER:"3" //普通用户*/
    let roleType = window.BFD.userType = CommonUtil.getCurrentUserType();
    //window.BFD.userType = this.props.userType;
    switch (roleType) {
      case BFD.ENUM.UserType.SUPERADMIN:
      case BFD.ENUM.UserType.ADMIN: //超级管理员
        menu = this.renderAdmin();
        tenantSelect = this.renderTenantSelect();
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
      <div className="layout-main data-manager">
        <SplitPane style={{height:'100%'}}
                   showClose={true}
                   split="vertical"
                   minSize={200}
                   maxSize={200}
                   defaultSize={200}>
          {/*左侧切换租户下拉框和导航栏*/}
          <div className="layout-sidebar" style={{height:'100%'}}>
            {tenantSelect}
            {menu}
          </div>
          {/*右侧切换租户下拉框和导航栏*/}
          <div className="layout-content " style={{height:'100%'}}>
            <BFDTabs id="bfd-tab-style1" ref="bfdTabs"
                     tabChildren={this.props.children}
                     closeAll={this.closeAll}/>
          </div>
        </SplitPane>
      </div>)
  }
});

export default Layout;


