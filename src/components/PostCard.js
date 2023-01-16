import React from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

const PostCard = function (props) {
  return (
    <Link to={`/post/${props.post.id}`}>
      <div className="postCard" key={props.post.id}>
        <div className="post-header">
          <div className="flexRow">
            <h2>{props.post.title}</h2>
          </div>
          <p>
            posted on {format(new Date(props.post.createdAt), "MMMM Qo, yyyy")}
          </p>
        </div>
        <p className="post-text">{props.post.text}</p>
        {props.post.published ? (
          <p className="published">Published</p>
        ) : (
          <p className="unpublished">Unpublished</p>
        )}
      </div>
    </Link>
  );
};

export default PostCard;
