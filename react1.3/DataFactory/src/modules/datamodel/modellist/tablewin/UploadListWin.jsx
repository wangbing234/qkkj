/***************************************************
 * 时间: 2016/7/21 16:04
 * 作者: bing.wang
 * 说明: 改变租户所有者页面
 *
 ***************************************************/
import React from 'react'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import {RestrictInput,RestrictConst} from 'CommonComponent'
import   RegularConst from "CommonComponent/utils/RegularConst"
import Ajax from '../ajax/AjaxReq'
import ParitionWin  from './ParitionWin'
import CommonModalWin from '../../common/CommonModalWin';
import loading from 'CommonComponent/component/loading'
import message from 'CommonComponent/component/bdosmessage'
//const style = {
//    radio: {marginBottom: 15, textAlign: 'center'},
//    btnDiv: {textAlign: 'center'},
//    btn: {marginRight: 10},
//    file: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0}
//}
let that;
class UploadListWin  extends React.Component{

    constructor(prop) {
        super(prop);
        this.hasPartition = false;
        this.rules = {
            partitions: value => {
                return BaseValidate.validateInput({isRequired:true,label:"用户",value});
            },
            filePath: value => {
                return BaseValidate.validateInput({isRequired:true,label:"文件上传",value});
            },
            isow: value => {
                return BaseValidate.validateInput({isRequired: true, label: "是否覆盖", value});
            }
        }


        this.partitionValueArray=[];
        this.state={};
        this.roleList=[];
        this.callBackFun=null;
    }

    componentDidMount() {
        this.initWebUpload();
        this.showPartitionValue();
        this.showPartition();
    }

    showPartition(){
        //获取分区
        Ajax.showPartition( {tableCode:that.props.code},(data)=>{
            that.partitionName=data;
            that.hasPartition=data.length>0;
            that.setState();
        });
    }


    /**
     * 初始化 webuploader 组件 [非react组件]
     */
    initWebUpload() {
        let that = this;
        let url = `${Server.dataFactory}uml/table/uploadTable`;
        window.uploader = window.WebUploader.create({
            server: url,
            pick: '#filePath',
            auto: false,
            threads: 1,
            duplicate: true,
            multiple: false,
            accept: {
                title: 'file',
                extensions: 'txt,csv',
                mimeTypes: '.txt,.csv'
            },
            fileSingleSizeLimit: 1024 * 1024 * 100  //单个文件不能超过500M[批量上传,大于这个大小,进不了上传队列]
        })

        /**
         * 上传文件之前，在这里传参数
         */
        window.uploader.on('uploadBeforeSend', function (file, data) {
            data.tableCode=that.props.code;
            data.isow=that.state.isow;
            data.partitions=that.state.partitions?String(that.state.partitions).replace("/",","):"";
        })

        /**
         * 选中文件之后, 触发
         */
        window.uploader.on('fileQueued', function (file) {

            //文件存在则不继续上传
            that.setState({filePath:file.name});
        })


        /**
         * 上传成功
         */
        window.uploader.on('uploadSuccess', function (file, result) {
            console.log("udf upload success...")
            loading.show(false);
            if(result.code=="000000")
            {
                if(that.callBackFun)
                    that.callBackFun();
                message.success( "上传成功！");
                that.props.cancelClick();
            }
            else {
                message.danger(result.msg);
                that.setState({filePath:""});
            }

        })

        /**
         * 验证文件格式以及文件大小
         **/
        window.uploader.on('error', function (type,file) {
            if (type === 'Q_TYPE_DENIED') {
                if (file.size) {
                    message.danger('不支持导入该类型的文件!')
                } else {
                    message.danger('不能上传空文件(文件大小0kb)!')
                }
            } else if (type === 'F_EXCEED_SIZE') {
                message.danger('单个文件大小不能超过100M')
            }
            else{
                message.success( "上传失败！" );
            }
            that.setState({filePath:""});
            loading.show(false);
        })
    }


    /**
     * 开始上传文件
     */
    startUpload() {
        loading.show(true)
        console.log("file start upload...")
        window.uploader.upload();
        //this.setState({showBtnCancle: true})
    }



    showPartitionValue(){
        Ajax.showPartitionValue({tableCode:this.props.code},(data)=>{
            that.partitionValueArray=data;
            that.setState();
        });
    }

    /**
     * 公用处理修改
     * @param dataField
     * @param evt
     */
    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.setState({[dataField]: value});
    }

    /**
     * 验证
     * @returns {*}
     */
    doVaildate(){
        let rBoolean=that.refs.form.validate(that.state);
        return rBoolean;
    }

    /**
     * 加载处理
     */
    openParitionWin(){
        that.refs._modal.setState({...this.props,partition:this.partitionName});
        this.refs._modal.refs._modal.open();
    }

    submit(fun){
        this.callBackFun=fun;
        that.startUpload();
    }

    submitHander(){
        this.showPartitionValue();
        this.refs._modal.refs._modal.close();
    }

    render(){
        that=this;
        let partitionString;
        if(this.hasPartition)
        {
            partitionString= <FormItem label="选择分区" required name="partitions">
                                <div>
                                    <Select value={this.state.partitions} onChange={this.handleChange.bind(this,"partitions")}
                                            placeholder="请选择">
                                        {this.partitionValueArray.map((item, index)=> {
                                            return (<Option key={index} value={item}>{item}</Option>)
                                        })}
                                    </Select>
                                    <button className="btn btn-primary" style={{ marginLeft: "10px"}} onClick={this.openParitionWin.bind(this)}>增加分区</button>
                                </div>
                            </FormItem>
        }
        return(
            <div style={{ paddingBottom: "23px"}}>
                <Form ref="form" rules={this.rules} className="popUpWinStyle" labelWidth="100">
                    <FormItem label="表名称" required name="tableName">
                        <input type="text" readonly value={this.props.tableName} disabled={true} className="bdos-form-control form-control"/>
                    </FormItem>
                    <FormItem label="是否覆盖" required name="isow">
                        <Select value={this.state.isow} onChange={this.handleChange.bind(this,"isow")} placeholder="请选择">
                                <Option key="1" value="1">是</Option>
                                <Option key="0" value="0">否</Option>
                        </Select>
                    </FormItem>
                    {partitionString}
                    <FormItem label="上传文件" required name="filePath">
                        <div>
                                 <input type="text" readonly value={this.state.filePath} disabled={true}   style={{display: "inline"}}  className="bdos-form-control form-control"/>
                                 <div id="filePath"  className="btn btn-sm btn-primary" style={{marginLeft: "10px",fontSize:"14px"}}>选择文件</div>
                        </div>
                        <span style={{color:"red", marginLeft: "10px",marginTop: "10px",display: "flex"}}>请选择csv,txt文件</span>
                    </FormItem>
                </Form>

                <CommonModalWin className="none" title="创建分区" ref="_modal"  Child={ParitionWin} submit={this.submitHander.bind(this)}/>
            </div>
        );
    }
}

export default UploadListWin