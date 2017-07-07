import React from 'react'
import {Select, Option} from 'bfd-ui/lib/Select'
import RestrictInput from '../restrictinput'
import './style.less'


class LabelInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {value:""};
    }
    handleChange(select,evt){
        this.setState({value:evt.target.value});
        if(this.props.onChange){
            this.props.onChange(evt.target.value);
        }
    }
    render(){
        const comboboxConfig = this.props;
        let selectClass = `label-input ${comboboxConfig.className}`;
        let labelClass = `select-label ${comboboxConfig.labelClass}`;
        return (
            <div className={selectClass} style={comboboxConfig.style}>
                <span className={labelClass} style={comboboxConfig.labelStyle}>
                        <nobr>{comboboxConfig.label}</nobr>
                </span>
                <div className="labelSelect-select"  style={{...comboboxConfig.componentStyle}}>
                    <RestrictInput type="text" className="form-control"
                           value={this.state.value} restrict={comboboxConfig.restrict}
                           onChange={this.handleChange.bind(this,'value')}/>
                </div>
            </div>);
    }
}

export default LabelInput;