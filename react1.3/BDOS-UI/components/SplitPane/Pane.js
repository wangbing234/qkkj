/***************************************************
 * 时间: 8/11/16 18:25
 * 作者: zhongxia
 * 说明: 面板组件
 ***************************************************/
import React, { Component, PropTypes } from 'react';

class Pane extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      hide: false
    };
  }

  render() {
    const split = this.props.split;
    const classes = ['Pane', split, this.props.className];

    const style = Object.assign({}, this.props.style || {}, {
      flex: 1
    });

    //隐藏
    if (!this.state.hide) {
      if (this.state.size !== undefined) {
        if (split === 'vertical') {
          style.width = this.state.size;
        } else {
          style.height = this.state.size;
          style.display = 'flex';
        }
        style.flex = 'none';
        style.borderSize = 1;
      }
    } else {
      style.width = 0;
      style.borderSize = 0;
      style.flex = 'none';
    }

    return (
      <div className={classes.join(' ')} style={style}>{this.props.children}</div>
    );
  }
}

Pane.propTypes = {
  split: PropTypes.oneOf(['vertical', 'horizontal']),
  className: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
};

export default Pane;
