/* *****************************************************************
 * autor qing.feng 2016-7-18
 * 用法：
 * <IconButton
 data-code="1020102" renderType="icon"
 type="plus-square" onClick={this.addHandler}
 isAuthBtn={false} //可以不写该属性，默认是需要设置权限的按钮
 disabled={disabledDelete}>新增</IconButton>
 * *********************************************************************/
import React from 'react';
import classnames from 'classnames'
import AuthButton from '../authbutton'
import Icon from 'bfd-ui/lib/Icon'

import './css/style.less'
class IconButton extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  renderAuthBtn( _props, btnClass ) {
    return (
      <AuthButton {..._props} className={btnClass}>
        {this.props.children}
      </AuthButton>
    );
  }

  renderBtn( _props, btnClass ) {
    return (
      <Icon {..._props} className={btnClass}>
        <span>{this.props.children}</span>
      </Icon>
    );
  }

  render() {
    const {className,..._props} = this.props;
    let btnClass = `bdos-icon-btn ${className}`;
    let needCheckAuthor = (this.props.hasOwnProperty( "isAuthBtn" ) && !_props.isAuthBtn) ? false : true;
    let btnRender = needCheckAuthor ? this.renderAuthBtn( _props, btnClass ) : this.renderBtn( _props, btnClass );
    return btnRender;
  }
}
export default IconButton