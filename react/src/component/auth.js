import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);  // Access Token 상태
  const [loading, setLoading] = useState(true);  // 로딩 상태 관리

  // 최초 마운트 시, localStorage에서 accessToken을 읽어옵니다.
  useEffect(() => {
    const accessTokenFromStorage = localStorage.getItem('access_token');
    
    if (accessTokenFromStorage) {
      setAccessToken(accessTokenFromStorage);  // 상태 업데이트
    }
    
    setLoading(false);  // 로딩 상태를 false로 변경하여 렌더링을 완료합니다.
  }, []);  // 컴포넌트가 마운트될 때만 한 번 실행

  // accessToken이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);  // Access Token을 localStorage에 저장
    } else {
      localStorage.removeItem('access_token');  // Token이 없으면 localStorage에서 삭제
    }
  }, [accessToken]);

  const login = async (id, password) => {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });

    if (!response.ok) {
      throw new Error('로그인 실패');
    }

    const data = await response.json();
    setAccessToken(data.accessToken);  // 로그인 성공 시 상태 업데이트
    console.log('Login Success:', data.accessToken); // 여기서 확인
  };

  const logout = () => {
    setAccessToken(null);  // 상태에서 토큰을 삭제
    localStorage.removeItem('access_token');  // localStorage에서 토큰 삭제
  };

  // 로딩 중일 때는 컴포넌트를 렌더링하지 않음 (로딩 상태가 끝날 때까지)
  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
