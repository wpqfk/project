import React, { useState } from 'react';

function SignupPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = () => {
    if (id && password && name && dob) {
      setMessage('회원가입 완료!');
    } else {
      setMessage('모든 필드를 입력해주세요.');
    }
  };

  return (
    <main>
      <h2>회원가입</h2>
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
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <button onClick={handleSignup}>회원가입</button>
      <p>{message}</p>
    </main>
  );
}

export default SignupPage;
