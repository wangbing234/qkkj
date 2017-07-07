import React from 'react'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'
import {BfdRequest,CommonUtil} from 'CommonComponent'
import StringDiv from 'CommonComponent/component/stringdiv'
import BreadCrumb from 'CommonComponent/component/breadcrumb'
let that;
const column = [{
    title: '日期',
    key: 'createTime'
}, {
    title: '集群',
    key: 'cluster'
}, {
    title: '主机',
    key: 'host'
}, {
    title: '监控项',
    key: 'metric'
}, {
    title: '邮件报警消息',
    key: 'mailContent',
    render(item, text){
        return ( <StringDiv value= {item}/> )
    }
}, {
    title: '短信报警消息',
    key: 'smsContent',
    render(item, text){
        return ( <StringDiv value= {item}/> )
    }
}, {
    title: '级别',
    key: 'level',
    render(item, text){
        return ( that.getLevelString(item))
    }
}]

const ALL_TYPE_CLUSTER=[{cluster:" ",clusterName:"全部集群"}];
const ALL_TYPE_HOSTS=[{host:" ",hostName:"全部主机"}];
const ALL_TYPE_LEVEL=[{level:" ",levelName:"全部级别"}];
let  currentPage = 1;
class WarnLog extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            pageSize: 15,
            cluster: ' ',
            host: ' ',
            level: ' ',
            titleStr:'报警日志',
            startTime:new Date(),
            endTime:new Date(),
            clusterList:ALL_TYPE_CLUSTER,
            hostsList:ALL_TYPE_HOSTS,
            levelList:ALL_TYPE_LEVEL
        };
        that = this;
    }

    componentDidMount() {
       var getClusterList= BfdRequest.ajaxGetData(Server.jupiterWeb+"configCenterApi/configCenter/alert/getClusterList",
           (data) => {
            that.state.clusterList=ALL_TYPE_CLUSTER.concat(data.totalList);
        });

        var getLevelList= BfdRequest.ajaxGetData(Server.jupiterWeb+"configCenterApi/configCenter/alert/getLevelList",(data) => {
            that.state.levelList=ALL_TYPE_LEVEL.concat(data.totalList);
        });

        $.when(getClusterList, getLevelList).done(function(){
            that.getDataByUrl(1);
        }).fail(function(){
        });
    }
    getLevelString(value)
    {
        for (var toItem of that.state.levelList) {
            if (toItem.level==value)
                return toItem.levelName;
        }
        return "";
    }




    //分页查询列表
    getDataByUrl(page) {
        var startTimeStr = this.state.startTime?new Date(this.state.startTime).format("yyyy-MM-dd 00:00:00"):"";
        var endTimeStr =   this.state.endTime?new Date(this.state.endTime).format("yyyy-MM-dd 00:00:00"):"";
        var alertMsg = {cluster:this.state.cluster,
                        level:this.state.level,
                        host:this.state.host,
                        pageSize:page,
                        limit:this.state.pageSize,
                        startTime:startTimeStr,endTime:endTimeStr};
        let url=`${Server.jupiterWeb}configCenterApi/configCenter/alert/getAlertInfoLogList?${CommonUtil.objectToURL(alertMsg)}`;
        return  BfdRequest.ajaxGetData(url,that.getAlertConfigListResult);
    }

    // 列表查询结果
        getAlertConfigListResult(data){
            that.state.alertConfigList=data;
            that.setState({alertConfigList: data});
        }


    handleChange(name, event) {
        let newState = {};
        if (event && event.target) {
            newState[name] = name === "checked" ? event.target.checked : event.target.value;
        } else {
            newState[name] = event; '菜单'
        }

        that.setState(newState);
    }
    clusterListDataChange(name, event) {
        that.handleChange('cluster',event);
        that.state.host=" ";
        var url=Server.jupiterWeb+"configCenterApi/configCenter/alert/getHostsList?cluster="+event;
        BfdRequest.ajaxGetData(url,that.getHostsListResult,null,false);
    }

    // 主机查询结果
    getHostsListResult(data){
        that.setState({hostsList: ALL_TYPE_HOSTS.concat(data.totalList)});
    }


    handleSelect(startTime, end) {
        that.setState({"startTime":startTime,"endTime":end})
    }

    searchHandler() {
        that.getDataByUrl(1);
    }

    onPageChange(nextPage) {
        currentPage = nextPage;
        that.getDataByUrl(nextPage);
    }

    render() {
        that=this;
        let breadCrumbArr = [{
            text: this.state.titleStr,
            url:''
        }];
        return (
            <div className="module-container">
                <div className="module-search warn-log-div">
                     <div className="module-search-right warn-log">
                            <DateRange start={this.state.startTime} end={this.state.endTime} onSelect={this.handleSelect} style={{marginLeft:10}}/>
                            <Select value={this.state.cluster} style={{marginLeft:10}} onChange={this.clusterListDataChange.bind(this,'cluster')}>
                                {this.state.clusterList.map((item,index) => {
                                    return <Option   value={item.cluster||item}>{item.clusterName||item}</Option>
                                })}
                            </Select>
                            <Select value={this.state.host} onChange={this.handleChange.bind(this,'host')} style={{marginLeft:10}}>
                                {this.state.hostsList.map((item,index) => {
                                    return <Option   value={item.host}>{item.hostName||item.host}</Option>
                                })}
                            </Select>
                            <Select value={this.state.level} onChange={this.handleChange.bind(this,'level')} style={{marginLeft:10}}>
                                {this.state.levelList.map((item,index) => {
                                    return <Option value={item.level}>{item.levelName}</Option>
                                })}
                            </Select>
                            <button className="btn btn-sm btn-primary" style={{marginLeft:10}}
                                    onClick={this.searchHandler.bind(this)}> 查询
                            </button>
                    </div>
                    <div className="module-search-right warn-log2">
                        <div>
                            <DateRange start={this.state.startTime} end={this.state.endTime} onSelect={this.handleSelect} style={{marginLeft:10}}/>
                            <Select value={this.state.cluster} style={{marginLeft:10}} onChange={this.clusterListDataChange.bind(this,'cluster')}>
                                {this.state.clusterList.map((item,index) => {
                                    return <Option   value={item.cluster||item}>{item.clusterName||item}</Option>
                                })}
                            </Select>
                            <Select value={this.state.host} onChange={this.handleChange.bind(this,'host')} style={{marginLeft:10}}>
                                {this.state.hostsList.map((item,index) => {
                                    return <Option   value={item.host}>{item.hostName||item.host}</Option>
                                })}
                            </Select>
                        </div>
                        <div className="div-buttom">
                            <Select value={this.state.level} onChange={this.handleChange.bind(this,'level')} style={{marginLeft:10}}>
                                {this.state.levelList.map((item,index) => {
                                    return <Option value={item.level}>{item.levelName}</Option>
                                })}
                            </Select>
                            <button className="btn btn-sm btn-primary" style={{marginLeft:10}}
                                    onClick={this.searchHandler.bind(this)}> 查询
                            </button>
                        </div>
                    </div>
                </div>

                <div className="module-table">
                    <DataTable data={this.state.alertConfigList}
                               onPageChange={this.onPageChange}
                               showPage="true"
                               column={column}
                               howRow={this.state.pageSize}></DataTable>

            </div></div>
        );
    }
}

export default WarnLog