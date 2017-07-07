import React from 'react';
import BreadCrumb from '../breadcrumb'
//import './style.less'
class EditPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {
    return (
      <div className="bdos-edit">
        <div className="bdos-edit-nav">
          <BreadCrumb
            history={this.props.history}
            msgArr={this.props.breadCrumbList}
            onChange={this.props.onChange}
          />
        </div>
        <div className="bdos-edit-main">
          {this.props.children}
        </div>
      </div>
    );
  }
}
export default EditPanel