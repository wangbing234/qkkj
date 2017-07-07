import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import classNames from 'classnames'
import './tooltip.less'

class ToolTip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
    this.menu;
    this.currentNode;
    let that = this;
    //右键菜单相关函数
    this.fnMenu = {
      //显示右键菜单
      showMenu: function (x, y) {
        that.menu.focus();
        that.menu.style.left = x + 'px';
        that.menu.style.top = y + 'px';
        that.menu.classList.add('show-menu');
      },
      //移除右键菜单
      hideMenu: function () {
        that.menu && that.menu.parentNode && that.menu.parentNode.removeChild(that.menu);
      },
      //点击菜单, 或者随便点击一次, 隐藏菜单
      onClick: function (e) {
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
      that.props.callback && that.props.callback(item);
    }
  }

  componentDidMount() {
    this.menu = document.querySelector('.bdos-ide-tooltip .menu');
    //阻止右键的默认功能
    document.body.oncontextmenu = function (e) {
      e.preventDefault();
      return false;
    }
  }

  /**
   * 判断对象是否为数组
   * @param obj
   * @returns {boolean}
   */
  isArray(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  }

  /**
   * 键盘事件
   */
  handleKeyDown(e) {
    e.preventDefault();
    const key = e.key;
    const menus = this.props.data || [];
    let index = this.state.index || 0;
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      if (key === 'ArrowDown') {
        index = (index + 1) % menus.length;
      }
      if (key === 'ArrowUp') {
        index = index - 1 < 0 ? 0 : index - 1;
      }
      this.setState({index: index})
    }
    if (key === 'Enter') {
      this.itemClick(menus[index])
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
      let className = classNames('menu-item', {'menu-item': item.children, active: that.state.index === index})
      return (
        <li key={index} className={className} onClick={()=>{that.itemClick(item)}}>
          <span type="button" className="menu-btn">
            <span className="menu-text">{item}</span>
          </span>
        </li>
      )
    })
    return (
      <menu tabIndex={1} className="menu" onKeyDown={this.handleKeyDown.bind(this)}>
        {menuItems}
      </menu>
    )
  }


  render() {
    return (
      <div className="bdos-ide-tooltip">
        {this.renderMenus()}
      </div>
    );
  }
}

ToolTip.propTypes = {
  data: React.PropTypes.array
};

ToolTip.defaultProps = {
  data: []
};

//作用: 创建一个ToolTip的实例, 外部使用提示信息,只需要使用调用方法的形式来调用该组件
let instance;

export default {
  show(config){
    let selector = config.selector
    let data = config.data || []
    let x = config.x
    let y = config.y
    let callback = config.callback;

    let _ide = document.querySelector(selector);
    //移除
    let _ToolTip = document.querySelector(`[data-id="${selector}"]`)
    _ToolTip && _ToolTip.parentNode.removeChild(_ToolTip)
    const container = document.createElement('div')
    container.setAttribute('data-id', "__ToolTip__")
    _ide.appendChild(container)
    _ide.focus();
    instance = render(<ToolTip callback={callback} data={data}/>, container)
    instance.fnMenu.showMenu(x, y);
    //添加点击事件, 隐藏按钮
    document.addEventListener('click', instance.fnMenu.onClick, false);
  },
  hide()
  {
    instance && instance.fnMenu.hideMenu();
  },
}
