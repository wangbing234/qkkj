import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
class Db2Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    validate(data){
        return this.refs.db2Form.validate(data);
    }
    render(){
        let getFormItemConfig = this.props.getFormItemConfig();
        this.rules = this.props.getRules();
        return (<Form ref="db2Form" rules={this.rules} labelWidth={150}
                      className="resourcemanage-edit-form" style={{paddingTop:"15px"}}>
            {getFormItemConfig}
        </Form>);
    }
}
export default Db2Form