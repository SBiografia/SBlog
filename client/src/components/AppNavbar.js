import React, { Fragment } from "react";
import { Navbar, Container, NavbarToggler, Collapse, Nav } from "reactstrap";
import { Link } from "react-router-dom";
import LoginModal from "./auth/LoginModal";

const AppNavbar = () => {
  return (
    <Fragment>
      <Navbar color="dark" dark expand="lg" className="sticky-top">
        <Container>
          <Link to="/" className="text-white text-decoration-none">
            ㅅㅂㄹㄱ SBlog
          </Link>

          <Collapse isOpen={true} navbar>
            {/* collapse 기능 이용해서 true/false일 때 인증값을 기준으로 접속자 권한을 표시해줌. */}
            <Nav
              className="ml-auto d-flex flex-row-reverse justify-content-around"
              navbar
            >
              {/* className="ml-auto d-flex justify-content-around" navbar> */}
              {false ? (
                <h1 className="text-white">authLink</h1>
              ) : (
                // <h1 className="text-white">guestLink</h1>
                <LoginModal />
              )}
            </Nav>
          </Collapse>
          <NavbarToggler />
        </Container>
      </Navbar>
    </Fragment>
  );
};

export default AppNavbar;
