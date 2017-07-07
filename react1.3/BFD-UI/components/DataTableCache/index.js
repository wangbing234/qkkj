/**
 * Created by BFD_270 on 2016-02-19.
 * Update by jiangtl on 2016-6-28.
 */
import 'bfd-bootstrap'
import React, { PropTypes } from 'react'
import Fetch from '../Fetch'
import Paging from '../Paging'
import classnames from 'classnames'
import { Checkbox } from '../Checkbox'
import './main.less'
const Rows = React.createClass({

  handleCheckboxChange(row) {
    row.isSelect = !row.isSelect
    this.setState({  t: +new Date  })
    let selectRow = []
    this.props.rows.map((item, j) => {
      if (item.isSelect) {
        selectRow.push(item)
      }
    })

    this.props.onSelect(row.isSelect, row, selectRow);
  },

  handleCheckboxClick(event) {
    event = event ? event : window.event;
    event.stopPropagation();
  },

  handleRowClick(item) {
    this.props.onRowClick && this.props.onRowClick(item)
  },

  render() {
    const rows = this.props.rows
    const column = this.props.column
    const currentPage = this.props.currentPage || 1
    const pageSize = this.props.pageSize || 0
    return (
      <tbody>
      {
        rows.length > 0 ?
        rows.map((item, j) => {
          let isSelect = item.isSelect || false;
          let isDisabled = item.disabled || false;
          let checkboxTd = this.props.onCheckboxSelect 
            ? <td><Checkbox disabled={isDisabled} checked={isSelect} onClick={this.handleCheckboxClick} onChange={this.handleCheckboxChange.bind(this, item)}></Checkbox></td>
            : null;
          return (
            <tr key={j} onClick={this.handleRowClick.bind(this, item)}>
              {checkboxTd}
              {
                column.map((columns,i) => {
                  for (let col in columns) {
                    //序号
                    if (columns[col] === 'sequence') {
                      return <td key = { String( i ) + j } > { (( currentPage-1) * pageSize ) + ( j + 1 ) }</td>
                    }
                    //操作
                    if (columns[col] == 'operation') {
                      return <td key = { String( i ) + j }> { columns['render'] ( item, this ) } </td>
                    }
                    //正常非字段编辑列
                    if (columns[col] !== 'operation' && columns[col] !== 'sequence' && col == 'key') {
                      if (typeof columns['render'] === 'function') {
                        return <td key = { String( i ) + j }> { columns['render'] ( item[columns[col]],item ) } </td>
                      } else {
                        return <td key = { String( i ) + j }>{ item[columns[col]] }</td>
                      }
                    }
                  }
                })
              }
            </tr>
          )
        }) : <tr><td colSpan="9"><div className="align-center" ref="nothingData" ></div>暂无数据!</td></tr>
      }
      </tbody>
    )
  }
})

