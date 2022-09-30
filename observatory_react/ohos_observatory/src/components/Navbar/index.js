import React from "react";
import { Nav, NavLink, NavMenu } from "./Navbarelements"

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/" activeStyle>
                        Home
                    </NavLink>
                    <NavLink to="/upload" activeStyle>
                        Upload
                    </NavLink>
                    <NavLink to="/graph" activeStyle>
                        Graph
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;