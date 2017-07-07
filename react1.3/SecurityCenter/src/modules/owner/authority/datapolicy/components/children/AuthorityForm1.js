import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import AddRowTable from 'CommonComponent/component/addrowtable'

let dataSource = {
    "totalList": [
        {
            "key": "1",
            "selectRole": [],
            "selectUser": [],
            "permission": []
        }
    ],
    "currentPage": 1,
    "totalPageNum": 20
};

class AuthorityForm extends React.Component{
    constructor(prop) {
        super(prop);
        this.state = {data: dataSource, userSelected: [],roleSelected: []};
        this.column = [
            {
                title: '选择角色',
                key: 'selectRole'
            }, {
                title: '选择用户',
                key: 'selectUser'
            }, {
                title: '权限',
                key: 'permission',
                render(text, record){
                    return (<a href="javascript:void(0);">添加权限</a>)
                }
            }];
    }

    /**
     * 公用修改
     * @param dataField
     * @param result
     */
    handleChange(dataField, result) {
        this.setState({dataField: result});
    }

    addClickHandler(e){
        dataSource.totalList.push({selectRole: '', selectUser: '', permission: ''});
        this.setState({data: dataSource});
    }


    render() {
        return (
            <div style={{marginBottom:40}}>
                <AddRowTable column={this.column} data={this.state.data}/>
            </div>
        );
    }
}

export default AuthorityForm;
