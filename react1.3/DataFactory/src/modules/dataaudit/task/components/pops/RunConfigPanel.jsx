/****************************************************
 * create by qing.feng
 * time 2016/7/22 17:03
 * desc：运行界面
*****************************************************/
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import AddRowTable from 'CommonComponent/component/addrowtable'
import RestrictInput from 'CommonComponent/component/restrictinput'
import FormFooter from 'CommonComponent/component/formfooter'
import message from 'CommonComponent/component/bdosmessage'
class RunConfigPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.pageSize = 30;
    this.data = null;
    this.state = {
      data: {
        "totalList": [{}]
      }
    };
  }

  open( data ) {
    this.data = data;
    this.state.data.totalList = [{}];
    this.setState({...this.state});
    this.refs.runConfigModal.open();
  }

  changeHandle( item, dataField, evt ) {
    item[ dataField ] = evt.target.value;
    this.setState( {} );
  }

  deleteClick( item ) {
    var arr = this.state.data.totalList;
    let rowIndex = arr.indexOf( item );
    if ( arr && arr.length > 1 ) {
      arr.splice( rowIndex, 1 );
    }
    this.state.data.totalList = arr;
    this.setState( {} );
  }

  getColumn() {
    let that = this;
    return [
      {
        title: "变量名", key: "key",relateKey:"value", render( text, item ){
        return <RestrictInput
          className="form-control" type="text" value={text}
          onChange={that.changeHandle.bind(that,item,'key')}/>
      }
      },
      {
        title: "变量值", key: "value",relateKey:"key", render( text, item ){
        return <RestrictInput
          className="form-control" type="text" value={item.varValue}
          onChange={that.changeHandle.bind(that,item,'value')}/>
      }
      },
      {
        title: "操作", key: "operation", render( item, text ){
        return <div>
          <a href="javascript:void(0);" onClick={that.deleteClick.bind(that,item)}>删除</a>
        </div>
      }
      }
    ];
  }

  saveInfo() {
    let isSuccess = true;
    let param;
    let params = [];
    this.state.data.totalList.map( ( item ) => {
      if((item.key && !item.value) || (!item.key && item.value)){
        isSuccess = false;
        message.danger("请输入变量名/变量值！");
        return;
      }
      if ( item.key ) {
        param = {}
        param[ item.key ] = item.value;
      }
      if(param) params.push( param );
    } );
    if(isSuccess){
      this.props.runHandle( params, this.data );
      this.cancelHandle();
    }
  }

  cancelHandle() {
    this.refs.runConfigModal.close();
  }

  render() {
    let column = this.getColumn();
    return (
      <Modal ref="runConfigModal">
        <ModalHeader>
          <h4 className="modal-title">添加变量</h4>
        </ModalHeader>
        <ModalBody>
          <div>
            <AddRowTable
              ref="runTable" column={column} data={this.state.data}
              notRequire={true}/>
          </div>
          <FormFooter
            className="text-center" submitClick={this.saveInfo.bind(this)}
            cancelClick={this.cancelHandle.bind(this)}/>
        </ModalBody>
      </Modal>
    );
  }
}
export default RunConfigPanel