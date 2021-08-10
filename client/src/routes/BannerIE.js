import React, { Fragment } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppNavbar from "../components/AppNavbar";
import { Row, Col, Button, Container } from "reactstrap";

const ChromeIMGsrc =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/90px-Google_Chrome_icon_%28September_2014%29.svg.png";
const EdgeIMGsrc =
  "https://upload.wikimedia.org/wikipedia/ko/thumb/9/98/Microsoft_Edge_logo_%282019%29.svg/64px-Microsoft_Edge_logo_%282019%29.svg.png";

const BannerIE = () => {
  const onRedirectEdge = () => {
    window.location = "microsoft-edge:" + window.location.href;
  };

  const EdgeButton = (
    <Fragment>
      <Row className="d-flex justify-content-start pb-3">
        <Col className="col-md-3 me-md-3 d-flex justify-content-center align-items-center">
          <span class="fs-2">Open with :</span>
        </Col>
        <Col className="col-md-3 me-md-3 d-flex justify-content-center">
          <Button outline size="lg" color="primary" onClick={onRedirectEdge}>
            <img
              style={{ height: "3rem" }}
              src={EdgeIMGsrc}
              alt="Microsoft Edge"
            />
            <br />
            Edge
          </Button>
        </Col>
        <Col className="col-md-3 me-md-3 d-flex justify-content-center">
          <Button outline size="lg" color="danger" onClick={onRedirectEdge}>
            <img
              style={{ height: "3rem" }}
              src={ChromeIMGsrc}
              alt="Chrome"
            ></img>
            <br />
            Chrome
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
        <div>
          <h1>
            {" "}
            이 브라우저는 지원하지 않습니다.
            <br />
            This brower is not supported
          </h1>
        </div>
        {EdgeButton}
      </Container>
      <Footer />
    </Fragment>
  );
};

export default BannerIE;
