import React, { useState, useEffect } from 'react';
import { useAuth } from '../component/auth'; // AuthContext에서 가져오기

const MyPage = () => {
  const { accessToken } = useAuth();  // AuthContext에서 accessToken을 가져옴
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 상태

  // 사용자 정보를 가져오는 함수
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:8080/mypage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // JSON이 아닌 경우 텍스트로 응답 받기
        throw new Error(`사용자 정보를 가져오는 데 실패했습니다. 상태 코드: ${response.status}. 응답 내용: ${errorText}`);
      }

      const data = await response.json(); // JSON 형식 응답을 처리
      setUserInfo(data);
      if (data.profileImage) {
        setProfileImage(`http://localhost:8080${data.profileImage}`); // 프로필 이미지 URL 설정
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      setError('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
      setLoading(false);
      return;
    }

    fetchUserInfo(); // 페이지 로드 시 사용자 정보를 가져옴
  }, [accessToken]);

  // 프로필 사진 업로드 핸들러
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0]; // 선택된 파일

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 로컬에서 파일을 읽은 후 프로필 이미지 상태에 저장
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file); // 파일을 data URL로 변환
    }

    const formData = new FormData();
    formData.append('profileImage', e.target.files[0]); // 선택된 파일을 formData에 추가

    try {
      const response = await fetch('http://localhost:8080/uploadProfileImage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('프로필 사진 업로드 실패');
      }

      const data = await response.json();
      alert('프로필 사진이 성공적으로 업로드되었습니다!');

      // 업로드 후 사용자 정보를 다시 가져옴
      fetchUserInfo();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div>사용자 정보를 가져오는 중...</div>;
  }

  if (error) {
    return <div>오류 발생: {error}</div>;
  }

  return (
    <div>
      <h1>사용자 정보</h1>
      {userInfo ? (
        <div>
          <p>이름: {userInfo.name}</p>
          <p>이메일: {userInfo.email}</p>
          <div>
            <label>프로필 사진</label>
            <input type="file" onChange={handleProfileImageUpload} />
            {/* 이미지 미리보기 */}
            {profileImage && (
              <img src={profileImage} alt="Profile" width="100" style={{ marginTop: '10px' }} />
            )}
          </div>
        </div>
      ) : (
        <p>사용자 정보를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default MyPage;
