import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
let columns = [
    {title: '脚本名称', key: 'scriptName', key: "scriptName"},
    {title: '所属目录', key: 'dirOwner', key: "dirOwner"},
    {title: '工作流名称', key: 'workflowName', key: "workflowName"},
    {title: '发布时间', key: 'releaseTime', key: "releaseTime"},
    {title: '发布人', key: 'releaser', key: "releaser"},
    {title: '版本号', key: 'version', key: "version"}];
const data = {
    totalList: [
        {
            scriptName: "hive1",
            dirOwner: "aa",
            workflowName: "ww1",
            releaseTime: "2016-02-22",
            releaser: "bb",
            version: "v1.12"
        },
        {
            scriptName: "hbase2",
            dirOwner: "bb",
            workflowName: "ww22",
            releaseTime: "2016-02-24",
            releaser: "cc",
            version: "v1.23"
        },
        {
            scriptName: "shell2",
            dirOwner: "ac",
            workflowName: "wf2",
            releaseTime: "2016-02-25",
            releaser: "dd",
            version: "v1.2"
        },
        {
            scriptName: "python1",
            dirOwner: "dd",
            workflowName: "sf3",
            releaseTime: "2016-02-26",
            releaser: "cc",
            version: "v1.33"
        }],
    "currentPage": 1,
    "totalPageNum": 4
}

class ScriptForm extends React.Component {
    render() {
        return (<div style={{marginLeft:"20px",marginRight:"20px"}}>
            <DataTable url="" data={data}
                       onPageChange={this.onPageChange}
                       showPage="true"
                       column={columns}
                       howRow={10}></DataTable>
        </div>);
    }
}

export default ScriptForm;