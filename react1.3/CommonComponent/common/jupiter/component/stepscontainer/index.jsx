/***************************************************
 * 时间: 16/5/4 17:29
 * 作者: bing.wang
 * 说明: 步骤控制 组件
 * 使用说明:
 *例子 ：参考 modules\msgnotice\home\components
 *
 * parent 当前组件
 * stepArray 步骤数组，数组组件必须指定ref
 *  编辑下一步骤初始化方法：initStep(allStepData)
 *  下一步骤初始化缓存方法：cacheStep(allStepData)
 *  下一步或提交的验证方法：vaildate 返回验证是否成功，true成功，false失败
 *  下一步或提交的提交方法：saveData 返回保存的数据
 * needSubmitBtn 是否需要提交按钮
 * currentStep 当前步骤
 * cancelClick  取消操作
 *
 ***************************************************/
import React from 'react';
import { Steps, Step } from 'bfd-ui/lib/Steps'
import './steps.less'
let that;
let currentStepUi;//当前渲染对象
let isClickPre=false;//是否点击上一部
let isClickNext=false;//是否点击上一部
class StepsContainer extends React.Component {
    constructor(props) {
        super(props);
        that=this;
        this.state = {
                      currentStep: this.props.currentStep,//currentStep默认外部的传来的步骤
                      stepData:{},//stepData 步骤的数据,提交的时候用的
                      stepState:{} //stepState每一步的状态数据，报错状态
                      };
    }

    //提交方法处理，只提交之前步骤和当前步骤的数据
    submitClick(currentStep)
    {
        let currentUi=that.props.parent.refs[currentStepUi.ref];
        if(!currentUi.vaildate || currentUi.vaildate(that.state.stepState))
        {
            that.state.stepData["step"+currentStep]=currentUi.saveData?currentUi.saveData(that.state.stepState):currentUi.state;
            let _submitClick=that.props.submitClick;
            if(_submitClick)
            {
                var sDataObj={};
                for(var i=0;i<=currentStep;)
                {
                    var _key="step"+i;
                    sDataObj[_key]=that.state.stepData[_key];
                    i++
                }
                _submitClick(sDataObj,currentStep);
            }

        }
        else {
            console.log("提交没有验证方法，或验证不通过！");
         }
    }

    //上一部处理，渲染之前保存的数据
    preClick(step){
        isClickPre=true;
        var preStep=that.state.currentStep-1;
        let currentUi=that.props.parent.refs[currentStepUi.ref];
        that.state.stepState["step"+that.state.currentStep]=currentUi.state;
        //保存上一步骤的状态
        that.setState({currentStep:preStep});
    }

    componentDidUpdate(){
        if(isClickNext || isClickPre)
        {
            //所有步骤的数据
            var _stepState=that.state.stepState["step"+that.state.currentStep];
            //如果点击的是上一步骤，渲染之前保存的数据
            let currentUi=that.props.parent.refs[currentStepUi.ref];
            if(currentUi &&　_stepState)
            {
                currentUi.setState(_stepState);
                //有缓存的时候调用缓存方法,下步骤依赖上一步骤
                if(isClickNext && currentUi.cacheStep)
                    currentUi.cacheStep(that.state.stepState);
            }
            else if(currentUi &&　currentUi.initStep){
                currentUi.initStep(that.state.stepState);
            }
        }
        isClickPre=false;
        isClickNext=false;
    }

    //下一步的验证处理
    nextClick(step){
        let currentUi=that.props.parent.refs[currentStepUi.ref];
        if(!currentUi.vaildate || currentUi.vaildate(that.state.stepState))
        {
            that.state.stepData["step"+step]=(currentUi.saveData?currentUi.saveData(that.state.stepState):currentUi.state);
            that.state.stepState["step"+step]=currentUi.state;
            that.doNextClick();
        }
        else
        {
            console.log("下一步没有验证方法，或验证不通过！");
        }
    }

    //下一步事件处理
    doNextClick(){
        isClickNext=true;
        var nextStep=that.state.currentStep+1;
        that.setState({currentStep:nextStep});
    }

    //取消处理
    cancelClick(step){
        that.props.cancelClick();
    }

    render(){
        that=this;
        let currentStep = this.state.currentStep;
        let divClass = "steps_button";
        let needSubmitBtn = this.props.needSubmitBtn;
        let allStepArray = this.props.stepArray;
        let totalSteps = allStepArray.length;
        currentStepUi=allStepArray[currentStep].ui;
        let footer;
        let submitBtn;
        if(needSubmitBtn){
            submitBtn = <button className="btn btn-primary" style={{marginRight:10}} onClick={this.submitClick.bind(this,currentStep)}>{this.props.submitLabel?this.props.submitLabel:"提交"}</button>;
        }
        if (currentStep == 0){
                footer = <div className={divClass} style={this.props.style}>
                    <button className="btn btn-primary" style={{marginRight:10,width:100}} onClick={this.nextClick.bind(this,currentStep)}>下一步</button>
                    {submitBtn}
                    <button className="btn btn-default" onClick={this.cancelClick.bind(this,currentStep)}>取消</button>
                </div>;
        }else if(currentStep > 0 && currentStep < totalSteps-1 && totalSteps>2){
            footer = <div className={divClass} style={this.props.style}>
                <button className="btn btn-primary" style={{marginRight:10,width:100}} onClick={this.preClick.bind(this,currentStep)}>上一步</button>
                <button className="btn btn-primary" style={{marginRight:10,width:100}} onClick={this.nextClick.bind(this,currentStep)}>下一步</button>
                {submitBtn}
                <button className="btn btn-default" onClick={this.cancelClick.bind(this,currentStep)}>取消</button>
            </div>;
        }else{
            footer = <div className={divClass} style={this.props.style}>
                <button className="btn btn-primary" style={{marginRight:10,width:100}} onClick={this.preClick.bind(this,currentStep)}>上一步</button>
                <button className="btn btn-primary" style={{marginRight:10}} onClick={this.submitClick.bind(this,currentStep)}>
                    {this.props.submitLabel?this.props.submitLabel:"提交"}</button>
                <button className="btn btn-default" onClick={this.cancelClick.bind(this,currentStep)}>取消</button>
            </div>;
        }


        return (
            <div className="list-container">
                <div  style={{borderBottom:"1px dotted #e9e9e9"}}>
                    <div style={{width:800, height:50, marginLeft:-20,marginTop:40,marginBottom:40}}>
                        <Steps current={currentStep}  height={70}>
                            {allStepArray.map((s, i) => <Step key={i} title={s.title}/>)}
                        </Steps>
                    </div>
                </div>
                <div style={{width:"100%",borderBottom:"1px dotted #e9e9e9",paddingTop:"35px"}}>
                       {currentStepUi}
                </div>
                <div  style={{width:"100%",borderTop:"1px dotted #e9e9e9",paddingBottom: "20px"}}>
                    <center>
                         {footer}
                    </center>
                </div>
        </div>);
    }
}
export default StepsContainer;
