/***************************************************
 * 时间: 8/24/16 17:55
 * 作者: zhongxia
 * 说明: Input组件, 增加显示输入的功能
 * 使用方式:
 * import Input from 'bdos-ui/lib/input'
 * //设置 restrict 属性即可    maxLength:最大长度
 * <Input restrict={/^$\d+/} onChange={this.handleChange.bind(this,'value')}/>
 ***************************************************/
import './style.less'
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

        if (!flag) {
          value = this.filterChar(value);

          //设置了最大长度
          if (this.props.maxLength) {
            value = value.substr(0, this.props.maxLength);
            console.log("value", value)
          }
          e.target.value = value;
        }
      }
      this.props.onChange(e);
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

  renderTextarea() {
    const {onChange,resizeType,className,...other} = this.props;
    let cls = ""
    if (resizeType === "h") {
      cls = "bdos-input__resize-h";
    } else if (resizeType === "v") {
      cls = "bdos-input__resize-v";
    }
    return (
      <textarea className={classNames(className,cls)}
                onChange={this.handleChange} {...other}></textarea>
    )
  }

  renderInput() {
    const {onChange,...other} = this.props;
    return (
      <input onChange={this.handleChange} {...other}/>
    );
  }

  render() {
    const {renderType} = this.props;
    if (renderType === "textarea") {
      return this.renderTextarea();
    } else {
      return this.renderInput();
    }
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