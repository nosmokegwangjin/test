const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// CORS 설정
app.use(cors());

// 클라이언트에서 요청할 때 CORS를 우회하기 위해 OPTIONS 메소드에 대한 핸들러 추가
app.options('*', cors());

// 라우트 및 기타 설정은 여기에 추가

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
