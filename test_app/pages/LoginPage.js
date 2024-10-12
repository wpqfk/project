import React, { useState } from 'react';

function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const validId = 'user';
  const validPassword = 'password';

  const handleLogin = () => {
    if (id === validId && password === validPassword) {
      setMessage('로그인 성공!');
    } else {
      setMessage('아이디 또는 패스워드가 잘못되었습니다.');
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
      <button onClick={handleLogin}>로그인</button>
      <p>{message}</p>
    </main>
  );
}

export default LoginPage;
