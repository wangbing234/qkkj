/***************************************************
 * 时间: 16/6/16 14:41
 * 作者: zhongxia
 * 说明: 新建脚本 , 脚本下拉框
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import List from 'CommonComponent/component/list'
import Icon from 'bfd-ui/lib/Icon'
import AuthButton from 'CommonComponent/component/authbutton'

//枚举
import ENUM from 'IDERoot/enum'

class ScriptMeun extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};

    this.openDropDown = this.openDropDown.bind(this)
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_ADD_IDEDROPDOWN, this.openDropDown);
  }

  componentWillUnmount() {
    EventEmitter.remove(ENUM.EVENTNAME.IDE_ADD_IDEDROPDOWN);
  }

  /**
   * 打开新建脚本的下拉框
   */
  openDropDown(node) {
    this.pid = node.pid;
    this.refs.dropDown.open();
  }

  /**
   * 新增 IDE编辑器 选项卡
   * @param item
   */
  createScript(item) {
    this.refs.dropDown.close()
    let config = {...item};
    config.pid = this.pid || '';
    //派发事件,在 editer/editor/executer/ScriptEditer.jsx 组件处理
    EventEmitter.dispatch(ENUM.EVENTNAME.IDE_ADD_EDITOR, config);

    EventEmitter.dispatch(ENUM.EVENTNAME.IDE_HIDE_EXPORT);
  }

  render() {
    /**
     * List data 对象:新增编辑器选项卡的类型
     * key: tab标签名称
     * value: tab的值
     * mode: IDE 编辑器的类型, 设置提示等
     * suffix: 文件名后缀
     */
    const menus = ENUM.getScriptConfig();
    return (
      <Dropdown ref="dropDown">
        <DropdownToggle>
          <AuthButton data-code="1021002" renderType="icon" title="添加" type="plus"
                      className="ide-fontIcon"/>
        </DropdownToggle>
        <DropdownMenu>
          <List data={menus} onClick={this.createScript.bind(this)}/>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default ScriptMeun
