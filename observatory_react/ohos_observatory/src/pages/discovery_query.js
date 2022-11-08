import React from "react";

function Get_discovery_query(props){
    return <h5>This will display -&gt; result {props.result}</h5>
}

function Discover_query(){
    return(
        <div>
            <Get_discovery_query result="discovery"/>
        </div>
    )
}

export { Discover_query, Get_discovery_query };