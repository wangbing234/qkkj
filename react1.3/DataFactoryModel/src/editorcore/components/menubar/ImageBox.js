import React from 'react'
import AuthButton from 'CommonComponent/component/authbutton'
class ImageBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {src: null}
    }

    dispatchCommand(cmdString) {
        EventEmitter.dispatch(cmdString);
    }

    onImageMouseOver(evt) {
        // console.log("evt:",evt);
    }

    onImageMouseOut(evt) {
        // console.log("evt:",evt);
    }

    render() {
        return (<AuthButton renderType="img"  data-code={this.props.dataCode} src={this.state.src||this.props.src}  onMouseOut={this.onImageMouseOver} onMouseOver={this.onImageMouseOver}
                     onClick={this.dispatchCommand.bind(this,this.props.cmd)}  title={this.props.title}/>
        );
    }
}

export default ImageBox;