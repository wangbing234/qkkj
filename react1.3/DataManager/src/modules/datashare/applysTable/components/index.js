import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import ApplyList from './ApplyList'
import '../../common/css/style.less'

const statusArr = [ { id: '', name: '全部状态' }, { id: '0', name: '已通过' }, { id: '1', name: '未通过' }, {
  id: '2',
  name: '未审批'
} ];

const FLAG_MY = 0;//我的申请
const FLAG_OTHER = 1;//他人申请
class Index extends React.Component {

  constructor( prop ) {
    super( prop );
    this.state = {}

  }

  selectChange( select ) {
    this.setState( { selected: select } );
  }

  render() {
    return (<div className="data-share-div">
      <Tabs>
        <TabList>
          <Tab>我的申请</Tab>
          <Tab>他人申请</Tab>
        </TabList>
        <TabPanel><ApplyList ref="applyList_0" history={this.props.history} flag={FLAG_MY}/></TabPanel>
        <TabPanel><ApplyList ref="applyList_1" history={this.props.history} flag={FLAG_OTHER}/></TabPanel>
      </Tabs>
    </div>)
  }
}

export default Index;
