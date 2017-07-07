/***************************************************
 * 时间: 2016/7/21 15:51
 * 作者: bing.wang
 * 说明: 租户配置页面
 *
 ***************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import Ajax from '../ajax/AjaxReq'
import {BreadCrumb} from 'CommonComponent'

const Index = React.createClass({
   getInitialState() {
    return { value1: "1", value2: "1", value3: "1",brand:'',value3: "1",value4:'1' ,value5:'1'};
   },

    /**
     * 公用修改处理
     * @param dataField
     * @param evt
     */
    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.setState({[dataField]: value});
    },

    /**
     * 确认处理
     */
   submitHandler(){
       //Ajax.
       //    let url=`${Server.authority}messageGroup/getAll/${this.state}"}`;
   },
   render() {
       var currentStyle={style:{height:75}};
        return (
            <div className="module-border">
                <Form horizontal>
                    <FormItem  {...currentStyle}>
                        <p><span>每个租户成员都需要独立进行功能授权？</span></p>
                        <RadioGroup name="value1" onChange={this.handleChange.bind(this)} value={this.state.value1}>
                            <Radio value="1">单独授权</Radio>
                            <Radio value="2">无需授权，成员进入租户即拥有租户项下所有功能权限</Radio>
                        </RadioGroup>
                    </FormItem >
                    <FormItem   {...currentStyle}>
                        <p><span> 每个租户成员都需要独立进行资源授权？</span></p>
                        <RadioGroup name="value2" onChange={this.handleChange.bind(this)} value={this.state.value2}>
                            <Radio value="1">单独授权</Radio>
                            <Radio value="2">无需授权，成员进入租户即拥有租户项下所有功能权限</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem  {...currentStyle}>
                        <p><span> 每个租户成员都需要独立进行hive授权？</span></p>
                        <RadioGroup name="value3" onChange={this.handleChange.bind(this)} value={this.state.value3}>
                            <Radio value="1">单独授权</Radio>
                            <Radio value="2">无需授权，成员进入租户即拥有租户项下所有功能权限</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem  {...currentStyle}>
                        <p><span> 每个租户成员都需要独立进行hbase授权？</span></p>
                        <RadioGroup name="value4" onChange={this.handleChange.bind(this)} value={this.state.value4}>
                            <Radio value="1">单独授权</Radio>
                            <Radio value="2">无需授权，成员进入租户即拥有租户项下所有功能权限</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem  {...currentStyle}>
                        <p><span> 每个租户成员都需要独立进行hdfs授权？</span></p>
                        <RadioGroup name="value5" onChange={this.handleChange.bind(this)} value={this.state.value5}>
                            <Radio value="1">单独授权</Radio>
                            <Radio value="2">无需授权，成员进入租户即拥有租户项下所有功能权限</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem>
                        <button type="button" className="btn btn-primary" style={{marginTop:15}}
                                onClick={this.submitHandler.bind(this)}>确定
                        </button>
                    </FormItem>
                </Form>
            </div>
        );
    }
});
export default Index