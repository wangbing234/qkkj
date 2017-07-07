/****************************************************
 * create by qing.feng
 * time 2016/7/22 11:05
 * desc：工作流维护- 定时计划- 定时器选择- 调度计划tab页
 *****************************************************/
import React from 'react';
import {Tabs,Tab,TabList,TabPanel} from 'bfd-ui/lib/Tabs'
import LabelInputNumber from 'CommonComponent/component/labelinputnumber'
import RestrictConst from 'CommonComponent/utils/RestrictConst'

import WeekSelect from 'CommonComponent/component/weekselect'
import CalenderSelect from 'CommonComponent/component/calenderselect'

class CalenderTab extends React.Component {
  constructor( props ) {
    super( props );
    //日期反选
    //this.refs.calendSelector.setState({year:this.props.year,month:this.props.month,day:this.props.day});
    this.isThis = false;//标识是否是当前界面的setState;
    this.state = { data:{planTabActive: 0, minute: 0, hour: 0, week: 1, day: 1 }};
  }
  componentDidMount(){
    if(this.props.data)
      this.setData( this.props.data );
  }
  componentWillReceiveProps(nextProp){
    if(nextProp.calenderData && !this.isThis){
      this.setData( nextProp.calenderData );
    }
  }

  initState(){
    this.isThis = false;
    let _newData = {planTabActive: 0, minute: 0, hour: 0, week: 1, day: 1 };
    this.setState({ data:_newData});
  }

  /*写入数据到state中*/
  setData( data ) {
    let _data = { planTabActive: 0, minute: 0, hour: 0 };
    let secStr = data.daPicker[ 0 ].split( ":" );
    secStr[ 0 ] = Number( secStr[ 0 ] );
    if ( secStr.length > 1 ) {
      secStr[ 1 ] = Number( secStr[ 1 ] );
    }
    let day = 1;
    switch ( data.type ) {
      case "h":
        _data = { minute: data.daPicker[ 0 ] };
        _data.planTabActive = 0;
        break;
      //type： d -> 选择的是定时tab页，且当前日期定义的是天的tab页
      case "d":
        _data = { minute: secStr[ 1 ], hour: secStr[ 0 ] };
        _data.planTabActive = 1;
        break;
      //type： w -> 选择的是定时tab页，且当前日期定义的是周的tab页
      case "w":
        _data = { minute: secStr[ 1 ], hour: secStr[ 0 ], week: Number( data.datePickers[ 0 ] ) };
        _data.planTabActive = 2;
        if(this.refs.weekSelect)
          this.refs.weekSelect.setState( {} );
        break;
      //type： m -> 选择的是定时tab页，且当前日期定义的是月的tab页
      case "m":
        day = Number( data.datePickers[ 0 ] );
        _data = { minute: secStr[ 1 ], hour: secStr[ 0 ], day: day };
        _data.planTabActive = 3;
        if(this.refs.calendSelector)
          this.refs.calendSelector.setState( { year: 2016, month: 5, day: day } );
        break;
    }
    _data.day = day;
    this.setState( { data:{..._data} } );
  }

  /*各组件change事件处理*/
  valueChange( dataField, value ) {
    this.isThis = true;
    if ( typeof value === "number" ) {
      this.state.data[dataField]=value;
      this.setState( { [dataField]: value } );
    } else if ( value && value.target ) {
      this.state.data[dataField] = value.target.value
    }
    this.setState( { ...this.state } );
  }

  /*日期-月change处理*/
  dateChange( value ) {
    this.isThis = true;
    let d = new Date( value );
    this.state.data.day = d.getDate();
    this.setState( { ...this.state} );
  }

  /*tab页标签change处理*/
  tabsChange( newIndex ) {
    this.isThis = true;
    this.state.data.planTabActive = newIndex;
    this.setState( { ...this.state} );
    this.props.tabsChange( newIndex );
  }

  /*从state中获取数据，并拼装到object中，返回给父级使用*/
  getFormData() {
    let tabType;
    let timeStr;
    let specDay;
    switch ( this.state.data.planTabActive ) {
      case 0:
        tabType = "h";
        timeStr = this.state.data.minute.toString();
        break;
      case 1:
        tabType = "d";
        timeStr = this.state.data.hour.toString() + ":" + this.state.data.minute.toString();
        break;
      case 2:
        tabType = "w";
        timeStr = this.state.data.hour.toString() + ":" + this.state.data.minute.toString();
        specDay = this.state.data.week;
        break;
      case 3:
        tabType = "m";
        timeStr = this.state.data.hour.toString() + ":" + this.state.data.minute.toString();
        specDay = this.state.data.day;
        break;
    }
    let _data = {
      type: tabType,
      daPicker: [ timeStr ]
    };
    if ( !specDay ) {
      specDay = [ "1" ]
    }
    _data.datePickers = [ specDay.toString() ];
    return _data;
  }

  render() {
    let numInputStyle = { display: "inline-block", width: "100px", marginRight: "10px" }
    return (
      <div>
        <Tabs activeIndex={this.state.data.planTabActive} onChange={this.tabsChange.bind(this)}>
          <TabList>
            <Tab>小时</Tab>
            <Tab>天</Tab>
            <Tab>周</Tab>
            <Tab>月</Tab>
          </TabList>
          <TabPanel>
            分:<input
            type="number" className="form-control" style={numInputStyle}
            name="分:" max={60} min={0} step={1} value={this.state.data.minute}
            onChange={this.valueChange.bind(this,'minute')}/>
          </TabPanel>
          <TabPanel>
            <div>
              时:<input
              type="number" className="form-control" style={numInputStyle}
              max={24} min={0} step={1} value={this.state.data.hour}
              onChange={this.valueChange.bind(this,'hour')}/>

              分:<input
              type="number" className="form-control" style={numInputStyle}
              max={60} min={0} step={1} value={this.state.data.minute}
              onChange={this.valueChange.bind(this,'minute')}/>
            </div>
          </TabPanel>
          <TabPanel>
            <WeekSelect ref="weekSelect" value={this.state.data.week} onChange={this.valueChange.bind(this,'week')}/>
            <div style={{marginTop:"20px",marginLeft:"-10"}}>
              时:<input
              type="number" className="form-control" style={numInputStyle}
              max={24} min={0} step={1} value={this.state.data.hour}
              onChange={this.valueChange.bind(this,'hour')}/>

              分:<input
              type="number" className="form-control" style={numInputStyle}
              max={60} min={0} step={1} value={this.state.data.minute}
              onChange={this.valueChange.bind(this,'minute')}/>
            </div>
          </TabPanel>
          <TabPanel>
            <CalenderSelect
              ref="calendSelector"
              onSelect={this.dateChange.bind(this)}
              date={new Date(2016,5,this.state.data.day)}/>
            <div>
              时:<input
              type="number" className="form-control" style={numInputStyle}
              max={24} min={0} step={1} value={this.state.data.hour}
              onChange={this.valueChange.bind(this,'hour')}/>

              分:<input
              type="number" className="form-control" style={numInputStyle}
              max={60} min={0} step={1} value={this.state.data.minute}
              onChange={this.valueChange.bind(this,'minute')}/>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
export default CalenderTab