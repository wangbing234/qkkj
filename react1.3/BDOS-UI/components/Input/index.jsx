/***************************************************
 * 时间: 8/24/16 17:55
 * 作者: zhongxia
 * 说明: Input组件, 增加显示输入的功能
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'

class Input extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (this.props.onChange) {
      //设置了输入限制
      if (this.props.restrict) {
        let value = e.target.value;
        let flag = this.props.restrict.test(value);

        if (flag) {
          this.props.onChange(e);
        } else {
          e.target.value = this.filterChar(value);
        }
      }
      //没有设置限制
      else {
        this.props.onChange(e);
      }
    }
  }

  /**
   * 过滤非法字符串
   * @param value
   */
  filterChar(value) {
    let restrict = this.props.restrict;
    let str = "";
    for (let i = 0; i < value.length; i++) {
      if (restrict.test(value.charAt(i))) {
        str += value.charAt(i);
      }
    }
    return str;
  }

  render() {
    const {onChange,...other} = this.props;
    return (
      <input onChange={this.handleChange} {...other}/>
    );
  }
}

Input.propTypes = {
  type: PropTypes.string,
  restrict: PropTypes.object
}
Input.defaultProps = {
  type: 'text'
}

export default Input