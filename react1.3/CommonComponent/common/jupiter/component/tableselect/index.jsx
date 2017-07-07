import React, { PropTypes } from 'react';
import {Select , Option} from 'bfd-ui/lib/Select2'
class TableSelect extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  selectChange( value ) {
    let ct = this.context;
    if ( ct.gridItem ) {
      ct.gridItem.validate( value );
    }
    this.props.onChange(value);
  }

  render() {
    let optionList = this.props.optionList ? this.props.optionList : [];
    return (
      <Select value={this.props.value} onChange={this.selectChange.bind(this)}>
        {optionList.map((item,index) => {
          return <Option key={index} value={item[this.props.dataField]?item[this.props.dataField]:item}>
            {item[this.props.labelField]?item[this.props.labelField]:item}
          </Option>
          })}
      </Select>
    );
  }
}
TableSelect.contextTypes = {
  formItem: PropTypes.object,
  gridItem: PropTypes.object,
}
export default TableSelect