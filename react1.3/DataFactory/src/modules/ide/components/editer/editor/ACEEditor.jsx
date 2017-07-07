/***************************************************
 * 时间: 2016-07-28 15:53:48
 * 作者: zhongxia
 * 说明: IDE代码编辑器, 把IDE封装一层, 这样, 如果后面要替换IDE编辑器, 比较方便
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import IDE  from 'CommonComponent/component/ide'
import Model from 'IDERoot/model/ide'


class ACEEditor extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  componentDidMount() {
    //创建的时候就获取光标,并且光标移动到内容的最后面
    const editor = this.refs.refEditor.editor;
    this.setFocus();

    //绑定保存事件
    editor.commands.addCommand({
      name: "customSave",
      bindKey: {win: "Ctrl-s", mac: "Command-s"},
      exec: (editor)=> {
        this.props.onSave && this.props.onSave();
      }
    });
  }

  /**
   * 获取选中的值,如果有选中, 获取选中的值, 否则获取整个编辑器的值
   * @param isAll 是否取出所有的
   * @returns {*}
   */
  getValue(isAll = false) {
    let IDEInstance = this.refs.refEditor;
    var code = IDEInstance.getSelectedValue()
    if (!code) {
      code = IDEInstance.editor.getValue();
    }
    //取出编辑器全部内容
    if (isAll) {
      code = IDEInstance.editor.getValue();
    }
    return code;
  }

  /**
   * 插入值
   * @param value
   */
  insertValue(value) {
    this.refs.refEditor.insertValue(value);
  }

  /**
   * 是否可以回退
   */
  hasUndo() {
    return this.refs.refEditor.editor.session.getUndoManager().hasUndo();
  }

  /**
   * 回退
   */
  undo() {
    this.refs.refEditor.editor.undo();
  }

  /**
   * 是否可以前进
   */
  hasRedo() {
    return this.refs.refEditor.editor.session.getUndoManager().hasRedo();
  }

  /**
   * 回退
   */
  redo() {
    this.refs.refEditor.editor.redo();
  }

  /**
   * 返回编辑器[提供外部使用]
   */
  getEditor() {
    return this.refs.refEditor.editor;
  }

  setFocus() {
    const editor = this.refs.refEditor.editor;
    editor.focus();
    let session = editor.getSession();
    let count = session.getLength();
    editor.gotoLine(count, session.getLine(count - 1).length);
  }

  /**
   * IDE自定义提示
   * @param key
   * @param callback
   */
  handeAudoComplete(key, callback) {
    //IDE脚本类型为 hive, 则弹出提示
    if (this.props.mode === "hive") {
      console.log("key", key)
      Model.getHiveTables(key, (result)=> {
        callback(result.data);
      })
    }
  }

  render() {
    return (
      <IDE ref="refEditor"
           readOnly={this.props.readOnly || false}
           mode={this.props.mode}
           keys={this.props.keys || []}
           onComplete={this.handeAudoComplete.bind(this)} {...this.props}>
        {this.props.children}
      </IDE>
    )
  }
}

ACEEditor.propTypes = {
  onSave: PropTypes.func,
  mode: PropTypes.string
}

export default ACEEditor
