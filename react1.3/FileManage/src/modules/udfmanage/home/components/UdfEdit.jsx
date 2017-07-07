/***************************************************
 * 时间: 16/6/24 10:51
 * 作者: zhongxia
 * 说明: UDF创建,编辑页面
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import FormInput from 'bfd-ui/lib/FormInput'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import { FormSelect, Option } from 'bfd-ui/lib/FormSelect'
import Upload from 'bfd-ui/lib/Upload'

import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import message from 'CommonComponent/component/bdosmessage'
import EditPanel from 'CommonComponent/component/bdoseditpanel'

//URF地址, 给上传文件用
import Model from '../model/udfManageAjax'

class UdfEdit extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      showBtnCancle: false,  //是否显示取消上传按钮
      hiveDatabase: '',      //Hive库名
      jarPath: '',           //Jar包路径
      listJar: [],
      hiveList: [],
      ...prop.data
    };

    /**
     * 表单验证规则
     */
    this.rules = {
      name: (val)=> {
        if (!val) return 'UDF名不能为空!'
        //实时验证UDF是否重复
        if (this.state.realTimeValiDateUdfName) {
          if (Model.validateUdfName(val, this.state.id)) {
            return 'UDF名称重复，请重新输入!'
          }
        }
      },
      functionName(val){
        if (!val) return '函数名不能为空!'
      },
      className(val){
        if (!val) return '类名不能为空!'
      },
      hiveDatabase(val){
        if (!val) return '库名不能为空!'
      },
      comment(val){
        if (!val) return '使用说明不能为空!'
      },
      jarPath(val){
        if (!val) return 'Jar包不能为空!'
      }
    }
  }


  componentDidMount() {
    this.initWebUpload();

    //编辑回显数据
    if (this.state.id) {
      Model.udfView(this.state.id, (result) => {
        //另存为
        if (this.state.isOtherSave) {
          this.setState({...result.data, id: null})
        }
        //编辑
        else {
          this.setState({...result.data})
        }
      })
    }

    this.getUdfJarList();
    this.getUdfHiveDb();
  }

  componentWillUnmount() {
    this.ajaxUdfListJar.abort();
    this.ajaxUdfHiveDb.abort();
  }

  /**
   * UDF文件下拉列表
   */
  getUdfJarList() {
    this.ajaxUdfListJar = Model.udfListJar((result)=> {
      this.setState({listJar: result.data})
    })
  }

  /**
   * 数据库名下拉列表
   */
  getUdfHiveDb() {
    this.ajaxUdfHiveDb = Model.udfHiveDb((result)=> {
      this.setState({hiveList: result.data})
    })
  }

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  /**
   * 设置实时验证文件名, 失去焦点验证, 获取焦点不验证
   */
  setValidateName(flag) {
    this.setState({realTimeValiDateUdfName: flag}, ()=> {
      if (flag) {
        this.refs.refUdfName && this.refs.refUdfName.validate(this.state.name);
      }
    })
  }

  /**
   * 初始化 webuploader 组件 [非react组件]
   */
  initWebUpload() {
    let that = this;
    let url = Model.getUploadSrc();

    window.uploader = window.WebUploader.create({
      server: url,
      pick: '#udfPicker',
      auto: false,
      threads: 1,
      duplicate: true,
      multiple: false,
      accept: {
        title: 'Jar',
        extensions: 'jar',
        mimeTypes: '.jar'
      },
      fileSingleSizeLimit: 1024 * 1024 * 100  //单个文件不能超过500M[批量上传,大于这个大小,进不了上传队列]
    })

    /**
     * 选中文件之后, 触发
     */
    window.uploader.on('fileQueued', function (file) {
      //文件存在则不继续上传
      if (!Model.udfCheckFile(file.name)) {
        that.startUpload(file);
      }
      //文件存在
      else {
        message.danger('该文件已经存在,无需重复上传!')
        window.uploader.reset()
      }
    })

    /**
     * 文件上传过程中创建进度条实时显示。
     */
    window.uploader.on('uploadProgress', function (file, percentage) {
      that.setState({percentage: percentage})
    })


    /**
     * 上传成功
     */
    window.uploader.on('uploadSuccess', function (file, result) {
      if (result.code !== "000000") {
        message.danger(result.msg)
        that.setState({showBtnCancle: false})
        return;
      }
      console.info("udf upload success...")
      that.setState({jarPath: result.data, showBtnCancle: false});
      that.refs.refJarPath && that.refs.refJarPath.validate(result.data);
      that.getUdfJarList();
    })

    /**
     * 验证文件格式以及文件大小
     **/
    window.uploader.on('error', function (type, file) {
      if (type === 'Q_TYPE_DENIED') {
        if (file.size) {
          message.danger('不支持导入非Jar类型的文件!')
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
    if (Model.udfCheckPermission()) {
      console.log("file start upload...")
      window.uploader.upload()
      this.setState({showBtnCancle: true})
    } else {
      message.danger('没有权限上传UDF文件!')
    }

  }

  /**
   * 取消文件上传
   * @param item
   */
  cancleUpload() {
    console.log("file cancle upload...")
    window.uploader.reset();
    this.setState({showBtnCancle: false})
  }

  /**
   *  跳转回列表页面
   */
  close(isLoadData = true) {
    if (isLoadData) {
      this.props.parent && this.props.parent.getTableData();
    }
    this.props.parent && this.props.parent.close();
  }

  /**
   * 提交表单
   */
  submitHandler() {
    //表单校验
    if (this.refs.form.validate(this.state)) {
      let {listJar,hiveList,createTime,updateTime,...data} = this.state;
      //编辑
      if (this.state.id) {
        Model.updateUdf(data, (result)=> {
          message.success("更新UDF成功!")
          this.close()
        })
      }
      //添加
      else {
        Model.addUdf(data, (result)=> {
          message.success("创建UDF成功")
          this.close()
        })
      }

    }
  }


  /**
   * 渲染取消上传按钮
   * @returns {XML}
   */
  renderBtnCancle() {
    if (this.state.showBtnCancle) {
      return (
        <span>
          <span style={{ marginLeft: 15}}>{(this.state.percentage * 100).toFixed(0)}%</span>
          <button type="button"
                  style={{marginLeft:15}}
                  className="btn btn-sm btn-default"
                  onClick={this.cancleUpload.bind(this)}>
            取消上传
          </button>
       </span>
      )
    }
  }


  render() {
    const style = {
      width: {
        width: 350,
        display: 'inline-block'
      },
      center: {
        marginLeft: 100
      },
      textarea: {
        width: 350,
        height: 130
      }
    }
    let title = this.state.id ? '编辑' : '新增';
    return (
      <EditPanel history={this.props.history}
                 breadCrumbList={[{text:"UDF管理",url:''},{text:title,url:''}]}
                 onChange={this.close.bind(this)}>
        <Form
          ref="form"
          data={this.state}
          rules={this.rules}>
          <FormCategory>
            <FormCategoryItem name="基本信息">
              <FormItem ref="refUdfName" label="UDF名称" required name="name">
                <RestrictInput type="text"
                               style={style.width}
                               className="form-control"
                               value={this.state.name}
                               restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_24}
                               tipString="支持中文、字母、数字、下划线、长度不大于24个字符"
                               onChange={this.handleChange.bind(this,'name')}
                               onBlur={this.setValidateName.bind(this,true)}
                               onFocus={this.setValidateName.bind(this,false)}/>
              </FormItem>

              <FormItem label="函数名" required name="functionName">
                <RestrictInput type="text"
                               style={style.width}
                               className="form-control"
                               value={this.state.functionName}
                               restrict={RestrictConst.NUM_STRING_UNDERLINE_24}
                               tipString="支持字母、数字、下划线、长度不大于24个字符"
                               onChange={this.handleChange.bind(this,'functionName')}/>
              </FormItem>

              <FormItem label="包名.类名" required name="className">
                <RestrictInput type="text"
                               style={style.width}
                               className="form-control"
                               value={this.state.className}
                               restrict={RestrictConst.NUM_STRING_UNDERLINE_POINT_255}
                               tipString="支持字母、数字、下划线、小数点、长度不大于255个字符"
                               onChange={this.handleChange.bind(this,'className')}/>
              </FormItem>

              <FormItem label="参数" name="args">
                <RestrictInput type="text"
                               style={style.width}
                               className="form-control"
                               value={this.state.args}
                               onChange={this.handleChange.bind(this,'args')}/>
              </FormItem>

              <FormItem label="库名" required name="hiveDatabase">
                <FormSelect style={style.width} value={this.state.hiveDatabase}
                            onChange={this.handleChange.bind(this,'hiveDatabase')}>
                  <Option value="">请选择</Option>
                  {
                    this.state.hiveList && this.state.hiveList.map(function (item, index) {
                      return (<Option key={index} value={item}>{item}</Option>)
                    })
                  }
                </FormSelect>
              </FormItem>

              <FormItem label="使用说明" required name="comment">
                <RestrictTextarea className="form-control"
                                  style={style.textarea}
                                  value={this.state.comment}
                                  restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_150}
                                  onChange={this.handleChange.bind(this,'comment')}>
                </RestrictTextarea>
              </FormItem>

              <FormItem ref="refJarPath" label="选择文件" required name="jarPath">
                <FormSelect searchable style={style.width} value={this.state.jarPath}
                            onChange={this.handleChange.bind(this,'jarPath')}>
                  <Option value="">请选择</Option>
                  {
                    this.state.listJar && this.state.listJar.map(function (item, index) {
                      return (<Option key={index} value={item}>{item}</Option>)
                    })
                  }
                </FormSelect>
                <div id="udfPicker" className="btn btn-sm btn-primary">文件上传</div>
                {this.renderBtnCancle()}
              </FormItem>


              <div style={style.center}>
                <button type="button"
                        className="btn btn-sm btn-primary" onClick={this.submitHandler.bind(this)}>确定
                </button>
                <button type="button"
                        style={{marginLeft:30}}
                        className="btn btn-sm btn-default" onClick={this.close.bind(this,false)}>取消
                </button>
              </div>

            </FormCategoryItem>
          </FormCategory>
        </Form>
      </EditPanel>);
  }
}

export default UdfEdit