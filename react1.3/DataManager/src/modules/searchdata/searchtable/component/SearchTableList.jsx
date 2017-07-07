/****************************************
 * 时间: 16/8/9
 * 作者: liujingjing
 * 说明: 查找表首页
 *
 ****************************************/
import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import {BreadCrumb,SearchInput,LabelSelect,RestrictInput} from 'CommonComponent'
import confirm from 'bfd-ui/lib/confirm'
import LeftTree from './LeftTree.jsx'
import AjaxReq from './../model/AjaxReq'
import EventName from 'EventName'
import message from 'CommonComponent/component/bdosmessage'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import CanvasSpace from 'CanvasSpace';
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import TableInfoForm from './TableInfoForm';


let that;
let topAllInfo = {
  project_count: 0,
  total_storage: 0,
  total_storage_str: "",
  database_count: 0,
  table_count: 0,
  create_time: 0,
  create_time_str: ""
};
let topProjectInfo = {
  "project_code": "",
  "cnName": "",
  "table_count": 0,
  "create_user": "",
  "tenant": "",
  "create_time": 0,
  "create_time_str": ""
};
let topDatabaseInfo = {
  "database": "",
  "type": "",
  "table_count": 0,
  "tenant": "0",
  "create_time": 0,
  "create_time_str": ""
};

const LIST_VIEW = 'list_view';
const FORM_VIEW = 'form_view';

class SearchTableList extends React.Component {

  constructor(prop) {
    super(prop);
    this.projectCode = '';
    this.currentPage = 1;
    this.state = {
      viewType: LIST_VIEW,
      tableName: '',
      listData: {totalList: []}
    };
    that = this;
    // 监听切换租户事件
    //EventEmitter.subscribe(EventName.CHANGE_TENANT, this.updateDataByTenant.bind(this));
    // 点击左侧树更新头部和表格信息
    EventEmitter.subscribe(EventName.UPDATE_SEARCH_TABLE_INFO, this.updateSearchTableInfo.bind(this));
  }

