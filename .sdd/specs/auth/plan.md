---
spec: SPEC-003
title: 사용자 인증 구현 계획
version: 1.0.0
status: draft
created: 2025-12-23
updated: 2025-12-23
---

# 구현 계획: 사용자 인증 기능

## 요약

프로젝트 보드에 JWT 기반 사용자 인증을 추가한다.
회원가입, 로그인, 로그아웃 기능과 Task 연동을 구현한다.

---

## 기술 결정

### TD-001: 인증 방식

**선택:** JWT + httpOnly 쿠키

**근거:**
- 리서치 결과(auth-system.md) 기반 선택
- Stateless로 서버 확장 용이
- Express + Vue SPA 구조에 최적
- httpOnly 쿠키로 XSS 공격 방지

**대안 검토:**
- 세션 기반: Redis 등 추가 인프라 필요
- OAuth: 프로젝트 규모에 과한 구현

---

### TD-002: 비밀번호 해싱

**선택:** bcrypt (cost factor: 10)

**근거:**
- 업계 표준 알고리즘
- 솔트 자동 생성
- 적응형 해싱 (보안 강화 시 cost 조정 가능)

**의존성:**
```json
{
  "bcrypt": "^5.1.x",
  "@types/bcrypt": "^5.x"
}
```

---

### TD-003: JWT 라이브러리

**선택:** jsonwebtoken

**근거:**
- Node.js에서 가장 널리 사용
- 안정적인 API
- TypeScript 타입 지원

**토큰 설정:**
```typescript
{
  expiresIn: '15m',        // Access Token: 15분
  algorithm: 'HS256'
}
```

**의존성:**
```json
{
  "jsonwebtoken": "^9.x",
  "@types/jsonwebtoken": "^9.x",
  "cookie-parser": "^1.4.x",
  "@types/cookie-parser": "^1.4.x"
}
```

---

### TD-004: 쿠키 설정

**선택:** httpOnly + secure + sameSite

**설정:**
```typescript
{
  httpOnly: true,          // JavaScript 접근 차단
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',         // CSRF 기본 방어
  maxAge: 15 * 60 * 1000,  // 15분
  path: '/'
}
```

---

### TD-005: 프론트엔드 라우팅

**선택:** Vue Router + 네비게이션 가드

**근거:**
- 이미 프로젝트에서 Vue 사용 중
- 선언적 라우트 가드 지원

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Vue 3)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  LoginPage   │  │ RegisterPage │  │   UserMenu   │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         └──────────────────┼─────────────────┘              │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │                   useAuth Composable                   │  │
│  │     - login() / logout() / register()                 │  │
│  │     - user / isAuthenticated                          │  │
│  └─────────────────────────┬─────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────┘
                              │ HTTP (Cookie)
┌─────────────────────────────┼───────────────────────────────┐
│                     Backend (Express)                        │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │                   Auth Router                          │  │
│  │   /register  /login  /logout  /me                     │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │              Auth Middleware                           │  │
│  │   - JWT 검증                                          │  │
│  │   - req.user 설정                                     │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │              Auth Service                              │  │
│  │   - register() / login() / verifyToken()              │  │
│  │   - bcrypt 해싱 / JWT 발급                            │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │              Prisma ORM                                │  │
│  └─────────────────────────┬─────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │      SQLite       │
                    │  ┌─────────────┐  │
                    │  │    User     │  │
                    │  │    Task     │  │
                    │  └─────────────┘  │
                    └───────────────────┘
```

---

## 구현 단계

### Phase 1: 데이터베이스 스키마 변경

User 모델 추가 및 Task 모델 수정

**산출물:**
- [ ] `prisma/schema.prisma`에 User 모델 추가
- [ ] Task 모델에 createdById, assigneeId 필드 추가
- [ ] 마이그레이션 생성 및 적용
- [ ] shared 패키지에 User 타입 추가

**Prisma Schema:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  createdTasks  Task[] @relation("CreatedTasks")
  assignedTasks Task[] @relation("AssignedTasks")
}

model Task {
  // 기존 필드...
  createdById  String?
  createdBy    User?   @relation("CreatedTasks", fields: [createdById], references: [id])
  assigneeId   String?
  assigneeUser User?   @relation("AssignedTasks", fields: [assigneeId], references: [id])
}
```

---

### Phase 2: 백엔드 의존성 설치

인증 관련 패키지 설치

**산출물:**
- [ ] bcrypt, jsonwebtoken, cookie-parser 설치
- [ ] TypeScript 타입 패키지 설치
- [ ] Express에 cookie-parser 미들웨어 추가

**명령어:**
```bash
npm install bcrypt jsonwebtoken cookie-parser -w @project-board/backend
npm install -D @types/bcrypt @types/jsonwebtoken @types/cookie-parser -w @project-board/backend
```

---

### Phase 3: 인증 서비스 구현

비즈니스 로직 및 유틸리티 함수

**산출물:**
- [ ] `services/authService.ts`: 회원가입, 로그인 로직
- [ ] `utils/jwt.ts`: JWT 생성/검증 함수
- [ ] `utils/password.ts`: bcrypt 해싱/검증 함수
- [ ] 환경변수 설정 (JWT_SECRET)

**구조:**
```
packages/backend/src/
├── services/
│   └── authService.ts
├── utils/
│   ├── jwt.ts
│   └── password.ts
└── config/
    └── env.ts
```

