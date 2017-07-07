import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import SeeTenant from 'SeeTenant'

let that;

class ResourceAuthority extends React.Component{
    constructor(prop){
        super(prop);
        that = this;
    }

    seeuser(){
       //弹出查看用户界面
       this.refs.usermodal.open();
    }

    seerole(){
       //弹出查看角色界面
       this.refs.rolemodal.open();
    }

    seeAllTenant(){
        this.refs.modal.open();
    }

    getColumns(){
        return [{
            title: "资源名称",
            key: 'name'
        }, {
            title: "租户",
            key: 'tenant',
            render(text) {
                var texts = text.split(',');
                return texts.map(function(name,index) {
                    if(index > 1){
                        return <a href="javascript:void(0)" key={index} onClick={that.seeAllTenant.bind(that)}>查看全部</a>
                    }
                    return <span key={index} className="list-function-span">{name}</span>
                })
            }
        }];
    }

    render() {
        that = this;
        let column = this.getColumns();
        return (<div className="module-table">
            <DataTable data={data} showPage="true" column={column} howRow={AdminEnum.PAGE_SIZE}/>
            <SeeTenant ref="modal"/>
      </div>)
    }
}

module.exports = ResourceAuthority;
