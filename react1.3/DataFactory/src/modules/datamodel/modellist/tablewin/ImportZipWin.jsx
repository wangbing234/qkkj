import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Select ,Option} from 'bfd-ui/lib/Select'
const style = {
    radio: {marginBottom: 15, textAlign: 'center'},
    btnDiv: {textAlign: 'center'},
    btn: {marginRight: 10},
    file: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0}
}
export default React.createClass({
    getInitialState() {
        return {
            dirData: [],
            dir1Data: [],
            dir: "",
            dir1: ""
        };
    },
    //取消处理
    cancelClick(){
        this.refs.tablePopWin.close();
    },

    handOkClick(){
        this.cancelClick();
    },

    handleChange(name, event) {
        let newState = {};
        if (event && event.target) {
            newState[name] = name === "checked" ? event.target.checked : event.target.value;
        } else {
            newState[name] = event;
        }
        this.setState(newState);
    },

    render() {
        return (
            <Modal ref="tablePopWin">
                <ModalHeader>
                    <h4 className="modal-title">test</h4>
                </ModalHeader>
                <ModalBody>
                    <div className="bdos-form-layout">
                        <div style={style.formItem} className="bdos-form-item">
                            <label >层级</label>
                            <div className="bdos-form-control">
                                <Select defaultValue={this.state.dir} onChange={this.handleChange.bind(this,'dir')}>
                                    {this.state.dirData.map(function (item, index) {
                                        return <Option key={index} value={item.value}>{item.key}</Option>
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div style={style.formItem} className="bdos-form-item">
                            <label >主题域</label>
                            <div className="bdos-form-control">
                                <Select defaultValue={this.state.dir1} onChange={this.handleChange.bind(this,'dir1')}>
                                    {this.state.dir1Data.map(function (item, index) {
                                        return <Option key={index} value={item.value}>{item.key}</Option>
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="bdos-form-item">
                            <label >上传zip</label>
                            <input type="text" value={this.state.filePath} className="bdos-form-control form-control"/>
                            <div className="btn btn-sm btn-default" style={{position:'relative',overflow:'hidden'}}>浏览
                                <input type="file"
                                       onChange={this.handleChange.bind(this,'filePath')}
                                       style={style.file}/>
                            </div>
                        </div>
                    </div>
                    <div style={style.btnDiv}>
                        <div className="btn btn-sm btn-primary" style={style.btn} onClick={this.handOkClick}>
                            确定
                        </div>
                        <div className="btn btn-sm btn-default" onClick={this.cancelClick}>取消</div>
                    </div>
                </ModalBody>

            </Modal>
        )
    }
})