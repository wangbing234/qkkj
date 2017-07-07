import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import LineChart from 'bfd-ui/lib/LineChart'
import AjaxReq from './../../model/AjaxReq'
import message from 'CommonComponent/component/bdosmessage'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import {Echarts} from 'Echarts'

let that;
let columns;

class RunningInfo extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            lineChartData: [{
                times: 0,
                startTime: ''
            }, {
                times: 0,
                startTime: ''
            }, {
                times: 0,
                startTime: ''
            }, {
                times: 0,
                startTime: ''
            }],
            data: {totalList:[]},
            endDate : (new Date()).getTime(),
            startDate : (new Date()).getTime()-7*24*60*60*1000,
            currentPage: 1,
            pageSize: 10,
        }
    }

    fillColumns(){
        let that = this;
        //todo:时间格式化字段名字
       columns = [
            {title:'序号',key:"index"},
            {title:'开始时间',key:"startTimeStr"},
            {title:'结束时间',key:"finishTimeStr"},
            {title:that.props.runningTime_title,key:"runtimeStr"},
            {
                title:'操作',
                key:"operation",
                render(text, item) {
                return (<div>
                    <a href="javascript:void(0);" onClick={function(){that.handleSeeLog(text)}}>查看日志</a>
                </div>);
            }}
       ]
    }

    // 查看日志
    handleSeeLog(text){
        this.log = ''; //日志内容
        let that = this;
        // 获取后台日志
        let param = {echoType:'PROCESS', execName:text.key, lineFrom:0, lineTo: 2147483647};
        AjaxReq.seeExecuteLog(param, function(result){
            if(result.data && result.data.result) {
                that.log = result.data.result
            } else {
                that.log = ''
            }
            that.setState({});
            that.refs.modal.open();
        });
    }

    componentDidMount() {
        this.getData();
    }

    componentWillUnmount() {
        this.isUnmount = true;
    }

    getData() {
        let that = this;
        let start = new Date(Number(this.state.startDate)).format("yyyy-MM-dd");
        let end = new Date(Number(this.state.endDate)).format("yyyy-MM-dd");
        //todo:start??end??page分页接口没有包含,接口有待调试,chartData没有数据
        let param = {taskCode:this.props.taskCode, pageNum:this.state.currentPage, limit:this.state.pageSize, startTime: start, finishTime: end}
        AjaxReq.getTaskInfo(param, function(result) {
            //console.log(result.data);
            if(!that.isUnmount){
                if(result.data && result.data.taskList){
                    let dateList = [];
                    let valueList = [];
                    result.data.chartData.map((item,index)=>{
                        if(item){
                            dateList.push(item.dateStr);
                            valueList.push(item.value);
                        }
                    });
                    that.renderChart(dateList,valueList);

                    that.setState({
                        data: result.data.taskList
                        //lineChartData: result.data.chartData
                    });
                } else {
                    that.setState({
                        data: {totalList: []}
                        // lineChartData: result.data.chartData
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
                data:['时长(秒)']
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
                    name:'时长(秒)',
                    type:'line',
                    smooth:true,
                    //stack: '时长',
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
        that = this;
        this.fillColumns();
        return (
            <div>
                <DateRange start={this.state.startDate} end={this.state.endDate} onSelect={this.handleSelect.bind(this)} />
                <div>
                    <div ref="lineChart" style={{height:"260px"}}></div>
                    {/*<LineChart category="startTime" cols={{times:'时长'}} data={this.state.lineChartData} style={{height:'150px'}}/>*/}
                </div>
                <div className="module-table">
                    <DataTable column={columns} data={this.state.data}  onPageChange={this.onPageChange.bind(this)} showPage="true" howRow={10}/>
                </div>

                <Modal ref="modal">
                    <ModalHeader>
                        <h4>查看日志</h4>
                    </ModalHeader>
                    <ModalBody>
                        {this.log}
                    </ModalBody>
                </Modal>
            </div>);
    }
}

export default RunningInfo;