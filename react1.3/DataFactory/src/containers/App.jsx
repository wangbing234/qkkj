/***************************************************
 * 时间: 8/4/16 17:13
 * 作者: zhongxia
 * 说明: 项目容器
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Layout from './Layout'
import MyProject from '../modules/myproject/list/components'
import EventName from './EventName'
import Header from 'CommonComponent/component/header'
import CommonUtil from 'CommonComponent/utils/CommonUtil'

class App extends React.Component {
  constructor(prop) {
    super(prop);
    var that = this;
    EventEmitter.subscribe(EventName.enterHomePage, function (data) {
      that.setState({
        showHomePage: true,
        tabData:null
      })
    });
    EventEmitter.subscribe(EventName.returnProjectList, function (data) {
      that.setState({showHomePage: false})
    });
    EventEmitter.subscribe(EventName.enterTab, (data) => {
      that.setState({
        showHomePage: true,
        tabData:data
      })
    });

    this.state = {
      userType: BFD.ENUM.UserType.ADMIN,
      showHomePage: false
    }
  }

  /**
   * [生命周期] 组件渲染到DOM节点后
   */
  componentDidMount() {
    //禁用 delete键,页面后退
    //document.onkeydown = CommonUtil.forbidBackSpace;
  }

  /**
   * [生命周期] 组件卸载前
   */
  componentWillUnmount() {
    //document.onkeydown = null;
    EventEmitter.remove(EventName.enterHomePage)
    EventEmitter.remove(EventName.returnProjectList)
    EventEmitter.remove(EventName.enterTab)
  }

  handleChange(value) {
    this.setState({userType: value});
  }

  /**
   * 返回项目首页
   */
  returnToProject() {
    this.setState({showHomePage: false});
  }

  /**
   * 渲染项目首页
   * @returns {XML}
   */
  renderProject() {
    return (
      <div className="layout-container">
        <MyProject history={this.props.history}/>
      </div>
    )
  }

  /**
   * 渲染工作区间
   * @returns {XML}
   */
  renderWorkbench() {
    return (<div className="layout-container">
      <Header/>
      <Layout {...this.props}
        history={this.props.history}
        userType={this.state.userType}
        tabData={this.state.tabData}
        returnProject={this.returnToProject.bind(this)}/>
    </div>);
  }

  render() {
    let comp = this.renderProject();
    if (this.state.showHomePage) {
      comp = this.renderWorkbench();
    }
    return comp;
  }
}

App.propTypes = {
  name: PropTypes.string
}
App.defaultProps = {
  name: '基本信息'
}

export default App
