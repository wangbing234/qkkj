import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import {BreadCrumb} from 'CommonComponent'
import LeftTree from './LeftTree.jsx'
import AjaxReq from './../model/AjaxReq'
import EventName from 'EventName'
import TableTabs from './TableTabs.jsx'
import message from 'CommonComponent/component/bdosmessage'
import {ConfirmModal} from 'CommonComponent'
import confirm from 'bfd-ui/lib/confirm'

let that;

class TableInfoForm extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
    };
    that = this;
  }

  componentDidMount() {
    this.getTopInfo();
  }

  getTopInfo(){
    let that = this;
    let data = this.props.data;
    let param = {project_code:data.project_code, data_base:data.database, table:data.table_name};
    //获取上部基本信息
    AjaxReq.getTableInfo(param, function(result) {
      if(!that.isUnmount){
        if ( result.data) {
          that.setState({
            topInfo:result.data,
            type:'tableInfo'
          });
        }
      }
    })
  }

  componentWillUnmount() {
    console.log('tableinfoform will unmount');
    this.isUnmount = true;
  }

  /*componentWillReceiveProps(nextProps) {
    if (nextProps.tableName != this.props.tableName) {
      //重新加载顶部表格基本信息
      this.getTopInfo();
    }
  }*/

  // 处理收藏/取消收藏操作
  handleCollect() {
    //调用SearchTableList页面的收藏方法
    let data = this.state.topInfo;
    data.database = this.props.data.database;//topInfo没有database属性
    this.props.handleCollect(data,true);//加上database
    /*let tableType;
    let data = this.state.topInfo;
    switch (data.table_type.toLowerCase()){
      case 'hive' :
        tableType = 1;
        break;
      case 'hbase' :
        tableType = 2;
        break;
      case 'mysql' :
        tableType = 3;
        break;
      case 'oracle' :
        tableType = 4;
        break;
    }

    let cmd;
    let msg;
    if(data.collected==1){// 已经收藏
      cmd = 'cancel';
      msg = '取消收藏成功!';
    }else {
      cmd = 'collect';
      msg = '收藏成功!'
    }
    let param = {database:this.props.data.database, tableName: data.table_name, tableType: tableType, cmd:cmd};
    AjaxReq.collectData(param, (result)=>{
      this.getTopInfo();
      message.success(msg);
    });*/
  }


  // 处理共享/取消共享操作(共享和收藏操作如果topInfo包含此信息就用topInfo,如果没有就用该行的表格信息text)
  handleShare() {
    //调用SearchTableList页面的共享方法
    let data = this.state.topInfo;
    data.database = this.props.data.database;//topInfo没有database属性
    this.props.handleShare(data,true);

    /*let that = this;
    if(this.state.topInfo.shared==1) { // 已经共享
      confirm('确认取消共享?', () => {
        that.removeShare();
      })
    }else {
      confirm('确认共享?', () => {
        that.share();
      })
    }*/
  }

  // 共享
  /*share(){
    let that = this;
    let data = this.state.topInfo;//topInfo没有database、table_name_cn信息，就从this.props.data中取吧
    //看下中文名是否有值
    let param = {database:this.props.data.database,createUser:data.create_user, tableName: data.table_name, createTimeStr: data.create_time_str, tableNameZh: this.props.data.table_name_cn};
    AjaxReq.submitShareData(param, function(){
      that.getTopInfo();
      message.success("共享成功!")
    });
  }

  // 取消共享
  removeShare(){
    let that = this;
    let data = this.state.topInfo;//topInfo没有database、就从this.props.data中取吧
    let param = {projectCode:data.project_code, database:this.props.data.database, tableName: data.table_name};
    AjaxReq.removeShareTable(param, function(result){
      that.getTopInfo();
      message.success("取消共享成功!")
    });
  }*/

  render() {
    that = this;
    let collected = this.state.topInfo ? this.state.topInfo.collected : 0;
    let shared = this.state.topInfo ? this.state.topInfo.shared : 0;

    let collectStr;
    let shareStr;
    //bt的功能，太混乱了，子页面还有收藏和共享。。。
    if(collected == 0){//没有收藏
      collectStr = '收藏';
    } else if (collected == 1){// 已经收藏
      collectStr = '取消收藏';
    }

    if(shared == 0){
      shareStr = '共享';
    } else if (shared == 1){
      shareStr = '取消共享';
    }

    let collectBtn;
    let shareBtn;
    if(window.BFD.userType == BFD.ENUM.UserType.OWNER || window.BFD.userType == BFD.ENUM.UserType.USER){
      collectBtn = <button className="btn btn-sm btn-primary common-margin-right"
                           onClick={this.handleCollect.bind(this)}>{collectStr}</button>;
      if(window.BFD.userType == BFD.ENUM.UserType.OWNER){
      shareBtn = <button className="btn btn-sm btn-primary common-margin-right"
                           onClick={this.handleShare.bind(this)}>{shareStr}</button>;
      }
    }

    return (
      <div>
          {/**上部基本信息**/}
          <div className="panel">
            <ul>
              <li>表名:{this.state.topInfo ? this.state.topInfo.table_name : ''}</li>
              <li>表类型:{this.state.topInfo ? this.state.topInfo.table_type : ''}</li>
              <li>创建人:{this.state.topInfo ? this.state.topInfo.create_user : ''}</li>
              <li>所属项目:{this.state.topInfo ? this.state.topInfo.project_cnName : ''}</li>
              <li>创建时间:{this.state.topInfo ? this.state.topInfo.create_time_str : ''}</li>
              {/*<li>生命周期:{this.state.topInfo ? this.state.topInfo.life_time : 0}天</li>*/}
            </ul>
          </div>
          <div className="module-search">
            {/**上部返回和收藏按钮**/}
            <button className="btn btn-sm btn-primary common-margin-right" onClick={this.props.cancel}>返回上级</button>
            {collectBtn}
            {shareBtn}
          </div>
          <TableTabs table={this.props.data}/>
      </div>
    );
  }
}

export default TableInfoForm;