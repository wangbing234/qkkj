import './index.less'

import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs';
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import List from '../list'

import Icon from 'bfd-ui/lib/Icon'
let that;
let activeKey;
let tabPanels = {};
class BFDTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
      showTool: false
    };
  }

  /**
   * 设置当前激活状态的key值
   * */
  findActiveKey() {
    this.state.tabs.map((tab, i) => {
      if (tab.panel === this.state.currentKey) {
        activeKey = i;
        this.tabCangeHandle(activeKey)
      }
    })
  }

  /**
   * 检查是否存在匹配的tab页
   * */
  checkHasTheTab(tabId) {
    return tabPanels[tabId] ? true : false;
  }

  /**
   * 关闭所有
   * */
  closeAll() {
    delete that.state.currentKey;
    tabPanels = {};
    this.setState({tabs: []})
  }

  /**
   * tab页标签关闭处理
   * */
  handleClose(index, key, evt) {
    //左侧关闭工具栏的事件
    evt && evt.stopPropagation();
    this.refs.refTool && this.refs.refTool.close();

    let tabs = this.state.tabs;
    tabs.filter((item, i)=> {
      if (i == index) {
        delete that.state.currentKey;
        delete tabPanels[item.panel];
        tabs.splice(i, 1);
      }
    });
    if (activeKey == index) {
      activeKey = index == 0 ? 0 : index - 1;
    }
    if (index < activeKey) {
      activeKey--;
    }
    this.changeActive(key);  //去掉当前导航栏的选中状态

    this.tabCangeHandle(activeKey)
    this.setState({tabs: tabs})
  }

  /**
   * 设置tab修改后对应的active样式状态
   * */
  tabCangeHandle(index) {
    activeKey = index;
    let key = this.state.tabs && this.state.tabs[index] ? this.state.tabs[index].panel : null;
    this.changeActive(key);
  }

  /**
   * 移除导航栏的所有active状态
   */
  changeActive(key) {
    $('.bfd-nav').find('li').removeClass('active');
    if (key) {
      let naviLi = $('.bfd-nav').find('li');
      naviLi.map((index, item) => {
        let $item = $(item);
        //BUG修改:由于组件库修改, li 上没有啦 href 属性, 因此去获取 a 标签的 href
        let href = $item.find('a').attr('href');
        if (key && href.indexOf(key) !== -1) {
          $item.addClass('active');
        }
      });
    }
  }

  /**
   * 关闭所有项目
   */
  handleCloseAll() {
    this.props.closeAll && this.props.closeAll();
    this.changeActive();
  }

  /**
   * 跳转到指定选项卡
   */
  toTabHandle(item, index, evt) {
    evt && evt.stopPropagation();
    this.refs.refTool && this.refs.refTool.close();
    this.setState({currentKey: item.panel})
  }


  /**
   * 渲染选项卡的tool工具栏
   */
  renderTabClose(item, index) {
    return (
      <div style={{height:'100%',lineHeight:'25px',textOverflow: 'ellipsis',overflow: 'hidden'}}>
        {item.name}
        <Icon type="times"
              onClick={this.handleClose.bind(this,index,null)}
              style={{float:'right',cursor:'pointer',lineHeight:'25px',marginRight:5}}>
        </Icon>
      </div>
    )
  }

  /**
   * 渲染选项卡关闭某一项,或者全部关闭的工具菜单
   * @returns {XML}
   */
  renderTool() {
    if (this.state.tabs.length > 0 && this.props.closeAll) {
      return (
        <li className="bdos-tabs-tool">
          <Dropdown ref="refTool">
            <DropdownToggle>
              <Icon style={{width:'100%',height:'100%',cursor:'pointer'}} type="caret-down"/>
            </DropdownToggle>
            <DropdownMenu>
              <List data={this.state.tabs}
                    onClick={this.toTabHandle.bind(this)}
                    render={this.renderTabClose.bind(this)}/>
              <div className="bdos-tabs-close-all" onClick={this.handleCloseAll.bind(this)}>关闭全部</div>
            </DropdownMenu>
          </Dropdown>
        </li>
      )
    }
  }

  render() {
    that = this;
    this.findActiveKey();

    if (this.state.currentKey) {
      //if (!tabPanels[this.state.currentKey]) {
      tabPanels[this.state.currentKey] = this.props.tabChildren;
      //}
    }
    let className = "tab-auto-width " + this.props.className
    return (<div {...this.props} className={className}>
      <Tabs dynamic
            activeIndex={activeKey}
            handleClose={this.handleClose.bind(this)}
            onChange={this.tabCangeHandle.bind(this)}>
        <TabList>
          {this.renderTool()}
          {this.state.tabs.map((tab, i) => {
            //内联样式, 针对 选项卡太多,自动缩收使用
            return <Tab key={i}><Icon style={{position:'absolute',lineHeight:'17px'}}
                                      type={tab.icon||''}/><TextOverflow>
              <div style={{padding:'0 10px 0 20px'}}>{tab.name}</div>
            </TextOverflow></Tab>
          })}
        </TabList>
        {this.state.tabs.map((tab, i) => {
          return <TabPanel key={i}>{tabPanels[tab.panel]}</TabPanel>
        })}
      </Tabs>
    </div>);
  }
}

export default BFDTabs;

