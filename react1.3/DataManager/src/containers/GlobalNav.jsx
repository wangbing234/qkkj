import React from 'react'
import { Link } from 'react-router'
import { Select ,Option} from 'bfd-ui/lib/Select2'

const GlobalNav = React.createClass({
    getDefaultProps: function () {
        return {
            user: {
                id: 1,
                name: 'Jupiter'
            }
        }
    },
    render() {
        const { user } = this.props
        return (
	        <div className='layout-header'>
                <div style={{ float: 'right' }}>
	            <Select  selected="0" id="id_userType"  onChange={this.props.onChange}>
	                <Option value="0">超级管理员</Option>
	                <Option value="1">租户所有者</Option>
	                <Option value="2">普通用户</Option>
	            </Select>
                  {/*<Link className='link' to="/profile">{user.name}</Link>*/}
                </div>
	    	</div>)
    }
})

export default GlobalNav
