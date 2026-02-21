# 커피 주문 앱 - 백엔드 (Server)

Node.js + Express.js 기반 API 서버입니다.

## 요구 사항

- Node.js 18+
- PostgreSQL (설치 후 `.env`에 연결 정보 설정)

### 데이터베이스 생성

PostgreSQL에 앱용 DB를 만든 뒤 `.env`의 `DB_NAME`(또는 `DATABASE_URL`)에 지정합니다.

```bash
# psql로 접속 후
CREATE DATABASE order_app;
```

## 설치 및 실행

```bash
# 의존성 설치 (최초 1회)
npm install

# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev

# 프로덕션 실행
npm start
```

기본 포트: **3000** (`http://localhost:3000`)

## 환경 변수

`.env` 파일을 프로젝트 루트(server 폴더)에 두고 아래 값을 넣으면 됩니다.  
예시는 `.env.example`을 참고하세요.

| 변수 | 설명 | 예시 |
|------|------|------|
| `PORT` | 서버 포트 (선택) | `3000` |
| **PostgreSQL 연결 (둘 중 하나 사용)** | | |
| `DATABASE_URL` | 연결 문자열 한 줄 | `postgresql://user:password@localhost:5432/order_app` |
| 또는 항목별 | | |
| `DB_HOST` | DB 호스트 | `localhost` |
| `DB_PORT` | DB 포트 | `5432` |
| `DB_NAME` | DB 이름 | `order_app` |
| `DB_USER` | DB 사용자 | `postgres` |
| `DB_PASSWORD` | DB 비밀번호 | (본인 비밀번호) |

## API

- `GET /health` — 서버 상태 확인
- `GET /health/db` — PostgreSQL 연결 여부 확인
- 메뉴 목록, 주문 생성/조회 등은 PRD 기준으로 추가 예정
