import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import format from "date-fns/format";
import { ModalContext } from "./Layout";
import parse from "html-react-parser";

const PostDetail = function () {
  let [post, setPost] = useState(null);
  let [comments, setComments] = useState(null);
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
        setComments(comments);
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
  }, [navigate, postID, comments]);

  function deleteButtonHandler(event) {
    event.preventDefault();
    const deletePost = async function () {
      try {
        const token = localStorage.getItem("token");
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

  function toggleVisibilityButtonHandler(event) {
    if (!post) return;
    event.preventDefault();
    const modalText = `Are you sure you want to ${
      post.published ? "unpublish" : "publish"
    } ${post.title}?`;

    /**Function being sent to modal*/
    async function invertPostPublishedState() {
      try {
        const token = localStorage.getItem("token");

        await fetch(
          `${process.env.REACT_APP_BLOG_API_URL}/private/posts/${post.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              published: !post.published,
            }),
          }
        );
        navigate("/");
        document.location.reload();
      } catch (err) {
        console.log(err);
      }
    }

    createModal(
      "Toggling Visibility",
      modalText,
      invertPostPublishedState,
      "Yes, I am sure."
    );
  }

  return error ? (
    <div>
      <p>{error}</p>
    </div>
  ) : post ? (
    <div className="postDetailWrapper">
      <div className="postDetail" key={post.id}>
        <div className="postDetailHeader flexRow">
          <h2 className="postDetailTitle">{post.title}</h2>

          <div className="flexGrow" />
          <div className="postDetailButtons flexCol">
            <Link to={`/post/${post.id}/update`}>
              <button className="postDetailUpdateButton postDetailButton">
                ✎
              </button>
            </Link>
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

          <p className="postDetailComments">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </p>
        </div>
        <div className="postDetailBody">{parse(post.text)}</div>
        <div className="postDetailFooter flexRow">
          {post.published ? (
            <p className="postDetailPublished">Published</p>
          ) : (
            <p className="postDetailUnpublished">Unpublished</p>
          )}
          <div className="flexGrow" />
          <button
            className="postDetailToggleVisibilityButton postDetailButton"
            onClick={(event) => {
              toggleVisibilityButtonHandler(event);
            }}
          >
            O
          </button>
        </div>
      </div>

      <div className="postComments">
        <h2>Comments</h2>
        <form action="userComment">
          <div className="postFormInputGroup userCommentText">
            <label htmlFor="comment">Leave a comment</label>
            <textarea name="comment"></textarea>
          </div>
          <div className="flexRow">
            <div className="postFormInputGroup userCommentUsername">
              <label htmlFor="username">Username (optional)</label>
              <input name="username" placeholder="Anonymous"></input>
            </div>
            <button className="userCommentSubmitButton">Submit</button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default PostDetail;
