import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>나의 홈페이지</h1>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/login">로그인</Link>
        <Link to="/signup">회원가입</Link>
        <Link to="/about">소개</Link>
      </nav>
    </header>
  );
}

export default Header;
