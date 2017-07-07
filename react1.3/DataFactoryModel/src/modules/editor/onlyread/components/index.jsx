import React from 'react'
import {ToolBar,MenuBar,Paper,Modal,RightMenu,Loading} from '../../../../editorcore'

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
    if (url) {
      $.get(url, function (data) {
        setTimeout(()=> {
          let allData = {};
          allData.links = that.getLinksFromXML(data);
          allData.nodes = that.getShapesFromXML(data);
          that.setState({data: allData, loaded: true})
        }, 500);
      });
    }
    else {
      this.setState({loaded: true})
    }
  }


  /**
   * 从XML中获取图元节点数据
   * @returns {Array}
   */
  getShapesFromXML(data) {
    let nodes = [];
    let shapes = data.getElementsByTagName('BPMNShape');
    let servicesTasks = data.getElementsByTagName('serviceTask');

    for (let i = 0, length = shapes.length; i < length; i++) {
      let bound = shapes[i].getElementsByTagName('Bounds')[0];
      let x = this.getXMLValue(bound.attributes['x']);
      let y = this.getXMLValue(bound.attributes['y']);
      let id = this.getXMLValue(shapes[i].attributes['bpmnElement']);
      let task = servicesTasks[id] || {};
      let config = this.getNodeConfigByXML(this.state.config, task);

      let src = (config && config.image) || "src/common/imgs/editor/DataAudit.png";
      let label = this.getXMLValue(task.attributes && task.attributes['name']);
      let node = {
        id: id,
        x: parseInt(x),
        y: parseInt(y),
        src: src,
        label: label,
        config: config,
        shape: shapes[i],  //节点信息
        task: task  //相关的逻辑信息
      }
      nodes.push(node);

      /*//没有配置的节点不显示
       if (config) {
       let src = (config && config.image);
       let label = this.getXMLValue(task.attributes && task.attributes['name']);
       let node = {
       id: id,
       x: parseInt(x),
       y: parseInt(y),
       src: src,
       label: label,
       config: config,
       shape: shapes[i],  //节点信息
       task: task  //相关的逻辑信息
       }
       nodes.push(node);
       }*/
    }
    return nodes;
  }

  /**
   * 根据XML数据，用解析器去解析，判断是哪一个类型数据
   */
  getNodeConfigByXML(config, xml) {
    let nodes = config.node || [];
    for (let i = 0, length = nodes.length; i < length; i++) {
      if (nodes[i].parser && (typeof(nodes[i].parser) === "function")) {
        if (nodes[i].parser(xml)) {
          return nodes[i];
        }
      }
    }
    return null;
  }

  /***
   * 从XML获取线节点
   * @param data
   * @returns {Array}
   */
  getLinksFromXML(data) {
    let links = [];
    let shapes = data.getElementsByTagName('sequenceFlow');
    for (let i = 0, length = shapes.length; i < length; i++) {
      let id = this.getXMLValue(shapes[i].attributes['id']);
      let name = this.getXMLValue(shapes[i].attributes['name']);
      let sourceRef = this.getXMLValue(shapes[i].attributes['sourceRef']);
      let targetRef = this.getXMLValue(shapes[i].attributes['targetRef']);
      let config = this.state.config.line;
      let link = {
        id: id,
        label: name,
        start: sourceRef,
        end: targetRef,
        config: config,
        shape: shapes[i]
      }
      links.push(link);
    }
    return links;
  }

  /**
   * 获取XML节点的值，兼容多种浏览器
   * @param xmlNode
   * @returns {*}
   */
  getXMLValue(xmlNode) {
    let value;
    if (xmlNode) {
      value = xmlNode.value || xmlNode.nodeValue || xmlNode.textContent;
    }
    return value;
  }

  dispatchCommand(cmdString) {
    console.log("cmdString:" + cmdString);
    EventEmitter.dispatch(cmdString);
  }

  /**
   * 生成节点
   * @returns {XML}
   */
  renderNodes() {
    let menus = [
      {
        text: '打开',
        func: function (e) {
          console.log('打开', e)
          alert('打开')
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
      }
      ,
      {
        text: '添加',
      }
    ]
    return (
      <div>
        <RightMenu data={menus}/>
        <Paper id="paper" ref="paper"
               onlyRead={true}
               config={this.state.config}
               data={this.state.data}>
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