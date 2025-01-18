const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8080;

// 비밀 키 (환경 변수로 관리하는 것이 좋습니다)
const SECRET_KEY = '1234'; // 액세스 토큰을 위한 비밀 키

// MySQL 연결
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'mysql', // 실제 사용 중인 데이터베이스 이름으로 변경
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패: ', err.stack);
    return;
  }
  console.log('MySQL 연결 성공, id: ' + connection.threadId);
});

// 미들웨어 설정
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // React 앱이 실행 중인 URL
  credentials: true, // 쿠키와 자격 증명 처리
}));

// 업로드 디렉토리 설정
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir); // uploads 폴더가 없다면 생성
  } catch (err) {
    console.error('업로드 디렉토리 생성 실패:', err);
    process.exit(1); // 디렉토리 생성 실패시 서버 종료
  }
}

// Multer 설정: 업로드된 파일을 저장할 위치 설정
const upload = multer({
  dest: uploadDir, // 파일을 저장할 디렉토리
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (5MB)
}).single('profileImage'); // 'profileImage'는 클라이언트에서 보내는 필드 이름

// **먼저 authenticateToken 함수 정의**
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer token'에서 token 추출

  if (!token) {
    return res.status(403).json({ error: '로그인 필요' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '유효하지 않은 토큰' });
    }
    req.user = user;
    next();
  });
};

// 사용자 프로필 사진 업로드 API
app.post('/uploadProfileImage', authenticateToken, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: '파일 업로드 실패', details: err.message });
    }

    // 업로드가 성공하면 파일의 경로를 데이터베이스에 저장 (예시)
    const imageUrl = `/uploads/${req.file.filename}`;

    // 데이터베이스에서 해당 사용자의 프로필 사진 URL 업데이트
    const query = 'UPDATE users SET profileImage = ? WHERE id = ?';
    connection.query(query, [imageUrl, req.user.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: '프로필 사진 업데이트 실패', details: err.message });
      }

      res.json({ message: '프로필 사진 업로드 성공', imageUrl });
    });
  });
});

// 업로드된 이미지를 클라이언트가 접근할 수 있도록 static 경로 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 로그인 API
app.post('/login', (req, res) => {
  const { id, password } = req.body;

  // 필수 값 체크
  if (!id || !password) {
    return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
  }

  // 사용자 정보 확인 쿼리
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: '아이디가 존재하지 않습니다.' });
    }

    // 비밀번호 확인 (암호화 없이 비교, 실제로는 암호화된 비밀번호를 비교해야 합니다)
    if (password !== results[0].password) {
      return res.status(400).json({ error: '비밀번호가 틀렸습니다.' });
    }

    // 로그인 성공, Access Token 발급
    const accessToken = jwt.sign({ id: results[0].id }, SECRET_KEY, { expiresIn: '1h' });

    // Access Token을 클라이언트에 전달
    res.status(200).json({ accessToken });
  });
});


// 사용자 정보 조회 API (마이페이지)
app.get('/mypage', authenticateToken, (req, res) => {
  // 로그인된 사용자의 정보를 가져오기 위해 토큰에서 user id를 가져와서 사용자 정보 쿼리
  const query = 'SELECT id, name, email, profileImage FROM users WHERE id = ?';
  connection.query(query, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: '사용자 정보 조회 실패', details: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
    }

    // 사용자 정보 반환
    res.json({
      id: results[0].id,
      name: results[0].name,
      email: results[0].email,
      profileImage: results[0].profileImage,
    });
  });
});

// 서버 코드 (Express)

app.get('/posts', (req, res) => {
  const query = 'SELECT posts_id, title FROM posts'; // 게시물 ID와 제목을 가져옵니다.
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: '게시물 조회 실패', details: err.message });
    }
    res.json(results); // 데이터베이스에서 가져온 게시물 목록을 반환
  });
});

// 게시물 상세 정보 조회 API
app.get('/posts/:id', (req, res) => {
  const postId = req.params.id; // URL에서 게시물 ID를 가져옵니다.
  const query = 'SELECT * FROM posts WHERE posts_id = ?'; // 게시물 ID로 상세 정보 조회

  connection.query(query, [postId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: '게시물 조회 실패', details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }

    // 게시물 정보 반환
    res.json(results[0]); // 첫 번째 결과만 반환
  });
});



// 서버 포트 8080번으로 실행
app.listen(port, (err) => {
  if (err) {
    console.error('서버 실행 중 오류가 발생했습니다:', err);
    return;
  }
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
