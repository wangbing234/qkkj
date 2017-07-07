/***********************************************
 * author: 冯庆  2016-05-12
 * 限制输入框,只能输入正则表达式匹配的字符
 * 使用方法：
 * <RestrictTextarea className="form-control"
 value={that.state.itemData[item.cpname]}
 restrict={item.restrict}
 type="text"
 onChange={that.handleChange.bind(that,item.cpname)}
 tipString="test"/>
 * **********************************************/
import React, { PropTypes } from 'react';
import BaseValidate from '../../utils/BaseValidate'
class RestrictTextarea extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  /*input输入时验证是否匹配限制输入的正则，如果匹配才进行更改value值，并回调父类处理方法*/
  changeHandle( e ) {
    let value = e.target.value;
    if ( this.props.restrict && value ) {
      let flag = this.props.restrict.test( value );
      if ( flag ) {
        //this.preValue = value;
        this.props.onChange( e );
      } else {
        e.target.value = this.filterChar( value );
        this.props.onChange( e );
      }
    } else {
      this.props.onChange( e );
    }
    if ( !value ) {
      this.focusHandle();
    }
    let ct = this.context;
    if ( ct.gridItem ) {
      ct.gridItem.validate( value );
    }

  }

  filterChar( value ) {
    let restrict = this.props.restrict;
    let str = "";
    let currChar;
    for ( let i = 0; i < value.length; i++ ) {
      currChar = value.charAt( i );
      if ( restrict.test(`${str}${currChar}`)) {
        str += currChar;
      }
    }
    return str;
  }

  focusHandle( evt ) {
    let ct = this.context;
    if ( ct.formItem ) {
      ct.formItem.setState( { error: "" } );
    }
    if ( this.props.onFocus ) {
      this.props.onFocus( evt );
    }
  }

  focusOutHandle( evt ) {
    let isSuccess = this.validate( evt.target.value );
    if ( isSuccess && this.props.onBlur ) {
      this.props.onBlur( evt );
    }
  }

  validate( value ) {
    return BaseValidate.formItemValidate( this, value );
  }

  componentDidMount() {
    $( function () {
      $( '[data-toggle="popover"]' ).popover( { trigger: "focus" } );
    } )
  }

  render() {
    let tprops = { ...this.props };
    let inputClassName = `input-group ${this.props.className}`
    delete tprops.onChange;
    delete tprops.className;
    delete tprops.onFocus;
    delete tprops.onBlur;
    return (<textarea
      className={inputClassName} {...tprops}
      onChange={this.changeHandle.bind(this)}
      data-container="body" data-toggle="popover"
      data-placement={this.props.popPlace||"right"}
      data-content={this.props.tipString}
      onFocus={this.focusHandle.bind(this)}
      onBlur={this.focusOutHandle.bind(this)}/>);
  }
}

RestrictTextarea.contextTypes = {
  formItem: PropTypes.object
}
export default RestrictTextarea