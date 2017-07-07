import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import SelectTree from 'bfd-ui/lib/Tree/SelectTree'

class ResourceAuthority  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            data: [{
                name: '数据工厂',
                open: true,
                children: [{
                    name: 'adsdsd',
                    checked: true
                }]
            }, {
                name: '配置中心',
                children: [{
                    name: 'dsads'
                }]
            }, {
                name: '配置中心2'
            }]
        };

    }


    //submit按钮提交操作
    handleSubmit(e) {
        if(e){e.preventDefault()}
        if(this.refs.form.validate(this.state)){
            console.log('表单验证通过');
            //验证通过
        } else {
            console.log('表单验证失败');
        }
    }

    render() {
        let divStyle ; //{marginTop:'-18px',marginBottom:'30px'};
        if(this.props.style){
            divStyle = this.props.style;
        }
        return (<div style={divStyle}>
            <SelectTree defaultData={this.state.data}/>
        </div>);
    }
}

export default ResourceAuthority;