/***************************************************
 * 时间: 8/11/16 18:25
 * 作者: zhongxia
 * 说明: 分隔组件,两个面板之间的分割线,以及应该按钮
 *
 ***************************************************/
import React, { Component, PropTypes } from 'react';
import Icon from 'bfd-ui/lib/Icon'

class Resizer extends Component {
  constructor(...args) {
    super(...args);
    this.state = {}

    this.onMouseDown = this.onMouseDown.bind(this);
  }

  onMouseDown(event) {
    this.props.onMouseDown(event);
  }

  render() {
    const { split, className,allowResize } = this.props;
    const classes = ['bdos-hsp__resizer', split, className];

    let style = {};
    if (allowResize) {
      style.cursor = 'ew-resize';
    }

    return (
      <span className={classes.join(' ')} style={style} onMouseDown={this.onMouseDown}>
      </span>
    );
  }
}

Resizer.propTypes = {
  //className: PropTypes.string.isRequired,
};

export default Resizer;
