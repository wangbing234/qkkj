import React from 'react'

import { DateRange } from 'bfd-ui/lib/DatePicker'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import message from 'CommonComponent/component/bdosmessage'
import confirm from 'bfd-ui/lib/confirm'
import {BfdRequest,LabelSelect} from 'CommonComponent'
import Model from 'WarnSettingModel'
import ENUM from 'WarnSettingEnum'
import '../css/warnsetting.less'
let that;
let serverUrl = Server.jupiterWeb + 'configCenterApi/configCenter';
const column = [
    {
        title: '集群',
        key: 'cluster'
    }, {
        title: '组',
        key: 'group'
    }, {
        title: '监控项',
        key: 'metric'
    }, {
        title: '操作',
        key: 'operation',
        render(item, text){
            return (
                <div>
                    <a href="javascript:void(0)" onClick={that.editHandler.bind(that,item)}>编辑</a>
                    <a href="javascript:void(0)" onClick={that.detailHandler.bind(that,item)}>详情</a>
                    <a href="javascript:void(0)" onClick={that.deleteHandler.bind(that,item)}>删除</a>
                </div>
            )
        }
    }];
class AlarmList extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            pageSize: 10,
            cluster: ENUM.CLUSTER,
            group: ENUM.GROUP,
            metric: ENUM.METRIC,
            clusterArr: [ENUM.CLUSTER],
            groupArr: [ENUM.GROUP],
            metricArr: [ENUM.METRIC]
        };
        that = this;
    }

    handleSelectChange(dataField, value) {
        that.setState({[dataField]: value});
        switch (dataField) {
            case 'cluster':
                this.clearDataSource(this.state.groupArr);
                this.clearDataSource(this.state.metricArr);
                this.setFirstSelectItem(this.state.groupArr,'group');
                this.setFirstSelectItem(this.state.metricArr,'metric');
                /*this.refs.group.setState({value:ENUM.GROUP});
                this.refs.metric.setState({value:ENUM.METRIC});*/
                //根据集群查询组
                this.getGroup(value);
                break;
            case 'group':
                this.clearDataSource(this.state.metricArr);
                this.setFirstSelectItem(this.state.metricArr,'metric');
                //this.refs.metric.setState({value:ENUM.METRIC});
                //根据集群和组查询监控项
                this.getWarnItem(value);
                break;
        }
    }

    /**数组开头添加-全部-**/
    addAll(arr,item) {
        //arr.unshift(ENUM.ALL);
        arr.unshift(item);
    }

    /**清除数据源，用于切换下拉框时清除后面下拉框的数据**/
    clearDataSource(arr){
        arr.splice(1,arr.length-1);
        return arr;
    }

    setFirstSelectItem(arr,field){
        let value;
        if(arr.length == 1){
            value = arr[0];
            //this.refs[field].value = value;
            let obj = {};
            obj[field] = value;
            this.setState(obj);
        }
    }

    /**分页**/
    onPageChange(nextPage) {
        console.log("load data currentPage ==> ", nextPage);
        that.getDataByUrl(nextPage);
    }

    componentDidMount() {
        this.loadInterval = setInterval(this.initRequest(),100);
    }

    /*组件将要销毁时，将是否是卸载状态的标识至为false*/
    componentWillUnmount () {
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }

    initRequest(){
        this.getCluster();
    }
    /**查询表格数据**/
    getDataByUrl(page = 1) {
        let clusterV = '';
        let groupV = '';
        let metricV = '';
        if (that.state.cluster && that.state.cluster != ENUM.CLUSTER) {
            clusterV = that.state.cluster;
        }
        if (that.state.group && that.state.group != ENUM.GROUP) {
            groupV = that.state.group;
        }
        if (that.state.metric && that.state.metric != ENUM.METRIC) {
            metricV = that.state.metric;
        }
        var alertMsg = {
            cluster: clusterV, group: groupV,
            metric: metricV, pageSize: this.state.pageSize, limit: page, orders: '', desc: ''
        };
        Model.getWarnList(alertMsg, (result) => {
            if(this.loadInterval){
                that.setState({data: result});
            }
        });
    }

    /**查询集群列表**/
    getCluster() {
        Model.getCluster((result) => {
            if(this.loadInterval){
                that.addAll(result.totalList,ENUM.CLUSTER);
                that.setState({clusterArr: result.totalList});
                this.getDataByUrl();
                //获取组列表，编辑时回显
                /*if (that.state.cluster && that.state.cluster != '请选择') {
                 this.getGroup(that.state.cluster);
                 }*/
            }
        });
    }

    /**查询组列表**/
    getGroup(cluster) {
        if (cluster == ENUM.CLUSTER) {
            cluster = '';
        }
        Model.getGroup(`&cluster=${cluster}`, (result) => {
            this.addAll(result.totalList,ENUM.GROUP);
            that.setState({groupArr: result.totalList});
        });
    }


    /**查询监控项列表**/
    getWarnItem(group) {
        let param = `&cluster=${this.state.cluster}&group=${group}`;
        Model.getWarnItem(param, (result) => {
            that.addAll(result.totalList,ENUM.METRIC);
            that.setState({metricArr: result.totalList});
        });
    }


    /**查询按钮click**/
    searchHandler() {
        this.getDataByUrl();
    }

    /**新增**/
    addHandler() {
        if(this.loadInterval){
            this.props.openHandler('add', {});
        }
    }

    /**编辑**/
    editHandler(item) {
        this.props.openHandler('update', item);//调试方便
    }

    /**详情**/
    detailHandler(item) {
        this.props.openHandler('detail', item);
    }

    /**删除**/
    deleteHandler(item) {
        confirm('确认删除吗', () => {
            let alertMsg = {alertConfig: JSON.stringify(item)};
            Model.delWarnItem(alertMsg, (data) => {
                message.success('删除成功');
                //刷新列表
                that.getDataByUrl();
            })
        })
    }


    render() {
        that = this;
        return (
            <div>
                <div className="module-search">
                    <button className="btn btn-sm btn-primary"
                            onClick={this.addHandler.bind(this)}> 新增
                    </button>
                    <div className="module-search-right">
                        <Select value={that.state.cluster} className="common-margin-right"
                                 onChange={this.handleSelectChange.bind(this,'cluster')}>
                            {
                                this.state.clusterArr.map((item, index)=> {
                                    return <Option key={index} value={item}>{item}</Option>
                                })
                            }
                        </Select>
                        <Select value={that.state.group} className="common-margin-right"
                                 onChange={this.handleSelectChange.bind(this,'group')}>
                            {
                                this.state.groupArr.map((item, index)=> {
                                    return <Option key={index} value={item}>{item}</Option>
                                })
                            }
                        </Select>

                        <Select value={that.state.metric} className="common-margin-right"
                                 onChange={this.handleSelectChange.bind(this,'metric')}>
                            {
                                this.state.metricArr.map((item, index)=> {
                                    return <Option key={index} value={item}>{item}</Option>
                                })
                            }
                        </Select>

                        <button className="btn btn-sm btn-primary"
                                onClick={this.searchHandler.bind(this)}> 查询
                        </button>
                    </div>
                </div>


                <div className="module-table operatioinTable">
                    <DataTable data={this.state.data}
                               onPageChange={this.onPageChange}
                               showPage="true"
                               column={column}
                               howRow={this.state.pageSize}></DataTable>
                </div>
            </div>
        );
    }
}
export default AlarmList