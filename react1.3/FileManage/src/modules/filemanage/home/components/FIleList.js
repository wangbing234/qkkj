/**
 * 时间: 16/4/12 20:10
 * 作者: zhongxia
 * 说明: 文件上传列表,用来展示目前上传哪些文件,以及可以看进度,以及取消上传等操作
 */

import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import Util from 'Commom/js/utils/util.js'
import ENUM from '../enum'


class FileList extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {
      data: {
        totalList: this.props.data,
        currentPage: 1,
        totalPageNum: this.props.data && this.props.data.length
      }
    }
  }

  /**
   * 获取表格列
   * @returns {*}
   */
  getColumns() {
    let that = this;
    return [
      {
        title: '文件名',
        key: 'name'
      }, {
        title: '大小',
        key: 'size',
        render: function (text) {
          return Util.changeSize(parseFloat(text))
        }
      }, {
        title: '状态',
        key: 'statusText',
        render(text, item){
          switch (text) {
            case ENUM.UPLOADSTATUS.ERROR:
              return <span style={{color:"red"}}>上传失败</span>
            case ENUM.UPLOADSTATUS.SCUESS:
              return '上传成功'
            case ENUM.UPLOADSTATUS.WAIT:
              return '等待上传'
            case ENUM.UPLOADSTATUS.UPLOADING:
              return (item.progressNum * 100).toFixed(0) + '%'
          }
        }
      }, {
        title: '操作',
        key: 'operation',
        render: function (item) {
          if (item.statusText !== ENUM.UPLOADSTATUS.ERROR && item.statusText !== ENUM.UPLOADSTATUS.SCUESS) {
            return (
              <a href="javascript:void(0)" onClick={that.cancleUploadHandler.bind(that, item)}>
                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </a>)
          } else {
            return ''
          }
        }
      }
    ]
  }

  /**
   * 设置取消上传
   * @param item
   */
  cancleUploadHandler(item) {
    this.removeFile(item)
  }

  /**
   * 取消文件上传
   * @param item
   */
  removeFile(item) {
    window.uploader.removeFile(item.id, true)
    let data = Util.delItemByKeyAndValue(this.state.data.totalList, 'id', item.id)
    data = Util.generaotrDTData(data);
    this.setState({data: data})
    this.props.removeFile && this.props.removeFile(item, data)
  }

  render() {
    return (<div>
      <DataTable data={this.state.data} column={this.getColumns()} howRow="9999"></DataTable>
    </div>)
  }
}

export default FileList