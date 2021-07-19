import React, { Fragment } from "react";
import { Row, Spinner } from "reactstrap";

export const GrowingSpinner = (
  <Fragment>
    <Row className="d-flex justify-content-center m-5">
      <Spinner
        style={{ width: "2rem", height: "2rem" }}
        type="grow"
        color="primary"
        children=""
      />
      <Spinner
        style={{ width: "2rem", height: "2rem" }}
        type="grow"
        color="secondary"
        children=""
      />
      <Spinner
        style={{ width: "2rem", height: "2rem" }}
        type="grow"
        color="success"
        children=""
      />
      <Spinner
        style={{ width: "2rem", height: "2rem" }}
        type="grow"
        color="danger"
        children=""
      />
      <Spinner
        style={{ width: "2rem", height: "2rem" }}
        type="grow"
        color="warning"
        children=""
      />
      <Spinner
        style={{ width: "2rem", height: "2rem" }}
        type="grow"
        color="info"
        children=""
      />
      <Spinner
        style={{ width: "2rem", height: "2rem" }}
        type="grow"
        color="light"
        children=""
      />
      <Spinner
        style={{ width: "2rem", height: "2rem" }}
        type="grow"
        color="dark"
        children=""
      />
    </Row>
  </Fragment>
);
