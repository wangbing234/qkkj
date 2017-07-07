/**
 * 时间: 16/4/26 15:51
 * 作者: zhongxia
 * 说明: 右键菜单组件,目前支持二级菜单
 * 依赖: Jquery [TODO:后期可能移除Jquery依赖]
 * 使用方式:
 * import RightMenu from '../rightmenu'   //路径根据需要变动
 * <RightMenu data={menus}/>
 *
 * data属性格式: text:右键菜单显示名称, func:处理的方法名, children:子节点
 * let menus = [
 {
     text: '打开',
     func: function (node) {node.model.attributes.label = 'zhongxia'}
 },
 {
     text: '保存',
     children: [
         {text: '复制',func: function (node) {console.log('复制', node);}}
     ]
 },
 {text: '删除'}
 ]
 *
 */

import React from 'react'
import './css/menu.less'

const SHOWRIGHTMENU = "paper_showRightMenu";

class RightMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.menu;
    this.currentNode;
    this.allowArea = this.props.allowArea || "rect";
    let that = this;
    this.fnMenu = {
      showMenu: function (x, y) {
        that.menu.style.left = x + 'px';
        that.menu.style.top = y + 'px';
        that.menu.classList.add('show-menu');
      },
      hideMenu: function () {
        that.menu.classList.remove('show-menu');
      },
      onClick: function (e) {
        that.fnMenu.hideMenu();
        document.removeEventListener('click', that.fnMenu.onClick);
      }
    }
    this.itemClick = function (item) {
      item.func && item.func(that.currentNode);
    }
    EventEmitter.subscribe(SHOWRIGHTMENU, function (data) {
      that.fnMenu.showMenu(data.x, data.y);
      that.currentNode = data.ev;
      document.addEventListener('click', that.fnMenu.onClick, false);
    });
  }

  componentDidMount() {
    this.menu = document.querySelector('.bdos-right-menu .menu');
    $(document).off('contextmenu');
    $(document).on('contextmenu', function (e) {
      e.preventDefault();
      return false;
    });
  }

  /**
   * 判断对象是否为数组
   * @param obj
   * @returns {boolean}
   */
  isArray(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  }

  renderMenus() {
    let that = this;
    let menus = that.props.data;
    let menuItems = menus.map(function (item, index) {
      let subMenu = [];
      if (item.children && that.isArray(item.children) && item.children.length !== 0) {
        subMenu = that.renderSubMenus(item.children);
      }
      let className = item.children ? "menu-item submenu" : "menu-item";
      return (
        <li key={index} className={className}>
                    <span type="button" className="menu-btn" onClick={(e)=>{that.itemClick(item)}}>
                        <i className="fa fa-folder-open"></i>
                        <span className="menu-text">{item.text}</span>
                    </span>
          {subMenu}
        </li>
      )
    })
    return (
      <menu className="menu">
        {menuItems}
      </menu>
    )
  }

  renderSubMenus(subMenus) {
    let that = this;
    let htmlSubMenus = subMenus.map(function (item, index) {
      return (
        <li key={index} className="menu-item">
                    <span type="button" className="menu-btn" onClick={item.func?item.func:(e)=>{}}>
                        <i className="fa fa-folder-open"></i>
                        <span className="menu-text">{item.text}</span>
                    </span>
        </li>
      )
    })
    return (
      <menu className="menu">
        {htmlSubMenus}
      </menu>
    )
  }

  render() {
    return (
      <div className="bdos-right-menu">
        {this.renderMenus()}
      </div>
    );
  }
}

RightMenu.propTypes = {
  data: React.PropTypes.array
};

RightMenu.defaultProps = {
  data: []
};

export default RightMenu;