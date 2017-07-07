import React from 'react';
import classnames from 'classnames'
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin'
import './style.less'
class CalenderSelect extends React.Component {
  constructor( props ) {
    super( props );
    const d = this.props.date ? new Date( this.props.date ) : new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    this.state = {
      year,
      month,
      day,
      currentYear: year,
      currentMonth: month
    };
  }

  handleDaySelect( date ) {
    const { year, month, day } = date;
    this.setState( {
      year,
      month,
      day,
      currentYear: year,
      currentMonth: month
    } );
    this.props.onSelect && this.props.onSelect( new Date( year, month, day ).setHours( 0, 0, 0, 0 ) )
  }

  // 当前月各天的时间状态
  getDates() {
    let d = this.props.date;
    const dates = [];
    // 本月
    for ( let i = 0; i < 31; i++ ) {
      dates.push( {
        year: d.getFullYear(),
        month: d.getMonth(),
        day: i + 1
      } )
    }
    return dates
  }

  // 样式高亮，是否是今天、开始、结束、区间内、当月外、日期范围外
  getDateClassNames( date ) {
    if ( date ) {
      const timestrap = new Date( date.year, date.month, date.day ).getTime();
      return classnames( {
        today: timestrap === new Date().setHours( 0, 0, 0, 0 ),
        exclude: date.notThisMonth,
        active: timestrap === new Date( this.state.year, this.state.month, this.state.day ).getTime()
      } )
    }

  }

  render() {
    const dates = this.getDates(this.props.date);
    let rowArr = dates.length % 7 ? [ 1, 2, 3, 4, 5 ] : [ 1, 2, 3, 4 ];
    let columnArr = [ 1, 2, 3, 4, 5, 6, 7 ];
    let singlePadding = { padding: "3px 8px" };
    let doublePadding = { padding: "4px 5px" };
    return (
      <div className="bfd-calendar">
        <table>
          <tbody>
          {rowArr.map((v, i) => {
            return (
            <tr key={i}>
              {
                columnArr.map((_v,ind) => {
                  let date = dates[i * 7 + ind];
                  if(date){
                    let aStyle = date.day > 9? doublePadding:singlePadding;
                    return <td key={ind}>
                      <a href="javascript:void(0);"
                         style={aStyle} className={this.getDateClassNames(date)}
                         onClick={this.handleDaySelect.bind(this, date)}>{date.day}</a>
                    </td>
                    }
                  })
                }
            </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
export default CalenderSelect