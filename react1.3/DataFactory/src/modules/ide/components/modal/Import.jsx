/***************************************************
 * 时间: 7/19/16 14:44
 * 作者: zhongxia
 * 说明: 脚本导入
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Select ,Option} from 'bfd-ui/lib/Select'
import { Form, FormItem } from 'bfd-ui/lib/Form2'

import TreeSelect from 'CommonComponent/component/treeselect'
import message from 'CommonComponent/component/bdosmessage'
//custom components
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import loading from 'CommonComponent/component/loading'

import Model from 'IDERoot/model/ide'
import ENUM from 'IDERoot/enum'


class Import extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      dirData: [],
      treeCode: prop.treeCode,
      treeName: prop.treeName
    };
    this.rules = {
      treeName(val){
        return BaseValidate.validateInput({label: "目录", value: val, isRequired: true});
      },
      fileName(val){
        return BaseValidate.validateInput({label: "导入文件", value: val, isRequired: true});
      }
    }
  }

  componentDidMount() {
    let that = this;
    that.initWebUpload();

    //获取保存路径
    this.ajaxGetSavePath = Model.getSavePath(function (result) {
      that.setState({pathTreeSelectData: result.data})
    })
  }

  componentWillUnmount() {
    this.ajaxGetSavePath && this.ajaxGetSavePath.abort();
  }


  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  /**
   * 初始化 webuploader 组件 [非react组件]
   */
  initWebUpload() {
    let that = this;
    let url = Model.getImportUrl();
    window.uploader = window.WebUploader.create({
      server: url,
      pick: '#picker',
      auto: false,
      threads: 1,
      duplicate: true,
      multiple: false,
      accept: {
        title: 'zip',
        extensions: 'zip',
        mimeTypes: '.zip'
      },
      fileSingleSizeLimit: 1024 * 1024 * 100  //单个文件不能超过500M[批量上传,大于这个大小,进不了上传队列]
    })

    /**
     * 上传文件之前，在这里传参数
     */
    window.uploader.on('uploadBeforeSend', function (file, data) {
      data['projectCode'] = window.projectCode;
      data['treeCode'] = that.state.treeCode == "0" ? '' : that.state.treeCode;
    })

    /**
     * 选中文件之后, 触发
     */
    window.uploader.on('fileQueued', function (file) {
      that.setState({fileName: file.name})
    })


    /**
     * 上传成功
     */
    window.uploader.on('uploadSuccess', function (file, result) {
      console.log("upload success...")
      loading.show(false);
      if (result.code === '000000') {
        message.success(result.msg);
      } else {
        message.danger(result.msg);
      }

      EventEmitter.dispatch(ENUM.EVENTNAME.IDE_UPDATE_SCRIPTLIST, {})
      EventEmitter.dispatch(ENUM.EVENTNAME.IDE_UPDATE_SCRIPTTREE, {})
      that.props.close && that.props.close();
    })

    /**
     * 验证文件格式以及文件大小
     **/
    window.uploader.on('error', function (type, file) {
      if (type === 'Q_TYPE_DENIED') {
        if (file.size) {
          message.danger('不支持导入非Zip类型的文件!')
        } else {
          message.danger('不能上传空文件(文件大小0kb)!')
        }
      } else if (type === 'F_EXCEED_SIZE') {
        message.danger('单个文件大小不能超过100M')
      }
    })
  }

  /**
   * 开始上传文件
   */
  startUpload(file) {
    if (this.refs.form.validate(this.state)) {
      console.log("file start upload...")
      loading.show(true);
      window.uploader.upload()
      this.setState({showBtnCancle: true})
    }
  }

  /**
   * 取消文件上传
   * @param item
   */
  cancleUpload() {
    console.log("file cancle upload...")
    window.uploader.reset();
    loading.show(false);
    this.setState({showBtnCancle: false})
  }

  /**
   * 关闭弹框
   */
  close() {
    this.props.close && this.props.close()
    //回调清空右键导出的脚本id
    this.props.callback && this.props.callback();
  }


  render() {
    console.info("脚本导入:", this.props, this.state)

    const style = {
      btnDiv: {textAlign: 'center'},
      btn: {marginRight: 10},
      input: {width: 200, float: 'left', marginRight: 20}
    }
    return (
      <div className="ide-import">
        <Form
          ref="form"
          data={this.state.formData}
          rules={this.rules}>

          <FormItem required label="目录" name="treeCode">
            <TreeSelect value={this.state.treeCode}
                        data={this.state.pathTreeSelectData}
                        onChange={this.handleChange.bind(this,'treeCode')}/>
          </FormItem>

          <FormItem required label="导入文件" name="fileName">
            <input type="text"
                   readOnly
                   style={style.input}
                   className="form-control"
                   value={this.state.fileName}
                   onChange={this.handleChange.bind(this,'fileName')}/>
            <div id="picker" className="btn btn-sm btn-default">浏览</div>
          </FormItem>

          <div style={style.btnDiv}>
            <div className="btn btn-sm btn-primary" style={style.btn} onClick={this.startUpload.bind(this)}>确定</div>
            <div className="btn btn-sm btn-default" onClick={this.close.bind(this)}>取消</div>
          </div>
        </Form>
      </div>
    );
  }
}

export default Import


