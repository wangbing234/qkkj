import React from 'react';

class StepsFooter extends React.Component {
    render(){
        let divClass = `${this.props.className}`;
        let currentStep = this.props.currentStep;
        let totalSteps = this.props.totalSteps;
        let needSubmitBtn = this.props.needSubmitBtn;
        let footer;
        let submitBtn;
        if(needSubmitBtn){
            submitBtn = <button className="btn btn-primary" style={{marginRight:10}} onClick={this.props.submitClick}>{this.props.submitLabel?this.props.submitLabel:"提交"}</button>;
        }
        if (currentStep == 0){
                footer = <div className={divClass} style={this.props.style}>
                    <button className="btn btn-primary" style={{marginRight:10,width:100}} onClick={this.props.nextClick}>下一步</button>
                    {submitBtn}
                    <button className="btn btn-default" onClick={this.props.cancelClick}>取消</button>
                </div>;
        }else if(currentStep > 0 && currentStep < totalSteps-1){
            footer = <div className={divClass} style={this.props.style}>
                <button className="btn btn-primary" style={{marginRight:10,width:100}} onClick={this.props.preClick}>上一步</button>
                <button className="btn btn-primary" style={{marginRight:10,width:100}} onClick={this.props.nextClick}>下一步</button>
                {submitBtn}
                <button className="btn btn-default" onClick={this.props.cancelClick}>取消</button>
            </div>;
        }else{
            footer = <div className={divClass} style={this.props.style}>
                <button className="btn btn-primary" style={{marginRight:10,width:100}} onClick={this.props.preClick}>上一步</button>
                <button className="btn btn-primary" style={{marginRight:10}} onClick={this.props.submitClick}>
                    {this.props.submitLabel?this.props.submitLabel:"提交"}</button>
                <button className="btn btn-default" onClick={this.props.cancelClick}>取消</button>
            </div>;
        }
        return (footer);
    }
}

export default StepsFooter;
