import React from 'react';
import {Select, Option} from 'bfd-ui/lib/Select';

const ComboBox = React.createClass({
	getInitialState() {
		return {
			selected: 1
		}
	},
	render(){
		console.log(this.props);
		const comboboxConfig = this.props;
		var options = comboboxConfig.dataProvider.map(function(itemObj, index){
			return (<Option key={index} value={itemObj[comboboxConfig.dataField]}>{itemObj[comboboxConfig.labelField]}</Option>);
		});
		return (<div className="common-comboBox"><Select {...this.props}>{options}</Select></div>);
	}
});

export default ComboBox;