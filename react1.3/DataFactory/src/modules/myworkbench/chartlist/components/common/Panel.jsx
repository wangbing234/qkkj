import React from 'react'
import AuthButton from 'CommonComponent/component/authbutton'

const Panel = React.createClass( {
  getInitialState() {
    return {}
  },
  clickHandler() {
    this.props.history.pushState( null, this.props.urlName );
    if ( this.props.menuClickFunc ) {
      this.props.menuClickFunc( {
        title: this.props.tabTitle,
        href: this.props.urlName,
        "data-icon": this.props.icon
      } );
    }
  },
  render() {
    let panelClass = `panel_content ${this.props.className}`;
    return (<div className={panelClass} style={this.props.style}>
      <div>
        <span style={{fontSize:"14px",color:"#666"}}>{this.props.title}</span>
        <span className="pull-right">
          <AuthButton
            renderType="a"
            data-code={this.props["data-code"]}
            className="more-text"
            onClick={this.clickHandler}>更多</AuthButton>
        </span>
      </div>
      {this.props.children}
    </div>);
  }
} );

export default  Panel;
