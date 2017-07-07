import CommonTopDiv from './CommonTopDiv'

class ProjectTopDiv extends CommonTopDiv {

    constructor(props) {
        super(props);
        this.state = {
            lineUpString: "项目总数",
            lineDownString: "总存储量",
            detail: "none",
            color: "#7986cb",
            icon:"./src/common/img/fullView/ProjectView.png",
            unit: "个" //单位
        };
    }
}
export default ProjectTopDiv;