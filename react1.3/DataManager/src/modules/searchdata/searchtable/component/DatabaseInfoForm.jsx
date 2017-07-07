import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form'
import { Select ,Option} from 'bfd-ui/lib/Select'

import {BreadCrumb} from 'CommonComponent'
const breadCrumbArr = [{
    text: '查找数据',
    url:''
},{
    text: '查找表',
    url:''
}];

class DatabaseInfoForm extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {id: 1}
    }

    render(){
        return (
            <div>
                <div style={{marginBottom:20,marginTop:20,paddingLeft:25}}>
                    <BreadCrumb msgArr={breadCrumbArr} history={this.props.history} />
                </div>
                <Form  horizontal className="search-database-form ">
                    <div className="row">
                        <div className="col-md-6">
                            <FormItem label="资源类型:" required>
                                <Select selected="apple" className="form-control" disabled>
                                    <Option value="apple">hive</Option>
                                    <Option value="mi">小米</Option>
                                    <Option value="samsung">三星</Option>
                                    <Option value="huawei">华为</Option>
                                </Select>
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormItem label="资源名称:" inline required>
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                        <div className="col-md-6">
                            <FormItem label="IP/主机名:" inline required>
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormItem label="JDBC端口号:" inline required>
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                        <div className="col-md-6">
                            <FormItem label="用户名:" inline required>
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormItem label="密码:" inline >
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                        <div className="col-md-6">
                            <FormItem label="JDBC连接参数:" inline >
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormItem label="元数据库IP/主机名:" inline required>
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                        <div className="col-md-6">
                            <FormItem label="元数据库端口号:" inline required>
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormItem label="元数据库名:" inline required>
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                        <div className="col-md-6">
                            <FormItem label="元数据库用户名:" inline required>
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormItem label="元数据库密码:" inline required>
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                        <div className="col-md-6">
                            <FormItem label="元数据库连接参数" inline required>
                                <input type="text"  className="form-control"></input>
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormItem label="机器登录名:">
                                <input type="text" className="form-control"></input>
                            </FormItem>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}

export default DatabaseInfoForm;