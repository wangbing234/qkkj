import React,{ PropTypes } from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import GridItem from './GridItem'
import "./style.less"
class ValidateTable extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  getChildContext() {
    return {
      table: this
    }
  }

  componentWillMount() {
    this.items = []
  }

  addItem( newItem ) {
    this.items.push( newItem )
  }

  removeItem( item ) {
    this.items.splice( this.items.indexOf( item ), 1 )
  }

  /*为需要进行提示的单元格进行处理*/
  setValidate() {
    let columnArr = this.props.column ? this.props.column : [];
    columnArr.map( ( item, index ) => {
      if ( item.regExp || item.isRequired || item.maxLen || item.minLen ) {
        if ( !item._isRender ) {
          let itemRender = item.render;
          item.render = function ( text, ditem ) {
            item._isRender = true;
            return (<GridItem key={index} data={ditem} itemConfig={item} children={itemRender(text,ditem)}/>);
          }
        }
      }
    } );
  }

  /*验证使用，返回boolean*/
  validate() {
    let isValid = true
    this.items.forEach( gridItem => {
      gridItem.validate( gridItem.data[ gridItem.config.key ] ) || (isValid = false)
    } )
    return isValid
  }

  render() {
    this.setValidate();
    return (
      <div className="bdos-edit_table" style={{width:this.props.tableWidth}}>
        <DataTable
          data={this.props.data}
          showPage={this.props.showPage}
          onPageChange={this.props.onPageChange}
          column={this.props.column}
          howRow={this.props.howRow}></DataTable>
      </div>
    );
  }
}


ValidateTable.childContextTypes = {
  table: PropTypes.instanceOf( ValidateTable )
}


ValidateTable.propTypes = {
  data: PropTypes.object,
  column: PropTypes.array,
  customProp( { data, column } ) {
    if ( data && !column ) {
      return new Error( 'You provided a `data` prop without an `column` prop.' )
    }
  }
}
export default ValidateTable