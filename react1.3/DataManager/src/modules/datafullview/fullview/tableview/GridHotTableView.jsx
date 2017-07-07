import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import GridTitle from './GridTitle'
import EventName from '../../../../containers/EventName'
import AjaxReq from '../model/AjaxReq'

let that;

class GridTableView extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
      hotTableTopTime_str: "",
      hotTableTopList:  {
        totalList: [],
        totalPage: 1
      }
    };
    that = this;
  }

  // 组件将要销毁时，将是否是卸载状态的标识至为true
  componentWillUnmount() {
    if(this.getListReq){
      this.getListReq.abort();
      this.getListReq = null;
    }
  }

  componentDidMount(){
    let that = this;
    let hotTableParam = {tenant: window.currentTenant};
    this.getListReq = AjaxReq.getHotTableData(hotTableParam, function(result){
      if(result.data){
        that.setState({
          // 热门表Top数据
          hotTableTopList: result.data,
          hotTableTopTime_str: result.data.updateTime
        });
      } else {
        that.setState({
          // 热门表Top数据
          hotTableTopList: {totalList:[]},
          hotTableTopTime_str: ''
        });
      }
    });
  }

  getTableData(){
    let that = this;
    let hotTableParam = {tenant: window.currentTenant};
    AjaxReq.getHotTableData(hotTableParam, function(result){
      if(result.data){
        that.setState({
          // 热门表Top数据
          hotTableTopList: result.data,
          hotTableTopTime_str: result.data.updateTime
        });
      } else {
        that.setState({
          // 热门表Top数据
          hotTableTopList: {totalList:[]},
          hotTableTopTime_str: ''
        });
      }
    });
  }



  addTableTab(item) {
    //后端代码各种风格也是醉了。。。转成统一的风格
    item.table_name = item.tableName;
    item.database = item.dbName;

    let record = {
      href: "/searchData/searchTable",
      title: "查找表",
      'data-icon':'search',
      tableName: item['table_name'],
      table:item
    };
    EventEmitter.dispatch(EventName.addTab, record)
  }

  getColumns() {
    return [
      /*{
        title: '',
        dataIndex: 'index',
        key: 'index',
        width: '50'
      },*/
      {
        title: '表',
        dataIndex: 'tableName',
        key: 'tableName',
        render:(text, item)=> {
          return <a href="javascript:void(0);" onClick={this.addTableTab.bind(this,item)}>{text}</a>;
        }
      },
      {
        title: '库',
        dataIndex: 'dbName',
        key: 'dbName'
      },
      {
        title: '收藏次数',
        dataIndex: 'hotNum',
        key: 'hotNum',
        width: '80'
      }
    ];
  }

  render() {
    let column = this.getColumns();
    return (
      <div  style={{border:'1px solid #ccc',backgroundColor:'#fff',height:"100%",padding:'20px'}}>
        <GridTitle topTime_str={this.state.hotTableTopTime_str} title="热门表Top5"/>
        <div style={{marginTop:'7px',marginBottom:'7px'}}>
          <DataTable column={column} howRow={10} data={this.state.hotTableTopList}/>
        </div>
      </div>
    );
  }
}

export default GridTableView;