import './index.less'

import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import classNames from 'classnames'
//公共权限方法
import Auth from '../../utils/Auth.js'

class RightMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.menu;
    this.currentNode;
    let that = this;
    //右键菜单相关函数
    this.fnMenu = {
      //显示右键菜单
      showMenu: function (x, y, param) {
        that.param = param;
        that.menu.style.left = x + 'px';
        that.menu.style.top = y + 'px';
        that.menu.classList.add('show-menu');
      },
      //移除右键菜单
      hideMenu: function () {
        //直接移除菜单
        that.menu && that.menu.parentNode && that.menu.parentNode.removeChild(that.menu);
        //隐藏菜单
        //that.menu.classList.remove('show-menu');
      },
      //点击菜单, 或者随便点击一次, 隐藏菜单
      onClick: function (e) {
        e.target.classList.value = e.target.classList.value || ""; //兼容性修改:有的浏览器classList的value会等于null
        if (e.target.classList.value.indexOf('show-menu') === -1) {
          e.stopPropagation();
          that.fnMenu.hideMenu();
          document.removeEventListener('click', that.fnMenu.onClick);
        }
      }
    }
    //右键菜单点击事件
    this.itemClick = function (item) {
      that.fnMenu.hideMenu();
      item.func && item.func(that.currentNode, that.param);
    }
  }

  componentDidMount() {
    this.menu = document.querySelector('.bdos-right-menu .menu');
    //阻止右键的默认功能
    document.body.oncontextmenu = function (e) {
      e.preventDefault();
      return false;
    }
  }

  /**
   * 渲染菜单
   * @returns {XML}
   */
  renderMenus() {
    let that = this;
    let menus = that.props.data;
    let menuItems = menus.map(function (item, index) {
      let subMenu = [];
      if (item.children && Array.isArray(item.children) && item.children.length !== 0) {
        subMenu = that.renderSubMenus(item.children);
      }
      let className = classNames('menu-item', {'menu-item': item.children})
      if (Auth.getAuthByCode(item.dataCode)) {
        return (
          <li key={index} className={className} disabled={item.disabled} onClick={(e)=>{that.itemClick(item)}}>
          <span type="button" className="menu-btn">
            <span className="menu-text">{item.text}</span>
          </span>
            {subMenu}
          </li>
        )
      }
    })
    return (
      <menu className="menu">
        {menuItems}
      </menu>
    )
  }

  /**
   * 渲染二级菜单
   * @param subMenus
   * @returns {XML}
   */
  renderSubMenus(subMenus) {
    let htmlSubMenus = subMenus.map(function (item, index) {
      if (Auth.getAuthByCode(item.dataCode)) {
        return (
          <li key={index} className="menu-item">
          <span type="button" className="menu-btn" onClick={item.func?item.func:(e)=>{}}>
            <span className="menu-text">{item.text}</span>
          </span>
          </li>
        )
      }
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

//作用: 创建一个RightMenu的实例, 外部使用提示信息,只需要使用调用方法的形式来调用该组件
let instance

export default {
  show(config, param){
    let data = config.data || []
    let x = config.x
    let y = config.y
    if (data.length > 0) {
      //移除
      let _rightMenu = document.querySelector('[data-id="__rightMenu__"]')
      _rightMenu && _rightMenu.parentNode.removeChild(_rightMenu)
      const container = document.createElement('div')
      container.setAttribute('data-id', "__rightMenu__")
      document.body.appendChild(container)
      instance = render(<RightMenu data={data}/>, container)

      instance.fnMenu.showMenu(x, y, param);
      //添加点击事件, 隐藏按钮
      document.addEventListener('click', instance.fnMenu.onClick, false);
    }
  },
  hide()
  {
    instance && instance.fnMenu.hideMenu();
  }

}


