import React from 'react';
import { useAuth } from '../component/auth'; // useAuth 훅을 통해 로그인 상태 가져오기
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const { accessToken, logout } = useAuth(); // 로그인 상태와 로그아웃 함수 가져오기
  const navigate = useNavigate();

  // 로그인 후, 마이페이지로 이동하거나, 다른 동작 처리
  const handleLogout = () => {
    logout(); // 로그아웃 처리
    navigate('/'); // 홈으로 리다이렉트
  };

  return (
    <div>
      <h1>홈페이지</h1>
      
      {/* 로그인 상태에 따라 다른 버튼을 보여줌 */}
      {!accessToken ? (
        <div>
          <Link to="/Login">
            <button>로그인</button>
          </Link>
          <Link to="/Signup">
            <button>회원가입</button>
          </Link>
          <Link to="/posts">
            <button>게시판</button>
          </Link>
        </div>
      ) : (
        <div>
          <Link to="/Mypage">
            <button>마이페이지</button>
          </Link>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      )}
    </div>
  );
}

export default Home;
