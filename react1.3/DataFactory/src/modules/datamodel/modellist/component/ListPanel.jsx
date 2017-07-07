import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import RestrictInput from 'CommonComponent/component/restrictinput'
import Auth from 'CommonComponent/utils/Auth'
import '../../css/style.less'
import AuthButton from 'CommonComponent/component/authbutton'
import Upload from 'CommonComponent/component/upload'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import  TypeConst from '../../common/TypeConst'
import Ajax from '../ajax/AjaxReq'
import  TablePopWin from '../tablewin/TablePopWin'
import  ImportZipWin from '../tablewin/ImportZipWin'
import DataModelList from '../../modelcanvas/component/lefttree/DataModelList'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import message from 'CommonComponent/component/bdosmessage'
import confirm from 'bfd-ui/lib/confirm'
import UploadListWin from '../tablewin/UploadListWin';
import CommonModalWin from '../../common/CommonModalWin';
import EventName from '../../../../containers/EventName';
import TextOverflow from 'bfd-ui/lib/TextOverflow'
class ListPanel extends React.Component {
  constructor(props) {
    super(props);
    this.pageSize = 10;
    this.state = {projectCode: window.projectCode};
    this.selectList = [];
    this.tableData = {totalList: []};
    let that = this;
    this.columns = [
      {
        title: '表名',
        key: 'tableName',
        render(text){
          return (
              <TextOverflow>
                <p style={{maxWidth: "100px",margin:"0px"}}>{text}</p>
              </TextOverflow>
          )
        }
      }, {
        title: '表中文名',
        key: 'cnName',
        render(text){
          return (
              <TextOverflow>
                <p style={{maxWidth: "100px",margin:"0px"}}>{text}</p>
              </TextOverflow>
          )
        }
      }, {
        title: '类型',
        key: 'type',
        render(text, record, index) {
          let renderView = TypeConst.DATA_TYPE[text];
          if (!renderView)
            renderView = "未知";
          return renderView
        }
      },
      {
        title: '库',
        key: 'dbName'
      },
      {
        title: '层级/主题域',
        key: 'hierarchyName',
        render(text, record, index) {
          let rStr = record.subjectName ? (record.hierarchyName + "/" + record.subjectName) : record.hierarchyName;
          return rStr
        }
      }, , {
        title: '创建人',
        key: 'createUser',
      },
      //{
      //    title: '生命周期',
      //    key: 'lifecycle'
      //},
      {
        title: '创建方式',
        key: 'loadType',
        render(text, record, index) {
          let rStr = text == 0 ? "自动" : "手动";
          return rStr
        }
      },
      //{
      //    title: '创建时间',
      //    key: 'createTime',
      //    render(item, text){
      //        var dataString=new Date(parseInt(item)).format("yyyy-MM-dd hh:mm:ss");
      //        return (
      //            <div>
      //                {dataString}
      //            </div>
      //        )
      //    }
      //},
      {
        title: '更新时间',
        key: 'updateTime',
        width: '120px',
        render(item, text){
          var dataString = new Date(parseInt(item)).format("yyyy-MM-dd hh:mm:ss");
          return <span>{dataString}</span>;
        }
      }, {
        title: '操作',
        key: 'operation',
        width: '110px',
        render(text, record, index) {
          let disableItem = ([1, 2].indexOf(text.type)) == -1 ? true : false;
          let disableUploadItem = ([1].indexOf(text.type)) == -1 ? true : false;
          return (<div className="myproject-list-opration" style={{lineHeight:'10px'}}>
            <AuthButton renderType="a" data-code="1020708" type="edit" onClick={that.editDiffrentTable.bind(that,text)}
                        title="编辑">编辑</AuthButton>
            <AuthButton renderType="a" data-code="1020709" disabled={disableItem} style={{marginLeft:'5px'}}
                        type="bar-chart"
                        onClick={that.queryIdeDataHandle.bind(that,text)} title="查询数据">查询数据</AuthButton>
            <AuthButton renderType="a" data-code="1020710" style={{marginLeft:'5px'}} type="upload"
                        disabled={disableUploadItem}
                        onClick={that.openUploadListWin.bind(that,text)} title="上传">上传</AuthButton>
          </div>);
        }
      }]
  }


  uploadHander() {

  }


