/***************************************************
 * 时间: 7/25/16 19:20
 * 作者: zhongxia
 * 说明:
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'

//bfd-ui components
import DataTable from 'bfd-ui/lib/DataTable'
import message from 'CommonComponent/component/bdosmessage'
import confirm from 'bfd-ui/lib/confirm'
import Icon from 'bfd-ui/lib/Icon'
//custom components
import Model from '../model'

class AccessKey extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      tableData: {
        totalList: [],
        currentPage: 1,
        totalPageNum: 0
      },
      idFiled: 'id', //表格唯一标识字段
      selectIds: '', //选中行的唯一标识
    };
  }

  /**
   * 虚拟DOM渲染到真实DOM节点后
   */
  componentDidMount() {
    this.getTableData()
  }

  /**
   * 获取表格字段
   * @returns {*}
   */
  getColumns() {
    return [{
      title: 'Access Key ID',
      key: 'accessKeyId'
    }, {
      title: 'Access Key Secret',
      key: 'accessKeySercet',
      render: (text, item)=> {
        return (
          <div>
            <span style={{marginRight:10}}>{text}</span>
            <a href="javascript:void(0);" data-type="1" onClick={this.showSecret.bind(this)}>隐藏</a>
          </div>
        )
      }
    }, {
      title: '状态',
      key: 'status',
      render: (text)=> {
        return text == 0 ? '启用' : '禁用';
      }
    },
      {
        title: '创建时间',
        key: 'createTime',
        render: (text)=> {
          return text;
        }
      }
      ,
      {
        title: '操作',
        key: 'operation',
        width: '100px',
        render: (item)=> {
          return (
            <span className="myproject-list-opration">
          <a href="javascript:void(0);"
             onClick={this.handleDisable.bind(this,item)}>{item.status == 0 ? '禁用' : '启用'}</a>
          <a href="javascript:void(0);" style={{marginLeft:15}}
             onClick={this.handleDel.bind(this,item)}>删除</a>
        </span>
          );
        }
      }
    ]
  }

  /**
   * 表单值绑定到state上
   * @param name 字段名
   * @param event 事件对象
   */
  handleChange(name, event) {
    let newState = {};
    //针对 多选框, 文本框
    if (event && event.target) {
      newState[name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  /**
   * 获取表格数据
   * @param searchVal 搜索条件
   */
  getTableData() {
    Model.getAccessKey({}, (result)=> {
      this.setState({tableData: result.data})
    })
  }

  /**
   * 显示Secret
   * @param item
   */
  showSecret(e) {
    e.stopPropagation();
    let cTar = e.currentTarget;
    //隐藏AccessKey
    if (cTar.getAttribute('data-type') === "1") {
      cTar.previousSibling && (cTar.previousSibling.style.display = 'none');
      cTar.setAttribute('data-type', "0");
      cTar.innerHTML = "显示";
    }
    //显示AccessKey
    else {
      cTar.previousSibling && (cTar.previousSibling.style.display = 'inline');
      cTar.setAttribute('data-type', "1");
      cTar.innerHTML = "隐藏";
    }
  }

  /**
   * 禁用
   * @param item
   */
  handleDisable(item) {
    Model.updateAccesskey(item.id, item.status === 0 ? 1 : 0, (result)=> {
      this.getTableData()
    })
  }

  /**
   * 删除
   * @param item
   */
  handleDel(item) {
    confirm('确认删除AccessKey吗?', () => {
      Model.delAccesskey(item.id, (result)=> {
        message.success('删除AccessKey成功!')
        this.getTableData()
      })
    })
  }

  /**
   * 添加Secret
   */
  addSecret() {
    Model.createAccesskey({}, (result)=> {
      this.getTableData()
    })
  }

  /**
   * 渲染表格列表
   * @returns {XML}
   */
  renderTable() {
    return (
      <div>
        <div className="bdos-header-waring">Access Key ID和Access Key Secret是您访问BD-OS API的密钥，具有该账户完全的权限，请您妥善保管</div>

        <Icon type="plus" style={{cursor:'pointer'}} onClick={this.addSecret.bind(this)}>
          <span style={{paddingLeft:5}}>新建Access Key</span>
        </Icon>
        <div className="bdos-table" style={{marginTop:0}}>
          <DataTable column={this.getColumns()}
                     howRow={9999}
                     data={this.state.tableData}/>

        </div>
      </div>)
  }


  render() {
    let jsx = this.renderTable();
    return (
      <div>
        {jsx}
      </div>
    )
  }
}

export default AccessKey
