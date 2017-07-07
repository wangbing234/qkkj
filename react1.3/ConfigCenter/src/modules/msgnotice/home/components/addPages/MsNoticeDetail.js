/**
 * Created by zhongxia on 16/4/5.
 */
import React from 'react'
import MsgNotiveForm from './MsgNotiveFormDetail'
import ManagerUser from './ManagerUserDetail'
let that;
class MsNoticeDetail extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
        this.state = {
            groupType: '邮件组',
            ...this.props.data
        }
    }


    render() {
        return (
            <div className="module-container readOnlyPanel">
                <span className="title_bar">消息组基本信息</span>
                <MsgNotiveForm  ref="msgNotiveForm"  data={this.props.formData} listPage={this.props.listPage}/>
                <span className="title_bar">系统用户</span>
                <ManagerUser     ref="managerUser"   data={this.props.formData}  listPage={this.props.listPage}/>
            </div>
        );
    }
}

export default MsNoticeDetail