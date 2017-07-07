import React from 'react'
class ConsanguinityInfoDetail extends React.Component{

  constructor(prop) {
    super(prop);
    this.state = {}
  }

    render(){
        return (
            <div className="consanguinity_table_border">
                <table className="consanguinity_table">
                    <tr>
                        <td className="table_label">直接上游表数</td>
                        <td className="table_value">{this.state.directUp}</td>
                        <td className="table_label">所有上游表数</td>
                        <td className="table_value">{this.state.allUp}</td>
                    </tr>
                    <tr>
                        <td className="table_label">直接下游表数</td>
                        <td className="table_value">{this.state.directDown}</td>
                        <td className="table_label">所有下游表数</td>
                        <td className="table_value">{this.state.allDown}</td>

                    </tr>
                </table>
            </div>
        );
    }
}

export default ConsanguinityInfoDetail;