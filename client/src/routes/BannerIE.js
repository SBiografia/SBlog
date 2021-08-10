import React, { Fragment } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppNavbar from "../components/AppNavbar";
import { Row, Col, Button, Container } from "reactstrap";

const BannerIE = () => {
  const onRedirectEdge = () => {
    window.location = "microsoft-edge:" + window.location.href;
  };

  const EdgeButton = (
    <Fragment>
      <Row className="d-flex justify-content-center pb-3">
        <Col className="col-sm-12 com-md-3">
          <Button block className="btn-check" onClick={onRedirectEdge}>
            OPEN with Edge
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
  return (
    <Fragment>
      <AppNavbar />
      <Header />

      <Container id="main-body">
        {<h1 style="text-align:center">이 브라우저는 오래 되었습니다.</h1>}
        {EdgeButton}
      </Container>
      <Footer />
    </Fragment>
  );
};

export default BannerIE;
