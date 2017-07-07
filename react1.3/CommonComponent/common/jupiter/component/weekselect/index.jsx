import React from 'react';
import './style.less'
class WeekSelect extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
    this.weekList = [
      { id: 1, label: "日" },
      { id: 2, label: "一" },
      { id: 3, label: "二" },
      { id: 4, label: "三" },
      { id: 5, label: "四" },
      { id: 6, label: "五" },
      { id: 7, label: "六" }
    ];
  }

  weekChange( item, evt ) {
    $( evt.target ).parent().find( 'a' ).removeClass( "a-selected" );
    $( evt.target ).addClass( "a-selected" );
    if ( this.props.onChange ) {
      this.props.onChange( item.id );
    }
  }

  componentDidMount() {

  }

  setActive() {
    let that = this;
    let selectValue ;
    this.weekList.map( ( item ) => {
      if ( item.id == that.props.value ) {
        selectValue = item.value;
        return;
      }
    } );
    let list = $( ".week-container" ).find( 'a' );
    list.removeClass( "a-selected" );
    list.map( ( index, item ) => {
      if ( $( item ).attr( "value" ) == selectValue) {
        $( item ).addClass( "a-selected" );
      }
    } );
  }


  render() {
    let that = this;
    return (
      <div className="week-container">
        {this.weekList.map((item,index) => {
          let activeClass = that.props.value == item.id?"a-selected":"";
          return (<a key={index} href="javascript:void(0);" className={activeClass} value={item.id}
                     onClick={this.weekChange.bind(this,item)}>{item.label}</a>);
          })}
      </div>
    );
  }
}
export default WeekSelect