/***********************************************
 * author: 冯庆  2016-05-12
 * 限制输入框,只能输入正则表达式匹配的字符
 * 使用方法：
 * <ValidateInput className="form-control"
 value={that.state.itemData[item.cpname]}
 restrict={item.restrict}
 type="text"
 onChange={that.handleChange.bind(that,item.cpname)}/>
 * **********************************************/
import React from 'react';
import './style.less'
class ValidateInput extends React.Component{
    constructor(props){
        super(props);
        //isChanged：是否修改；  isFocus 是否在焦点；
        this.state = {isChanged:false,isFocus:false};
    }
    /*input输入时验证是否匹配限制输入的正则，如果匹配才进行更改value值，并回调父类处理方法*/
    changeHandle(e){
        let value = e.target.value;
        this.state.isChanged=true;
        if(this.props.restrict && value){
            let flag = this.props.restrict.test(value);
            if(flag){
                this.props.onChange(e);
            }else{
                e.target.value = this.filterChar(value);
            }
        }else{
            this.props.onChange(e);
        }

    }

    filterChar(value){
        let restrict = this.props.restrict;
        let str = "";
        for(let i = 0; i < value.length;i++){
            if(restrict.test(value.charAt(i))){
                str += value.charAt(i);
            }
        }
        return str;
    }


    /*input输入时验证是否匹配限制输入的正则，如果匹配才进行更改value值，并回调父类处理方法*/
    onblurHander(e){
        this.state.isFocus=false;
        this.setState(this.state);
        $(e.target).parent().find('.popover').hide();
    }
    onfocusHander(e){
        this.state.isFocus=true;
        this.setState(this.state);
    }


    render(){
        let tprops = {...this.props};
        delete tprops.onChange;
        let errTip;
        let itemStyle = {};
        let divStyle=this.props.style||{width: "100%"};
        //错误提示:  有错误信息，焦点
        if(tprops.errorTip  && this.state.isFocus && (this.state.isChanged || tprops.validated)   && !tprops.isErrorEnable)
        {
            errTip=(<span className="validate-input-error">
                         {tprops.errorTip}
                    </span>);
        }

        //错误边框
        if(tprops.errorTip  && (this.state.isChanged || tprops.validated) && !tprops.isErrorEnable)
        {
            itemStyle = {className:"has-error"};
        }
        //输入提示信息,没有值，有提示信息，获取焦点
        if(this.state.isFocus && !tprops.value && tprops.tipString && !errTip)
        {
            errTip=(<span className="tip-input">
                         {tprops.tipString}
                    </span>)
        }

        return (
                    <div  {...itemStyle} style={divStyle}>
                        {errTip}
                        <input {...tprops} style={divStyle} onChange={this.changeHandle.bind(this)}
                                           onBlur={this.onblurHander.bind(this)}
                                           onFocus ={this.onfocusHander.bind(this)}/>
                    </div>
                );
    }
}
export default ValidateInput