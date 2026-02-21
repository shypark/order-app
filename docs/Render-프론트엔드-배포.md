# Render 프론트엔드(UI) 배포 가이드

## 1. 코드에서 수정할 부분

### 이미 반영된 사항
- **API 주소**: `ui/src/api/client.js`에서 `VITE_API_URL` 환경 변수를 사용합니다.
  - 설정이 없으면 `http://localhost:3001`을 사용합니다.
  - **배포 시**: Render에서 `VITE_API_URL`에 백엔드 URL을 넣으면 됩니다. **추가 코드 수정 불필요.**

### 참고
- `ui/.env.example`에 `VITE_API_URL` 예시가 있습니다. 로컬에서 사용할 때는 `ui/.env`에 복사해 사용하면 됩니다.

---

## 2. Render 배포 과정

### 전제 조건
- 이 저장소가 GitHub(또는 GitLab 등)에 연결되어 있어야 합니다.
- **백엔드**가 이미 Render에 배포되어 있고, 백엔드 URL(예: `https://order-app-api.onrender.com`)을 알고 있어야 합니다.

### Step 1: Static Site 생성
1. [Render](https://render.com) 로그인 후 **Dashboard** → **New +** → **Static Site** 선택.
2. 저장소 연결: **Connect a repository**에서 해당 GitHub 저장소 선택 후 연결.

### Step 2: 설정
| 항목 | 입력값 |
|------|--------|
| **Name** | 원하는 이름 (예: `order-app-ui`) |
| **Branch** | `main` (또는 사용 중인 브랜치) |
| **Root Directory** | `ui` ← **반드시 입력** (프론트 코드가 `ui` 폴더에 있음) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Step 3: 환경 변수 (필수)
Vite는 빌드 시점에 `VITE_` 로 시작하는 변수를 코드에 넣습니다. 반드시 설정해야 합니다.

1. **Environment** 섹션에서 **Add Environment Variable** 클릭.
2. 다음 변수 추가:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | 백엔드 URL (예: `https://order-app-api.onrender.com`) |

- **주의**: URL 끝에 슬래시(`/`) 없이 입력 (예: `https://order-app-api.onrender.com`).

### Step 4: 배포
- **Create Static Site** 클릭.
- 빌드가 끝나면 자동으로 배포되고, **사이트 URL**이 부여됩니다 (예: `https://order-app-ui.onrender.com`).

---

## 3. 배포 후 확인
- 브라우저에서 부여된 URL로 접속.
- 주문하기 / 관리자 화면에서 메뉴·주문이 로드되는지 확인 (백엔드와 DB가 정상이어야 함).

---

## 4. CORS
- 현재 백엔드는 `cors()`로 모든 오리진을 허용하므로, 별도 CORS 설정 없이 배포된 프론트 URL에서 API 호출이 가능합니다.
