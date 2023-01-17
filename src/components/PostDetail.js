import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import format from "date-fns/format";

import { ModalContext } from "./Layout";

const PostDetail = function () {
  let [post, setPost] = useState(null);
  let [error, setError] = useState(null);
  let [formattedDate, setFormattedDate] = useState(null);
  const postID = parseInt(useParams().postid);
  const navigate = useNavigate();

  const createModal = useContext(ModalContext);

  function formatDate(post) {
    setFormattedDate(format(new Date(post.createdAt), "MMMM Qo, yyyy"));
  }

  //get post
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
          `${process.env.REACT_APP_BLOG_API_URL}/private/posts/${postID}`,
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
        /** get comments for later 
        /* const comments = postJSON.comments;
        */
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

  function deleteButtonHandler(event) {
    event.preventDefault();
    const deletePost = async function () {
      try {
        console.log("delete post fired");
        const token = localStorage.getItem("token");

        if (!token) {
          const err = new Error("No JWT found.");
          err.status = 404;
          setError(err);
          return;
        }
        await fetch(
          `${process.env.REACT_APP_BLOG_API_URL}/private/posts/${post.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: token,
            },
          }
        );
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    };
    createModal(
      "Deleting post",
      `Are you sure you want to delete ${post.title}?`,
      deletePost,
      "Yes, I am sure."
    );
  }

  return (
    <div className="postDetailWrapper">
      {error ? (
        <div>
          <p>{error}</p>
        </div>
      ) : post ? (
        <div className="postDetail" key={post.id}>
          <div className="postDetailHeader flexRow">
            <h2 className="postDetailTitle">{post.title}</h2>

            <div className="flexGrow" />
            <div className="postDetailButtons flexRow">
              <button className="postDetailUpdateButton postDetailButton">
                ✎
              </button>
              <button
                className="postDetailDeleteButton postDetailButton"
                onClick={(event) => {
                  deleteButtonHandler(event);
                }}
              >
                X
              </button>
            </div>
          </div>
          <div className="postDetailInfo flexRow">
            <p>
              By{" "}
              <a
                href="https://github.com/oliverowen2210"
                className="postDetailLink"
              >
                Oliver Owen
              </a>
            </p>
            <p className="postDetailDate">Posted on {formattedDate}</p>
          </div>
          <div className="postDetailBody">
            <p className="postDetailText">{post.text}</p>
          </div>
          <div className="postDetailFooter flexRow">
            {post.published ? (
              <p className="postDetailPublished">Published</p>
            ) : (
              <p className="postDetailUnpublished">Unpublished</p>
            )}
            <div className="flexGrow" />
            <button className="postDetailToggleVisibilityButton postDetailButton">
              O
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
