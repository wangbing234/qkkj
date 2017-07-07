import React from 'react'
class ImageBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {src: null}
    }

    dispatchCommand(cmdString) {
        console.log("cmdString:" + cmdString);
        EventEmitter.dispatch(cmdString);
    }

    onImageMouseOver(evt) {
        // console.log("evt:",evt);
    }

    onImageMouseOut(evt) {
        // console.log("evt:",evt);
    }

    render() {
        return (<img src={this.state.src||this.props.src} onMouseOut={this.onImageMouseOver}
                     onMouseOver={this.onImageMouseOver}
                     onClick={this.dispatchCommand.bind(this,this.props.cmd)}
                     title={this.props.title}/>

        );
    }
}

export default ImageBox;