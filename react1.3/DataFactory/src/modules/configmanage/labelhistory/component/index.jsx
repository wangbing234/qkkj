import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { DateRange,DatePicker } from 'bfd-ui/lib/DatePicker'
import message from 'bfd-ui/lib/message'
import LabelInfoForm from './LabelInfoForm';
import {BreadCrumb} from 'CommonComponent'

let that;
let breadCrumbArr = [{text:"配置管理"},{text:"标签历史"}];
let columns = [
    {title: '标签名称', key: 'labelName'},
    {title: '提交人', key: 'submiter'},
    {title: '提交时间', key: 'submitTime'},
    {title: '备注', key: 'desc'},
    {
        title: '操作', key: "operation", render(item){
        return (
            <span>
                <a href="javascript:void(0);" onClick={that.look.bind(that,item)}> 查看 </a>
                <span className="ant-divider"></span>
                <a href="javascript:void(0);" onClick={that.exportTable.bind(that,item)}> 导出 </a>
            </span>);
    }
    }];
const data = {
    totalList: [
        {labelName: "V1.1.1.201602231", submiter: "a", submitTime: "2016-02-22", desc: ""},
        {labelName: "V1.1.1.201602232", submiter: "bb", submitTime: "2016-02-24", desc: ""},
        {labelName: "V1.1.1.201602233", submiter: "ac", submitTime: "2016-02-25", desc: ""},
        {labelName: "V1.1.1.201602234", submiter: "dd", submitTime: "2016-02-26", desc: ""}],
    "currentPage": 1,
    "totalPageNum": 3
}

const ENUM = {
    TABLE: 'table',
    TAG: 'tag'
}

class LabelHistory extends React.Component {
    constructor(prop) {
        super(prop)
        this.state = {
            showType: ENUM.TABLE
        }
        this.look = this.look.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.cancelHandle = this.cancelHandle.bind(this);
    }

    exportTable(item) {
        message.info('导出数据:' + item.labelName)
    }

    look() {
        this.setState({showType: ENUM.TAG})
    }

    handleOk() {
        this.cancelHandle();
    }

    cancelHandle() {
        this.setState({showType: ENUM.TABLE})
    }
    handleSelect(start, end) {
        this.setState({ start })
    }
    renderTable() {
        return (<div>

            <div style={{marginBottom:10}}>
                <DateRange start={this.state.start} style={{marginRight:"10px",marginTop:"10px"}} onSelect={this.handleSelect.bind(this)} />
                <button className="btn btn-primary">查询</button>
            </div>
            <div className="list-container">
                <DataTable onPageChange={this.onPageChange}
                           column={columns}
                           data={data}
                           showPage="true"
                           howRow={10}></DataTable>
            </div>

        </div>)
    }

    renderTagInfo() {
        //TODO:按钮在实际中要去掉,实际中在tab中打开
        return (
            <LabelInfoForm/>
        )
    }

    render() {
        that = this;
        let resultJSX = this.renderTable();
        switch (this.state.showType) {
            case ENUM.TABLE:
                breadCrumbArr = [{text:"配置管理"},{text:"标签历史"}];
                resultJSX = this.renderTable();
                break;
            case ENUM.TAG:
                breadCrumbArr = [{text:"配置管理"},{text:"标签历史"},{text:"标签详情"}];
                resultJSX = this.renderTagInfo();
                break;
        }
        return (<div  className="content-margin" style={{marginTop:20}}>
            <BreadCrumb msgArr={breadCrumbArr} history={this.props.history}/>
            {resultJSX}
        </div>);
    }
}
export default LabelHistory