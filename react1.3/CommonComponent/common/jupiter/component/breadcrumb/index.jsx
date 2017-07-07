/***************************************************
 * 时间: 16/5/4 17:29
 * 作者: lijun.feng
 * 说明: collapse 组件
 * 使用说明:
 <BreadCrumb title="title">
 </BreadCrumb>
 *
 ***************************************************/
import React from 'react'
import './style.less'
/*let msgArr = [{
    text: '用户审计',
    url:''//如果不需要跳转url可以为空或不写url
},{
    text: '数据审计',
    url:'/useraudit/data'
}];*/
const BreadCrumb = React.createClass({
    clickHandler(text){
        /*if(url && url != ""){
            if(this.props.history){aa
                this.props.history.pushState(null,url);
            }
        }*/

        let returnIndex;
        for(let i=0;i<this.props.msgArr.length;i++){
            let item = this.props.msgArr[i];
            if(item.text == text && i!=this.props.msgArr.length-1){
                returnIndex = i+1;
                this.props.onChange && this.props.onChange(returnIndex);
                break;
            }
        }


    },
    render() {
        var title;
        var str;
        var arr = this.props.msgArr?this.props.msgArr:[];
        str = arr[arr.length - 1].text;

        if (this.props.title){
            str = this.props.title;
        }
        if(str){
            title= <span><h2 style={{marginBottom:0,color: "#666666"}}>{str}</h2></span>;
        }
        return (<div className="bdos-breadcrumb-div" style={this.props.style}>
            {/*{title}*/}
            <ol className="breadcrumb" style={{marginBottom:0,fontSize:12}}>
                {this.props.msgArr.map((item,index)=>{
                    let liHref= (<li key={index}>
                                    <a href="javascript:(0)" onClick={this.clickHandler.bind(this,item.text)}>{item.text}</a>
                                    <span>{" > "}</span>
                                 </li>);
                    if(index==this.props.msgArr.length-1)
                        return <span key={index}>{item.text}</span>;
                    return liHref;
                })}
            </ol>
                </div>);
    }
})
export default BreadCrumb