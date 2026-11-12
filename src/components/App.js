
import React, { useState, useEffect, useMemo } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(1);
  const [cache, setCache] = useState({});

  const cachedPosts = useMemo(() => {
    return cache[userId] || [];
  }, [cache, userId]);

  useEffect(() => {
    if (cache[userId]) {
      setPosts(cache[userId]);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();

        setPosts(data);

        setCache((prev) => ({
          ...prev,
          [userId]: data
        }));
      } catch (error) {
        console.log(error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, cache]);

  return (
    <div className="main-container">
      <h1>Cached API</h1>

      <label>Select User: </label>

      <select
        value={userId}
        onChange={(e) => setUserId(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((id) => (
          <option key={id} value={id}>
            User {id}
          </option>
        ))}
      </select>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div>
          <h2>Posts List</h2>

          {cachedPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <p>User ID: {post.userId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
