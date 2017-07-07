/***************************************************
 * 时间: 16/5/4 17:29
 * 作者: bing.wang
 * 说明: 表格文字过多省略号
 *
 ***************************************************/
import React from 'react';
class StringDiv extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if(String(this.props.value).length>20)
        {
            let suolveString =this.suolve(this.props.value,20);
            return  (<div data-toggle="tooltip" data-placement="right" title={this.props.value}>{suolveString}</div>);
        }
        else {
           return  (<div>{this.props.value}</div>);
        }

        return null;
    }


    suolve( str,sub_length ){
            var temp1 = str.replace(/[^\x00-\xff]/g,"**");
            var temp2 = temp1.substring(0,sub_length);
             //找出有多少个*
            var x_length = temp2.split("\*").length - 1 ;
            var hanzi_num = x_length /2 ;
            sub_length = sub_length - hanzi_num ;//实际需要sub的长度是总长度-汉字长度
            var res = str.substring(0,sub_length);
            if(sub_length < str.length ){
                var end =res+"……" ;
            }else{
                var end = res ;
            }
            return end ;
        }
}



export default StringDiv;

