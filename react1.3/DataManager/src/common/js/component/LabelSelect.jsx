import React from 'react'
import {Select, Option} from 'bfd-ui/lib/Select'

class LabelSelect extends React.Component{
    render(){
        const comboboxConfig = this.props;
        var options = comboboxConfig.dataProvider.map(function(itemObj, index){
            return (<Option key={index} value={itemObj[comboboxConfig.dataField]}>{itemObj[comboboxConfig.labelField]}</Option>);
        });
        return (<div>
                    <div className="clear-col-padding-left select-label" style={{width:80,float:'left'}}>
                      {comboboxConfig.label}
                    </div>
                    <div style={{width:240,float:'left'}}>
                        <Select {...comboboxConfig}>{options}</Select>
                    </div>
            </div>);
    }
}

export default LabelSelect;