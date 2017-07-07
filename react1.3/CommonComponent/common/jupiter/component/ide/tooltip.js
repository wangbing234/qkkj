import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import classNames from 'classnames'
import './tooltip.less'

class ToolTip extends React.Component {
  constructor(props) {
    super(props);
    const data = props.data || [];
    this.state = {
      index: 0,
      data: data,
      defaultData: data.slice(0),
      value: ''
    };
    this.menu;
    this.currentNode;
    let that = this;
    //右键菜单相关函数
    this.fnMenu = {
      //显示右键菜单
      showMenu: function (x, y) {
        that.menu.focus();
        that.menu.classList.add('show-menu');
      },
      //移除右键菜单
      hideMenu: function () {
        let _ToolTip = document.querySelector(`[data-id="__ToolTip__"]`)
        _ToolTip && _ToolTip.parentNode.removeChild(_ToolTip)

        that.menu && that.menu.parentNode && that.menu.parentNode.removeChild(that.menu);
      },
      //点击菜单, 或者随便点击一次, 隐藏菜单
      onClick: function (e) {
        e.target.classList.value = e.target.classList.value || "";
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

  componentWillUnmount() {
    //释放右键功能
    document.body.oncontextmenu = null;
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
    const key = e.key;  //在chrome48和之下的版本，key获取不到 具体键盘的值（上下左右,回车，回退，F1~F12可以）
    let keyValue = String.fromCharCode(e.keyCode) || "";
    keyValue = keyValue.toLowerCase();

    let tooltipDiv = e.target;
    const menus = this.state.data || [];
    let index = this.state.index || 0;
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      if (key === 'ArrowDown') {
        index++;
        index = index >= menus.length - 1 ? menus.length - 1 : index;

        //div滚动
        if (index * 20 >= tooltipDiv.offsetHeight) {
          tooltipDiv.scrollTop += 25;
        }
      }
      if (key === 'ArrowUp') {
        index = index - 1 < 0 ? 0 : index - 1;

        //div滚动
        if (index * 20 <= tooltipDiv.offsetHeight) {
          tooltipDiv.scrollTop -= 25;
        }
      }
      this.setState({index: index})
    }
    else if (key === 'ArrowLeft' || key === 'ArrowRight') {
      this.fnMenu.hideMenu();
      this.props.callback && this.props.callback("");
    }
    else if (key === 'Enter') {
      this.itemClick(menus[index] || this.state.value)
    }
    else if (/^\w$/i.test(keyValue) || key === 'Backspace') {
      let menus = [];
      let value = this.state.value;
      const data = this.state.defaultData;

      //删除过滤的字符,还是新增
      if (key === 'Backspace') {
        if (!value) {
          this.fnMenu.hideMenu();
          this.props.callback && this.props.callback("");
        }
        value = value.substr(0, value.length - 1);
      } else {
        value += keyValue;
      }
      //过滤数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].startsWith(value)) {
          menus.push(data[i]);
        }
      }

      this.setState({data: menus, value: value})
    }
  }

  /**
   * 渲染菜单
   * @returns {XML}
   */
  renderMenus() {
    let menus = this.state.data;
    let menuItems = menus.map((item, index)=> {
      let className = classNames('menu-item', {'menu-item': item.children, active: this.state.index === index})
      return (
        <li key={index} className={className} onClick={(e)=>{e.stopPropagation();this.itemClick(item);}}>
          <span type="button" className="menu-btn">
            <span className="menu-text" title={item}>{item}</span>
          </span>
        </li>
      )
    })
    return (
      <menu tabIndex={1} className="menu" onKeyDown={this.handleKeyDown.bind(this)}>
        <div className="bdos-ide-tooltip-filter">{this.state.value}</div>
        {menuItems}
      </menu>
    )
  }


  render() {
    return (
      <div style={this.props.style} className="bdos-ide-tooltip">
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

    //fix bug: 鼠标点击列表,导致插入的位置出问题(插入到输入点击的位置,应该是点击让ace获取焦点了)
    //let _ide = document.querySelector(selector);
    let _ide = document.querySelector('body');
    //移除
    let _ToolTip = document.querySelector(`[data-id="__ToolTip__"]`)
    _ToolTip && _ToolTip.parentNode.removeChild(_ToolTip)

    const container = document.createElement('div')
    container.setAttribute('data-id', "__ToolTip__")
    _ide.appendChild(container)
    _ide.focus();
    instance = render(<ToolTip style={{left:x,top:y}} callback={callback} data={data}/>, container)
    instance.fnMenu.showMenu();
    //添加点击事件, 隐藏按钮
    document.addEventListener('click', instance.fnMenu.onClick, false);
  },
  hide(){
    instance && instance.fnMenu.hideMenu();
  },
}
