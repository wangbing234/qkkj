import './tabStyle.less'
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

class Demo extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {}
    console.info("demo constructor...")
  }

  componentDidMount() {
    setTimeout(()=> {
      this.setState({title: new Date().toDateString()})
      console.info("demo componentDidMount....")
    }, 2000)
  }

  componentWillUnmount() {
    console.info("demo componentWillUnmount")
  }

  render() {
    console.info("render demo ....")
    return (
      <div>DEMO {this.state.title}</div>
    )
  }
}

class TabStyleDemo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  render() {
    let style = {
      height: 200,
      width: '100%'
    }
    return (
      <div>
        <div id="bfd-tab-style1" className="tab-auto-width" style={style}>
          <Tabs dynamic>
            <TabList>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>
              <Tab>
                <TextOverflow>
                  <div style={{width: style.width}}>我是很长的一段文字</div>
                </TextOverflow>
              </Tab>

            </TabList>
            <TabPanel>
              <div id="bfd-tab-style2" style={style}>
                <Tabs>
                  <TabList>
                    <Tab>群体特征报告</Tab>
                    <Tab>样例用户画像</Tab>
                  </TabList>
                  <TabPanel>在 tabs的外层容器添加 id 为 bfd-tab-style1 使用该风格 <Demo/></TabPanel>
                  <TabPanel>
                    <div id="bfd-tab-style3" style={style}>
                      <Tabs>
                        <TabList>
                          <Tab>群体特征报告</Tab>
                          <Tab>样例用户画像</Tab>
                        </TabList>
                        <TabPanel>我是群体特征报告</TabPanel>
                        <TabPanel>我是样例用户画像</TabPanel>
                      </Tabs>
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
            </TabPanel>
            <TabPanel>
              <div id="bfd-tab-style3" style={style}>
                <Tabs>
                  <TabList>
                    <Tab>群体特征报告</Tab>
                    <Tab>样例用户画像</Tab>
                  </TabList>
                  <TabPanel>我是群体特征报告</TabPanel>
                  <TabPanel>我是样例用户画像</TabPanel>
                </Tabs>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default TabStyleDemo