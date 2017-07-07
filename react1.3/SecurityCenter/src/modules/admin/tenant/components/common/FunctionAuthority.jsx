import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import SelectTree from 'bfd-ui/lib/Tree/SelectTree'
import Tree from 'bfd-ui/lib/Tree'
import AjaxReq from '../../model/AjaxReq'
import message from 'CommonComponent/component/bdosmessage'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
let that;
class FunctionAuthority extends React.Component {

    constructor(prop) {
        super(prop);
        that = this;
        this.state = {
            data: []


        };

    }

    /*setData(id){
        this.roleId = id;
    }*/

    componentDidMount(){
        let param = {roleId:this.props.roleId};
        //let param = {roleId:51};
        AjaxReq.queryFuncAuthority(`data=${JSON.stringify(param)}`,(result)=>{
            this.setState({data:result})
        })
    }

    //submit按钮提交操作
    handleSubmit() {

        let arr=[];
        this.state.data.map(function (item, index) {
            if(item.checked){
                arr.push(item.id);
            }
        });
        let param = {roleId:this.props.roleId,functionCodes:arr};
        //this.props.next();//测试用
        AjaxReq.saveFuncAuthority(`data=${JSON.stringify(param)}`,(result)=>{
            message.success('功能授权操作成功');
            if(this.props.next){
                this.props.next()
            } else {
                this.props.cancel();
            }
            //this.setState({data:result})
        })
    }

    changeHandler(datas){
        this.setState({data:datas});
    }

    /*handleChange(evt) {
        that.state.data;
        console.log(target.checked, target.value)
    }*/

    handleChange(data,e) {
        this.state.data.map((item,index)=>{
            if(data.id == item.id){
                item.checked = e.target.checked;
            }
        })
}

    render() {
        that = this;
        let divStyle;//{marginTop:'-18px',marginBottom:'30px'};
        if(this.props.style){
            divStyle = this.props.style;
        }
        return (<div className="functionTree" style={divStyle}>
            {/*<SelectTree data={this.state.data} onChange={this.changeHandler.bind(this)}/>*/}
            <Tree data={this.state.data} ref="tree" onChange={this.changeHandler.bind(this)}
                  render={(data, path) => <Checkbox checked={data.checked} style={{lineHeight:'30px'}} disabled={this.props.isSee} onChange={this.handleChange.bind(this,data)}>{data.name}</Checkbox>} />
        </div>);
    }
}

export default FunctionAuthority;