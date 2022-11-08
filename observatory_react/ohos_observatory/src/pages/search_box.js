import React from "react";

function Get_search(props){
    return <h5>This will display  search</h5>
}

function Search_box(){
    return(
        <div>
            <Get_search result="seach"/>
        </div>
    )
}

export { Search_box, Get_search };