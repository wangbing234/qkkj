import React from 'react';
import ModelTree from '../../common/ModelTree'
import Icon from 'bfd-ui/lib/Icon'
class ListLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (<div className="panel list_left_bar" style={{height: "100%"}}>
      <div className="panel-heading">
        <Icon type="bfd-icon fa fa-database" style={{float:"left",width: 10}}/>
        <span style={{float:"left"}}>数据模型</span>
      </div>
      <div className="panel-body" style={{height:"95%",overflowY:"auto"}}>
        <ModelTree ref="modelTree" operatorType="list"/>
      </div>
    </div>);
  }
}
export default ListLeft