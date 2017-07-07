import React from 'react';
const FormFooter = React.createClass( {
  render(){
    let divClass = `${this.props.className}`;
    let btnClass = `btn btn-sm btn-primary ${this.props.btnClassName}`;
    let cancelClass = `btn btn-sm btn-default ${this.props.btnClassName}`;
    return (<div className={divClass} style={this.props.style}>
      <button type="button" className={btnClass} style={{...this.props.btnStyle,marginRight:10}}
              onClick={this.props.submitClick}>{this.props.submitLabel?this.props.submitLabel:"保存"}</button>
      <button type="button" className={cancelClass} style={this.props.btnStyle} onClick={this.props.cancelClick}>取消
      </button>
    </div>);
  }
} );
module.exports = FormFooter;