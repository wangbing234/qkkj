/****************************************************
 * create by qing.feng
 * time 2016/7/21 20:25
 * desc：工作流维护- 导入界面
*****************************************************/
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import DataTable from 'bfd-ui/lib/DataTable'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import message from 'CommonComponent/component/bdosmessage'

class ImportPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.isOpen = false;
    this.state = { data: { totalList: [] } };
  }

  open() {
    this.refs.modal.open();
    this.isOpen = true;
    this.setState( { data: { totalList: [] } } );
    //this.initUploader();
  }

  /*删除处理*/
  deleteHandle( item ) {
    let that = this;
    let list = this.state.data.totalList;
    list.map( ( dItem, index ) => {
      if ( dItem.id === item.id ) {
        list.splice( index, 1 );
        that.uploader.removeFile( item.id, true );
      }
    } );
    this.setState( { ...this.state } );
  }

  /*上传文件list*/
  uploadFile() {
    if ( this.uploader ) {
      this.uploader.upload();
    }
  }

  /*清空上传列表*/
  clearAllFiles() {
    let that = this;
    let listData = this.state.data;
    this.uploader.reset();
    this.setState( { data:{...listData,totalList:[]} } );
  }

  getColumn() {
    let that = this;
    return [
      { title: "文件名", key: "fileName" },
      { title: "大小(字节)", key: "fileSize" },
      { title: "状态", key: "status",render(text){
        return <TextOverflow>
          <p className="table-column-max-width">{text}</p>
        </TextOverflow>
      } },
      {
        title: "操作", key: "operation", render( item, text ){
        if(!item.deleteDisabled){
          return (
            <div>
              <a href="javascript:void(0);" onClick={that.deleteHandle.bind(that,item)}> 删除 </a>
            </div>
          );
        }else{
          return null;
        }

      }
      }
    ];
  }

  /*初始化uploader*/
  componentDidUpdate() {
    if ( this.isOpen ) {
      this.isOpen = false;
      this.initUploader();
    }

  }

  initUploader() {
    console.log( $( '#picker' ) )
    let that = this;
    if(this.uploader){
      this.uploader.destroy();
      this.uploader = null;
    }
    this.uploader = WebUploader.create( {
      // 文件接收服务端。
      server: `${Server.workflow}fileUpload?projectId=${window.projectId}&projectCode=${window.projectCode}`,
      //prepareNextFile:true,
      // 选择文件的按钮。可选。
      // 内部根据当前运行是创建，可能是input元素，也可能是flash.
      pick: '#wl_picker',
      auto: false,
      threads: 1,
      // 只允许选择文件的类型。
      accept: {
        title: 'rar/zip/xml',
        extensions: 'rar,zip,xml',
        mimeTypes: '.rar,.zip,.xml'
      },

      // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
      resize: false,
      duplicate: true,
      fileSingleSizeLimit: 1024 * 1024 * 500  //单个文件不能超过500M[批量上传,大于这个大小,进不了上传队列]
    } );
    // 当有文件被添加进队列的时候
    this.uploader.on( 'fileQueued', function ( file ) {
      let fileList = that.state.data.totalList;
      let hasFile = fileList.filter( ( fileItem ) => {
        return fileItem.fileName == file.name
      } );
      if ( !hasFile.length ) {
        fileList.push( {
          id: file.id,
          fileName: file.name,
          fileSize: file.size,
          status: "等待上传",
          lastModifiedDate: file.lastModifiedDate
        } );
      }else{
        message.danger(`${file.name} 名称重复`);
      }
      that.setState( { ...that.state } );
    } );

    // 文件上传过程中创建进度实时显示。
    this.uploader.on( 'uploadProgress', function ( file, percentage ) {
      let fileList = that.state.data.totalList;
      fileList.map( ( item, index ) => {
        if ( item.fileName == file.name ) {
          if ( percentage < 100 && percentage > 0 ) {
            item.status == `已上传:${percentage}%`;
          } else if ( percentage == 100 ) {
            item.status == "上传成功";
            item.deleteDisabled = true;
          }
          that.setState( { ...that.state } );
          return;
        }
      } );
    } );

    /*单个文件上传成功*/
    this.uploader.on( 'uploadSuccess', function ( file,response ) {
      let fileList = that.state.data.totalList;
      fileList.map( ( item, index ) => {
        if ( item.id == file.id ) {
          item.status = response?response[0]:"上传成功";
          item.deleteDisabled = true;
          return;
        }
      } );
      that.setState( { ...that.state } );
    } );

    /*单个文件上传失败*/
    this.uploader.on( 'uploadError', function ( file,response ) {
      let fileList = that.state.data.totalList;
      fileList.map( ( item, index ) => {
        if ( item.id == file.id ) {
          item.status = response?response[0]:"上传失败";
          item.deleteDisabled = false;
          return;
        }
      } );
      that.setState( { ...that.state } );
    } );
    /*上传完成*/
    /*uploader.on( 'uploadComplete', function( file ) {
     });*/
  }

  closeHanlder(){
    this.uploader.destroy();
    this.uploader = null;
  }

  render() {
    let column = this.getColumn();
    return (
      <div>
        <Modal ref="modal" onClose={this.closeHanlder.bind(this)}>
          <ModalHeader>
            <h4 className="modal-title">上传文件</h4>
          </ModalHeader>
          <ModalBody>
            <DataTable howRow={this.pageSize} column={column} data={this.state.data}/>
            <div className="file-div">
              <div id="wl_picker" style={{position:'relative'}} className="btn btn-sm btn-primary">添加
              </div>
            </div>

            <div style={{marginTop:"15px"}}>
              <button
                className="btn btn-sm btn-primary"
                style={{marginRight:"10px"}}
                onClick={this.uploadFile.bind(this)}
              >上传
              </button>
              <button
                className="btn btn-sm btn-default"
                onClick={this.clearAllFiles.bind(this)}
              >清空
              </button>
            </div>

          </ModalBody>
        </Modal>
      </div>
    );
  }
}
export default ImportPanel