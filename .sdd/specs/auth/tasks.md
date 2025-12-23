---
spec: SPEC-003
plan: plan.md
title: 사용자 인증 작업 목록
version: 1.0.0
created: 2025-12-23
updated: 2025-12-23
---

# 작업 목록: 사용자 인증 기능

## 요약

| 구분 | 개수 |
|------|------|
| 전체 작업 | 18 |
| 완료 | 18 |
| 진행 중 | 0 |
| 대기 | 0 |

---

## Phase 1: 데이터베이스 스키마

### AUTH-001: Prisma User 모델 추가

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** 없음

#### 설명
User 모델을 Prisma 스키마에 추가하고 마이그레이션 실행

#### 완료 조건
- [x] `prisma/schema.prisma`에 User 모델 추가
- [x] Task 모델에 createdById, assigneeId 관계 추가
- [x] `npx prisma migrate dev` 실행
- [x] `npx prisma generate` 실행

---

### AUTH-002: Shared 패키지 User 타입 추가

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-001

#### 설명
공유 타입에 User 관련 인터페이스 추가

#### 완료 조건
- [x] `packages/shared/src/types.ts`에 User 인터페이스 추가
- [x] AuthRequest, AuthResponse 타입 추가
- [x] shared 패키지 빌드

---

## Phase 2: 백엔드 의존성

### AUTH-003: 인증 패키지 설치

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** 없음

#### 설명
bcrypt, jsonwebtoken, cookie-parser 및 타입 패키지 설치

#### 완료 조건
- [x] `npm install bcrypt jsonwebtoken cookie-parser -w @project-board/backend`
- [x] `npm install -D @types/bcrypt @types/jsonwebtoken @types/cookie-parser -w @project-board/backend`
- [x] 설치 확인

---

### AUTH-004: Express 미들웨어 등록

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-003

#### 설명
cookie-parser 미들웨어를 Express에 등록

#### 완료 조건
- [x] `src/index.ts`에 `cookieParser()` 미들웨어 추가
- [x] 서버 재시작 후 쿠키 파싱 확인

---

## Phase 3: 인증 서비스

### AUTH-005: 환경변수 설정

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** 없음

#### 설명
JWT_SECRET 등 인증 관련 환경변수 설정

#### 완료 조건
- [x] `.env` 파일에 JWT_SECRET 추가
- [x] `.env.example` 업데이트
- [x] `src/config/env.ts` 생성 (환경변수 로드)

---

### AUTH-006: 비밀번호 유틸리티 구현

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-003

#### 설명
bcrypt를 사용한 비밀번호 해싱/검증 유틸리티

#### 완료 조건
- [x] `src/utils/password.ts` 생성
- [x] `hashPassword(plain)` 함수 구현
- [x] `comparePassword(plain, hash)` 함수 구현

---

### AUTH-007: JWT 유틸리티 구현

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-003, AUTH-005

#### 설명
JWT 토큰 생성 및 검증 유틸리티

#### 완료 조건
- [x] `src/utils/jwt.ts` 생성
- [x] `generateToken(payload)` 함수 구현
- [x] `verifyToken(token)` 함수 구현
- [x] 토큰 만료 시간 15분 설정

---

### AUTH-008: 인증 서비스 구현

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-001, AUTH-006, AUTH-007

#### 설명
회원가입, 로그인 비즈니스 로직 구현

#### 완료 조건
- [x] `src/services/authService.ts` 생성
- [x] `register(email, password, name?)` 함수 구현
- [x] `login(email, password)` 함수 구현
- [x] `getUserById(id)` 함수 구현
- [x] 중복 이메일 체크
- [x] 비밀번호 최소 길이 검증

---

## Phase 4: 인증 미들웨어

### AUTH-009: 인증 미들웨어 구현

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-007

#### 설명
JWT 검증 및 req.user 설정 미들웨어

#### 완료 조건
- [x] `src/middleware/auth.ts` 생성
- [x] `requireAuth` 미들웨어 구현 (인증 필수)
- [x] `optionalAuth` 미들웨어 구현 (인증 선택)
- [x] Express Request 타입 확장 (req.user)
- [x] 토큰 만료/변조 에러 처리

---

## Phase 5: 인증 API

### AUTH-010: 인증 라우터 구현

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-008, AUTH-009

#### 설명
인증 관련 API 엔드포인트 구현

#### 완료 조건
- [x] `src/routes/auth.ts` 생성
- [x] POST /api/auth/register 구현
- [x] POST /api/auth/login 구현
- [x] POST /api/auth/logout 구현
- [x] GET /api/auth/me 구현
- [x] 입력값 검증 (zod)
- [x] httpOnly 쿠키 설정

---

### AUTH-011: 인증 에러 메시지 한글화

- **상태:** ✅ 완료
- **우선순위:** 🟡 MEDIUM
- **의존성:** AUTH-010

#### 설명
인증 관련 에러 메시지 한글화

#### 완료 조건
- [x] `packages/shared/src/messages.ts`에 AUTH_ERRORS 추가
- [x] 라우터에서 AUTH_ERRORS 사용
- [x] shared 패키지 재빌드

---

## Phase 6: Task API 수정

### AUTH-012: Task 생성자 연결

