import React from "react";

function Get_wikibase_result(props){
    return <h5>This will display  -&gt result; {props.result}</h5>
}

function Wikibase_query(){
    return(
        <div>
            <Get_wikibase_result result="wikibase"/>
        </div>
    )
}

export { Wikibase_query, Get_wikibase_result };