/***********************************************
 * author: 王兵  2016-05-12
 * 限制输入框,只能输入正则表达式匹配的字符
 * 使用方法：
 * <RestrictInput className="form-control"
 value={that.state.itemData[item.cpname]}
 restrict={item.restrict}
 type="text"
 onChange={that.handleChange.bind(that,item.cpname)}/>
 * **********************************************/
import React from 'react';
import './style.css'
import { Select2 ,Option2} from 'bfd-ui/lib/Select2'
class ValidateSelect extends React.Component{
    constructor(props){
        super(props);
        this.state = {display:"none",isChanged:false};
    }
    /*input输入时验证是否匹配限制输入的正则，如果匹配才进行更改value值，并回调父类处理方法*/
    changeHandle(e){
             this.state.isChanged=true;
            this.props.onChange(e);
    }

    /*input输入时验证是否匹配限制输入的正则，如果匹配才进行更改value值，并回调父类处理方法*/
    onblurHander(e){
        this.state.isChanged=true;
        this.state.display="none";
        this.setState(this.state);
    }
    tableInputHandleChange(e)
    {
        if(e) {
            this.state.display="none";
        }
        else {
            this.state.display="block";
        }
        this.props.onChange(e);
    }


    onfocusHander(e){
        this.state.isChanged=true;
        this.state.display="block";
        this.setState(this.state);
    }



    render(){
        let tprops = {...this.props};
        delete tprops.onChange;
        let errTip;
        let itemStyle = {};
        if((!tprops.value || tprops.value == '请选择') && this.state.display=="block" && !tprops.isErrorEnable && tprops.validated)
        {
            errTip=(<span className="validate-select-error">
                         {tprops.errorTip||"数据不能为空！"}
                    </span>)
        }
        if((!tprops.value ||tprops.value == '请选择') &&  (this.state.isChanged || tprops.validated) && !tprops.isErrorEnable && tprops.validated)
        {
            itemStyle = {className:"divError"};
        }

        return (
            <div  {...itemStyle} style={{width:"100%"}}>
                {errTip}
                <Select2  {...tprops}  onChange={this.tableInputHandleChange.bind(this)} onMouseOut={this.onblurHander.bind(this)} onMouseOver ={this.onfocusHander.bind(this)}>
                    {this.props.children}
                </Select2>
            </div>
        );
    }
}

export default ValidateSelect