import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Button, Badge } from "reactstrap";
const Category = ({ post, type }) => {
  // console.log(post);
  return (
    <Fragment>
      {Array.isArray(post)
        ? post.map(({ _id, categoryName, post }) => (
            <div key={_id} className="ms-1 mt-1 my_category">
              <Link
                to={`/post/category/${categoryName}`}
                className="text-dartk text-decoration-none"
              >
                <span className="ms-1">
                  <Button color="info">
                    {categoryName}
                    {type === "list" ? (
                      <Badge color="light">{post.length}</Badge>
                    ) : (
                      ""
                    )}
                  </Button>
                </span>
              </Link>
            </div>
          ))
        : ""}
    </Fragment>
  );
};
export default Category;
