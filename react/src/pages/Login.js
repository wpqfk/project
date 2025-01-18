// src/pages/Login.js
import React, { useState } from 'react';
import { useAuth } from '../component/auth'; // 전역 상태를 관리하는 AuthContext
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // 전역 상태에서 login 함수 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

  const handleLogin = async () => {
    setIsLoading(true);
    setMessage(''); // 이전 메시지 초기화

    if (!id || !password) {
      setMessage('아이디와 비밀번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      await login(id, password); // 로그인 함수 호출
      setMessage('로그인 성공!');
      navigate('/'); // 로그인 성공 후 홈 페이지로 이동
    } catch (error) {
      setMessage('로그인 실패: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <h2>로그인</h2>
      <input
        type="text"
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        placeholder="패스워드"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={isLoading}>
        로그인
      </button>
      {isLoading && <p>로그인 중...</p>}
      <p>{message}</p>
    </main>
  );
}

export default Login;
