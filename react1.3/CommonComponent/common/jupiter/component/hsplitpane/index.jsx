/***************************************************
 * 时间: 9/18/16 15:58
 * 作者: zhongxia
 * 说明: 横向分栏组件,支持缩收左边的面板
 ***************************************************/
import './style.less';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Icon from 'bfd-ui/lib/Icon';
import Resizer from './Resizer';
import Pane from './Pane';

const ICONTYPE = {
  SHOW: 'angle-double-left',
  HIDE: 'angle-double-right'
}

const HIDESIZE = 20;

class index extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      show: true,
      size: prop.size
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.hideOrShowHandler = this.hideOrShowHandler.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  unFocus() {
    if (document.selection) {
      document.selection.empty();
    } else {
      window.getSelection().removeAllRanges();
    }
  }

  onMouseDown(event) {
    this.unFocus();
    const position = event.clientX;
    this.setState({
      active: true,
      position,
    });
  }

  onMouseMove(event) {
    if (this.state.active && this.props.allowResize) {
      this.unFocus();
      const ref = this.refs.pane1;
      if (ref) {
        const node = ReactDOM.findDOMNode(ref);

        if (node.getBoundingClientRect) {
          const width = node.getBoundingClientRect().width;
          const current = event.clientX;
          const size = width;
          const position = this.state.position;
          const newPosition = position - current;

          let maxSize = this.props.maxSize;
          if ((this.props.maxSize !== undefined) && (this.props.maxSize <= 0)) {
            const splPane = ReactDOM.findDOMNode(this.refs.hSplitPane);
            maxSize = splPane.getBoundingClientRect().width + this.props.maxSize;
          }

          let newSize = size - newPosition;

          if (newSize < this.props.minSize) {
            newSize = this.props.minSize;
          } else if ((this.props.maxSize !== undefined) && (newSize > maxSize)) {
            newSize = maxSize;
          } else {
            this.setState({
              position: current,
              resized: true,
            });
          }
          this.setState({size: newSize}, ()=> {
            if (this.props.onChange) {
              this.props.onChange(newSize);
            }
          });
        }
      }
    }
  }

  onMouseUp() {
    this.setState({
      active: false,
    });
  }

  /**
   * 隐藏/显示左侧面板
   */
  hideOrShowHandler() {
    let show = !this.state.show;
    let size = this.props.size;
    if (!show) size = HIDESIZE;
    this.setState({show: show, size: size})
  }

  /**
   * 渲染左侧面板
   */
  renderLeftPane() {
    const leftChildren = this.props.children[0];
    if (this.state.show) {
      return leftChildren;
    }
    else {
      return (
        <div className="bdos-hsp__hidePane"></div>
      )
    }
  }

  render() {
    const leftChildren = this.props.children[0];
    const rightChildren = this.props.children[1];
    return (
      <div ref="hSplitPane" className={classNames("bdos-hsp",this.props.className)}>
        <Pane ref="pane1" className="bdos-hsp__left" size={this.state.size}>
          <Icon className="bdos-hsp__icon"
                type={this.state.show?ICONTYPE.SHOW:ICONTYPE.HIDE}
                onClick={this.hideOrShowHandler}/>
          <div className="bdos-hsp__left-main"
               style={{display:this.state.show?'block':'none'}}>{leftChildren}</div>
          <div style={{display:this.state.show?'none':'block'}} className="bdos-hsp__hidePane"></div>
        </Pane>
        <Resizer ref="resizer" onMouseDown={this.onMouseDown} allowResize={this.props.allowResize}/>
        <Pane ref="pane2" className="bdos-hsp__right">{rightChildren}</Pane>
      </div>
    );
  }
}

index.propTypes = {
  size: PropTypes.number,
  allowResize: PropTypes.bool
}
index.defaultProps = {
  size: 185,
  allowResize: true
}

export default index