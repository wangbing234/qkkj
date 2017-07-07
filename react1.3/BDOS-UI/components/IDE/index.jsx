/***************************************************
 * 时间: 16/6/3 10:27
 * 作者: zhongxia
 * 说明: IDE组件
 ***************************************************/

import './ide.less'
//import './js/ace/ace'
import React from 'react'

//import './js/ACE/ace.min'

class IDE extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {
      readOnly: prop.readOnly || false,
      mode: prop.mode || 'sql',
      autoCompletion: prop.autoCompletion || true
    };

    this.editorId = `_editor_${this.getUUID()}`
    this.editor;
  }

  componentDidMount() {
    ace.require("ace/ext/language_tools");
    this.editor = ace.edit(this.editorId)

    this.editor.getSession().setMode("ace/mode/" + this.state.mode)

    this.editor.$blockScrolling = Infinity

    //设置自动提示
    this.editor.setOptions({
      enableBasicAutocompletion: this.state.autoCompletion,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });

    //设置只读
    this.editor.setReadOnly(this.state.readOnly)

    //设置语言类型(高亮)

  }

  componentWillUpdate(nextProps, nextState) {
    this.editor.setReadOnly(nextState.readOnly)  //只读
    this.editor.getSession().setMode("ace/mode/" + nextState.mode)
    this.editor.setOptions({
      enableBasicAutocompletion: nextState.autoCompletion,
      enableSnippets: nextState.autoCompletion,
      enableLiveAutocompletion: nextState.autoCompletion
    });
  }

  function

  /**
   * 获取唯一标识,这个比较简单
   * @returns {number}
   */
  getUUID() {
    var id = setTimeout('0');
    clearTimeout(id);
    return id;
  }

  /**
   * 获取选中的值
   */
  getSelectedValue() {
    return this.editor.session.getTextRange(this.editor.getSelectionRange());
    //console.log("开始的位置,结束的位置:", this.editor.getSelectionRange())  //获取选中的范围, 行列
    //console.log("选中的值:", this.editor.session.getTextRange(this.editor.getSelectionRange())) //获取选中的值
  }

  changeReadOnly() {
    this.setState({readOnly: !this.state.readOnly})
  }

  changeLanguage(e) {
    console.log("e", e.target.value)
    this.setState({mode: e.target.value})
  }

  enableAutoCompletion() {
    this.setState({autoCompletion: !this.state.autoCompletion})
  }

  insertValue() {
    this.editor.insert("select * from table1 ");
  }

  render() {
    return (
      <div>
        <div id={this.editorId} className="bdos-ide" style={{height:'300px'}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default IDE