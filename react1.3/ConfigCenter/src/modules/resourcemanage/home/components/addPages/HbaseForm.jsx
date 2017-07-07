/****************************************************
 * create by qing.feng
 * time 2016/7/31 14:26
 * desc：资源管理- HBASE
*****************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form'
class HbaseForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  validate(data){
    return this.refs.HBaseForm.validate(data);
  }
  render(){
    let getFormItemConfig = this.props.getFormItemConfig();
    this.rules = this.props.getRules();
    return (<Form ref="HBaseForm" rules={this.rules} labelWidth={150}
                  className="resourcemanage-edit-form" style={{paddingTop:"15px"}}>
      {getFormItemConfig}
    </Form>);
  }
}
export default HbaseForm