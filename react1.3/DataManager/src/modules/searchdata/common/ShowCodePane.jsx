import React from 'react'
let arr;

class ShowCodePanel extends React.Component{

    constructor(prop) {
        super(prop);
        let data = 'ds\ncreateTable\nd bign.wang test  cou.u';
        arr = data.split('\n');
        this.state = {data:[],nullLine:[]}
    }

    fillNullLine(){
        let nullLineArr = [];
        for (let lineNum = this.state.data.length; lineNum < 13; lineNum++){
            nullLineArr.push('');
        }
        return nullLineArr;
    }

    componentDidMount(){
        this.setState({data:arr,nullLine: this.fillNullLine()});
    }

    render(){
        let count;
        return (<div className="search-tableInfo-ddl-div" style={{padding:0}} >
                    <table cellSpacing="0">
                            <tbody>
                            {this.state.data.map((item,index) =>{
                                return (
                                <tr key={index+200}>
                                    <td key={index+1} className="search-tableInfo-ddl-td-line"><span key={index+100}>{index+1}</span></td>
                                    <td key={index-1} className="search-tableInfo-ddl-td-content"><span key={index-100}>{item}</span></td>
                                </tr>);
                                })}
                            {
                                this.state.nullLine.map((item,index) =>{
                                    return (
                                    <tr key={index-200}>
                                        <td key={index+20} className="search-tableInfo-ddl-td-line"><span key={index+500}></span></td>
                                        <td key={index-20} className="search-tableInfo-ddl-td-content"><span key={index-500}></span></td>
                                    </tr>);
                                    })
                                }
                            </tbody>
                    </table>
        </div>);
    }
}

export default ShowCodePanel;