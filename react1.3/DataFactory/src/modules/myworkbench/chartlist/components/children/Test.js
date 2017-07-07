/**
 * Created by BFD_274 on 2016/3/31.
 */
import React from 'react'
import PieChart from 'bfd-ui/lib/PieChart'

const data = [{
    "value": 200,
    "name": "HIVE"
}, {
    "value": 200,
    "name": "SQOOP"
}];

const Test = React.createClass({
    getInitialState() {
        return {

        }
    },
    render() {
        return (
                <div>
                    <PieChart name="访问来源" radius={{inner:0.5}} animation={{pie:2500,lineText:500}}
                          tooltip={{enabled:true}} data={data} />
                </div>
        );
    }
})

export default  Test
