/***************************************************
 * 时间: 16/5/31 16:38
 * 作者: zhongxia
 * 说明: 表单进行分类组件[针对1.3 最新UI设计 而编写的组件]
 * 1. 表单分类组件容器, 用于 包裹 FormCategoryItem 组件
 ***************************************************/
import React,{ PropTypes } from 'react'
import './FormCategory.less'
import FormCategoryItem from './FormCategoryItem'

class FormCategory extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  render() {
    const {children} = this.props;
    let _children
    if (!children.length) {
      _children = React.cloneElement(children, {showSeparator: false});
    } else {
      _children = children.map(function (item, index) {
        if (index === 0) {
          return React.cloneElement(item, {showSeparator: false, key: index});
        }
        return item;
      })
    }
    return (
      <div className="form-category">
        {_children}
        {/*最后一项,不包含内容,只作用于 封闭小圆点*/}
        <FormCategoryItem showSeparator={false} style={{padding:0}}/>
      </div>
    );
  }
}

FormCategory.propTypes = {
  name: PropTypes.string
}
FormCategory.defaultProps = {
  name: '基本信息'
}

export default FormCategory