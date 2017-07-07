import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'

let column = [
  {
    title: '名称',
    key: 'fileName',
    render: function (text, item) {
      if (item.fileType === ENUM.FILETYPE.DIR) {
        return (
          <span>
            <a href="javascript:void(0)" style={{marginRight: 10}}
               onClick={that.navClickHandler.bind(that, item.path)}>
              {text}
            </a>
          </span>
        )
      }
      return (<span>{text}</span>)
    }
  }, {
    title: '类型',
    key: 'fileType'
  }, {
    title: '大小',
    key: 'fileSize',
    render: function (text) {
      let size = Util.changeSize(parseFloat(text))
      return size
    }
  }, {
    title: '修改时间',
    key: 'updateTime'
  }, {
    title: '权限',
    key: 'premission'
  }, {
    title: '所有者',
    key: 'owner'
  }, {
    title: '分组',
    key: 'group'
  }
]
let that;
class ModuleList extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }


  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  render() {
    that = this;
    return (
      <div className="module-container">
        <div className="module-nav"></div>
        <div className="module-search">
          {/* marginRight 没有在公共样式里面设置, 请自行设置 */}
          <input type="text"
                 style={{width: 200, marginRight: 10,float:'left'}}
                 className="form-control form-inline"
                 placeholder="输入文件名关键字"
                 value={this.state.fileName}
                 onChange={this.handleChange.bind(this, 'fileName')}/>

          <button className="btn btn-sm btn-primary">查询</button>
        </div>
        <div className="module-table">
          <DataTable data={this.state.data}
                     showPage="true"
                     column={column}
                     howRow={10}>
          </DataTable>
        </div>
      </div>
    );
  }
}

export default ModuleList