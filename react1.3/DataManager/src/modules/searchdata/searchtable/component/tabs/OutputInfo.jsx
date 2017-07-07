import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import LineChart from 'bfd-ui/lib/LineChart'
import AjaxReq from './../../model/AjaxReq'
import message from 'CommonComponent/component/bdosmessage'
import {Echarts} from 'Echarts'


let that;
let columns = [
    {title:'序号',key:'index',width:'50'},
    {title:'时间',key:'date_str',width:'150'},
    {title:'净增量',key:'append_storage_str',width:'150'},
    {title:'总存储量',key:'total_storage_str',width:'50'}];
let lineChartData= [{
    times: '0',
    date: ''
}]
class OutputInfo extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            data: {
                totalList: []
            },
            lineChartData: [
                {
                    times: '0',
                    date: ''
                }
            ],
            endDate : (new Date()).getTime(),
            startDate : (new Date()).getTime()-7*24*60*60*1000,
            currentPage: 1,
            pageSize: 10
        }
        that = this;
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
        let param = {project_code:'', data_base:this.props.table.database, table:this.props.table['table_name'], currentPage:this.state.currentPage, pageSize:this.state.pageSize, start: start, end: end};
        AjaxReq.getOutputInfo(param, function(result){
            if(!that.isUnmount){
                if (result.data && result.data.totalList) {
                    let totalList = result.data.totalList;
                    let lineChartData = [];
                    let dateList = [];
                    let valueList = [];
                    totalList.map((item,index)=>{
                        dateList.push(item.date_str);
                        valueList.push(item.total_storage_str.substr(0,item.total_storage_str.length-1));
                    });
                    dateList.reverse();
                    valueList.reverse();
                    that.renderChart(dateList,valueList);
                    that.setState({
                        data: result.data
                    });
                } else if(!result.data){
                    that.setState({
                        data: {totalList:[]}
                    });
                }
            }
        });
    }

    // 点击DateRange
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

    // 换页
    onPageChange(page){
        let that = this;
        that.setState({
                currentPage: page
            }, // 刷新当前state状态下的列表
            function(){that.getData()});
    }

    setOption(dateList,valueList){
        let that = this;
        return {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                x:'right',
                data:['表储存量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    data : dateList
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    }
                }
            ],
            series : [
                {
                    name:'表储存量',
                    type:'line',
                    smooth:true,
                    //stack: '表储存量',
                    itemStyle: {
                        normal: {
                            color: "#64b5f6"
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0, color: 'rgba(100,181,246, 0.8)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(100,181,246, 0.2)' // 100% 处的颜色
                            }], true)//"#64b5f6"
                        }},
                    data:valueList
                }
            ]
        };
    }

    renderChart(dateList,valueList) {
        let that = this;
        if ( this.refs.lineChart ) {
            var myChart = Echarts.init(this.refs.lineChart);
            // 绘制图表
            myChart.setOption(this.setOption(dateList,valueList));
        }
    }

    render(){
        return (
            <div>
                <DateRange start={this.state.startDate} end={this.state.endDate} onSelect={this.handleSelect.bind(this)} />
                <div>
                    <div ref="lineChart" style={{height:"260px"}}></div>
                    {/*<LineChart category="date" cols={{times:'表存储量'}} data={this.state.lineChartData} style={{height:'150px'}}/>*/}
                </div>
                <div className="module-table">
                    <DataTable column={columns} data={this.state.data}  onPageChange={this.onPageChange.bind(this)} showPage="true" howRow={10}/>
                </div>
            </div>
        );
    }
}

export default OutputInfo;