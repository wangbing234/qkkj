"use strict";
import React, { PropTypes } from 'react'
import classNames from 'classnames'

class FormItem extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }


  render() {
    const {label,required,tip,error,children,...other} = this.props;
    console.log(this.props)
    return (
      <div className="form-item">
        <div className="item-label">{required ? <span className="required">*</span> : ''}{label}</div>
        <div className="item-control">
          {children}
          <span className={classNames('tip',{'error':this.state.isError})}>{tip}</span>
        </div>
      </div>
    );
  }
}

FormItem.propTypes = {
  label: PropTypes.string,
  tip: PropTypes.string,
  error: PropTypes.string,
}
FormItem.defaultProps = {
  tip: '基本信息',
  error: '错误信息',
}

export default FormItem