/**
 * DB 스키마 생성 및 시드 데이터 삽입
 * 실행: node scripts/initDb.js
 */
require('dotenv').config();
const { getPool, query } = require('../db');

const menus = [
  { code: 'americano-ice', name: '아메리카노(ICE)', description: '에스프레소에 찬물과 얼음을 더한 시원한 아메리카노입니다.', price: 4500, image: '/images/americano-ice.png', stock: 10 },
  { code: 'americano-hot', name: '아메리카노(HOT)', description: '에스프레소에 뜨거운 물을 더한 클래식 아메리카노입니다.', price: 4000, image: '/images/americano-hot.png', stock: 10 },
  { code: 'cafe-latte-hot', name: '카페라떼(HOT)', description: '풍부한 에스프레소와 스팀 밀크의 조화입니다.', price: 4500, image: '/images/cafe-latte-hot.png', stock: 10 },
  { code: 'cafe-latte-ice', name: '카페라떼(ICE)', description: '에스프레소와 차가운 우유, 얼음으로 완성한 라떼입니다.', price: 5000, image: '/images/cafe-latte-ice.png', stock: 10 },
  { code: 'vanilla-latte', name: '바닐라 라떼(HOT)', description: '바닐라 시럽이 더해진 달콤한 라떼입니다.', price: 5500, image: '/images/vanilla-latte.png', stock: 10 },
  { code: 'cold-brew', name: '콜드브루', description: '차가운 물로 긴 시간 추출한 깔끔한 커피입니다.', price: 5000, image: '/images/cold-brew.png', stock: 10 },
];

const options = [
  { id: 'shot', name: '샷 추가', price: 500 },
  { id: 'syrup', name: '시럽 추가', price: 0 },
];

async function run() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS menus (
      id SERIAL PRIMARY KEY,
      code VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      image VARCHAR(255),
      stock INTEGER DEFAULT 10
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS options (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price INTEGER NOT NULL DEFAULT 0
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu_options (
      menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
      option_id VARCHAR(50) REFERENCES options(id) ON DELETE CASCADE,
      PRIMARY KEY (menu_id, option_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      status VARCHAR(20) DEFAULT 'pending',
      total_amount INTEGER NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      menu_id INTEGER NOT NULL REFERENCES menus(id),
      menu_name VARCHAR(100) NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price INTEGER NOT NULL,
      total_price INTEGER NOT NULL,
      option_labels JSONB DEFAULT '[]'
    )
  `);

  await pool.query('DELETE FROM order_items');
  await pool.query('DELETE FROM orders');
  await pool.query('DELETE FROM menu_options');
  await pool.query('DELETE FROM options');
  await pool.query('DELETE FROM menus');

  for (const o of options) {
    await pool.query('INSERT INTO options (id, name, price) VALUES ($1, $2, $3)', [o.id, o.name, o.price]);
  }
  for (const m of menus) {
    const r = await pool.query(
      'INSERT INTO menus (code, name, description, price, image, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [m.code, m.name, m.description, m.price, m.image, m.stock]
    );
    const menuId = r.rows[0].id;
    for (const o of options) {
      await pool.query('INSERT INTO menu_options (menu_id, option_id) VALUES ($1, $2)', [menuId, o.id]);
    }
  }

  console.log('스키마 생성 및 시드 완료');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
