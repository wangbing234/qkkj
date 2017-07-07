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
    this.state = {
      hide: false
    }

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onMouseDown(event) {
    this.props.onMouseDown(event);
  }

  onClose(event) {
    this.setState({hide: !this.state.hide})
    this.props.onClose(event);
  }

  renderCloseBtn() {
    if (this.props.showClose) {
      let iconType = this.state.hide ? 'caret-right' : 'caret-left';
      return (<span className="Resizer-close" onClick={this.onClose}><Icon type={iconType}/></span>)
    }
  }

  render() {
    const { split, className } = this.props;
    const classes = ['Resizer', split, className];
    const style = {
      cursor: 'ns-resize'
    }
    if (split === "vertical") {
      style.cursor = 'ew-resize';
    }
    return (
      <span className={classes.join(' ')} style={style} onMouseDown={this.onMouseDown}>
        {this.renderCloseBtn()}
      </span>
    );
  }
}

Resizer.propTypes = {
  onMouseDown: PropTypes.func.isRequired,
  split: PropTypes.oneOf(['vertical', 'horizontal']),
  className: PropTypes.string.isRequired,
};

export default Resizer;
