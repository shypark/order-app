-- Render PostgreSQL 스키마 + 시드 (대시보드 Shell 또는 psql에서 실행)
-- 실행: Render 대시보드 > Database > Connect > PSQL 또는 Web Shell에서 이 파일 내용 붙여넣기

-- 테이블 생성
CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image VARCHAR(255),
  stock INTEGER DEFAULT 10
);

CREATE TABLE IF NOT EXISTS options (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS menu_options (
  menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
  option_id VARCHAR(50) REFERENCES options(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_id, option_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending',
  total_amount INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_id INTEGER NOT NULL REFERENCES menus(id),
  menu_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  option_labels JSONB DEFAULT '[]'
);

-- 기존 시드 정리 (이미 있으면)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM menu_options;
DELETE FROM options;
DELETE FROM menus;

-- 옵션 시드
INSERT INTO options (id, name, price) VALUES
  ('shot', '샷 추가', 500),
  ('syrup', '시럽 추가', 0);

-- 메뉴 시드 (id는 SERIAL이므로 지정하지 않음)
INSERT INTO menus (code, name, description, price, image, stock) VALUES
  ('americano-ice', '아메리카노(ICE)', '에스프레소에 찬물과 얼음을 더한 시원한 아메리카노입니다.', 4500, '/images/americano-ice.png', 10),
  ('americano-hot', '아메리카노(HOT)', '에스프레소에 뜨거운 물을 더한 클래식 아메리카노입니다.', 4000, '/images/americano-hot.png', 10),
  ('cafe-latte-hot', '카페라떼(HOT)', '풍부한 에스프레소와 스팀 밀크의 조화입니다.', 4500, '/images/cafe-latte-hot.png', 10),
  ('cafe-latte-ice', '카페라떼(ICE)', '에스프레소와 차가운 우유, 얼음으로 완성한 라떼입니다.', 5000, '/images/cafe-latte-ice.png', 10),
  ('vanilla-latte', '바닐라 라떼(HOT)', '바닐라 시럽이 더해진 달콤한 라떼입니다.', 5500, '/images/vanilla-latte.png', 10),
  ('cold-brew', '콜드브루', '차가운 물로 긴 시간 추출한 깔끔한 커피입니다.', 5000, '/images/cold-brew.png', 10);

-- menu_options 시드 (메뉴 id 1~6에 옵션 shot, syrup 연결)
INSERT INTO menu_options (menu_id, option_id)
SELECT m.id, o.id
FROM menus m
CROSS JOIN options o;
