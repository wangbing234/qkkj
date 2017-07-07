import React from 'react'
import {ToolBar,MenuBar,Paper,Modal,RightMenu,Loading} from '../../../../editorcore'
import Parse from '../js/XML2Editor'

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loaded: false,
      config: require('../../uml/config')
    };
  }

  componentDidMount() {
    var that = this;
    let url = "test/data/test.xml";
    //url = "test/data/data.json"   //如何直接返回json格式的数据,需要转换成指定格式,并且注意要把 config 匹配进去
    if (url) {
      $.get(url, function (data) {
        setTimeout(()=> {
          let editorData = Parse.getData(data, that.state.config);
          that.setState({data: editorData, loaded: true})
        }, 100);
      });
    }
    else {
      this.setState({loaded: true})
    }
  }

  /**
   * 该方法,会在 paper 里面注册事件,并且传出 paper 对象
   * @param paper paper对象
   */
  regFn(paper) {
    EventEmitter.subscribe('test', function () {
      console.log("success...", paper)
    });
    /**
     * TODO:保存数据
     */
    EventEmitter.subscribe('paper_saveCells', function (cells) {
      let xmldoc = Parse.saveData(cells)
      let definitions = xmldoc.getElementsByTagName('definitions')[0];
      console.log(definitions.outerHTML);
    });
  }

  /**
   * 生成节点
   * @returns {XML}
   */
  renderNodes() {
    //邮件菜单借点
    let menus = [
      {
        text: '打开',
        func: function (node) {
          //设置图元的某些属性，需要使用 model.set 才会起作用
          node.model.set({label: '44444'})
          EventEmitter.dispatch('test', {name: 'zhongxia'})
        }
      },
      {
        text: '保存',
        children: [
          {
            text: '另存为',
            func: function (e) {
              console.log('另存为', e);
              alert('另存为')
            }
          },
          {
            text: '复制',
            func: function (e) {
              console.log('复制', e);
              alert('复制')
            }
          }
        ]
      },
      {
        text: '删除',
        func: function (node) {
          //删除图元，是同样的，必须使用 model.remove() 才可以
          node.model.remove();
        }
      }
    ]

    /*
     * 需要考虑 如何把事件注册的方法,从 paper 中抽取出来
     * */
    return (
      <div>
        <Paper id="paper"
               config={this.state.config}
               data={this.state.data}
               regFn={this.regFn}
               Modal={Modal}>
          <ToolBar paper="paper"
                   config={this.state.config}
                   dispatchEventName="paper_createNode"/>
          <MenuBar/>
          <RightMenu data={menus}/>
        </Paper>
      </div>
    );
  }


  render() {
    //加载数据完成
    if (this.state.loaded) {
      return this.renderNodes();
    } else {
      return <Loading/>;
    }
  }
}

export default Editor;