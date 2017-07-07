/***************************************************
 * 时间: 16/7/5 15:41
 * 作者: zhongxia
 * 说明: 搜索框组件
 * 设置的样式会设置到 SearchInput 里面的 div 上, 但是 任意 属性, 事件 可以直接绑定到 input 上
 使用方式: <SearchInput style={{width:200}} onChange={this.handleChange.bind(this,'search')}/>
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Icon from 'bfd-ui/lib/Icon'

let that;
class SearchInput extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  componentWillUnmount() {
    that = null;
  }

  render() {
    that = this;
    let {style,className,...other} = this.props;
    style = style || {};
    style.position = 'relative';
    return (
      <div className={classNames(className)} style={style}>
        <input type="search" className={classNames('form-control')} style={{paddingRight:25}} {...other} />
        <Icon type="search" style={{position:'absolute',right:10,top:7}}/>
      </div>
    );
  }
}

export default SearchInput