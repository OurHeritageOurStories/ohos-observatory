import React from "react";
import { Nav, NavLink, NavMenu } from "./Navbarelements"

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/" activeStyle>
                        home
                    </NavLink>
                    <NavLink to="/test" activeStyle>
                        test
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;