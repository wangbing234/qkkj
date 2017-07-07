import CommonTopDiv from './CommonTopDiv'
import EventName from '../../../../containers/EventName'
class TableTopDiv extends CommonTopDiv {
  constructor(props) {
    super(props);
    this.state = {
      lineUpString: "表总数",
      lineDownString: "总存储量",
      detail: "black",
      color: "#64b5f6",
      icon: "./src/common/img/fullView/TableView.png",
      unit: "张" //单位
    };
  }


  addDetailTab(){
    let record = {
      href: "/searchData/searchTable",
      title: "查找表",
      "data-icon": "search"
    }
    EventEmitter.dispatch(EventName.addTab, record)
  }
}
export default TableTopDiv;