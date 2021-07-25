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

//post가 배열로 존재한다면
//post.map 해주는데 몽고DB 는 개개별 id를 '_id'로 표기, 그 외
//Link to 로 Router.js 에서 만들어준 postDetail로 넘어가게 할꺼임
//text-truncate : 텍스트가 표시영역 넘어가면 ...으로 표시
const PostCardOne = ({ post }) => {
  // console.log("PostCardOne : post:", post);
  return (
    <Fragment>
      {Array.isArray(post)
        ? post.map(({ _id, title, fileUrl, comments, views }) => {
            // {
            //   console.log("PostCardOne/return", _id, title, comments);
            // }
            return (
              <div key={_id} className="col-md-4">
                <Link
                  to={`/post/${_id}`}
                  className="text-dark text-decoration-none"
                >
                  <Card className="mb-3">
                    <CardImg top alt="카드이미지" src={fileUrl} />
                    <CardBody>
                      <CardTitle className="text-truncate d-flex justify-content-between">
                        <span className="text-truncate">{title}</span>
                        <span>
                          <FontAwesomeIcon icon={faMouse} /> &nbsp;&nbsp;{" "}
                          <span>{views}</span>
                        </span>
                      </CardTitle>
                      <Row>
                        <Button color="primary" className="p-2 btn-block">
                          More <Badge color="light">{comments.length}</Badge>
                        </Button>
                      </Row>
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
