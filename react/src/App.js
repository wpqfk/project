import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Posts from './pages/posts';
import Mypage from './pages/Mypage'; 
import PostDetail from './pages/postDetail'; // PostDetail 컴포넌트 추가

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Mypage" element={<Mypage />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetail />} /> {/* 게시물 상세 페이지 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