  componentDidMount() {
    this.isUnmount = false;
    //this.getData();
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  /**外部调用，SearchTable页面调用，由首页数据全景表存储量排行跳转过来**/
  openTableDetail(table){
    this.setState({viewType: LIST_VIEW});
    this.currentPage = 1;
    this.externalTable = table;
    //this.getTenantList(0);
    this.queryTableExists();
  }

  queryTableExists(){
    let that = this;
    this.currentPage = 1;
    let param = {project_code:this.externalTable.projectCode,table_name:this.externalTable.tableName,data_base:this.externalTable.database};
    AjaxReq.getList(param,  (result)=> {
      if (!this.isUnmount) {
        let tableName = that.externalTable?that.externalTable.table_name:'';
        let database = that.externalTable?that.externalTable.database:'';
        if (result.data && result.data.totalList.length > 0) {
          if (tableName && database) {
            result.data.totalList.map(function (item, index) {
              if (tableName == item.table_name && database == item.database) {
                that.seeDetail(item);
              }
            });
          }
        } else {
          that.externalTable = null;
          message.success(tableName+'表已不存在!');
        }
      }
    });
  }

  externalSeeTable(){
    this.currentPage = 1;
    this.getData();
  }



  // 改变上部信息
  updateSearchTableInfo(obj) {
    this.projectCode = obj.projectCode;
    this.database = obj.database;
    this.currentPage = 1;
    if(!this.projectCode && !this.database){
      this.getAllInfo();
      this.getTenantList(0);
    } else if(this.projectCode && !this.database){
      this.getProjectInfo();
      this.getList(0);
    } else if (this.projectCode && this.database){
      this.getDatabaseInfo();
      this.getList(0);
    }
  }

  // 切换租户事件
  /*updateDataByTenant() {
    this.projectCode = '';
    this.getData();
  }*/

  getData() {
    if (this.projectCode.length != 0) {
      this.getProjectInfo();
      this.getList(0)
    } else {
      this.getAllInfo();
      this.getTenantList(0);
    }
  }


  // 获取All上部基本信息
  getAllInfo() {
    let that = this;
    let param = {tenant: window.currentTenant};
    AjaxReq.getAllInfo(param, function (result) {
      if (!that.isUnmount) {
        if (result.data) {
          that.setState({
            topInfo: {data: result.data, type: 'topAllInfo'}
          });
        } else if (!result.data) {
          that.setState({
            topInfo: {data: topAllInfo, type: 'topAllInfo'}
          });
        }
      }
    })
  }

  // 获取项目上部基本信息
  getProjectInfo() {
    let that = this;
    let param = {project_code: this.projectCode};
    AjaxReq.getProjectInfo(param, function (result) {
      if (!that.isUnmount) {
        if (result.data) {
          that.setState({
            topInfo: {data: result.data, type: 'topProjectInfo'}
          });
        } else if (!result.data) {
          that.setState({
            topInfo: {data: topProjectInfo, type: 'topProjectInfo'}
          });
        }
      }
    })
  }

  // 获取数据库上部基本信息
  getDatabaseInfo() {
    let that = this;
    let param = {project_code: this.projectCode, data_base: this.database};
    AjaxReq.getDatabaseInfo(param, function (result) {
      if (!that.isUnmount) {
        if (result.data) {
          that.setState({
            topInfo: {data: result.data, type: 'topDatabaseInfo'}
          });
        } else {
          that.setState({
            topInfo: {data: topDatabaseInfo, type: 'topDatabaseInfo'}
          });
        }
      }

    })
  }


  //获取all下列表
  getTenantList(sort) {
    let that = this;
    let param = {
      table_name: this.state.tableName,
      tenant: window.currentTenant,
      currentPage: this.currentPage,
      pageSize: 10,
      sort: sort
    };
    AjaxReq.getTenantList(param, function (result) {
      if (!that.isUnmount) {
        if (result.data && result.data.totalList) { // 返回数据不为空时
          that.setState({
            listData: result.data
          });


        } else {
          that.setState({
            listData: {totalList: []}
          });

        }
      }
    });
  }

  //获取项目/数据库下列表
  getList(sort) {
    let that = this;
    let param = {
      table_name: this.state.tableName,
      project_code: this.projectCode,
      data_base: this.database,
      currentPage: this.currentPage,
      pageSize: 10,
      sort: sort
    };
    AjaxReq.getList(param, function (result) {
      if (!that.isUnmount) {
        if (result.data && result.data.totalList) { // 返回数据不为空时
          that.setState({
            listData: result.data
          });
          if (that.props.tableName && !that.props.isReturnFirst) {
            result.data.totalList.map(function (item, index) {
              if (that.props.tableName == item.table_name) {
                that.props.openTableInfo(item);
              }
            });
          }
        } else {
          that.setState({
            listData: {totalList: []}
          });
        }
      }
    });
  }

  cancelHandler() {
    this.externalTable = null;
    this.setState({viewType: LIST_VIEW});
    this.getData();
  }

  // 处理收藏/取消收藏操作
  //isFromTableForm:是否从TableInfoForm页面跳转过来
  handleCollect(text,isFromTableForm) {
    let tableType;
    switch (text.table_type.toLowerCase()) {
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
    if (text.collected == 1) {// 已经收藏
      cmd = 'cancel';
      msg = '取消收藏成功!';
    } else {
      cmd = 'collect';
      msg = '收藏成功!'
    }
    let param = {database: text.database, tableName: text.table_name, tableType: tableType, cmd: cmd};
    AjaxReq.collectData(param, (result)=> {
      if(isFromTableForm){
        this.refs.tableForm.getTopInfo();
      }else {
        this.search();
      }

      message.success(msg);
    });
  }


  // 处理共享/取消共享操作(共享和收藏操作如果topInfo包含此信息就用topInfo,如果没有就用该行的表格信息text)
  //isFromTableForm:是否从TableInfoForm页面跳转过来
  handleShare(text,isFromTableForm) {
    let that = this;
    if (text.shared == 1) { // 已经共享
      confirm('确认取消共享?', () => {
        that.removeShare(text,isFromTableForm);
      })
    } else {
      confirm('确认共享?', () => {
        that.share(text,isFromTableForm);
      })
    }
  }

  // 共享
  //isFromTableForm:是否从TableInfoForm页面跳转过来
  share(text,isFromTableForm) {
    let that = this;
    let param = {
      database: text.database,
      createUser: text.create_user,
      tableName: text.table_name,
      createTimeStr: text.create_time_str,
      tableNameZh: text.table_name_cn
    };
    AjaxReq.submitShareData(param, function () {
      if(isFromTableForm){
        that.refs.tableForm.getTopInfo();
      } else {
        that.search();
      }
      message.success("共享成功!")
    });
  }

  // 取消共享
  //isFromTableForm:是否从TableInfoForm页面跳转过来
  removeShare(text,isFromTableForm) {
    let that = this;
    let param = {projectCode: text.project_code, database: text.database, tableName: text.table_name};
    AjaxReq.removeShareTable(param, function (result) {
      if(isFromTableForm){
        that.refs.tableForm.getTopInfo();
      } else {
        that.search();
      }
      message.success("取消共享成功!")
    });
  }


  // 输入框输入查询表名字table_name
  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: $.trim(value)});
  }

  search(curPage) {
    this.currentPage = curPage?curPage:this.currentPage;
    let sort = this.sort ? this.sort : 0;
    if (this.projectCode.length == 0) {
      this.getTenantList(sort);
    } else {
      this.getList(sort);
    }
  }

  // 切换datatable页数触发
  onPageChange(page) {
    this.currentPage = page;
    let sort = this.sort ? this.sort : 0;
    if (this.projectCode.length == 0) {
      this.getTenantList(sort);
    } else {
      this.getList(sort);
    }
  }


  // 排序触发事件
  handleOrder(name, sort) {
    if (sort == 'desc') { //降序
      if(name == 'total_storage_str'){
        this.sort = 0;
      }else if (name == 'create_time_str'){
        this.sort = 2;
      }
    } else {
      if(name == 'total_storage_str'){
        this.sort = 1;
      }else if (name == 'create_time_str'){
        this.sort = 3;
      }
    }
    this.search();
  }


  //血缘关系
  handleOpen() {
    this.refs.modal.open()
  }

  seeDetail(data) {
    this.setState({viewType: FORM_VIEW, formData: data});
  }


  getColumns() {
    let oper_user = {
      title: '操作',
      key: 'operation',
      render(text, item) {
        let showStr;
        if (text['collected'] == 1) { // 已经收藏
          showStr = '取消收藏';
        } else if (text['collected'] == 0) { // 没有收藏
          showStr = '收藏';
        }
        return <a href="javascript:void(0);" onClick={function(){that.handleCollect(text)}}>{showStr}</a>
      }
    };
    let oper_owner = {
      title: '操作',
      key: 'operation',
      render(text, item) {
        let collectStr;
        let shareStr;

        if (text['collected'] == 1) {
          collectStr = '取消收藏';
        } else if (text['collected'] == 0) {
          collectStr = '收藏';
        }

        if (text['shared'] == 1) {
          shareStr = '取消共享';
        } else if (text['shared'] == 0) {
          shareStr = '共享';
        }

        let collect;
        if (text['collected'] != -1) {//后端说现在已经没有-1的情况了
          collect = <a href="javascript:void(0);" onClick={function(){that.handleCollect(text)}}>{collectStr}</a>;
        }
        let share = <a href="javascript:void(0);" onClick={function(){that.handleShare(text)}}>{shareStr}</a>;

        return <div>
          {collect}
          {share}
        </div>;
      }
    };
    let columns = [/*{
      title: '序号',
      key: 'index',
      width: '50px'
    },*/ {
      title: '名称',
      key: 'table_name',
      render:(text, item) => {
        if (text) {
          // 传入表名和数据库名 收藏 共享 表类型
          return <TextOverflow>
            <div style={{maxWidth:150}}>
              <a href="javascript:void(0);" onClick={this.seeDetail.bind(this,item)}>{text}</a>
            </div>
          </TextOverflow>;
        } else {
          return '-'
        }

      }
    }, {
      title: '中文名称',
      key: 'table_name_cn',
      render(text, item) {
        if (text) {
          return <TextOverflow>
            <div style={{maxWidth:90}}>
              {text}
            </div>
          </TextOverflow>;
        } else {
          return '-'
        }

      }
    }, {
      title: '类型',
      key: 'table_type'
    }, {
      title: '库',
      key: 'database'
    }, {
      title: '创建人',
      key: 'create_user'
    }, {
      title: '存储量',
      key: 'total_storage_str',
      width:'10%',
      order: true
    }, {
      title: '创建时间',
      key: 'create_time_str',
      width:'15%',
      order: true
    }];
    if (window.BFD.userType == BFD.ENUM.UserType.OWNER) {
      columns.push(oper_owner);
    } else if (window.BFD.userType == BFD.ENUM.UserType.USER) {
      columns.push(oper_user);
    }
    return columns;
  }

  renderList(){
    that = this;
    let column = this.getColumns();
    let topAllUl = <ul>
      <li>项目数(个):<span>{this.state.topInfo ? this.state.topInfo.data.project_count : 0}</span></li>
      <li>总存储量:<span>{this.state.topInfo ? this.state.topInfo.data.total_storage_str : ''}</span></li>
      <li>库总数(个): <span>{this.state.topInfo ? this.state.topInfo.data.database_count : 0}</span></li>
      <li>表总数(张):<span>{this.state.topInfo ? this.state.topInfo.data.table_count : 0}</span></li>
      <li>(最近更新时间:<span>{this.state.topInfo ? this.state.topInfo.data.create_time_str : ''}</span>)</li>
    </ul>;
    let topProjectUl = <ul>
      <li>项目名:<span>{this.state.topInfo ? this.state.topInfo.data.cnName : ''}</span></li>
      <li>表总数(张):<span>{this.state.topInfo ? this.state.topInfo.data.table_count : 0}</span></li>
      <li>项目创建人: <span>{this.state.topInfo ? this.state.topInfo.data.create_user : ''}</span></li>
      <li>所属租户:<span>{this.state.topInfo ? this.state.topInfo.data.tenant : ''}</span></li>
      <li>创建时间:<span>{this.state.topInfo ? this.state.topInfo.data.create_time_str : ''}</span></li>
    </ul>;
    let topDatabaseUl = <ul>
      <li>库:<span>{this.state.topInfo ? this.state.topInfo.data.database : ''}</span></li>
      <li>库类型:<span>{this.state.topInfo ? this.state.topInfo.data.type : ''}</span></li>
      <li>表总数(张): <span>{this.state.topInfo ? this.state.topInfo.data.table_count : 0}</span></li>
      <li>所属租户:<span>{this.state.topInfo ? this.state.topInfo.data.tenant : ''}</span></li>
      <li>创建时间:<span>{this.state.topInfo ? this.state.topInfo.data.create_time_str : ''}</span></li>
    </ul>;
    let topUl, consanguinity;
    switch (this.state.topInfo ? this.state.topInfo.type : 'topAllInfo') {
      case 'topAllInfo':
        topUl = topAllUl;
        break;
      case 'topProjectInfo':
        topUl = topProjectUl;
        consanguinity = <button className="btn btn-sm btn-primary" onClick={that.handleOpen.bind(that)}>血缘关系</button>
        break;
      case 'topDatabaseInfo':
        topUl = topDatabaseUl;
        break;
    }
    return (
      <div>
        {/**上部基本信息**/}
        <div className="panel">
          {topUl}
        </div>
        {/**筛选表名**/}
        <div className="module-search" style={{height:'30px'}}>
          {consanguinity}
          <button className="btn btn-sm btn-primary common-right" onClick={this.search.bind(this,1)}>查询</button>
          <RestrictInput ref="tableName" type="text" value={this.state.tableName}
                         className="form-control common-input common-right"
                         onChange={this.handleChange.bind(this,"tableName")} placeholder="表名称/表中文名"/>
        </div>
        {/**查询结果表格**/}
        <div className="module-table">
          <DataTable data={this.state.listData} column={column} onPageChange={this.onPageChange.bind(this)}
                     showPage="true" howRow={10} onOrder={this.handleOrder.bind(this)}/>
        </div>

        <div className="width1000 bfd-modal__modal-dialog">
          <Modal ref="modal">
            <ModalHeader>
              <h4>查看血缘关系</h4>
            </ModalHeader>
            <ModalBody>
              <CanvasSpace projectCode={this.projectCode} type="dataManagerProject"/>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }

  render() {
    let comp;
    if (this.state.viewType == LIST_VIEW) {
      comp = this.renderList();
    } else if (this.state.viewType == FORM_VIEW) {
      comp = <TableInfoForm ref="tableForm" data={this.state.formData}
                            handleCollect={this.handleCollect.bind(this)} handleShare={this.handleShare.bind(this)}
                            cancel={this.cancelHandler.bind(this)}/>;
    }
    return (<div>
      {comp}
    </div>)
  }
}

export default SearchTableList;