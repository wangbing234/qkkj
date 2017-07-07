import React from 'react';
const FormFooter = React.createClass({
    render(){
        let divClass = `row text-center ${this.props.className}`;
        let btnClassName = `${this.props.btnClassName||"btn btn-primary"}`;
        return (<div className={divClass} style={this.props.style}>
            <button className={btnClassName}  type="submit" style={{marginRight:10}} onClick={this.props.submitClick}>
                {this.props.okText?this.props.okText:"确定"}</button>
            <button className="btn btn-sm btn-default" onClick={this.props.cancelClick}>取消</button>
        </div>);
    }
});
export default FormFooter;