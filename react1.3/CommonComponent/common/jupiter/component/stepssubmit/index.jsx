/***************************************************
 * 时间: 2016年6月20日16:29:14
 * 作者: bing.wang
 * 说明: 步骤提交组件
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
class StepsSubmit extends React.Component {
    constructor(props) {
        super(props);
        that=this;
        this.state = {stepData:{}, currentStep: this.props.currentStep||0};
    }


    //调用验证方法，把所有数据当前对象
    nextClick(){
        let currentUi=that.refs["step"+that.state.currentStep];
        if(currentUi.vaildate)
        {
            currentUi.vaildate(that.state.stepData)
        }
        else
        {
            console.log("下一步没有验证方法，或验证不通过！");
        }
    }
    //调用步骤获取数据
    getStepData(){
        let currentUi=that.refs["step"+that.state.currentStep];
        debugger
        that.state.stepData["step"+that.state.currentStep]=currentUi.getData?currentUi.getData():currentUi.state;
    }

    //下一步事件处理,提供外部调用
    nextStep(){
        that.getStepData();
        var nextStep=that.state.currentStep+1;
        that.setState({currentStep:nextStep});
    }

    //取消处理
    cancelClick(step){
        that.props.cancelClick();
    }

    render(){
        that=this;
        //当前
        let currentStep = this.state.currentStep;
        let allStepArray = this.props.stepArray;
        let sProps=allStepArray[currentStep].props;
        let CurrentStepUi=allStepArray[currentStep].ui;
        let totalSteps = allStepArray.length;
        let divClass = "steps_button";
        let  submitBtn = <div className={divClass} style={this.props.style}>
                <button className="btn btn-primary" style={{marginRight:10}} onClick={this.nextClick.bind(this)}>提交</button>
                <button className="btn btn-default" onClick={this.cancelClick.bind(this,currentStep)}>取消</button>
            </div>;

        return (
            <div className="list-container">
                <div  style={{}}>
                    <div className="steps_container">
                        <Steps current={currentStep}  height={70}>
                            {allStepArray.map((s, i) => <Step key={i} title={s.title}/>)}
                        </Steps>
                    </div>
                </div>
                <div style={{width:"100%",paddingTop:"10px",paddingLeft:"20px",paddingRight:"10px"}}>
                       <CurrentStepUi ref={"step"+currentStep} stepData={this.state.stepData} parent={this} {...sProps}/>
                </div>
                <div  style={{width:"100%",paddingBottom: "20px"}}>
                    <center>
                         {submitBtn}
                    </center>
                </div>
        </div>);
    }
}
export default StepsSubmit;
