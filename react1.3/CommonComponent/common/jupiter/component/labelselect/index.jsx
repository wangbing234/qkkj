/***********************************************
 * author: 冯庆   2016-05-12
 * 带标签的Select
 * 使用方法：
 * <LabelSelect  dataProvider={typeList} dataField="id" labelField="name" label="资源类型："
 labelStyle={{marginRight:5,textAlign:"left"}} style={{float:"left"}}
 onChange={this.typeHandleChange.bind(this,'resourceType')}>
 </LabelSelect>
 * **********************************************/
import React from 'react'
import {Select, Option} from 'bfd-ui/lib/Select2'
import './style.less'


class LabelSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    //默认下拉选择第一项
    if (this.props.dataProvider && this.props.dataProvider.length) {
      let key;
      let svalue;
      if (this.props.dataField) {
        key = this.props.dataField;
      }
      svalue = key ? this.props.dataProvider[0][key] : this.props.dataProvider[0];
      this.state = {value: svalue};
    }
  }

  /*下拉值改变的处理方法*/
  selectChange(value) {
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  /*组件渲染*/
  render() {
    const comboboxConfig = this.props;
    let options = comboboxConfig.dataProvider.map(function (itemObj, index) {
      return (<Option key={index}
                      value={comboboxConfig.dataField?itemObj[comboboxConfig.dataField]:itemObj}>{comboboxConfig.labelField ? itemObj[comboboxConfig.labelField] : itemObj}</Option>);
    });
    let selectClass = `labelSelect ${(comboboxConfig.className ? comboboxConfig.className : '')}`;
    let labelClass = `select-label ${(comboboxConfig.labelClass ? comboboxConfig.labelClass : '')}`;
    // let innerSelectClass = ''
    return (<div className={selectClass} style={comboboxConfig.style}>
                <span className={labelClass} style={comboboxConfig.labelStyle}>
                        <nobr>{comboboxConfig.label}</nobr>
                </span>
      <div className="labelSelect-select" style={{...comboboxConfig.componentStyle}}>
        <Select value={this.state.value} onChange={this.selectChange.bind(this)}>{options}</Select>
      </div>
    </div>);
  }
}

export default LabelSelect;