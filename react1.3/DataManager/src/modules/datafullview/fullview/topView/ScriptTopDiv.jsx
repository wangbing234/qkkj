import CommonTopDiv from './CommonTopDiv'
import EventName from '../../../../containers/EventName'

class ScriptTopDiv extends CommonTopDiv {
  constructor(props) {
    super(props);
    this.state = {
      lineUpString: "脚本总数",
      lineUpValue: "3434",
      lineDownString: "在调度",
      lineDownValue: "434",
      detail: "black",
      color: "#04dde1",
      icon: "./src/common/img/fullView/ScriptView.png",
      unit: "个",
      detailUrl: "/searchData/searchScript"
    };
  }

  addDetailTab(){
    let record = {
      href: "/searchData/searchScript",
      title: "查找脚本",
      "data-icon": "search"
    }
    EventEmitter.dispatch(EventName.addTab, record)
  }
}
export default ScriptTopDiv;