/***************************************************
 * 时间: 8/11/16 18:24
 * 作者: zhongxia
 * 说明: React布局组件, SplitPane组件
 ***************************************************/
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Pane from './Pane';
import Resizer from './Resizer';

class SplitPane extends Component {
  constructor(prop) {
    super(prop);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onClose = this.onClose.bind(this);

    this.state = {
      active: false,
      resized: false,
    };
  }

  componentDidMount() {
    this.setSize(this.props, this.state);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  componentWillReceiveProps(props) {
    this.setSize(props, this.state);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseDown(event) {
    if (this.props.allowResize && !this.props.size) {
      this.unFocus();
      const position = this.props.split === 'vertical' ? event.clientX : event.clientY;
      if (typeof this.props.onDragStarted === 'function') {
        this.props.onDragStarted();
      }
      this.setState({
        active: true,
        position,
      });
    }
  }

  onMouseMove(event) {
    if (this.props.allowResize && !this.props.size) {
      if (this.state.active) {
        this.unFocus();
        const isPrimaryFirst = this.props.primary === 'first';
        const ref = isPrimaryFirst ? this.refs.pane1 : this.refs.pane2;
        if (ref) {
          const node = ReactDOM.findDOMNode(ref);

          if (node.getBoundingClientRect) {
            const width = node.getBoundingClientRect().width;
            const height = node.getBoundingClientRect().height;
            const current = this.props.split === 'vertical' ? event.clientX : event.clientY;
            const size = this.props.split === 'vertical' ? width : height;
            const position = this.state.position;
            const newPosition = isPrimaryFirst ? (position - current) : (current - position);

            let maxSize = this.props.maxSize;
            if ((this.props.maxSize !== undefined) && (this.props.maxSize <= 0)) {
              const splPane = ReactDOM.findDOMNode(this.refs.splitPane);
              if (this.props.split === 'vertical') {
                maxSize = splPane.getBoundingClientRect().width + this.props.maxSize;
              } else {
                maxSize = splPane.getBoundingClientRect().height + this.props.maxSize;
              }
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

            if (this.props.onChange) {
              this.props.onChange(newSize);
            }
            this.setState({
              draggedSize: newSize,
            });

            ref.setState({
              size: newSize,
            });
          }
        }
      }
    }
  }

  onMouseUp() {
    if (this.props.allowResize && !this.props.size) {
      if (this.state.active) {
        if (typeof this.props.onDragFinished === 'function') {
          this.props.onDragFinished();
        }
        this.setState({
          active: false,
        });
      }
    }
  }

  setSize(props, state) {
    const ref = this.props.primary === 'first' ? this.refs.pane1 : this.refs.pane2;
    let newSize;
    if (ref) {
      newSize = props.size || (state && state.draggedSize)
      if (newSize === undefined) {
        newSize = props.defaultSize || props.minSize;
      }
      ref.setState({
        size: newSize,
      });
    }
  }

  onClose() {
    const ref = this.refs.pane1;
    ref.setState({hide: !ref.state.hide})
  }

  unFocus() {
    //移除选中的内容
    //if (document.selection) {
    //  document.selection.empty();
    //} else {
    //  window.getSelection && window.getSelection() && window.getSelection().removeAllRanges();
    //}
  }

  render() {
    const { split, allowResize,style } = this.props;
    let disabledClass = allowResize ? '' : 'disabled';

    const children = this.props.children;
    const classes = ['SplitPane', this.props.className, split, disabledClass];


    return (
      <div className={classes.join(' ')} style={style} ref="splitPane">
        <Pane ref="pane1" key="pane1" className="Pane1" split={split}>{children[0]}</Pane>
        <Resizer
          ref="resizer"
          key="resizer"
          className={disabledClass}
          onMouseDown={this.onMouseDown}
          onClose={this.onClose}
          showClose={this.props.showClose}
          split={split}
        />
        <Pane ref="pane2" key="pane2" className="Pane2" split={split}>{children[1]}</Pane>
      </div>
    );
  }
}

SplitPane.propTypes = {
  primary: PropTypes.oneOf(['first', 'second']),
  minSize: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  maxSize: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  defaultSize: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  size: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  showClose: PropTypes.bool,
  allowResize: PropTypes.bool,
  split: PropTypes.oneOf(['vertical', 'horizontal']),
  onDragStarted: PropTypes.func,
  onDragFinished: PropTypes.func,
  onChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

SplitPane.defaultProps = {
  split: 'vertical',
  minSize: 50,
  allowResize: true,
  primary: 'first',
};

export default SplitPane;
