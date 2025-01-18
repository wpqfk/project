import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // 페이지 이동을 위한 navigate 훅
import { useAuth } from '../component/auth'; // 인증 정보 가져오기

const CreatePost = () => {
  const [title, setTitle] = useState('');  // 제목 상태
  const [content, setContent] = useState('');  // 내용 상태
  const [error, setError] = useState('');  // 오류 상태
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const { accessToken } = useAuth();  // 인증 토큰 가져오기
  const navigate = useNavigate();  // 페이지 이동을 위한 navigate 훅

  // 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();  // 기본 폼 제출 동작 방지

    // 인증 토큰이 없으면 오류 처리
    if (!accessToken) {
      return setError('로그인이 필요합니다.');
    }

    setLoading(true);  // 로딩 시작
    setError('');  // 기존 오류 상태 초기화

    try {
      // 서버로 POST 요청 보내기
      const response = await fetch('http://localhost:8080/posts', {
        method: 'POST',  // POST 요청
        headers: {
          'Content-Type': 'application/json',  // JSON 데이터 형식
          Authorization: `Bearer ${accessToken}`,  // 인증 토큰 헤더에 추가
        },
        body: JSON.stringify({ title, content }),  // 제목과 내용 데이터를 본문에 포함
      });

      if (!response.ok) {
        throw new Error('게시물 작성에 실패했습니다.');  // 요청 실패 시 오류 메시지
      }

      const data = await response.json();  // 서버 응답 받기
      navigate(`/posts/${data.posts_id}`);  // 새 글의 상세 페이지로 이동
    } catch (error) {
      setError(error.message);  // 오류 처리
    } finally {
      setLoading(false);  // 로딩 종료
    }
  };

  return (
    <div>
      <h1>새 게시물 작성</h1>
      
      {/* 오류 메시지 표시 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* 로딩 상태 표시 */}
      {loading && <p>게시물 작성 중...</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">제목:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}  // 제목 입력 처리
            required
            disabled={loading}  // 로딩 중에는 입력 불가
          />
        </div>
        <div>
          <label htmlFor="content">내용:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}  // 내용 입력 처리
            required
            disabled={loading}  // 로딩 중에는 입력 불가
          />
        </div>
        <button type="submit" disabled={loading}>게시물 작성</button>  {/* 로딩 중에는 버튼 비활성화 */}
      </form>
    </div>
  );
};

export default CreatePost;
