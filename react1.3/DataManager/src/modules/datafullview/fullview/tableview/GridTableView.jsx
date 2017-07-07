import React from 'react';
import GridTitle from './GridTitle'
import DataTable from 'bfd-ui/lib/DataTable'
import EventName from '../../../../containers/EventName'

let that;

class GridTableView extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {

    };
    that = this;
  }

  // 组件将要销毁时，将是否是卸载状态的标识至为true
  componentWillUnmount() {
    this.isUnmount = true
  }

  addTableTab(item) {
    //后端代码各种风格也是醉了。。。转成统一的风格
    item.projectCode = item.project_code;
    let record = {
      href: "/searchData/searchTable",
      title: "查找表",
      'data-icon':'search',
      tableName: item['table_name'],
      //database:item['database']
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
        dataIndex: 'table_name',
        key: 'table_name',
        render(text, item) {
          return <a href="javascript:void(0);" onClick={function(){that.addTableTab(item)}}>{text}</a>;
        }
      },
      {
        title: '库',
        dataIndex: 'database',
        key: 'database'
      },
      {
        title: '存储量',
        dataIndex: 'total_storage_str',
        key: 'total_storage_str',
        width: '80'
      }
    ];
  }

  render() {
    let column = this.getColumns();
    return (
      <div  style={{border:'1px solid #ccc',backgroundColor:'#fff',height:"100%",padding:'20px'}}>
        <GridTitle topTime_str={this.props.topTime_str} title="表存储量Top5"/>
        <div style={{marginTop:'7px',marginBottom:"7px"}}>
          <DataTable column={column} howRow={10} data={this.props.topList}/>
        </div>
      </div>
    );
  }
}

export default GridTableView;