import React from 'react';
import {Modal, ModalHeader, ModalBody} from 'bfd-ui/lib/Modal'
import Ajax from '../ajax/AjaxReq'
const TablePopWin = React.createClass({

    getInitialState() {
        return {tableConfig:this.props.tableConfig};
    },
    //取消处理
    cancelClick(){
        this.refs.tablePopWin.close();
    },

    /**
     * 确认处理
     */
    handOkClick(){
        let that=this;
        if(!this.refs.contentWin)return;
        if(!this.refs.contentWin.vaildate || this.refs.contentWin.vaildate())
        {
            let data = this.refs.contentWin.getData && this.refs.contentWin.getData();
            //派发出事件,让外部可以处理
            Ajax.addHiveTable({table:JSON.stringify(data)},{infoCode:this.state.infoCode},(data)=>{
                that.props.submit &&  that.props.submit();
                that.cancelClick();
            })

        }
    },

    /**
     * 接受属性处理
     * @param nextProps
     */
    componentWillReceiveProps(nextProps){
        this.setState({tableConfig:nextProps.tableConfig})
    },

    render() {
        let ContentWin=this.state.tableConfig;
        let tableName;
        if(this.state.data && this.state.data.tableInfo)
            tableName=this.state.data.tableInfo.tableName;
        return (
            <Modal ref="tablePopWin" lock={true}>
                <ModalHeader>
                    <h4 className="modal-title">创建表{tableName}</h4>
                </ModalHeader>
                <ModalBody>
                    <div>
                        {ContentWin?<ContentWin ref="contentWin" data={this.state.data} okButton={this.state.okButton}/>:null}
                        <div className="modal-footer">
                            <button style={this.props.okStyle} className="btn btn-sm btn-primary" onClick={this.handOkClick}>确定
                            </button>
                            <button style={this.props.cancalStyle} className="btn btn-sm btn-default" onClick={this.cancelClick}>取消
                            </button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        )
    }
})
export default TablePopWin