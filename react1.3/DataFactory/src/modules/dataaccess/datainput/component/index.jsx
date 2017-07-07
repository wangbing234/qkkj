/****************************************************
 * create by qing.feng
 * time 2016/7/26 14:56
 * desc：数据接入-主入口
 *****************************************************/
import React from 'react'
import InputListPanel from './InputListPanel'
import TypeConst from '../../utils/TypeConst'
import DbInfoPanel from './DbInfoPanel'
import FtpInfoPanel from './FtpInfoPanel'
import ExcutePanel from '../../common/ExcutePanel'
import '../../css/style.less'
/* render 界面的唯一类型标识 */
const LIST_ADD_ROLE_DB = 'list_add_role_db';//用户管理界面-新增用户界面的唯一类型标识
const LIST_ADD_ROLE_FTP = 'list_add_role_ftp';
const ROLEMANAGE_LIST = 'rolemanage_list';// 用户/用户管理界面的唯一类型标识
const EXCUTE_SCRIPT = 'excute_script';
class InputManager extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { viewType: ROLEMANAGE_LIST };
  }

  /*返回list界面*/
  cancelAddUser( value ) {
    this.setState( { viewType: ROLEMANAGE_LIST } );
  }

  /*进入添加/编辑界面*/
  addRole( data,isLook ) {
    this.isLook = isLook;
    this.infoData = data;
    if ( data.typeCode == TypeConst.DB ) {
      this.setState( { viewType: LIST_ADD_ROLE_DB } );
    } else {
      this.setState( { viewType: LIST_ADD_ROLE_FTP } );
    }
  }

  openExcuteScript(data,command,saveData){
    this.refs.excutePanel.open(data,saveData,command);
    this.setState({...this.state});
    //this.setState( { viewType: EXCUTE_SCRIPT } );
  }

  backToInfo(data){
    this.addRole(data);
  }

  render() {
    let renderView;
    switch ( this.state.viewType ) {
      case ROLEMANAGE_LIST:
        //breadCrumbArr=[{text:"数据接入"},{text:"数据接入"}];
        renderView = <InputListPanel addRole={this.addRole.bind(this)}/>;
        break;
      case LIST_ADD_ROLE_DB:
        //breadCrumbArr=[{text:"数据接入"},{text:"新增资源"}]
        renderView = <DbInfoPanel
          ref="dbInfo_modal"
          cancelAddUser={this.cancelAddUser.bind(this)}
          data={this.infoData}
          isLook={this.isLook}
          isNew={this.infoData.id?false:true}
          openExcuteScript={this.openExcuteScript.bind(this)}
        />
        break;
      /*case EXCUTE_SCRIPT:
        renderView = <ExcutePanel
          data={this.scriptData}
          backToInfo={this.backToInfo.bind(this)}
          command={this.scriptCommand}
        />
        break;*/
      case LIST_ADD_ROLE_FTP:
        //breadCrumbArr=[{text:"数据接入"},{text:"新增资源"}]
        renderView = <FtpInfoPanel
          ref="ftpInfo_modal"
          cancelAddUser={this.cancelAddUser.bind(this)}
          data={this.infoData}
          isLook={this.isLook}
          isNew={this.infoData.id?false:true}
          openExcuteScript={this.openExcuteScript.bind(this)}
        />;
        break;
      default:
        break;
    }
    return (<div className="module-container data-access-div">
      {/*<BreadCrumb msgArr={breadCrumbArr} history={this.props.history}/>*/}
      {renderView}
      <ExcutePanel
        ref="excutePanel"
        backToInfo={this.backToInfo.bind(this)}
      />
    </div>);
  }
}
export default InputManager