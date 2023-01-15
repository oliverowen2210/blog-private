import React, { useEffect, useState } from "react";
import format from "date-fns/format";

const Posts = function () {
  let [posts, setPosts] = useState(null);
  let [JWT, setJWT] = useState(false);

  function checkJWT() {
    if (localStorage.getItem("token")) {
      setJWT(localStorage.getItem("token"));
    } else setJWT(null);
  }

  useEffect(() => {
    async function fetchData() {
      const postsData = await fetch(
        "https://blog-api-production-c97a.up.railway.app"
      );
      const posts = await postsData.json();
      setPosts(posts);
    }
    checkJWT();
    if (JWT) fetchData();
  }, [JWT]);

  return (
    <div className="App">
      {posts ? (
        posts.map((post) => {
          const formattedDate = format(
            new Date(post.createdAt),
            "MMMM Qo, yyyy"
          );
          return (
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
          );
        })
      ) : (
        <div>
          <p>There are no posts to display.</p>
        </div>
      )}
    </div>
  );
};

export default Posts;
