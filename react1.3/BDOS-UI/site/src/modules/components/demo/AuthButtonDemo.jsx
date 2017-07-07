import React, { PropTypes } from 'react'
import classNames from 'classnames'
import AuthButton from 'Base/AuthButton'

let that;
class AuthButtonDemo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  componentWillUnmount() {
    that = null;
  }

  clickHandler() {
    alert('click')
  }

  render() {
    that = this;
    return (
      <div>
        <AuthButton data-code='btn1' renderType="a" href="javascript:void(0);"
                    onClick={that.clickHandler}>DEMO</AuthButton>
        <AuthButton data-code='btn2' renderType="icon" type="weixin" style={{margin:'0 10px'}}
                    onClick={that.clickHandler}>新建</AuthButton>
        <AuthButton data-code='btn3' renderType="option"
                    onClick={that.clickHandler}>DEMO</AuthButton>
      </div>
    );
  }
}

export default AuthButtonDemo