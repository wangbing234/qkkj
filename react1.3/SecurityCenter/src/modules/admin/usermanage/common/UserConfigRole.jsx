import React from 'react'
import List from '../../../../common/js/component/List'
const users = [{name:"用户1"},{name:"用户2"},{name:"用户3"}];
const roles = [{name:"用户1"},{name:"用户2"},{name:"用户3"}];

class UserConfigRole  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {}
    }

    getDefaultProps() {
        return {
            user: {
                id: 1,
                name: 'Jupiter'
            }
        }
    }

    render(){
        return (
        <div style={{marginTop:10,marginBottom:20,marginLeft:80}}>
            <h4>
                用户名1：{this.props.user.name}
            </h4>
            <List/>
        </div>
        );
    }
}

module.exports = UserConfigRole;