import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import PostCard from "./PostCard";

const PostsList = function () {
  let [posts, setPosts] = useState(null);
  let [error, setError] = useState(null);
  const navigate = useNavigate();

  //get posts
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const postsData = await fetch(
        `${process.env.REACT_APP_BLOG_API_URL}/private/posts`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const posts = await postsData.json();
      setPosts(posts);
    }
    try {
      fetchData();
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
      }
      setError(err);
    }
  }, [navigate]);

  return (
    <div className="postsListWrapper">
      <Link to="/post/new" className="postsListNewPost">
        <button>Create New Post</button>
      </Link>
      <div className="postsList">
        {error ? (
          <div>
            <p>error.message</p>
          </div>
        ) : posts ? (
          posts.map((post) => {
            return <PostCard post={post} key={post.id} />;
          })
        ) : (
          <div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsList;