---

### Phase 4: 인증 미들웨어 구현

JWT 검증 및 사용자 정보 주입

**산출물:**
- [ ] `middleware/auth.ts`: JWT 검증 미들웨어
- [ ] `middleware/optionalAuth.ts`: 선택적 인증 미들웨어
- [ ] Express Request 타입 확장 (req.user)

**미들웨어 종류:**
- `requireAuth`: 인증 필수 (401 반환)
- `optionalAuth`: 인증 선택 (req.user 있으면 설정)

---

### Phase 5: 인증 API 라우트 구현

REST API 엔드포인트

**산출물:**
- [ ] `routes/auth.ts`: 인증 라우터
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/me
- [ ] 에러 메시지 한글화

**라우터 등록:**
```typescript
app.use('/api/auth', authRouter);
```

---

### Phase 6: Task API 수정

생성자 연결 및 선택적 인증

**산출물:**
- [ ] Task 생성 시 createdById 자동 설정
- [ ] Task 조회 시 생성자 정보 포함
- [ ] optionalAuth 미들웨어 적용

---

### Phase 7: 공유 타입 및 메시지 추가

shared 패키지 업데이트

**산출물:**
- [ ] `types.ts`에 User, AuthResponse 타입 추가
- [ ] `messages.ts`에 AUTH_ERRORS 메시지 추가

**메시지 예시:**
```typescript
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
  EMAIL_EXISTS: '이미 등록된 이메일입니다',
  PASSWORD_TOO_SHORT: '비밀번호는 8자 이상이어야 합니다',
  UNAUTHORIZED: '로그인이 필요합니다',
  TOKEN_EXPIRED: '토큰이 만료되었습니다',
  TOKEN_INVALID: '유효하지 않은 토큰입니다',
} as const;
```

---

### Phase 8: 프론트엔드 인증 상태 관리

useAuth Composable 구현

**산출물:**
- [ ] `composables/useAuth.ts`: 인증 상태 관리
- [ ] 로그인/로그아웃/회원가입 함수
- [ ] 사용자 정보 반응형 상태
- [ ] 앱 시작 시 인증 상태 확인

**API:**
```typescript
const { user, isAuthenticated, login, logout, register, checkAuth } = useAuth();
```

---

### Phase 9: 프론트엔드 인증 페이지

로그인/회원가입 UI

**산출물:**
- [ ] `views/LoginPage.vue`: 로그인 페이지
- [ ] `views/RegisterPage.vue`: 회원가입 페이지
- [ ] Vue Router 라우트 추가
- [ ] 폼 유효성 검사

---

### Phase 10: 프론트엔드 UI 통합

헤더 및 네비게이션 수정

**산출물:**
- [ ] `components/UserMenu.vue`: 사용자 메뉴 드롭다운
- [ ] App.vue 헤더에 UserMenu 추가
- [ ] 로그인/로그아웃 상태별 UI 분기
- [ ] 라우트 가드 (선택적)

---

### Phase 11: 테스트 및 검증

기능 테스트 및 시나리오 검증

**산출물:**
- [ ] API 테스트 (회원가입, 로그인, 로그아웃)
- [ ] 에러 케이스 테스트
- [ ] 프론트엔드 통합 테스트
- [ ] 스펙 시나리오 검증

---

## 리스크 분석

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|-------------|-----------|
| JWT Secret 노출 | 높 | 낮 | .env 파일 gitignore, 환경변수 관리 |
| 비밀번호 정책 우회 | 중 | 중 | 서버/클라이언트 양측 검증 |
| 토큰 탈취 | 중 | 중 | 짧은 만료 시간, httpOnly 쿠키 |
| 기존 Task 호환성 | 중 | 낮 | 선택적 인증으로 기존 기능 유지 |
| CORS 쿠키 문제 | 중 | 중 | credentials: 'include' 설정 |

---

## 테스트 전략

### 단위 테스트
- 비밀번호 해싱/검증
- JWT 생성/검증
- 입력값 검증 (이메일, 비밀번호)

### 통합 테스트
- 회원가입 API 플로우
- 로그인/로그아웃 API 플로우
- 인증 미들웨어 동작

### E2E 테스트
- 회원가입 → 로그인 → Task 생성 → 로그아웃 시나리오
- 에러 케이스 (중복 이메일, 잘못된 비밀번호)

### 테스트 커버리지 목표
- 인증 서비스: 90%+
- API 라우트: 80%+

---

## 환경변수 추가

```env
# .env
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m
```

---

## 디렉토리 구조 변경

```
packages/backend/src/
├── config/
│   └── env.ts              # 환경변수 로드
├── middleware/
│   ├── errorHandler.ts
│   ├── auth.ts             # 필수 인증
│   └── optionalAuth.ts     # 선택 인증
├── routes/
│   ├── tasks.ts
│   └── auth.ts             # 신규
├── services/
│   ├── taskService.ts
│   ├── statusTransition.ts
│   └── authService.ts      # 신규
└── utils/
    ├── jwt.ts              # 신규
    └── password.ts         # 신규

packages/frontend/src/
├── composables/
│   └── useAuth.ts          # 신규
├── views/
│   ├── BoardView.vue
│   ├── LoginPage.vue       # 신규
│   └── RegisterPage.vue    # 신규
└── components/
    ├── ...
    └── UserMenu.vue        # 신규
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2025-12-23 | 최초 작성 |
