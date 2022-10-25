import React from "react";

function Test(props){
    return <h5>This is the test1 prop -&gt; {props.test1}</h5>
}

function Test_prop(){
    return(
        <div>
            <Test test1="dave"/>
            <Test test1="3"/>
        </div>
    )
}

export { Test_prop, Test };