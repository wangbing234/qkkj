import React from 'react'
import AjaxReq from './../model/AjaxReq'
let arr;

class ShowCodePanel extends React.Component{

    constructor(prop) {
        super(prop);
        //let data = '';
        //arr = data.split('\n');
        //this.state = {data:arr,nullLine:[]}
        this.state = {
            data:''
        }
    }

    fillNullLine(){
        let nullLineArr = [];
        for (let lineNum = this.state.data.length; lineNum < 13; lineNum++){
            nullLineArr.push('');
        }
        return nullLineArr;
    }

    componentDidMount(){
        this.getData();
        //this.setState({data:arr,nullLine: this.fillNullLine()});
    }

    componentWillUnmount() {
        console.log('table-codepane will unmount');
        this.isUnmount = true;
    }

    getData() {
        let that = this;
        let param = {database:this.props.table.database, tableName:this.props.table['table_name']};
        AjaxReq.getDDLInfo(param, function(result) {
            if(!that.isUnmount){
                if(result.data){
                    that.setState({
                        data: result.data
                    });
                } else if(!result.data){
                    that.setState({
                        data: {}
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

//<tbody>
//{this.state.data.map((item,index) =>{
//    return (
//        <tr key={index+200}>
//            {/*<td key={index+1} className="search-tableInfo-ddl-td-line"><span key={index+100}>{index+1}</span></td>*/}
//            <td key={index-1} className="search-tableInfo-ddl-td-content"><span key={index-100}>{item}</span></td>
//        </tr>);
//})}
//{
//    this.state.nullLine.map((item,index) =>{
//        return (
//            <tr key={index-200}>
//                {/*<td key={index+20} className="search-tableInfo-ddl-td-line"><span key={index+500}></span></td>*/}
//                <td key={index-20} className="search-tableInfo-ddl-td-content"><span key={index-500}></span></td>
//            </tr>);
//    })
//}
//</tbody>