  componentDidMount() {
    this.loadInterval = setInterval(this.queryDataByPage(1), 100);
    EventEmitter.subscribe(TypeConst.QUERY_MODEL_BY_TYPE, this.queryListByCode.bind(this))
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval(this.loadInterval);
    this.loadInterval = false;
  }

  queryListByCode(item) {
    this.queryDataByPage(1, item);
  }

  /*复选框change 处理*/
  handleCheckboxSelect(selectItems) {
    this.selectList = selectItems;
    this.setState();
  }


  /**
   * 公用修改处理
   * @param dataField
   * @param select
   * @param text
   */
  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.state[dataField] = value;
    this.setState();
  }

  /**
   * 查询第几页
   * @param page 第几页
   */
  queryDataByPage(page, item) {
    if (!item)
      item = {projectCode: window.projectCode}
    let that = this;
    var info14 = {"currentPage": page, "pageSize": this.pageSize, ...item};
    let objectUrl = CommonUtil.objectToURL(info14);
    Ajax.queryIdeListByPage(objectUrl, (data) => {
      that.tableData = data;
      if (that.loadInterval) {
        that.setState({...that.state});
      }
    })
  }

  /**
   * 打开IDE的界面
   */
  queryIdeDataHandle(item, e) {
    let record = {};
    record.href = `/ide/ide?tableName=${item.tableName}&dbName=${item.dbName}&type=${TypeConst.DATA_TYPE[item.type]}`
    record.title = '脚本管理'
    this.props.history.pushState(null, record.href);
    EventEmitter.dispatch(EventName.addTab, record)
  }

  /**
   * 点出查询处理
   */
  searchHander() {
    this.queryDataByPage(1, this.state);
  }


  /**
   * 到入完成处理
   */
  importOneHandle(data) {
    console.log('complete', data)
  }

  /**
   * 到入ZIP
   */
  importZipHandle() {
    //that.refs.importZipWin.refs.tablePopWin.open();
  }

  /**
   * 导出ZIP
   */
  outPupZipHandle() {
    //that.refs.importZipWin.refs.tablePopWin.open();
  }

  /**
   * 得到选择的列表
   */
  getSelectIds() {
    let deleteArray = this.selectList;
    let deleteiDs = "";
    if (deleteArray.length > 0) {
      deleteiDs = CommonUtil.spiltArrayToString(deleteArray, "id", ",");
    }
    else
      message.danger("请选择列表！");
    return deleteiDs;
  }

  /**
   * 删除处理
   */
  deleteItemHandle() {
    let deleteiDs = this.getSelectIds();
    let that = this;
    if (deleteiDs) {
      confirm('确认要删除吗？', () => {
        Ajax.deleteList(deleteiDs, (data)=> {
          that.queryDataByPage(1);
        });
      })
    }
  }

  /**
   * 收藏处理
   */
  storeHandle() {
    let deleteiDs = this.getSelectIds();
    let that = this;
    if (deleteiDs) {
      Ajax.favoriteSave({tableIds: deleteiDs}, (data)=> {
        message.success("收藏成功！");
        that.queryDataByPage(1);
      });
    }
  }


  /**
   * 加载处理
   */
  loadTableHander() {
    this.refs.dataModelWin.refs._modal.open();
  }


  /**
   * 编辑当前表记录
   * @param item
   * @param e
   */
  editDiffrentTable(item, e) {
    let that = this;
    Ajax.getDataTableByID(item, (data) => {
      that.openDiffrentTable(data, true);
    })
  }

  /**
   * 打开数据表对话框
   * @param data，数据
   */
  openDiffrentTable(data, infoCode) {
    let that = this;
    this.props.parent.refs.listLeft.refs.modelTree.openDiffrentTable(data, infoCode, ()=> {
      that.queryDataByPage(1);
    });
  }


  /**
   * 打开
   * @param data，数据
   */
  dbItemClick(type, e) {
    this.refs.addNewDropdown.close();
    this.openDiffrentTable({tableType: type}, false);
  }

  /**
   * 分页处理
   * @param pageNum
   */
  onPageChange(pageNum) {
    this.queryDataByPage(pageNum);
  }


  /**
   * 打开上传页面
   * @param e
   */
  openUploadListWin(item, e) {
    this.refs._modal.setState(item);
    this.refs._modal.refs._modal.open();
  }

  /**
   * 加载模型处理调用
   * */
  submitModel() {
    this.queryDataByPage(1);
  }


  render() {
    let dataYpe = TypeConst.DATA_TYPE;
    let array = [];
    for (var p in dataYpe) { // 方法
      array.push({id: p, name: dataYpe[p]})
    }
    let dropDonw;
    if (Auth.getAuthByCode("1020603") || Auth.getAuthByCode("1020604") || Auth.getAuthByCode("1020605")) {
      dropDonw = <Dropdown ref="addNewDropdown">
        <DropdownToggle>
          <AuthButton style={{marginRight: 10}} data-code="1020702" renderType="icon"
                      type="plus-square">新增</AuthButton>
        </DropdownToggle>
        <DropdownMenu>
          <AuthButton renderType="option" data-code="1020603" value={TypeConst.Hive}
                      onClick={this.dbItemClick.bind(this,TypeConst.Hive)}>Hive</AuthButton>
          <AuthButton renderType="option" data-code="1020604" value={TypeConst.Hbase}
                      onClick={this.dbItemClick.bind(this,TypeConst.Hbase)}>HBase</AuthButton>
          <AuthButton renderType="option" data-code="1020605" value={TypeConst.RDBMS}
                      onClick={this.dbItemClick.bind(this,TypeConst.RDBMS)}>RDBMS</AuthButton>
        </DropdownMenu>
      </Dropdown>
    }
    let disableItem = this.selectList.length == 0 ? {disabled: true} : {}
    return (
      <div className="modulelist-right">
        <div className="module-container" style={{marginTop:0 ,margin:0,padding:0,marginRight:0}}>
          <div className="modelToolBar module-search dropdown-menu-container">
            {dropDonw}
            {/**<AuthButton  data-code="1020703" renderType="icon" onClick={this.importZipHandle.bind(this)} type="mail-forward">导入</AuthButton>
             <AuthButton  data-code="1020704" renderType="icon" style={{marginLeft:5}} onClick={this.outPupZipHandle.bind(this)} type="mail-reply">导出</AuthButton>
             **/}
            <AuthButton data-code="1020705" renderType="icon" style={{marginLeft:10}}  {...disableItem}
                        onClick={this.storeHandle.bind(this)} type="heart">收藏</AuthButton>
            <AuthButton data-code="1020706" renderType="icon" style={{marginLeft:15}}
                        onClick={this.loadTableHander.bind(this)} type="spinner">加载表</AuthButton>
            <AuthButton data-code="1020707" renderType="icon" style={{marginLeft:20}}  {...disableItem}
                        onClick={this.deleteItemHandle.bind(this)} type="trash">删除</AuthButton>

            <AuthButton data-code="1020701" className="btn btn-primary" style={{marginLeft:"10px",float:"right"}}
                        ref="btn_search" onClick={this.searchHander.bind(this)}>查询</AuthButton>

            <Select placeholder="创建方式" selected={this.state.loadType} style={{marginLeft:10,float:"right",marginTop: 0}}
                    onChange={this.handleChange.bind(this,"loadType")}>
              <Option value="">全部</Option>
              <Option value="0">自动</Option>
              <Option value="1">手动</Option>
            </Select>
            <Select placeholder="请选择表类型" style={{marginLeft:10,float:"right",marginTop: 0}} selected={this.state.type}
                    onChange={this.handleChange.bind(this,"type")}>
              <Option value="">全部</Option>
              {array.map((item, index)=> {
                return (<Option key={item.id} value={item.id}>{item.name}</Option>)
              })}
            </Select>
            <RestrictInput type="text" className="form-control common-input" placeholder="表名/中文名"
                           style={{width:"160px",marginLeft:10,float:"right"}} value={this.state.tableName}
                           onChange={this.handleChange.bind(this,"tableName")}/>


          </div>

          <div className="bdos-table checkbox-table" style={{marginTop:-5}}>
            <DataTable column={this.columns} howRow={this.pageSize} data={this.tableData}
                       onCheckboxSelect={this.handleCheckboxSelect.bind(this)}
                       onPageChange={this.onPageChange.bind(this)} showPage="true"/>
          </div>

          <ImportZipWin ref="importZipWin"/>
          <CommonModalWin title="加载模型" ref="dataModelWin" Child={DataModelList} submit={this.submitModel.bind(this)}
                          hasFormFooter="false"/>
          <CommonModalWin className="none" title="文件上传" ref="_modal" Child={UploadListWin}/>
        </div>
      </div>);
  }
}
export default ListPanel