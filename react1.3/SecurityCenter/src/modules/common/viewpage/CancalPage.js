import React from 'react'
import FormFooter from 'CommonComponent/component/formfooter'
const CancalPage = React.createClass({
    render() {

        return (
            <div>
                {this.props.children}
                <button  style={{marginLeft: "100px"}} type="button" className="btn btn-sm btn-default " onClick={this.props.cancelClick}>取消
                </button>
            </div>
        );
    }
});

export default CancalPage