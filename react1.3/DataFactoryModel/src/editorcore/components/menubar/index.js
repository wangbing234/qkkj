import React from 'react'
import ImageBox from './ImageBox'
import './css/menubar.css'
let that;
class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    that = this;
      this.state={fullScreenImage:"src/common/img/menu/fullscreen.png"};
    //EventEmitter.subscribe('paper_reundo', this.paperUndoLater);
  }


  paperUndoLater(commandManager) {
    let undoSrc = commandManager.hasUndo() ? "src/common/img/menu/undo.png" : "src/common/img/menu/undoDisabled.png";
    let redoSrc = commandManager.hasRedo() ? "src/common/img/menu/redo.png" : "src/common/img/menu/redoDisabled.png"
    that.refs.undoHander.setState({src: undoSrc});
    that.refs.redoHander.setState({src: redoSrc});
  }

    fullScreenHander(cmdString,e) {
            if(this.state.fullScreenImage=="src/common/img/menu/fullscreen.png")
            {
                this.state.fullScreenImage="src/common/img/menu/quitFullScreen.png";
            }
            else{
                this.state.fullScreenImage="src/common/img/menu/fullscreen.png";
            }
        this.setState();
        EventEmitter.dispatch(cmdString);
        //<ImageBox src="src/common/img/menu/clean.png" cmd='paper_clean' title="清空"/>
        //<ImageBox src="src/common/img/menu/undoDisabled.png" ref="undoHander" cmd='paper_undo' title="撤销"/>
        //    <ImageBox src="src/common/img/menu/redoDisabled.png" ref="redoHander" cmd='paper_redo' title="重做"/>
    }

  render() {
    return (
      <div className="top-toolbar">
          {this.props.children}
          <div  className="toolbar_img">
              <span className="ant-divider"/>
                <ImageBox dataCode="1020607" src="src/common/img/menu/delete.png" cmd='paper_delete' title="删除"/>
                <ImageBox dataCode="1020610" src="src/common/img/menu/save.png" cmd='paper_save' title="保存"/>
              {/** <ImageBox src="src/common/img/menu/export.png" cmd='paper_export' title="导出"/>
                <ImageBox src="src/common/img/menu/open.png" cmd='paper_open' title="导入"/>**/}
                <img ref="fullScreenHander" src={this.state.fullScreenImage}  style={{float:"right",marginTop:5}} onClick={this.fullScreenHander.bind(this,"screen_full")}  title="全屏"/>
          </div>
      </div>
    );
  }
}

export default MenuBar;