import CommonTopDiv from './CommonTopDiv'
import EventName from '../../../../containers/EventName'
class WorkFlowTopDiv extends CommonTopDiv {
  constructor(props) {
    super(props);
    this.state = {
      lineUpString: "工作流总数",
      lineUpValue: "40",
      lineDownString: "在调度",
      lineDownValue: "23",
      detail: "black",
      color: "#81c784",
      icon: "./src/common/img/fullView/WorkFlowView.png",
      unit: "个",
    };
  }

  addDetailTab(){
    let record = {
      href: "/searchData/searchWorkflow",
      title: "查找工作流",
      "data-icon": "search"
    }
    EventEmitter.dispatch(EventName.addTab, record)
  }
}

export default WorkFlowTopDiv;