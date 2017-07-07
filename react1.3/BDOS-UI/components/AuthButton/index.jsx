/***************************************************
 * 时间: 16/7/12 14:39
 * 作者: zhongxia
 * 说明: 权限组件,用于控制按钮粒度的权限
 * 使用方式:
 * 1. 在 项目的入口文件 index.jsx , 同步Ajax请求权限数组, 然后保存在 window['__AUTHCODES__'] 变量里面
 * 2. 所有需要控制的按钮,替换成 该组件(只需要修改 标签名, 不需要改动其他相关属性)
 ***************************************************/
import './style.less'
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Icon from 'bfd-ui/lib/Icon'
import { Select, Option } from 'bfd-ui/lib/Select2'

class AuthButton extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  /**
   * 根据Code获取按钮是否有权限
   */
  getAuthByCode() {
    let code = this.props['data-code'];
    //在项目入口文件 index.jsx 会去获取 项目权限, 然后保存在变量中
    let authCodes = window['__AUTHCODES__'] && window['__AUTHCODES__'].btns || [];
    if (authCodes.indexOf(code) === -1)
      return true;
  }

  /**
   * 渲染按钮
   * @returns {XML}
   */
  renderButton() {
    return (
      <button {...this.props}>
        {this.props.children}
      </button>
    )
  }

  /**
   * 渲染超链接
   * @returns {XML}
   */
  renderA() {
    return (
      <a {...this.props}>
        {this.props.children}
      </a>
    )
  }

  /**
   * 渲染字体图标
   */
  renderIcon() {
    const {className,...other} = this.props;
    return (
      <Icon className={classNames('auth-button-icon', className)} {...other}>
        <span>{this.props.children}</span>
      </Icon>
    )
  }

  /**
   * 渲染下拉列表
   */
  renderOption() {
    return (
      <Option {...this.props}>
        {this.props.children}
      </Option>
    )
  }

  /**
   * 渲染图片
   */
  renderImg() {
    return (
      <img {...this.props}>
        {this.props.children}
      </img>
    )
  }


  render() {
    if (this.getAuthByCode()) {
      let jsx = this.renderButton();
      switch (this.props.renderType) {
        case "button":
          jsx = this.renderButton();
          break;
        case "a":
          jsx = this.renderA();
          break;
        case "icon":
          jsx = this.renderIcon();
          break;
        case "option":
          jsx = this.renderOption();
          break;
        case "img":
          jsx = this.renderImg();
      }
      return jsx;
    } else {
      return <span></span>;
    }
  }
}

export default AuthButton