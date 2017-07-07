/***************************************************
 * 时间: 16/6/1 10:37
 * 作者: zhongxia
 * 说明: 表单分类项
 ***************************************************/
import React,{ PropTypes } from 'react'

class FormCategoryItem extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  render() {
    const {children,name,showSeparator ,...other} = this.props;
    let hr = showSeparator ? <div className="hr"></div> : '';
    return (
      <div className="form-category-type" {...other}>
        <div className="form-category-type-title">
          <div className="circle">
            <div className="circle_min"></div>
          </div>
          <div className="type-name">{name}</div>
          {hr}
        </div>
        <div className="form-category-content">
          {children}
        </div>
      </div>
    );
  }
}

FormCategoryItem.propTypes = {
  name: PropTypes.string
}
FormCategoryItem.defaultProps = {
  name: '',
  showSeparator: true  //是否显示分隔符
}

export default FormCategoryItem