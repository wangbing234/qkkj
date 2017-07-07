import React from 'react'
import EventName from 'EventName'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import { Select ,Option} from 'bfd-ui/lib/Select'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'

const style = {
    width: 300
};
class SeeDataPolicy extends React.Component{
    constructor(prop){
        super(prop);
        }

        handleCancel(e) {
           EventEmitter.dispatch(EventName.see_Data_Authority_List, {});
        }

        render() {
            return (
            <Tabs>
                <TabList>
                    <Tab>Hive</Tab>
                </TabList>
                <TabPanel>
                    <Form>
                        <FormItem label="策略名称"required>
                            <input type="text" className="form-control"/>
                        </FormItem>
                        <FormItem label="库：" required>
                            <Select style={style}  placeholder="请选择" >
                                <Option value="jack">hivedev</Option>
                                <Option value="lucy">lucy</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            label="数据库：" required>
                            <Select style={{ width: 200 }} placeholder="请选择" >
                                <Option value="jack">hivedev</Option>
                                <Option value="lucy">lucy</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            label="表：" required>
                            <Select style={style}  placeholder="请选择" >
                                <Option value="jack">hivedev</Option>
                                <Option value="lucy">lucy</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            label="列：" required>
                            <Select style={style}  placeholder="请选择" >
                                <Option value="jack">hivedev</Option>
                                <Option value="lucy">lucy</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="权限类型" required>
                            <CheckboxGroup>
                                <Checkbox value="apple">苹果</Checkbox>
                                <Checkbox value="mi">小米</Checkbox>
                                <Checkbox value="samsung">三星</Checkbox>
                                <Checkbox value="huawei">华为</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="描述"
                                     labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                                     required>
                            <input type="text"/>
                        </FormItem>
                        <FormItem label="描述"
                                  labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                                  required>
                            <button onClick = {this.handleCancel}>返回</button>
                        </FormItem>
                    </Form>
                </TabPanel>
            </Tabs>
            );
        }
}

export default SeeDataPolicy