- **상태:** ✅ 완료
- **우선순위:** 🟡 MEDIUM
- **의존성:** AUTH-009

#### 설명
Task 생성 시 로그인 사용자를 생성자로 기록

#### 완료 조건
- [x] `routes/tasks.ts`에 optionalAuth 적용
- [x] Task 생성 시 createdById 설정
- [x] Task 조회 시 createdBy 정보 포함

---

## Phase 7: 프론트엔드 인증

### AUTH-013: useAuth Composable 구현

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-010

#### 설명
인증 상태 관리 Composable 구현

#### 완료 조건
- [x] `src/composables/useAuth.ts` 생성
- [x] `user`, `isAuthenticated` 반응형 상태
- [x] `login()`, `logout()`, `register()` 함수
- [x] `checkAuth()` 앱 시작 시 호출
- [x] 인증 API 호출 (credentials: 'include')

---

### AUTH-014: 로그인 페이지 구현

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-013

#### 설명
로그인 페이지 UI 구현

#### 완료 조건
- [x] `src/views/LoginPage.vue` 생성
- [x] 이메일/비밀번호 입력 폼
- [x] 로그인 버튼 및 처리
- [x] 에러 메시지 표시
- [x] 회원가입 페이지 링크
- [x] 모든 텍스트 한글화

---

### AUTH-015: 회원가입 페이지 구현

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-013

#### 설명
회원가입 페이지 UI 구현

#### 완료 조건
- [x] `src/views/RegisterPage.vue` 생성
- [x] 이메일/비밀번호/이름 입력 폼
- [x] 비밀번호 확인 필드
- [x] 회원가입 버튼 및 처리
- [x] 에러 메시지 표시
- [x] 로그인 페이지 링크
- [x] 모든 텍스트 한글화

---

### AUTH-016: Vue Router 설정

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** AUTH-014, AUTH-015

#### 설명
인증 페이지 라우트 추가

#### 완료 조건
- [x] Vue Router 설치 (미설치 시)
- [x] `/login` 라우트 추가
- [x] `/register` 라우트 추가
- [x] 라우터 설정 파일 생성/수정

---

### AUTH-017: 사용자 메뉴 구현

- **상태:** ✅ 완료
- **우선순위:** 🟡 MEDIUM
- **의존성:** AUTH-013

#### 설명
헤더에 사용자 메뉴 추가

#### 완료 조건
- [x] `src/components/UserMenu.vue` 생성
- [x] 로그인 상태: 사용자 이름 + 로그아웃 버튼
- [x] 비로그인 상태: 로그인/회원가입 버튼
- [x] App.vue 헤더에 UserMenu 추가
- [x] 모든 텍스트 한글화

---

## Phase 8: 테스트

### AUTH-018: 인증 기능 테스트

- **상태:** ✅ 완료
- **우선순위:** 🟡 MEDIUM
- **의존성:** AUTH-017

#### 설명
인증 기능 통합 테스트

#### 완료 조건
- [x] 회원가입 API 테스트
- [x] 로그인 API 테스트
- [x] 로그아웃 API 테스트
- [x] 중복 이메일 에러 테스트
- [x] 잘못된 비밀번호 에러 테스트
- [x] 프론트엔드 로그인 플로우 테스트
- [x] 스펙 시나리오 검증

---

## 의존성 그래프

```
AUTH-001 (User 모델)
    │
    ├──▶ AUTH-002 (타입 추가)
    │
    └──▶ AUTH-008 (인증 서비스)
              │
              └──▶ AUTH-010 (인증 API)
                        │
                        └──▶ AUTH-013 (useAuth)
                                  │
                                  ├──▶ AUTH-014 (로그인)
                                  │
                                  ├──▶ AUTH-015 (회원가입)
                                  │
                                  └──▶ AUTH-017 (사용자 메뉴)

AUTH-003 (패키지 설치)
    │
    ├──▶ AUTH-004 (미들웨어 등록)
    │
    ├──▶ AUTH-006 (비밀번호 유틸)
    │
    └──▶ AUTH-007 (JWT 유틸)
              │
              └──▶ AUTH-009 (인증 미들웨어)
                        │
                        └──▶ AUTH-012 (Task 연결)

AUTH-005 (환경변수) ─▶ AUTH-007 (JWT 유틸)

AUTH-016 (라우터) ◀── AUTH-014, AUTH-015

AUTH-018 (테스트) ◀── 전체 완료 후
```

---

## 작업 순서 (권장)

```
1. AUTH-001: User 모델
2. AUTH-003: 패키지 설치
3. AUTH-002: 타입 추가
4. AUTH-005: 환경변수
5. AUTH-004: 미들웨어 등록
6. AUTH-006: 비밀번호 유틸
7. AUTH-007: JWT 유틸
8. AUTH-008: 인증 서비스
9. AUTH-009: 인증 미들웨어
10. AUTH-010: 인증 API
11. AUTH-011: 에러 한글화
12. AUTH-012: Task 연결
13. AUTH-013: useAuth
14. AUTH-014: 로그인 페이지
15. AUTH-015: 회원가입 페이지
16. AUTH-016: 라우터 설정
17. AUTH-017: 사용자 메뉴
18. AUTH-018: 테스트
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2025-12-23 | 최초 작성 |
