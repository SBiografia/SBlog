import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  Navbar,
  Container,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Form,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import LoginModal from "./auth/LoginModal";
import { LOGOUT_REQUEST } from "../redux/types";
import { useDispatch, useSelector } from "react-redux";
import RegisterModal from "./auth/RegisterModal";

const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, userRole } = useSelector(
    (state) => state.auth
  );
  console.log("UserROle => ", userRole);
  const dispatch = useDispatch();
  const onLogout = useCallback(() => {
    dispatch({
      type: LOGOUT_REQUEST,
    });
  }, [dispatch]);
  //Login하고 나면 로그인 메뉴가 열려 있을 필요가 없어서 만들어줌. isopen을 false로 해서 닫아놓으려고
  useEffect(() => {
    setIsOpen(false);
  }, [user]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const addPostClick = () => {};

  //enum: ["MainJuin", "SubJuin", "User"],
  const authLink = (
    <Fragment>
      <NavItem>
        {userRole === "MainJuin" ? (
          <Form className="col mt-2">
            <Link
              to="post"
              className="btn btn-success block text-white px-3"
              onClick={addPostClick}
            >
              Add Post
            </Link>
          </Form>
        ) : (
          ""
        )}
      </NavItem>
      <NavItem className="d-flex justify-content-center">
        <Form className="col mt-2">
          {user && user.name ? (
            <Link>
              <Button outline color="light" className="px-3" block>
                <strong>{user ? `Welcome ${user.name}!` : ""}</strong>
              </Button>
            </Link>
          ) : (
            <Button outline color="light" className="px-3" block>
              <strong>No User</strong>
            </Button>
          )}
        </Form>
      </NavItem>
      <NavItem>
        <Form className="col">
          <Link onClick={onLogout} to="#">
            <Button outline color="light" className="mt-2" block>
              Logout
            </Button>
          </Link>
        </Form>
      </NavItem>
    </Fragment>
  );

  const guestLink = (
    <Fragment>
      <NavItem>
        <RegisterModal />
      </NavItem>
      <NavItem>
        <LoginModal />
      </NavItem>
    </Fragment>
  );

  return (
    <Fragment>
      <Navbar color="dark" dark expand="lg" className="sticky-top">
        <Container>
          <Link to="/" className="text-white text-decoration-none">
            ㅅㅂㄹㄱ SBlog
          </Link>
          <NavbarToggler onClick={handleToggle} />
          <Collapse isOpen={isOpen} navbar>
            {/* collapse 기능 이용해서 true/false일 때 인증값을 기준으로 접속자 권한을 표시해줌. */}
            <Nav
              className="ml-auto d-flex flex-row-reverse justify-content-around"
              navbar
            >
              {/* className="ml-auto d-flex justify-content-around" navbar> */}
              {isAuthenticated ? authLink : guestLink}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </Fragment>
  );
};

export default AppNavbar;
