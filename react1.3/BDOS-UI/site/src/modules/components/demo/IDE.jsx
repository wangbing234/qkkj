import React from 'react'
import IDE from 'Base/IDE'
import BfdRequest from 'CommonComponent/request/AjaxRequest'

let that;
class IDEDemo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  componentWillUnmount() {
    that = null;
  }

  getValue() {
    let ide = that.refs.ide;
    console.log("ide.getSelectedValue()", ide.getSelectedValue())
  }

  redo() {
    let editor = that.refs.ide.editor;
    editor.redo();
  }

  undo() {
    let editor = that.refs.ide.editor;
    editor.undo();
  }

  handleIdeChange(editor, e) {
    this.setState({
      hasUndo: editor.session.getUndoManager().hasUndo(),
      hasRedo: editor.session.getUndoManager().hasRedo()
    })
  }

  handleComplete(key, callback) {
    console.log("getdata...")
    let url = "./data/tables.json"
    BfdRequest.ajaxGet(url, (result)=> {
      callback(result.data);
    }, null, false)
  }



  render() {
    that = this;
    return (<div>
      <button onClick={this.getValue}>获取选中数据</button>
      <button onClick={this.redo} className="btn btn-primary" disabled={!that.state.hasRedo}>前进</button>
      <button onClick={this.undo} className="btn btn-primary" disabled={!that.state.hasUndo}>后退</button>
      <IDE ref="ide"
           style={{height:300}}
           keys={["word","ide",'hiveTable']}
           onComplete={this.handleComplete.bind(this)}
           onChange={this.handleIdeChange.bind(this)}>

      </IDE>
    </div>);
  }
}

export default IDEDemo