import React from 'react'
/*let msgArr = [{
    text: '用户审计',
    url:''//如果不需要跳转url可以为空或不写url
},{
    text: '数据审计',
    url:'/useraudit/data'
}];*/
const BreadCrumb = React.createClass({
    clickHandler(url,e){
        if(url && url != ""){
            if(this.props.history){
                this.props.history.pushState(null,url);
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
            title= <span><h2 style={{marginBottom:0}}>{str}</h2></span>;
        }
        return (<div>
            {title}
            <ol className="breadcrumb" style={{marginBottom:0}}>
                {this.props.msgArr.map((item,index)=>{
                    return (<li key={index}><a href="javascript:void(0);"
                                   onClick={this.clickHandler.bind(this,item.url)}>{item.text}</a> </li>);
                })}
            </ol>
                </div>);
    }
})

export default BreadCrumb;