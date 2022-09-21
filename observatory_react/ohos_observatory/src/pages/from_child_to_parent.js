import React from "react";

export class ButtonChild extends React.Component{
    state = {
        onOrOf: '',
    }

    handleStateChange = () => {
        this.props.onOnOrOf(onOrOf);
    }

    render(){
        return (
            <div>
                <button type="button" onClick={this.handleStateChange}>Click me</button>
            </div>
        )
    }
}