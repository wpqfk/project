import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // URL 파라미터에서 게시물 ID를 가져오기 위해 사용
import { useAuth } from '../component/auth'; // useAuth 훅을 통해 accessToken을 가져옵니다.

const PostDetail = () => {
  const { id } = useParams(); // URL 파라미터에서 게시물 ID 가져오기
  const { accessToken } = useAuth(); // useAuth 훅을 사용해 accessToken을 가져옵니다.
  const [post, setPost] = useState(null); // 게시물 상세 정보 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 서버에서 게시물 상세 정보를 가져오는 함수
  const getPostDetails = async () => {
    if (!accessToken) {
      setError('로그인된 사용자가 아닙니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/posts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // 헤더에 accessToken 추가
        },
      });

      if (!response.ok) {
        throw new Error('게시물 정보를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      setPost(data); // 가져온 게시물 상세 정보를 상태에 저장
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 게시물 상세 정보를 가져옵니다.
  useEffect(() => {
    if (accessToken) {
      getPostDetails(); // accessToken이 있을 때만 호출
    } else {
      setLoading(false); // accessToken이 없으면 로딩을 끝냄
    }
  }, [accessToken, id]); // accessToken과 id가 변경될 때마다 실행

  if (loading) {
    return <div>게시물 정보를 가져오는 중...</div>;
  }

  if (error) {
    return <div>오류 발생: {error}</div>;
  }

  // 게시물 상세 정보 렌더링
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>작성 시간: {new Date(post.time).toLocaleString()}</p>
      <p>좋아요: {post.likes}</p>
    </div>
  );
};

export default PostDetail;
