/***************************************************
 * 时间: 8/8/16 15:53
 * 作者: zhongxia
 * 说明: 放在FormItem中使用,新增提示
 ***************************************************/
import React, { PropTypes } from 'react';
import classNames from 'classnames'

class RestrictInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * input输入时验证是否匹配限制输入的正则，
   * 如果匹配才进行更改value值，并回调父类处理方法
   * */
  handleChange(e) {
    let value = e.target.value;

    if (this.props.restrict && value) {
      let flag = this.props.restrict.test(value);

      if (flag) {
        this.props.onChange(e);
      } else {
        e.target.value = this.filterChar(value);
      }
    } else {
      this.props.onChange(e);
    }

    if (!value) {
      this.handleFocus();
    }

    let ct = this.context;
    ct.gridItem && ct.gridItem.validate(value);
  }

  /**
   * 过滤掉非法字符
   * @param value
   * @returns {string}
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

  handleFocus(evt) {
    let ct = this.context;
    if (ct.formItem) {
      ct.formItem.setState({error: ""});
    }
    if (this.props.onFocus) {
      this.props.onFocus(evt);
    }
    if (evt) {
      evt.preventDefault();
    }
  }

  handleBlur(evt) {
    let isSuccess = this.validate(evt.target.value);
    if (isSuccess && this.props.onBlur) {
      this.props.onBlur(evt);
    }
    if (evt) {
      evt.preventDefault();
    }
  }


  render() {
    let {onChange,className,onFocus,onBlur,...tprops} = this.props;
    return (<input
      className={classNames('input-group', className)} {...tprops}
      onChange={this.handleChange.bind(this)}
      onFocus={this.handleFocus.bind(this)}
      onBlur={this.handleBlur.bind(this)}/>);
  }
}

RestrictInput.contextTypes = {
  formItem: PropTypes.object,
  gridItem: PropTypes.object
}
export default RestrictInput
