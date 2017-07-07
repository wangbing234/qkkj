import React from 'react';
import Transfer from 'bfd-ui/lib/Transfer'
let sourceData = [
    {id : 1, label : "张三"},
    {id : 2, label : "李四"},
    {id : 3, label : "李五"},
    {id : 4, label : "李六"},
    {id : 5, label : "李七五"},
    {id : 6, label : "李八"},
    {id : 7, label : "李九四"},
    {id : 8, label : "李十"},
    {id : 9, label : "李时珍"}
];
let targetData = [
    {id : 10, label : "张三疯"},
    {id : 11, label : "王二小"}
];
const List = React.createClass({
    getInitialState() {
        return {
            sourceData: [],
            targetData: []
        };
    },
    componentDidMount() {
        //this.getMock();
    },

    renderFooter() {
        return (
            <Button type="primary" size="small" style={{ float: 'right', margin: '5' }}
                    onClick={this.getMock}>
                刷新
            </Button>
        );
    },
    render() {
        return (<div className="row">
            <Transfer height={200} title={"已选的用户"} sdata={sourceData} tdata={targetData} />
        </div>);
    }
});
module.exports = List;