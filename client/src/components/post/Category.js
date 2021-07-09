import React from "react";
import { Link } from "react-router-dom";
import { Button, Badge } from "reactstrap";
const Category = ({ post }) => {
  // console.log(post);
  return (
    <>
      {Array.isArray(post)
        ? post.map(({ _id, categoryName, post }) => (
            <div key={_id} className="mx-1 mt-1 my_category">
              <Link
                to={`/post/category/${categoryName}`}
                className="text-dartk text-decoration-none"
              >
                <span className="ml-1">
                  <Button color="info">
                    {categoryName} <Badge color="light">{post.length}</Badge>
                  </Button>
                </span>
              </Link>
            </div>
          ))
        : ""}
    </>
  );
};
export default Category;
