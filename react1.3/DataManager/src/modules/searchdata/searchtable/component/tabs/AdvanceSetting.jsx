import React from 'react'
import {Form, FormItem} from 'bfd-ui/lib/Form'
import {Select, Option} from 'bfd-ui/lib/Select'
import AjaxReq from './../../model/AjaxReq'

let data = {
    "location":"",
    "dataFormat":"",
    "storeType":"",
    "lineSplit":null,
    "escape":null,
    "collectionSplit":null,
    "mapKey":null,
    "serializationFormat":null
}
class AdvanceSetting extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            data: {
                "location":"",
                "dataFormat":"",
                "storeType":"",
                "lineSplit":null,
                "escape":null,
                "collectionSplit":null,
                "mapKey":null,
                "serializationFormat":null
            }
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentWillUnmount() {
        this.isUnmount = true;
    }

    // 获取表格数据
    getData() {
        let that = this;
        let param = {database:this.props.table.database, tableName:this.props.table['table_name']};
        AjaxReq.getSeniorInfo(param, function(result){
            if(!that.isUnmount){
                if( result.data) {
                    that.setState({
                        data: result.data
                    });
                } else if(!result.data){
                    that.setState({
                        data: data
                    });
                }
            }

        });
    }

    selectChange(field,e){
        this.setState({...this.state,[field]:e});
    }

    changeData(){
        console.log('changeData')
    }

    render(){
        return (<div className="search-tableInfo-ddl-div" >
                    <Form labelWidth={120} horizontal onChange={this.changeData.bind(this)}>
                        <FormItem label="表所在HDFS地址" name="location">
                            <input disabled={true} type="text" className="form-control" value={this.state.data.location}/>
                        </FormItem>
                        <FormItem label="数据存储格式" name="dataFormat">
                            <input disabled={true} type="text" className="form-control" value={this.state.data.dataFormat}/>
                        </FormItem>
                        <FormItem label="存储类型" name="storeType">
                            <input disabled={true} type="text" className="form-control" value={this.state.data.storeType}/>
                        </FormItem>
                        <FormItem label="列分隔符" name="lineSplit">
                            <input disabled={true} type="text" className="form-control" value={this.state.data.fieldDelim}/>
                        </FormItem>
                        <FormItem label="列转义符" name="serializationFormat">
                            <input type="text" className="form-control" disabled={true} value={this.state.data.escape}/>
                        </FormItem>
                        <FormItem label="collection分隔符" name="collectionSplit">
                            <input type="text" className="form-control" disabled={true} value={this.state.data.collectionSplit}/>
                        </FormItem>
                        <FormItem label="map-kv分隔符" name="mapKey">
                            <input type="text" className="form-control" disabled={true} value={this.state.data.mapKey}/>
                        </FormItem>
                    </Form>
        </div>);
    }
}

export default AdvanceSetting;