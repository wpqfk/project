import React, { useState } from 'react';

function Signup() {
  const [id, setId] = useState('');  // 사용자가 입력하는 아이디 (id)
  const [email, setEmail] = useState('');  // 사용자가 입력하는 이메일
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [message, setMessage] = useState('');

  // 이메일 형식 검증 함수
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 회원가입 처리 함수
  const handleSignup = async () => {
    // 모든 필드가 입력되었는지 확인
    if (id && email && password && name && dob) {
      if (!isValidEmail(email)) {
        setMessage('유효한 이메일 주소를 입력해주세요.');
        return;
      }

      const userData = {
        id,    // 사용자가 입력한 아이디
        email, // 사용자가 입력한 이메일
        password,
        name,
        dob,
      };

      try {
        // 서버로 POST 요청 보내기
        const response = await fetch('http://localhost:8080/signup', {
          method: 'POST', // POST 요청
          headers: {
            'Content-Type': 'application/json', // JSON 형식으로 데이터 전송
          },
          body: JSON.stringify(userData), // 폼 데이터 JSON으로 변환하여 전송
        });

        // 응답이 실패한 경우
        if (!response.ok) {
          const result = await response.json(); // JSON으로 응답을 받기
          throw new Error(result.error || '회원가입 실패, 다시 시도해주세요.');
        }

        // 응답이 성공적이면
        const result = await response.json();
        setMessage(result.message || '회원가입 완료!');
      } catch (error) {
        // 에러 발생 시
        setMessage(error.message || '서버에 문제가 발생했습니다.');
      }
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
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <p>{message}</p> {/* 서버로부터 받은 메시지 출력 */}
    </main>
  );
}

export default Signup;
