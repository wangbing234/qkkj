import React from 'react';
import InputNumber from '../inputnumber'
import './style.less'
class LabelInputNumber extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  handleChange( select, event ) {
    this.setState( { value: event.target.value } );
    if ( this.props.onChange ) {
      this.props.onChange( event.target.value );
    }
  }

  render() {
    const comboboxConfig = this.props;
    let selectClass = `label-input-number ${comboboxConfig.className}`;
    let labelClass = `select-label ${comboboxConfig.labelClass}`;
    return (
      <div className={selectClass} style={comboboxConfig.style}>
        <span className={labelClass} style={comboboxConfig.labelStyle}>
          <nobr>{comboboxConfig.label}</nobr>
        </span>
        <div className="labelSelect-select" style={{...comboboxConfig.componentStyle}}>
          <InputNumber
            step={this.props.step} max={this.props.max} min={this.props.min}
            num={this.props.num} onChange={this.props.onChange}/>
        </div>
      </div>);
  }
}
export default LabelInputNumber