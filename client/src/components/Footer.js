import React from "react";
import { Row, Col } from "reactstrap";

const Footer = () => {
  const thisYear = () => {
    const year = new Date().getFullYear();
    return year;
  };

  return (
    <div id="main-footer" className="text-center p-2">
      {/* ReactStrap에서는 1개의 행만 있더라도 반드시 Row 다음에는 Col이 와야함 */}
      <Row>
        <Col>
          <p>
            Copyright &copy;<span>{thisYear()}</span>
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
