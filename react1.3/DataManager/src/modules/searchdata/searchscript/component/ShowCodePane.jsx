import React from 'react'
import AjaxReq from './../model/AjaxReq'

let TYPE_CODE_MR = 6;
let TYPE_CODE_SPARKSQL = 7;
let TYPE_CODE_SPARK = 8;

class ShowCodePanel extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            data:''
        }
    }

    componentDidMount(){
        this.getData()
    }

    componentWillUnmount() {
        console.log('script-codepane will unmount');
        this.isUnmount = true;
    }

    fillNullLine(){
        let nullLineArr = [];
        for (let lineNum = this.state.data.length; lineNum < 13; lineNum++){
            nullLineArr.push('');
        }
        return nullLineArr;
    }

    getData() {
        let that = this;
        let param = {taskCode:this.props.taskCode}
        AjaxReq.getTaskCommand(param, function(result) {
            if(!that.isUnmount){
                if(result.data){
                    let _data = result.data
                    if([TYPE_CODE_MR,TYPE_CODE_SPARK,TYPE_CODE_SPARKSQL].indexOf(that.props.typeCode ) != -1){
                        let _dataObj = JSON.parse(result.data);
                        _data = JSON.stringify(_dataObj,null,4);
                    }
                    that.setState({
                        data: _data
                    });
                } else if(!result.data){
                    that.setState({
                        data: ''
                    });
                }
            }
        });
    }

    render(){
        return (<div className="search-tableInfo-ddl-div" style={{padding:0}} >
            <pre>{this.state.data}</pre>
        </div>);
    }
}

export default ShowCodePanel;