import React from "react";
import {Test_prop, Test} from "./test_prop";

const Home = () => {
    return (
        <div>
            <h1>
                thingy stuff home
            </h1>
            <h3>
                Test just spawning from child
                <Test_prop />
            </h3>
            <h4>
                Alt test passing to child to inherit
                <Test test1="Tada"/>
            </h4>
        </div>
    );
};

export default Home;