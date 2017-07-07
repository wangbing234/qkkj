import React from "react";
import DataTable from 'bfd-ui/lib/DataTable'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import RestrictInput from 'CommonComponent/component/restrictinput'
import LeftTree from './LeftTree.jsx'
import WorkflowList from './WorkflowList.jsx'

let that;

class Index extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            ...prop.location.state, //首页点击项目工作流,获取location后的参数, projectCode
            projectCode:''
        }
    }

    componentWillReceiveProps(nextProps){
        this.externalSeeWF(nextProps.location.state);

    }

    componentDidMount(){
        this.externalSeeWF(this.props.location.state);
    }

    /**数据全景跳转过来查看工作流根据projectCode**/
    externalSeeWF(data){
        if(data && data.projectCode != undefined){
            this.setState({
                projectCode:data.projectCode //首页点击项目工作流,获取location后的参数, projectCode
            },()=>{
                this.refs.wfList.openWfByProjectCode(data.projectCode);
            });

        }
    }

    handleChange(dataField, evt) {
        let value = evt && evt.target ? evt.target.value : evt;
        this.setState({[dataField]: value});
    }


    handleActive(data) {
        console.log(data)
    }

    render(){
        that = this;
        return (<div className="module-container search-data">
            <div>
                <div style={{width:'20%',float:'left', position:'relative'}}>
                    <LeftTree projectCode={that.state.projectCode}/>
                </div>
                <div style={{width:'78%',float:'left'}}>
                    <WorkflowList ref="wfList" projectCode={that.state.projectCode}/>
                </div>
            </div>
        </div>);
    }
}

export default Index;