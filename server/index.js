require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');
const menusRouter = require('./routes/menus');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/menus', menusRouter);
app.use('/api/orders', ordersRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '커피 주문 앱 서버' });
});

// DB 연결 확인 (선택)
app.get('/health/db', async (req, res) => {
  try {
    const row = await testConnection();
    res.json({ status: 'ok', database: 'connected', serverTime: row.now });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected', message: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
  try {
    await testConnection();
    console.log('PostgreSQL 연결됨');
  } catch (err) {
    console.error('PostgreSQL 연결 실패:', err.message);
  }
});
