import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'

let columns = [
    {title: '任务名称', key: 'taskName'},
    {title: '数据库', key: 'database'},
    {title: '任务描述', key: 'taskDescription'},
    {title: '规则数', key: 'ruleCount'},
    {title: '创建时间', key: 'createTime'},
    {title: '更新时间', key: 'updateTime'},
    {title: '创建人', key: 'creator'},
    {title: '报警组', key: 'alarmGroup'}];
const data = {
    totalList: [
        {
            taskName: "稽核表BI_1",
            database: "Hive1",
            taskDescription: "表BI_1的准确性",
            ruleCount: "4",
            createTime: "2016-02-22",
            updateTime: "2016-02-22",
            creator: "jupiter",
            alarmGroup: "邮件组：e_mail"
        },
        {
            taskName: "稽核表BI_1",
            database: "Hive1",
            taskDescription: "表BI_1的准确性",
            ruleCount: "4",
            createTime: "2016-02-22",
            updateTime: "2016-02-22",
            creator: "jupiter",
            alarmGroup: "邮件组：e_mail"
        },
        {
            taskName: "稽核表BI_1",
            database: "Hive1",
            taskDescription: "表BI_1的准确性",
            ruleCount: "4",
            createTime: "2016-02-22",
            updateTime: "2016-02-22",
            creator: "jupiter",
            alarmGroup: "邮件组：e_mail"
        },
        {
            taskName: "稽核表BI_1",
            database: "Hive1",
            taskDescription: "表BI_1的准确性",
            ruleCount: "4",
            createTime: "2016-02-22",
            updateTime: "2016-02-22",
            creator: "jupiter",
            alarmGroup: "邮件组：e_mail"
        }],
    "currentPage": 1,
    "totalPageNum": 11
}

class DataCheck extends React.Component {
    constructor(prop) {
        super(prop)
        this.state = {};
        this.onPageChange = this.onPageChange.bind(this);
    }

    onPageChange(page) {
        //TODO:翻页
        console.log('翻页:page : ', page)
    }

    componentDidMount() {
        //    TODO:从后端获取数据，或者传prop
    }

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

export default DataCheck;