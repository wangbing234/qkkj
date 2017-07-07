/****************************************************
 * create by qing.feng
 * time 2016/7/21 14:53
 * desc：需要验证的多选下拉框
 * 用法：<TableMultipleSelect
 value={text.split(",")}
 onChange={that.itemChangeHandle.bind(that,true,item,'dbHiveName')}
 dataField="id"
 labelField="name"
 optionList={that.hiveDbList}
 />
 *****************************************************/
import React, { PropTypes } from 'react';
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
class TableMultipleSelect extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  /*切換時，驗證*/
  selectChange( value ) {
    this.props.onChange( value );
    let ct = this.context;
    if ( ct.gridItem ) {
      ct.gridItem.validate( value );
    }
  }

  render() {
    let optionList = this.props.optionList ? this.props.optionList : [];
    return (
      <div className="table-multiple-select-div">
        <MultipleSelect
          key={this.props.key}
          defaultValues={this.props.defaultValues}
          value={this.props.value} onChange={this.selectChange.bind(this)}>
          {optionList.map((item,index) => {
            return <Option key={index} value={item[this.props.dataField]?item[this.props.dataField]:item}>
              {item[this.props.labelField]?item[this.props.labelField]:item}
            </Option>
            })}
        </MultipleSelect>
      </div>
    );
  }
}
TableMultipleSelect.contextTypes = {
  formItem: PropTypes.object,
  gridItem: PropTypes.object,
}
export default TableMultipleSelect