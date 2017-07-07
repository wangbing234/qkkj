import React from 'react'
/*import { SearchSelect } from 'bfd-ui/lib/SearchSelect'*/
import { Form, FormItem } from 'bfd-ui/lib/Form'
const data = [{ "key": "mi1", "value": "小米1" },{ "key": "mi2", "value": "小米2" },{ "key": "mi3", "value": "小米3" },
    { "key": "huawei", "value": "华为" }, { "key": "apple", "value": "苹果" },{ "key": "letv","value": "乐视" },
    { "key": "samsung","value": "三星" }, { "key": "meizu", "value": "魅族" }, { "key": "lenove","value": "联想" },
    {"key": "sony1","value": "索尼1" },{"key": "sony2","value": "索尼2" },{"key": "sony3","value": "索尼3" }];
class ProjectConfig extends React.Component {
    constructor(prop) {
        super(prop)
        this.state = {selected: [data[0],data[1]],hbase:"hbase_test",hdfs:"/bd-os/data/jupiter",searchNum:"1000"}
    }
    handleChange(result) {
        this.setState({	selected: result });
    }
    render() {
        return (
            <Form className="col-md-offset-1" horizontal style={{width:'90%'}}>
                <FormItem label="Hive库：">
                  {/*<SearchSelect data={data} disabled={true} selected={this.state.selected}
                                  onChange={this.handleChange.bind(this)}></SearchSelect>*/}
                </FormItem>
                <FormItem label="Hbase：">
                    <input type="text" className="form-control" disabled value={this.state.hbase}/>
                </FormItem>
                <FormItem label="hdfs目录：">
                    <input type="text" className="form-control" disabled value={this.state.hdfs}/>
                </FormItem>
                <FormItem label="查询默认显示条数：">
                    <input type="text" className="form-control" disabled value={this.state.searchNum}/>
                </FormItem>
            </Form>
        );
    }
}
export default ProjectConfig;



