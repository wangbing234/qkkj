/***************************************************
 * 时间: 16/6/24 10:51
 * 作者: zhongxia
 * 说明: 添加用户
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'bfd-ui/lib/message'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { FormSelect, Option } from 'bfd-ui/lib/FormSelect'

import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'

import Model from 'model/resourceConfig'

let that;
class AddUser extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      configPool: 0,
      privilege: false,
      type: 0,
      clientPort: 2181,
      parent: '/hbase',
      ...prop.data
    };

    this.rules = {
      sourceName(val){
        if (!val) return "数据源不能为空!"
      },
      aliasName(val){
        if (!val) return "别名不能为空!"
      }
    }
  }

  componentDidMount() {
    //回显数据
    let id = that.state.id;
    id && Model.view(id, function (result) {
      that.setState({...result.data})
    })
  }

  componentWillUnmount() {
    that = null;
  }

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  closePage() {
    that.props.parent && that.props.parent.setState({isAddPage: false})
  }

  /**
   * 测试链接
   */
  testConn() {
    if (that.refs.form.validate(that.state)) {
      let {createTime,updateTime,confItems,...data} = that.state;
      Model.testConn(data, function (result) {
        if (result.data) {
          message.success("连接成功!")
        } else {
          message.success("无法连接到该资源!")
        }
      })
    }
  }

  /**
   * 添加或者更新
   */
  addOrEdit() {
    if (that.refs.form.validate(that.state)) {
      let {createTime,updateTime,confItems,...data} = that.state;
      //编辑
      if (that.state.id) {
        Model.update(data, function (result) {
          console.log("result", result)
          message.success("新增资源配置成功!")
          that.props.parent && that.props.parent.getTableData();
          that.closePage()

        })
      }
      else {
        //添加
        Model.add(data, function (result) {
          console.log("result", result)
          message.success("更新资源配置成功!")
          that.props.parent && that.props.parent.getTableData();
          that.closePage()
        })
      }

    }
  }


  /**
   * 渲染MySql的配置
   * @returns {XML}
   */
  renderMySql(style) {
    return (
      <div>
        <FormItem label="机器名/IP地址" name="ip">
          <RestrictInput type="text"
                         style={style.width}
                         className="form-control"
                         value={this.state.ip}
                         onChange={that.handleChange.bind(that,'ip')}/>
        </FormItem>

        <FormItem label="端口号" name="port">
          <RestrictInput type="number"
                         style={style.width}
                         className="form-control"
                         value={this.state.port}
                         onChange={that.handleChange.bind(that,'port')}/>
        </FormItem>

        <FormItem label="用户名" name="username">
          <RestrictInput type="text"
                         style={style.width}
                         className="form-control"
                         value={this.state.username}
                         onChange={that.handleChange.bind(that,'username')}/>
        </FormItem>

        <FormItem label="密码" name="pwd">
          <RestrictInput type="password"
                         style={style.width}
                         className="form-control"
                         value={this.state.pwd}
                         onChange={that.handleChange.bind(that,'pwd')}/>
        </FormItem>

        <FormItem label="数据库" name="dbname">
          <RestrictInput type="text"
                         style={style.width}
                         className="form-control"
                         value={this.state.dbname}
                         onChange={that.handleChange.bind(that,'dbname')}/>
        </FormItem>

        <FormItem label="jdbc链接参数" name="jdbcParams">
          <RestrictInput type="text"
                         style={style.width}
                         className="form-control"
                         value={this.state.jdbcParams}
                         onChange={that.handleChange.bind(that,'jdbcParams')}/>
        </FormItem>
      </div>
    )
  }

  /**
   * 渲染Hbase的配置
   * @returns {XML}
   */
  renderHBase(style) {
    return (
      <div>
        <FormItem label="zk的地址" name="quorum ">
          <RestrictInput type="text"
                         style={style.width}
                         className="form-control"
                         value={this.state.quorum}
                         onChange={that.handleChange.bind(that,'quorum')}/>
        </FormItem>

        <FormItem label="端口号" name="clientPort">
          <RestrictInput type="number"
                         style={style.width}
                         className="form-control"
                         value={this.state.clientPort}
                         onChange={that.handleChange.bind(that,'clientPort')}/>
        </FormItem>

        <FormItem label="存储目录" name="parent">
          <RestrictInput type="text"
                         style={style.width}
                         className="form-control"
                         value={this.state.parent}
                         onChange={that.handleChange.bind(that,'parent')}/>
        </FormItem>

        <FormItem label="共享目录" name="rootdir">
          <RestrictInput type="text"
                         style={style.width}
                         className="form-control"
                         value={this.state.rootdir}
                         onChange={that.handleChange.bind(that,'rootdir')}/>
        </FormItem>

        <FormItem label="用户名" name="username">
          <RestrictInput type="text"
                         style={style.width}
                         className="form-control"
                         value={this.state.username}
                         onChange={that.handleChange.bind(that,'username')}/>
        </FormItem>

        <FormItem label="开启权限" name="privilege">
          <RadioGroup value={this.state.privilege} onChange={this.handleChange.bind(this,'privilege')}>
            <Radio value={true}>启用</Radio>
            <Radio value={false}>禁用</Radio>
          </RadioGroup>
        </FormItem>
      </div>
    )
  }

  render() {
    that = this;
    const style = {
      width: {
        width: 350,
        display: 'inline-block'
      },
      center: {
        marginLeft: 100
      }
    }

    return (
      <div className="bdos-edit-form">
        <Form
          ref="form"
          data={this.state}
          rules={this.rules}>

          <FormItem label="类型" name="type">
            <FormSelect style={style.width}
                        value={that.state.type}
                        disabled={that.state.id?true:false}
                        onChange={that.handleChange.bind(that,'type')}>
              <Option value={0}>mysql</Option>
              <Option value={1}>hbase</Option>
            </FormSelect>
          </FormItem>

          <FormItem required label="数据源" name="sourceName">
            <RestrictInput type="text"
                           style={style.width}
                           className="form-control"
                           value={this.state.sourceName}
                           onChange={that.handleChange.bind(that,'sourceName')}/>
          </FormItem>

          <FormItem required label="别名" name="aliasName">
            <RestrictInput type="text"
                           style={style.width}
                           className="form-control"
                           disabled={that.state.id?true:false}
                           value={this.state.aliasName}
                           onChange={that.handleChange.bind(that,'aliasName')}/>
          </FormItem>

          {that.state.type === 0 ? that.renderMySql(style) : that.renderHBase(style)}

          <FormItem label="DB连接池" name="configPool">
            <RadioGroup value={this.state.configPool} onChange={this.handleChange.bind(this,'configPool')}>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </RadioGroup>
          </FormItem>

          <div style={style.center}>
            <button type="button"
                    className="btn btn-sm btn-primary" onClick={this.testConn}>测试连接
            </button>

            <button type="button"
                    style={{margin:'0 30px'}}
                    className="btn btn-sm btn-primary" onClick={this.addOrEdit}>确定
            </button>

            <button type="button"
                    className="btn btn-sm btn-default" onClick={this.closePage}>取消
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

export default AddUser