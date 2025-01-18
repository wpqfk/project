import React from 'react';
import { logout } from './auth'; // auth.js에서 logout 함수 불러오기

function Logout() {
  const handleLogout = () => {
    logout();  // auth.js의 logout 함수 호출
    window.location.href = '/login';  // 로그아웃 후 로그인 페이지로 리디렉션
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
}

export default Logout;
