/****************************************************
 * create by qing.feng
 * time 2016/7/21 18:08
 * desc：表格-验证单元格
*****************************************************/
import React, { PropTypes } from 'react';
import BaseValidate from '../../utils/BaseValidate'
class GridItem extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { error: null };
  }

  getChildContext() {
    return {
      gridItem: this
    }
  }

  componentWillMount() {
    this.isDivFocus = false;
    this.context.table.addItem( this )
  }

  componentWillUnmount() {
    this.context.table.removeItem( this )
  }

  componentDidMount() {
    this.isDivFocus = false;
  }

  /*单元格中数据的验证*/
  validate( value ) {
    let isValid = true;
    value = this.data[this.config.key];
    let config = this.config;
    if ( config.regExp || config.isRequired || config.maxLen || config.minLen ) {
      const error = BaseValidate.validateInput( {
        label: config.title, value,
        isRequired: config.isRequired, maxLength: config.maxLen, minLength: config.minLen, regExp: config.regExp
      } );
      if ( error && typeof error === 'string' ) {
        isValid = false;
      }
      this.setState( { error } );
    }
    return isValid;
  }

  onItemFocus( str, evt ) {
    this.isDivFocus = true;
    this.setState( { error: "" } );
    evt.preventDefault();
  }

  onItemBlur( evt ) {
    this.isDivFocus = false;
    this.validate( this.value );
    evt.preventDefault();
  }

  onItemOver( error, errorstr, evt ) {
    this.isMouseOver = true;
    this.setState( this.state );
    evt.preventDefault();
  }

  onItemOut( evt ) {
    this.isMouseOver = false;
    this.setState( this.state );
    evt.preventDefault();
  }

  tipClick( evt ) {
    this.isDivFocus = false;
    this.setState( this.state );
  }

  render() {
    this.data = this.props.data;
    this.config = this.props.itemConfig;
    const { error } = this.state;
    let tipStr = this.config.toolTip;
    let errorClass;
    let tipStyle = { borderColor: "#ececec", color: "#666" };
    let arrowStyle = { borderTopColor: "#ececec" };
    if ( error ) {
      tipStr = error;
      errorClass = "has-error";
      tipStyle = { borderColor: "#cf7f7f", color: "#cf7f7f" };
      arrowStyle = { borderTopColor: "#cf7f7f" };
    }
    let divClassName = `validate-table ${errorClass}`;
    let tip = tipStr && (this.isMouseOver || this.isDivFocus) ?
      <div className="tooltip-content top" style={tipStyle}
           onClick={this.tipClick.bind(this)}>
        <div className="arrow" style={arrowStyle}></div>
        <span >{tipStr}</span>
      </div> : null;
    return (
      <div className={divClassName} style={{position:"relative"}}
           onFocus={this.onItemFocus.bind(this,this.config.toolTip)}
           onBlur={this.onItemBlur.bind(this)}
           onMouseOver={this.onItemOver.bind(this,error,tipStr)}
           onMouseOut={this.onItemOut.bind(this)}
      >
        {tip}
        {this.props.children}
      </div>
    )
  }
}

GridItem.contextTypes = {
  table: PropTypes.object
}

GridItem.childContextTypes = {
  gridItem: PropTypes.instanceOf( GridItem )
}

GridItem.propTypes = {
  data: PropTypes.object.isRequired
}
export default GridItem