import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import format from "date-fns/format";

const Post = function () {
  let [post, setPost] = useState(null);
  let [error, setError] = useState(null);
  let [formattedDate, setFormattedDate] = useState(null);
  const postID = parseInt(useParams().postid);
  const navigate = useNavigate();

  function formatDate(post) {
    setFormattedDate(format(new Date(post.createdAt), "MMMM Qo, yyyy"));
  }

  //get posts
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        const err = new Error("No JWT found.");
        err.status = 404;
        setError(err);
        return;
      }
      try {
        const postData = await fetch(
          `https://blog-api-production-c97a.up.railway.app/private/posts/${postID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (postData.status === 404) {
          setError("No post with that ID was found.");
          return;
        }
        const postJSON = await postData.json();
        const post = postJSON.post;
        const comments = postJSON.comments;
        formatDate(post);
        setPost(post);
      } catch (err) {
        setError(err.message);
        return;
      }
    }
    try {
      fetchData();
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
      }
      setError(err);
    }
  }, [navigate, postID]);

  return (
    <div>
      {error ? (
        <div>
          <p>{error}</p>
        </div>
      ) : post ? (
        <div className="post" key={post.id}>
          <div className="post-header">
            <h2>{post.title}</h2>
            <p>posted on {formattedDate}</p>
          </div>
          <p className="post-text">{post.text}</p>
          {post.published ? (
            <p className="published">Published</p>
          ) : (
            <p className="unpublished">Unpublished</p>
          )}
        </div>
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Post;
