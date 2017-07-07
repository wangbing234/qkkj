import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import { FormItem } from 'bfd-ui/lib/Form'
import {LabelSelect} from 'CommonComponent'
import AjaxReq from './../../model/AjaxReq'
import message from 'CommonComponent/component/bdosmessage'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

let grainSizeArr = [{name:'全部',value:0},{name:'表结构',value:1},{name:'分区',value:2}];

class ChangedInfo extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            data: {
                "totalList":[]
            },
            endDate : (new Date()).getTime(),
            startDate : (new Date()).getTime()-7*24*60*60*1000,
            currentPage: 1,
            pageSize: 10,
            particle: 0 //0全部1表结构2分区
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentWillUnmount() {
        this.isUnmount = true;
    }

    // 获取表格数据
    getData() {
        let that = this;
        let start = new Date(Number(this.state.startDate)).format("yyyy-MM-dd");
        let end = new Date(Number(this.state.endDate)).format("yyyy-MM-dd");
        let param = {data_base:this.props.table.database, table:this.props.table['table_name'], start: start, end: end, level: this.state.particle, currentPage:this.state.currentPage, pageSize:this.state.pageSize};
        AjaxReq.getTableOptHistoryInfo(param, function(result){
            if(!that.isUnmount){
                if(result.data && result.data.totalList){
                    that.setState({
                        data: result.data
                    });
                } else if(!result.data || !result.data.totalList){
                    that.setState({
                        data: {totalList:[]}
                    });
                }
            }
        });
    }

    //改变起止时间
    handleSelect(start, end){
        let that = this;
        if(start && end){
            if ((end - start) > 30*24*60*60*1000){
                message.danger("开始时间、结束时间区间间隔不能超过30天");
            } else {
                message.close();
                //查询后台数据
                this.setState({currentPage:1, pageSize:10, startDate:start, endDate: end},
                    function () {
                        that.getData();
                    });
            }
        }
    }

    //换页码
    onPageChange(page){
        let that = this;
        that.setState({
                currentPage: page
            }, // 刷新当前state状态下的列表
            function(){that.getData()});
    }

    //改变粒度
    selectChange(dataField, evt){
        let value = evt && evt.target ? evt.target.value : evt;
        this.setState({[dataField]: value,currentPage:1},()=>{
            this.getData();
        });
    }

    getColumns(){
        return [{title:'变更内容',key:'descript',width:'450px',
            render:(text)=>{
                return  <TextOverflow>
                    <div style={{width:450}}>{text}</div>
                </TextOverflow>

            }},
            {title:'粒度',key:'level_str'},
            {title:'时间',key:'optTime_str'}];
    }

    render(){
        return (<div className="search-tableInfo-ddl-div">
                        <div className="row">
                            <div className="col-md-4" style={{ paddingLeft:"7px",paddingRight:0}}>
                                     <LabelSelect label="粒度：" dataProvider={grainSizeArr} labelField="name" dataField="value"
                                             onChange={this.selectChange.bind(this, 'particle')} selected={this.state.particle}/>
                            </div>
                            <div style={{ paddingLeft:10}}>
                                  时间: <DateRange start={this.state.startDate} end={this.state.endDate} onSelect={this.handleSelect.bind(this)} />
                            </div>
                        </div>
                        <div className="module-table">
                                 <DataTable style={{marginTop:20}} column={this.getColumns()} data={this.state.data} showPage="true"  onPageChange={this.onPageChange.bind(this)}   howRow={10}/>
                        </div>
              </div>);
    }
}

export default ChangedInfo;