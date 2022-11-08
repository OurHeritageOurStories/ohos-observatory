import React from "react";
import Wikibase_query from "./wikibase_query";
import Discovery_query from "./discovery_query";
import Search_box from "./search_box";

const Query = () => {
    return (
        <div>
            <h1>
                Query
            </h1>
            <h3>
                Search box
                <Search_box />
            </h3>
            <h3>
                Discovery
                <Discovery_query />
            </h3>
            <h3>
                Wikibase
                <Wikibase_query />
            </h3>
        </div>
    );
};

export default Query;