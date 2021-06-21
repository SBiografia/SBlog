import React, { Fragment } from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Button,
  Badge,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMouse } from "@fortawesome/free-solid-svg-icons";

//posts가 배열로 존재한다면
//posts.map 해주는데 몽고DB 는 개개별 id를 '_id'로 표기, 그 외
//Link to 로 Router.js 에서 만들어준 postDetail로 넘어가게 할꺼임
//text-truncate : 텍스트가 표시영역 넘어가면 ...으로 표시
const PostCardOne = ({ posts }) => {
  return (
    <Fragment>
      {Array.isArray(posts)
        ? posts.map(({ _id, title, fileUrl, comments, views }) => {
            return (
              <div key={_id} className="col-md-4">
                <Link
                  to={`/post/${_id}`}
                  className="text-dark text-decoration-none"
                >
                  <Card>
                    <CardImg top alt="카드이미지" src={fileUrl} />
                    <CardBody>
                      <CardTitle className="d-flex justify-content-between">
                        <span className="text-truncate">{title}</span>
                        <span>
                          <FontAwesomeIcon icon={faMouse} /> &nbsp;&nbsp;{" "}
                          <span>{views}</span>
                        </span>
                      </CardTitle>
                    </CardBody>
                  </Card>
                </Link>
              </div>
            );
          })
        : ""}
    </Fragment>
  );
};

export default PostCardOne;
