import React, { Fragment } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppNavbar from "../components/AppNavbar";
import { Container } from "reactstrap";

const BannerIE = () => (
  <Fragment>
    <AppNavbar />
    <Header />

    <Container id="main-body">
      {<h1>이 브라우저는 오래 되었습니다.</h1>}
    </Container>
    <Footer />
  </Fragment>
);

export default BannerIE;