export default React.createClass({
  items: [],
  propTypes: {
    data: PropTypes.object,
    url: PropTypes.string,
    customProp({data, url}) {
      if (data && url) {
        return new Error('data属性和url属性不能同时使用！')
      }
    }
  },
  getInitialState: function() {
    return {
      order: '',
      selectItems:[],
      url: this.props.url || '',
      isSelectAll: false,
      sid:this.props.sid||"id",
      items: {
        totalList: [],
        totalPageNum: 0,
        refresh: false,
        currentPage: 1
      },
      currentPage: this.props.currentPage || 1
    }
  },

  componentWillMount() {
    if (this.props.data) {
      this.setState({
        items: {
          totalList: this.props.data.totalList || [],
          totalPageNum: this.props.data.totalPageNum || 0,
          refresh: false,
          currentPage: this.props.data.currentPage || 1
        }
      })
    }
  },

  onChange: function(params, currentPage) {
  },

  onPageChange(page) {
    if (this.props.onPageChange) {
      this.props.onPageChange(page)
    }
    this.setState({
      currentPage: page
    })
  },

  orderClick: function(column, i) {
    if (column.order) {
      if (this.refs[i].getAttribute('order') == null) {
        this.refs[i].className = 'sorting_asc'
        this.refs[i].setAttribute('order', 'asc')
        this.setState({
          order: '&key=' + column['key'] + '&sort=asc'
        })
        this.props.onOrder && this.props.onOrder(column['key'], 'asc')
        return
      }
      if (this.refs[i].getAttribute('order') == 'asc') {
        this.refs[i].className = 'sorting_desc'
        this.refs[i].setAttribute('order', 'desc')
        this.setState({
          order: '&key=' + column['key'] + '&sort=desc'
        })
        this.props.onOrder && this.props.onOrder(column['key'], 'desc')
        return;
      }
      if (this.refs[i].getAttribute('order') == 'desc') {
        this.refs[i].className = 'sorting_asc'
        this.refs[i].setAttribute('order', 'asc')
        this.setState({
          order: '&key=' + column['key'] + '&sort=asc'
        })
        this.props.onOrder && this.props.onOrder(column['key'], 'asc')
        return;
      }
    }
  },

  handleSuccess: function(data) {
    this.setState({
      items: data,
      isSelectAll: false
    })
  },

  refresh: function() {
    this.setState({
      refresh: true
    })
  },

  /**
   * 修改状态
   * @param addItems 增加的数据
   * @param delItems 删除的数据
     */
  handerListChange(addItems,delItems){
    this.state.selectItems=this.state.selectItems.concat(addItems);
    let dStrArray=[];
    let sid=this.state.sid;
    for (let obj of delItems) {
      dStrArray.push(obj[sid]);
    }
    this.state.selectItems=this.state.selectItems.filter(item=>(dStrArray.indexOf(item[sid])==-1))
  },

  /**
   * 处理选择状态，通知外部方法
   */
  handerOutChange(){
    const selectAllFn = this.props.onCheckboxSelect
    selectAllFn && selectAllFn(this.state.selectItems||[])
  },

  /**
   * 点击全选
   */
  handleCheckboxAllChange() {
    const isAll = !this.state.isSelectAll;
    this.setState({
      isSelectAll: isAll
    })

    let changeRows = []
    const rows = this.state.items.totalList
    rows.map((item, j) => {
      if (item.isSelect !== isAll && !item.disabled) {
        item.isSelect = isAll
        changeRows.push(item);
      }
    })

    //判断增加和删除的数据
    isAll?this.handerListChange(changeRows,[]):this.handerListChange([],changeRows)
    this.handerOutChange();
  },

  /**
   * 列选择派发事件
   * @param checked 是否选择
   * @param row 当前行
   * @param rows 选择的行
     */
  handleCheckboxChange(checked, row, rows) {
    checked?this.handerListChange([row],[]):this.handerListChange([],[row])
    this.handerOutChange();
    if (!checked) {
      this.setState({  isSelectAll: false  })
    }
    if(rows.length == this.state.items.totalList.length) {
      this.setState({ isSelectAll: true })
    }
  },

  handleRowClick(row) {
    this.props.onRowClick && this.props.onRowClick(row)
  },

  getRowsValue(key, rows) {

  },

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      let isSelectAll=this.handSelectData(nextProps.data);
      this.setState({
        items: nextProps.data,
        isSelectAll:isSelectAll
      })
    }
  },

  handSelectData(nData){
    let isSelectAll=true;
    if(this.state.selectItems && this.state.selectItems.length!=0)
    {
      for (let tList of nData.totalList) {
        //如果在选择的数组中
          if(this.isExistThisObject(tList)){
            tList.isSelect=true;
          }
         else{
            isSelectAll=false;
          }
      }
    }
    else {
      isSelectAll=false;
    }
    return isSelectAll;
  },

  isExistThisObject(nData){
    for (let tList of this.state.selectItems) {
      if(tList[this.state.sid]==nData[this.state.sid] && nData[this.state.sid])
        return true;
    }
    return false;
  },

  render: function() {
    const self = this;
    let { className, column, url, ...other } = this.props
    delete other.howRow
    delete other.showPage
    delete other.onRowClick
    delete other.onOrder
    delete other.onPageChange
    delete other.onCheckboxSelect
    let totalPageNum = 0,
      currentPage = parseInt(this.state.currentPage),
      //新增自动分页功能 
      pageSize = parseInt(this.props.howRow)

    //如果是传入url查询数据就附带参数查询
    if (url && url !== '') {
      if (url.indexOf('?') < 0) {
        if (this.props.showPage == 'true') {
          url += '?pageSize=' + pageSize + '&currentPage=' + this.state.currentPage
        }
      }
      if (url.indexOf('pageSize') < 0 && url.indexOf('currentPage') < 0 && url.indexOf('?') > -1) {
        url += '&pageSize=' + pageSize + '&currentPage=' + this.state.currentPage
      }
    }

    let checkboxTh;
    if(this.props.onCheckboxSelect)
    {
      checkboxTh=<th><Checkbox checked={this.state.isSelectAll} onChange={this.handleCheckboxAllChange}></Checkbox></th>;
    }


    return (
      <div>
        {url != "" ? <Fetch url={url} onSuccess={this.handleSuccess} ></Fetch> : null}
        
        <table className={classnames('table', "bfd-datatable", className)} {...other} >
          <thead>
            <tr>
              {checkboxTh}
              {
                column.map ((head_column, i) => {
                  const style = head_column.width ? {width: head_column.width} : {}
                  return <th 
                    key={head_column['title']} 
                    ref={i}
                    style={style}
                    onClick={self.orderClick.bind(self, head_column, i)}
                    title={head_column['order'] === true ? head_column['title'] + '排序' : ''} className = {head_column['order'] === true ? 'sorting' : ''} >{head_column['title']}</th>
                })
              }
            </tr>
          </thead>

          <Rows 
            rows={this.state.items.totalList} 
            onRowClick={this.handleRowClick}
            onSelect={this.handleCheckboxChange}
            onCheckboxSelect={this.props.onCheckboxSelect}
            column={this.props.column}
            currentPage={this.state.items.currentPage || currentPage}
            pageSize={pageSize}
          >
          </Rows>
        </table>

        {
          this.state.items.totalList.length > 0 
            ? this.props.showPage == 'true' 
              ? <Paging 
                  currentPage={this.state.items.currentPage}                   
                  totalPageNum={this.state.items.totalPageNum} 
                  pageSize={this.props.howRow} 
                  onPageChange={this.onPageChange} 
                  onChange={this.onChange}>
                </Paging> 
              : '' 
            : ''}
      
      </div>
    )
  }
})