import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../component/auth'; // useAuth 훅을 통해 accessToken을 가져옵니다.

const Posts = () => {
  const { accessToken } = useAuth(); // useAuth 훅을 사용해 accessToken을 가져옵니다.
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  // 게시물 데이터를 가져오는 함수
  const getPosts = async () => {
    if (!accessToken) {
      setError('로그인된 사용자가 아닙니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // 헤더에 accessToken 추가
        },
      });

      if (!response.ok) {
        throw new Error('게시물을 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      setPosts(data); // 가져온 게시물 데이터를 상태에 저장
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // accessToken이 있는 경우에만 getPosts() 호출
  useEffect(() => {
    if (accessToken) {
      getPosts();
    } else {
      setLoading(false); // accessToken이 없으면 로딩을 끝내고 에러 처리
    }
  }, [accessToken]); // accessToken이 변경될 때마다 실행

  if (loading) {
    return <div>게시물을 가져오는 중...</div>;
  }

  if (error) {
    return <div>오류 발생: {error}</div>;
  }

  return (
    <div>
      <h1>게시물 목록</h1>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.posts_id}>
              <button onClick={() => navigate(`/posts/${post.posts_id}`)}>
                {post.title}
              </button>
            </div>
          ))
        ) : (
          <p>게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
