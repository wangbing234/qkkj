import React from "react"
import  './style.less'
import Icon from 'bfd-ui/lib/Icon'
//权限控制
import AuthButton from '../authbutton'
let that;
class Accordion extends React.Component{
    constructor(props){
        super(props);
        that = this;
    }

    componentDidMount() {
        this.initFunction($('.Accordion'), false);
    }

    initFunction(target, multiple) {
        target.find('.AcdBorder:first .AcdContent').show();
        target.find('.AcdBorder:first').addClass("Height100");
        target.find('.AcdBorder:first .AcdTitle ').addClass("open");
        var links = target.find('.AcdBorder .AcdTitle ');
        links.on('click', {target: target, multiple: multiple}, this.dropdown);
    }

    dropdown(e) {
        if(e.target.localName=="i")
            return;
        let  $AcdTitle=$(e.currentTarget);
        let  $AcdContent = $AcdTitle.next();
        let  $AcdBorder = $AcdTitle.parent();
        let $AcdContentList = $AcdBorder.siblings().children(".AcdContent");//其它的区域
        if(!$AcdContent.is(":visible"))
        {
            $AcdTitle.toggleClass('open');
            $AcdBorder.toggleClass('Height100');
            $AcdContent.slideDown(200);//打开
            $AcdContentList.slideUp(200)//关闭
            $AcdBorder.siblings().removeClass('Height100');
        }
    }

    render(){
       return(<div className="Accordion" {...this.props}>
                        {this.props.children}
                </div>);
    }
}

class AccordionItem extends React.Component {
    constructor(props) {
        super(props);
        that = this;
    }

    initFunction() {
        this.refs.child.titleClick();
    }

    render(){
        let buttonString;
        let Children=this.props.Child;
        if(this.props.buttonString)
        {
            buttonString= <AuthButton  data-code={this.props.dataCode} renderType="icon" onClick={this.initFunction.bind(this)} type={this.props.buttonString}/>
        }

        return(
                <div className="AcdBorder">
                    <div className="AcdTitle">
                        <Icon   type={this.props.icon} style={{float:"left",width: 10}}/>
                        <span style={{float:"left"}}>{this.props.title}</span>
                        {buttonString}
                    </div>
                    <div className="AcdContent" style={{display:"none"}} >
                        <Children ref="child" {...this.props.props}/>
                    </div>
                </div>);
    }
}
export default {Accordion,AccordionItem}