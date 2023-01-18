import React from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

const PostCard = function (props) {
  return (
    <Link className="postCardWrapper" to={`/post/${props.post.id}`}>
      <div className="postCard" key={props.post.id}>
        <div className="postCardHeader">
          <h2 className="postCardTitle">{props.post.title}</h2>
        </div>

        <div className="postCardInfo flexRow">
          <p>
            {" "}
            By{" "}
            <a
              href="https://github.com/oliverowen2210"
              className="postCardLink"
            >
              Oliver Owen
            </a>
          </p>
          <p className="postCardDate">
            Posted on {format(new Date(props.post.createdAt), "MMMM Do, yyyy")}
          </p>
        </div>

        <div className="postCardFooter">
          {props.post.published ? (
            <p className="postCardPublished">Published</p>
          ) : (
            <p className="postCardUnpublished">Unpublished</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
