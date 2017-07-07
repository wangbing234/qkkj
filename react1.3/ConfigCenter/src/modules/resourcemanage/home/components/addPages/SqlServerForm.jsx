import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
class SqlServerForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    validate(data){
        return this.refs.sqlServerForm.validate(data);
    }
    render(){
        let getFormItemConfig = this.props.getFormItemConfig();
        this.rules = this.props.getRules();
        return (<Form ref="sqlServerForm" rules={this.rules} labelWidth={150}
                      className="resourcemanage-edit-form" style={{paddingTop:"15px"}}>
            {getFormItemConfig}
        </Form>);
    }
}
export default SqlServerForm