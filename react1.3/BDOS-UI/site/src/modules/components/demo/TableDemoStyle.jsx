import React, { PropTypes } from 'react'
import classNames from 'classnames'
import DataTable from 'bfd-ui/lib/DataTable'
const TableDemoStyle = React.createClass({
  /**
   * 定义初始化状态
   */
  getInitialState: function () {
    return {
      url: "../data/table.json",
      column: [
        {
          title: '序号',
          key: 'sequence'
        }, {
          title: '姓名',
          order: true,
          width: '100px',
          render: (text, item) => {
            return <a href="javascript:void(0);" onClick={this.handleClick.bind(this, item)}>{text}</a>
          },
          key: 'name'
        }, {
          title: '年龄',
          key: 'age'
        }, {
          title: '体重',
          key: 'weight',
        }, {
          title: '国家/地区',
          key: 'country',
          width: '15%'
        }, {
          title: '学校',
          key: 'school'
        }, {
          title: '生日',
          key: 'birthday',
        }, {
          title: '操作',
          /**
           * @param item  当前数据对象
           * @param component 当前
           * @returns {XML}  返回dom对象
           */
          render: (item, component)=> {
            return <a href="javascript:void(0);" onClick={this.handleClick.bind(this, item)}>编辑</a>
          },
          key: 'operation'//注：operation 指定为操作选项和数据库内字段毫无关联，其他key 都必须与数据库内一致
        }],
      data: {
        "totalList": [{
          "id": "11",
          "name": "张三",
          "age": "11",
          "country": "中国",
          "height": "185cm",
          "weight": "65kg",
          "school": "六安一中",
          "birthday": "1990-03-16"
        }, {
          "id": "12",
          "name": "张柏仁",
          "age": "23",
          "country": "美国",
          "height": "170cm",
          "weight": "60kg",
          "school": "斯坦福大学",
          "birthday": "2016-03-02"
        }, {
          "id": "31",
          "name": "黄冬冬",
          "age": "25",
          "country": "英国",
          "height": "168cm",
          "weight": "64kg",
          "school": "剑桥大学",
          "birthday": "2016-03-07"
        }, {
          "id": "12",
          "name": "张博谦",
          "age": "45",
          "country": "中国",
          "height": "181cm",
          "weight": "80kg",
          "school": "西安交大",
          "birthday": "2016-04-08"
        }, {
          "id": "13",
          "name": "张伯苓",
          "age": "66",
          "country": "中国",
          "height": "188",
          "weight": "80kg",
          "school": "天津南开大学",
          "birthday": "2016-03-13"
        }, {
          "id": "14",
          "name": "溧阳路",
          "age": "30",
          "country": "南京",
          "height": "188cm",
          "weight": "83kg",
          "school": "南京邮电",
          "birthday": "1989-06-01"
        }, {
          "id": "15",
          "name": "张雪生",
          "age": "19",
          "country": "杭州",
          "height": "155cm",
          "weight": "55kg",
          "school": "合肥科技大学",
          "birthday": "2016-03-02"
        }, {
          "id": "16",
          "name": "邵冬梅",
          "age": "41",
          "country": "新疆",
          "height": "166cm",
          "weight": "66kg",
          "school": "日本陆军大学",
          "birthday": "1698-03-02"
        }],
        "totalPageNum": 32
      }
    }
  },
  /**
   * 此回调方法是点击切换分页时触发，可以在此方法体内发送Ajax请求数据，来替代组件的url属性
   * @param page 当前页
   */
  onPageChange(page) {
    //TODO
  },

  handleClick(){

  },
  render() {
    return (
      <div className="bdos-edit" style={{margin:'20px auto',width:'80%'}}>
        <div className="bdos-edit-nav">角色管理</div>
        <div className="bdos-edit-main">
          <div className="bdos-table">
            <DataTable
              data={this.state.data}
              onPageChange={this.onPageChange}
              showPage="true"
              column={this.state.column}
              howRow={8}>
            </DataTable>
          </div>
        </div>
      </div>
    )
  }
})

export default TableDemoStyle
