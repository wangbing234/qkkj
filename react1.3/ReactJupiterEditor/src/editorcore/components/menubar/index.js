import React from 'react'
import ImageBox from './ImageBox'

import './css/menubar.css'

let that;
class MenuBar extends React.Component {

  constructor(props) {
    super(props);
    that = this;
    EventEmitter.subscribe('paper_reundo', this.paperUndoLater);
  }


  paperUndoLater(commandManager) {
    let undoSrc = commandManager.hasUndo() ? "src/common/img/menu/undo.png" : "src/common/img/menu/undoDisabled.png";
    let redoSrc = commandManager.hasRedo() ? "src/common/img/menu/redo.png" : "src/common/img/menu/redoDisabled.png"
    that.refs.undoHander.setState({src: undoSrc});
    that.refs.redoHander.setState({src: redoSrc});
  }


  render() {
    return (
      <div className="top-toolbar">
        <ImageBox src="src/common/img/menu/delete.png" cmd='paper_delete' title="删除"/>
        <ImageBox src="src/common/img/menu/clean.png" cmd='paper_clean' title="清空"/>
        <ImageBox src="src/common/img/menu/save.png" cmd='paper_save' title="保存"/>
        <ImageBox src="src/common/img/menu/saveas.png" cmd='paper_saveas' title="另存为"/>
        <ImageBox src="src/common/img/menu/undoDisabled.png" ref="undoHander" cmd='paper_undo' title="撤销"/>
        <ImageBox src="src/common/img/menu/redoDisabled.png" ref="redoHander" cmd='paper_redo' title="重做"/>
        <ImageBox src="src/common/img/menu/export.png" cmd='paper_export' title="导出"/>
        <ImageBox src="src/common/img/menu/open.png" cmd='paper_open' title="导入"/>
      </div>
    );
  }
}

export default MenuBar;