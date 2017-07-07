/***************************************************
 * 时间: 16/7/13 11:11
 * 作者: zhongxia
 * 说明: 左侧导航菜单组件
 * 做了权限控制, 权限根据后端返回, 没有权限的 标识, 采用 React 移除掉没有权限的导航
 ***************************************************/
import React from 'react'
import classNames from 'classnames'
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { Nav, NavItem } from 'bfd-ui/lib/Nav'

// components
import BFDTabs from 'CommonComponent/component/tabs'
import Auth from 'CommonComponent/utils/Auth'
import IconButton from 'CommonComponent/component/iconbutton'
import SplitPane from 'CommonComponent/component/splitpane'

import EventName from './EventName'
import NavConfig from  'CommonComponent/config/menu/dataFactory'

//import HomePage from '../modules/myworkbench/chartlist/components/HomePage'

let tabs = [];
class Layout extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
    this.addTab = this.addTab.bind(this);
    EventEmitter.subscribe(EventName.addTab, this.addTab)
  }

  componentDidMount() {
    let tabData = this.props.tabData;
    if (tabData) {
      this.refs[tabData.parentNodeRef].defaultOpen = true;
      this.refs[tabData.ref].handleClick();
      this.setState({...this.state});
    }
  }

  componentWillUnmount() {
    EventEmitter.remove(EventName.addTab)
  }

  /**
   * 使用事件添加选项卡
   * @param param
   */
  addTab(param) {
    event.stopPropagation();
    let hashKey = param.href;
    let bfdTabs = this.refs.bfdTabs;
    let tabId = hashKey.split('?')[0]
    if (tabId && tabId != "/" && !bfdTabs.checkHasTheTab(tabId)) {
      tabs.push({panel: tabId, name: param.title, icon: param.icon});
    }
    bfdTabs.setState({tabs: tabs, currentKey: tabId});
  }

  /**
   * 导航栏点击事件
   * @param props
   * @param evt
   */
  menuClick(props, evt) {
    window.showDefault = false;
    let hashKey = props.href;
    let bfdTabs = this.refs.bfdTabs;
    /*if (hashKey == "/myworkbench") {
      window.showDefault = true;
      this.setState({...this.state});
    } else */if (!(props.children && props.children.length > 0) && !bfdTabs.checkHasTheTab(hashKey)) {
      tabs.push({panel: hashKey, name: hashKey == "/myworkbench/chartlist"?window.projectName:props.title, icon: props['data-icon']});
      bfdTabs.setState({tabs: tabs, currentKey: hashKey});
    } else {
      bfdTabs.setState({currentKey: hashKey})
    }
    this.setState({...this.state});
    if (evt) {
      evt.stopPropagation();
    }
  }

  clearProject() {
    tabs = [];
    this.refs.bfdTabs.closeAll();
    this.props.returnProject();
  }

  /**
   * 关闭所有选项卡
   */
  closeAll() {
    tabs = [];
    this.refs.bfdTabs.closeAll();
  }

  /**
   * 根据配置文件生成菜单
   * @returns {XML}
   */
  renderNav() {
    //获取导航组件
    return Auth.getNavComp(NavConfig, this.menuClick.bind(this))
  }

  render() {
    //let defaultView = null;
    //if (window.showDefault) {
    //  defaultView = <HomePage history={this.props.history} menuClickFunc={this.menuClick.bind(this)}/>
    //}
    //let tabsShow = window.showDefault ? "none" : "inline-block";
    return (
      <div className="layout-main">
        <SplitPane style={{height:'100%'}}
                   showClose={true}
                   split="vertical"
                   minSize={150}
                   maxSize={200}
                   defaultSize={175}>
          <div className="layout-sidebar" style={{height:'100%'}}>
            {this.renderNav()}
          </div>
          <div className="layout-content" style={{height:'100%'}}>
            {/*defaultView*/}
            <BFDTabs id="bfd-tab-style1" ref="bfdTabs"
                     history={this.props.history}
                     closeAll={this.closeAll.bind(this)}
                     tabChildren={this.props.children}/>
            <IconButton
              className="exit-project-icon"
              isAuthBtn={false} type="sign-out"
              onClick={this.clearProject.bind(this)}
            >退出项目</IconButton>
          </div>
        </SplitPane>
      </div>)
  }
}

export default Layout
