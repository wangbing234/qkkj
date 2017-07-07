/**
 * 文件管理模块
 * 时间：2016年4月19日 14:49:37
 * 作者：xiaodong.huang
 * 主要功能: HDFS上文件的管理
 *  1. 批量文件上传
 *  2. 文件删除,下载
 *  3. 文件夹重命名
 *  4. 文件查看等功能
 */

import React from 'react'

/* bfd-ui*/
import DataTable from 'bfd-ui/lib/DataTable'
//import message from 'bfd-ui/lib/message'
import confirm from 'bfd-ui/lib/confirm'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

/* custom*/
import BDOSModal from 'BDOSModal'
import BreadCrumb from 'BreadCrumb'
import DirForm from './DirForm'
import FileList from './FIleList'
import message from 'CommonComponent/component/bdosmessage'
import AuthButton from 'CommonComponent/component/authbutton'

/* urlconfig*/
import Model from '../model/fileManageAjax'

/* 工具函数*/
import Util from 'Commom/js/utils/util.js'
import ENUM from '../enum'
import validate from '../validate'

/**
 * 由于点击导航菜单,触发两次导致该问题
 * */
let that;

class FileManage extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {
      pageSize: 10,
      parRead: false,                   // 上一级目录读权限
      currRead: false,                   // 当前读权限
      currWrite: false,                   // 当前写权限
      modalTitle: '新建文件夹',    // 新建文件夹==>弹框的title
      fileList: [],               // 上传文件列表
      uploadedTotal: 0,           // 已经上传的文件数
      filePath: '',               // 文件路径
      isLoaded: false             // 加载数据是否结束
    }

    this.uuid = Date.now();
  }

  componentDidMount() {
    this.getDataByUrl()
    if (window.WebUploader) {
      this.initWebUpload()
    } else {
      console.error('WebUploader.min.js is Not loaded')
    }
  }

  componentWillUnmount() {
    this._isMounted = true;  //isMounted 是React 的属性, 因此加一个 _
    this.ajaxGetListData.abort();
  }

  /**
   * 表单onchange 事件函数
   * 该函数支持 文本框, 下拉框, 复选框, 单选框的 onchange 事件
   * @param name
   * @param event
   */
  handleChange(name, event) {
    let newState = {}
    if (event && event.target) {
      newState[name] = name === 'checked' ? event.target.checked : event.target.value
    } else {
      newState[name] = event
    }
    this.setState(newState)
  }

  /**
   * 获取表格列
   * @returns {*[]}
   */
  getColumns() {
    let that = this;
    return [
      {
        title: '名称',
        key: 'fileName',
        width: '350px',
        render: function (text, item) {
          let style = {
            width: 300
          }
          if (item.fileType === ENUM.FILETYPE.DIR) {
            return (
              <TextOverflow>
                <a href="javascript:void(0)" style={style}
                   onClick={that.navClickHandler.bind(that, item.path)}>
                  {text}
                </a>
              </TextOverflow>
            )
          }
          return (<TextOverflow><p style={style}>{text}</p></TextOverflow>)
        }
      }, {
        title: '类型',
        key: 'fileType'
      }, {
        title: '大小',
        key: 'fileSize',
        render: function (text, item) {
          if (item.fileType === "dir") {
            return "";
          }
          else {
            return Util.changeSize(parseFloat(text))
          }
        }
      }, {
        title: '修改时间',
        key: 'updateTime'
      }
    ]
  }

  /**
   * 获取有权限的操作列
   * @returns {{title: string, key: string, render: render}}
   */
  getOpColumns() {
    let that = this;
    return {
      title: '操作',
      key: 'operation',
      width: '120px',
      render: function (item) {
        let jsx
        if (item.fileType === ENUM.FILETYPE.DIR) {
          jsx = (
            <AuthButton data-code="1040107" renderType="a"
                        disabled={!that.state.currWrite}
                        href="javascript:void(0)"
                        onClick={that.renameHandler.bind(that, item)}>
              重命名
            </AuthButton>)
        } else {
          jsx = (
            <AuthButton data-code="1040105" renderType="a"
                        href="javascript:void(0)"
                        disabled={!that.state.currRead}
                        onClick={that.downloadFromHdfs.bind(that, item)}>
              下载
            </AuthButton>)
        }
        return (
          <div>
            {jsx}
            <AuthButton data-code="1040103" renderType="a"
                        href="javascript:void(0)"
                        disabled={!that.state.currWrite}
                        onClick={that.delHandler.bind(that, item)}>
              删除
            </AuthButton>
          </div>
        )
      }
    }
  }

  /**
   * 获取没有权限的操作列
   * @returns {{title: string, key: string, render: render}}
   */
  getNotOpColumns() {
    return {
      title: '操作',
      key: 'operation',
      width: '120px',
      render: function (item) {
        let jsx
        if (item.fileType === ENUM.FILETYPE.DIR) {
          jsx = (<span style={{color:'#CCC',cursor:'pointer'}}> 重命名</span>)
        } else {
          jsx = (<span style={{color:'#CCC',cursor:'pointer'}}> 下载</span>)
        }
        return (
          <div>
            {jsx}
            <span style={{color:'#CCC',cursor:'pointer'}}> 删除</span>
          </div>
        )
      }
    }
  }

  /**
   * 根据路径和文件夹名称获取文件列表
   * @param path 路径
   * @param fileName 文件夹名称
   * @param flag 是否使用 Loading 效果
   * @param pageSize 每页显示条数
   * @param currentPage 当前页数
   */
  getDataByUrl(path, fileName, flag = true, pageSize = 10, currentPage = 1) {
    this.ajaxGetListData = Model.getListData(path, fileName,
      (data)=> {
        this.setState({
          data: data.data,
          ...data.data,
          path: path
        })
      },
      ()=> {
        //错误的处理
        this.setState({filePath: this.state.data && this.state.data.filePath})
      },
      flag, pageSize, currentPage)
  }

  /**
   * 文件搜索
   */
  searchHandler(e) {
    if (e.keyCode) {
      if (e.keyCode === 13)  this.getDataByUrl(this.state.filePath, this.state.fileName)
    }
    else {
      this.getDataByUrl(this.state.filePath, this.state.fileName)
    }
  }

  /**
   *
   */
  goToPath(e) {
    if (e.keyCode === 13) {
      this.getDataByUrl(this.state.filePath, this.state.fileName)
    }
  }

  /***************************************************************
   *          文件上传相关函数  START
   ***************************************************************/

  /**
   * 初始化 webuploader 组件 [非react组件]
   */
  initWebUpload() {
    console.info("初始化上传组件...")
    let url = Model.getUploadUrl();
    window.uploader = window.WebUploader.create({
      //swf: '/src/common/js/lib/webuploader/Uploader.swf',  // 可以不配置这个,使用HTML5原生的文件上传
      server: url,
      pick: '#picker',
      resize: false,
      auto: false,
      threads: 1,
      compress: false,  //设置为不压缩图片
      duplicate: true,
      fileSingleSizeLimit: 1024 * 1024 * 500  //单个文件不能超过500M[批量上传,大于这个大小,进不了上传队列]
    })

    /**
     * 上传文件之前，在这里传参数
     */
    window.uploader.on('uploadBeforeSend', function (file, data) {
      const currentFile = that.state.fileList[that.state.uploadedTotal] || {};
      const uploadPath = currentFile.path || that.state.filePath;
      console.info("当前路径:", uploadPath);
      data['path'] = uploadPath;
    })

    /**
     * 当一批文件加入队列时触发
     */
    window.uploader.on('filesQueued', function (files) {
      let existFileName = '',
        specialCharFileName = '',
        moreSizeFileName = '',
        existQueudFileName = '',
        flag = true,
        errorMsg = '',
        newFiles = $.extend(true, [], that.state.fileList)


      //限制上传文件的个数, 最多上传100个
      if (files.length > 100) {
        //必须重置上传队列, 否则 下次继续选择还是有问题
        message.danger('上传文件的个数不能超过100个!')
        window.uploader.reset()
        return;
      }

      /**
       * 全部上传完成,则清除队列
       */
      if (that.state.uploadedTotal === that.state.fileList.length) {
        newFiles = []
        !that._isMounted && that.setState({uploadedTotal: 0, fileList: []})
      }

      /**
       * 验证文件名存在特殊字符,文件大于500M，文件已存在，则从队列移除
       */
      for (let i = 0; i < files.length; i++) {
        let fileName = files[i].name
        if (Util.valIsExist4Arr(that.state.fileList, 'name', files[i].name)) {
          //BUG5118 文件管理-文件上传，上传文件时，取消后会继续上传  START
          /*原因:上传文件列表已经存在的文件,需要清除文件列表,否则会存在上传列表*/
          window.uploader.removeFile(files[i].id, true)
          //BUG5118 文件管理-文件上传，上传文件时，取消后会继续上传  END

          existQueudFileName += files[i].name + ','
          flag = false;
        }
        else if (!validate.checkFileName(fileName)) {
          this.removeFile(files[i].id, true)
          specialCharFileName += files[i].name + ','
          flag = false
        } else if (files[i].size > 1024 * 1024 * 500) {
          this.removeFile(files[i].id, true)
          moreSizeFileName += files[i].name + ','
          flag = false
        } else if (Model.checkAsyncFileExist(that.state.filePath, fileName)) {
          this.removeFile(files[i].id, true)
          existFileName += files[i].name + ','
          flag = false
        } else {
          files[i].path = that.state.filePath; //保存上传的目录
          newFiles.push(files[i])
        }
      }

      // [文件名,大小验证] 有文件已经存在,或者有文件存在特殊字符
      if (!flag) {
        if (existQueudFileName.length > 0) {
          existQueudFileName = existQueudFileName.substr(0, existQueudFileName.length - 1)
          errorMsg += `</br>文件:${existQueudFileName}已经存在上传队列中,`
        }
        if (existFileName.length > 0) {
          existFileName = existFileName.substr(0, existFileName.length - 1)
          errorMsg += `</br>文件:${existFileName}已经存在,`
        }
        if (specialCharFileName.length > 0) {
          specialCharFileName = specialCharFileName.substr(0, specialCharFileName.length - 1)
          errorMsg += `</br>文件:${specialCharFileName}存在特殊字符,`
        }
        if (moreSizeFileName.length > 0) {
          moreSizeFileName = moreSizeFileName.substr(0, moreSizeFileName.length - 1)
          errorMsg += `</br>文件:${moreSizeFileName}大于500M,`
        }
        errorMsg = errorMsg.substring(5, errorMsg.length)
        errorMsg += '请确定后再导入!'
        message.danger(errorMsg);

        //没有文件正在上传,则重置上传队列
        if (that.state.fileList === 0) {
          window.uploader.reset()
        } else {
          // 有文件正在上传,则清除本地加入队列的文件
          for (let i = that.state.fileList.length; i < newFiles.length; i++) {
            window.uploader.removeFile(newFiles[i].id, true)
          }
        }
      }
      // 所有文件在HDFS都不存在,且不在队列中
      else {
        that.startUpload(newFiles)
      }
    })

    /**
     * 文件上传过程中创建进度条实时显示。
     */
    window.uploader.on('uploadProgress', function (file, percentage) {
      if (Model.checkAsyncFileWrite(file.path || that.state.filePath)) {
        //如果还没有上传完成,则提示99%;
        percentage = percentage === 100 ? 99 : percentage;
        //有上传文件的权限
        file['statusText'] = ENUM.UPLOADSTATUS.UPLOADING
        file['progressNum'] = percentage
        let newFileList = Util.setItemByKeyAndValue(that.state.fileList, 'id', file.id, file)
        that.setState({fileList: newFileList})
      }
      else {
        // 没有权限,则提示上传失败
        window.uploader.removeFile(file.id, true)
        file['statusText'] = ENUM.UPLOADSTATUS.ERROR
        let newFileList = Util.setItemByKeyAndValue(that.state.fileList, 'id', file.id, file)
        that.setState({fileList: newFileList, uploadedTotal: that.state.uploadedTotal + 1})
      }
    })

    /**
     * 上传成功
     */
    window.uploader.on('uploadSuccess', function (file) {
      file['statusText'] = ENUM.UPLOADSTATUS.SCUESS
      let newFileList = Util.setItemByKeyAndValue(that.state.fileList, 'id', file.id, file)
      that.setState({fileList: newFileList, uploadedTotal: that.state.uploadedTotal + 1})
      that.getDataByUrl(that.state.filePath, '', false)
    })

    /**
     * 上传失败
     ***/
    window.uploader.on('uploadError', function (file) {
      file['statusText'] = ENUM.UPLOADSTATUS.ERROR
      let newFileList = Util.setItemByKeyAndValue(that.state.fileList, 'id', file.id, file)
      that.setState({fileList: newFileList, uploadedTotal: that.state.uploadedTotal + 1})
    })

    /**
     * 验证文件格式以及文件大小
     **/
    window.uploader.on('error', function (type, file) {
      if (type === 'Q_TYPE_DENIED') {
        if (file.size) {
          message.danger('不支持导入该类型的文件!')
        } else {
          message.danger('不能上传空文件(文件大小0kb)!')
        }
      } else if (type === 'F_EXCEED_SIZE') {
        message.danger('单个文件大小不能超过500M')
      }
    })
  }

  /**
   * 开始上传文件
   */
  startUpload(files) {
    if (files.length > 0) {
      this.setState({fileList: files})
      window.uploader.upload()
      this.refs.fileListModal && this.refs.fileListModal.open()
    }
  }

  /**
   * 打开文件列表
   */
  openFileListModal() {
    this.refs.fileListModal && this.refs.fileListModal.open()
  }

  /**
   * 关闭文件列表
   */
  closeFileListModal() {
    this.refs.fileListModal && this.refs.fileListModal.close()
  }

  /**
   * 取消文件上传,删除上传列表中的数据   TODO
   * [弹框文件列表 x 按钮,点击之后会触发]
   */
  cancleFileUpload(item, data) {
    this.setState({fileList: data.totalList})
  }


  /**********************************************************************
   *  文件删除,下载相关函数 START
   **********************************************************************/
  /**
   * 下载文件
   * 下载之前先判断文件是否存在
   */
  downloadFromHdfs(item) {
    let that = this;
    let fileName = item.fileName;
    let path = that.state.filePath;

    if (Model.checkAsyncFileExist(path, fileName)) {
      confirm(`确认下载文件[${item.fileName}]吗?`, () => {
        Model.downloadFromHdfs(path, fileName, function () {
          that.getDataByUrl(path)
        })
      })
    } else {
      message.info(`文件 [${that.state.downloadFileName}] 不存在`)
    }
  }

  /**
   * 删除文件
   * 删除之前先判断文件是否存在
   */
  delHandler(item) {
    let that = this;
    let fileName = item.fileName
    let path = that.state.filePath

    if (Model.checkAsyncFileExist(path, fileName)) {
      confirm(`确认删除文件[${item.fileName}]吗?`, () => {
        Model.deleteHdfs(path, fileName, function () {
          that.getDataByUrl(path, that.state.fileName)
        })
      })
    } else {
      message.info(`文件 [${that.state.downloadFileName}] 不存在`)
    }
  }

  /**********************************************************************
   *  文件夹命名,新建 相关函数  START
   **********************************************************************/
  /**
   * 新建文件夹  弹出表单框
   */
  addFilesHandler() {
    this.setState({
      modalTitle: '新建文件夹',
      _isAdd: true,
      formData: ''
    })
    this.refs.modal.open()
  }

  /**
   * 重命名文件夹 弹出表单框
   * @param item 表格行数据
   */
  renameHandler(item) {
    this.setState({
      modalTitle: '重命名文件夹',
      _isAdd: false,
      formData: item
    })
    this.refs.modal.open()
  }


  /**
   * 重命名文件夹 弹出表单框
   * @param data 表单返回的数据
   */
  editDirHandler(data) {
    let that = this;
    if (this.state._isAdd) {
      Model.addDir(this.state.filePath, data.fileName, function () {
        message.success(`新建文件夹 [${data.fileName}] 成功!`)
        that.getDataByUrl(that.state.filePath)
      })
    } else {
      Model.renameDir(this.state.filePath, data.oldFileName, data.fileName, function () {
        message.success('修改文件夹名称成功!')
        that.getDataByUrl(that.state.filePath)
      })
    }
    that.close()
  }

  /**
   * 关闭新增文件夹窗口
   */
  close() {
    this.refs.modal.close()
  }

  /** *************************************************************
   *          其他功能 相关函数 START
   ***************************************************************/
  /**
   * 表格分页
   */
  onPageChange(nextPage) {
    this.getDataByUrl(this.state.filePath, this.state.fileName, true, this.state.pageSize, nextPage)
  }

  /**
   * 查看文件夹里面的文件
   * @param filePath 文件夹路径
   */
  navClickHandler(filePath) {
    this.setState({fileName: ''})  //如何切换目录了, 搜索的文件名清空
    this.getDataByUrl(filePath)
  }

  /**
   * 返回上级
   */
  returnPrevPath() {
    let filePath = this.state.filePath;
    filePath = filePath.split('/').slice(0, -1).join('/');
    filePath = filePath || "/";
    this.getDataByUrl(filePath, this.state.fileName);
  }

  /** *************************************************************
   *          render 相关函数  START
   ***************************************************************/

  renderTable() {
    let newColumn = []
    newColumn = newColumn.concat(this.getColumns())
    if (true) {
      newColumn.push(this.getOpColumns())
    } else {
      newColumn.push(this.getNotOpColumns())
    }
    return (
      <DataTable data={this.state.data}
                 onPageChange={this.onPageChange.bind(this)}
                 showPage="true"
                 column={newColumn}
                 howRow={this.state.pageSize}>
      </DataTable>
    )
  }

  /**
   * 新建文件夹，选择文件上传按钮 是否可用的判断
   */
  renderBtns() {
    return (
      <div style={{float: 'left'}}>
        <AuthButton data-code="1040102" disabled={!this.state.currWrite}
                    renderType="icon" type="plus-square"
                    style={{marginRight:20}}
                    onClick={this.addFilesHandler.bind(this)}>新建文件夹
        </AuthButton>
        <AuthButton data-code="1040104" id="picker"
                    disabled={!this.state.currWrite} style={{height: 30,marginRight:20}}
                    renderType="icon" type="plus-square">上传文件
        </AuthButton>
        <AuthButton style={{height: 30}} renderType="icon" type="reply"
                    disabled={!this.state.parRead}
                    onClick={this.returnPrevPath.bind(this)}>返回上级
        </AuthButton>
      </div>
    )
  }

  /**
   * 查看上传文件列表，默认不显示
   * 只有在有文件上传并且隐藏了文件上传列表弹框才显示
   */
  renderFileInfo() {
    let that = this;
    // 上传完成则不显示查看进度功能
    // 上传列表中 没有文件 ,则 三秒后关闭 窗口
    if (this.state.fileList.length > 0 && this.state.fileList.length !== this.state.uploadedTotal) {
      return (
        <div style={{float: 'right'}}>
            <span style={{margin: '0 10px 0 40px', color: '#C2C2C2', fontSize: 12}}>
                        正在上传 {this.state.uploadedTotal + 1 }/{this.state.fileList.length}
            </span>
          <AuthButton renderType="icon" type="eye"
                      onClick={this.openFileListModal.bind(this)}>
            查看进度
          </AuthButton>
        </div>
      )
    } else {
      if (this.state.fileList.length > 0 && this.state.fileList.length === this.state.uploadedTotal) {
        setTimeout(function () {
          that.closeFileListModal()
        }, 3000)
      }
    }
    return ''
  }

  render() {
    that = this;
    return (
      <div className="filemanage module-container">
        <div>
          {/* 文件路径 START*/}
          <div className="filemanage-nav">
            <input type="text"
                   style={{width:350}}
                   className="form-control"
                   value={this.state.filePath}
                   onKeyDown={this.goToPath.bind(this)}
                   onChange={this.handleChange.bind(this, 'filePath')}/>
          </div>

          {/*搜索集合*/}
          <div className="module-search">
            <div className="module-search-right">
              <input type="text"
                     style={{width: 200, marginRight: 10,float: 'left'}}
                     className="form-control form-inline"
                     placeholder="输入文件名关键字"
                     value={this.state.fileName}
                     onKeyDown={this.searchHandler.bind(this)}
                     onChange={this.handleChange.bind(this, 'fileName')}/>

              <button className="btn btn-sm btn-primary"
                      onClick={this.searchHandler.bind(this)}>
                查询
              </button>
            </div>

            {/* 按钮组 START*/}
            <div className="module-search-left">
              {this.renderFileInfo()}
              {this.renderBtns()}
            </div>

            {/* 文件信息展示区 START*/}
            <div className="filemanage-fileInfo" style={{display:'none'}}>
              <span>文件备份数:{this.state.replication || 0}</span>
            <span style={{marginLeft: 35}}>
                文件块大小:{Util.changeSize(parseFloat(this.state.blockSize)) || '0 MB'}
            </span>
            </div>
          </div>
          {/* 表格 START*/}
          <div className="module-table">
            {this.renderTable()}
          </div>

          {/* 新建文件夹表单+上传列表 START*/}
          <BDOSModal ref="modal" title={this.state.modalTitle}
                     hideFooter>
            <DirForm data={this.state.formData}
                     close={this.close.bind(this)}
                     path={this.state.filePath}
                     submitHandler={this.editDirHandler.bind(this)}/>
          </BDOSModal>

          <div className="fileList">
            <BDOSModal ref="fileListModal" title={'上传列表'}
                       hideFooter>
              <FileList data={this.state.fileList}
                        removeFile={this.cancleFileUpload.bind(this)}/>
            </BDOSModal>
          </div>
        </div>
      </div>
    )
  }
}

export default FileManage