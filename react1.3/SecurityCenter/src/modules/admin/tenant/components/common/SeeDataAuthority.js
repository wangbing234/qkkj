import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import Hbase from './dataauthoritytabs/hbaseTable'
import Hdfs from './dataauthoritytabs/hdfsTable'
import Hive from './dataauthoritytabs/hiveTable'

class SeeDataAuthority extends React.Component{
    constructor(prop){
        super(prop);
        this.state = {};
    }

    render() {
        return (<div>
            <div id="bfd-tab-style3">
                <Tabs>
                    <TabList>
                        <Tab>Hive</Tab>
                        <Tab>HBase</Tab>
                        <Tab>HDFS</Tab>
                    </TabList>
                    <TabPanel><Hive tenantId={this.props.tenantId}/></TabPanel>
                    <TabPanel><Hbase tenantId={this.props.tenantId}/></TabPanel>
                    <TabPanel><Hdfs tenantId={this.props.tenantId}/></TabPanel>
                </Tabs>

            </div>
      </div>)
    }
}

export default SeeDataAuthority;
