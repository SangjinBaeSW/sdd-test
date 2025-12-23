---
id: SPEC-003
title: 사용자 인증 기능
version: 1.0.0
status: draft
created: 2025-12-23
updated: 2025-12-23
author:
constitution: 1.1.0
research: auth-system.md
---

# SPEC-003: 사용자 인증 기능

## 개요

프로젝트 보드에 사용자 인증 기능을 추가하여, 사용자별 Task 관리 및 접근 제어를 가능하게 한다.

## 용어 정의

| 용어 | 정의 |
|------|------|
| User | 시스템에 등록된 사용자 |
| Access Token | 인증된 사용자임을 증명하는 JWT 토큰 |
| Refresh Token | Access Token 갱신을 위한 장기 토큰 |
| 인증 (Authentication) | 사용자가 누구인지 확인하는 과정 |
| 인가 (Authorization) | 사용자가 특정 리소스에 접근할 권한이 있는지 확인 |

## 범위

### 포함
- 회원가입 (이메일/비밀번호)
- 로그인/로그아웃
- 현재 사용자 정보 조회
- Task 생성자/담당자 연결

### 제외 (향후 고려)
- 소셜 로그인 (OAuth)
- 비밀번호 재설정
- 이메일 인증
- 2단계 인증 (2FA)

---

## 요구사항

### REQ-001: 회원가입

시스템은 이메일과 비밀번호로 새 사용자를 등록할 수 있어야 한다(SHALL).

#### 필수 입력
- `email`: 유효한 이메일 형식 (필수, 고유)
- `password`: 최소 8자 이상 (필수)
- `name`: 사용자 이름 (선택)

#### 처리 규칙
- 비밀번호는 bcrypt로 해싱하여 저장해야 한다(SHALL)
- 이미 등록된 이메일은 거부해야 한다(SHALL)
- 회원가입 성공 시 자동 로그인 처리해야 한다(SHOULD)

### Scenario: 정상 회원가입

- **GIVEN** 미등록 이메일 "user@example.com"이 있을 때
- **WHEN** 비밀번호 "securePass123"으로 회원가입을 요청하면
- **THEN** 사용자가 생성되어야 한다
- **AND** Access Token이 발급되어야 한다

### Scenario: 중복 이메일 회원가입

- **GIVEN** "user@example.com"으로 이미 등록된 사용자가 있을 때
- **WHEN** 동일 이메일로 회원가입을 시도하면
- **THEN** "이미 등록된 이메일입니다" 에러가 반환되어야 한다
- **AND** 사용자가 생성되지 않아야 한다

### Scenario: 짧은 비밀번호 회원가입

- **GIVEN** 미등록 이메일이 있을 때
- **WHEN** 7자 이하의 비밀번호로 회원가입을 시도하면
- **THEN** "비밀번호는 8자 이상이어야 합니다" 에러가 반환되어야 한다

---

### REQ-002: 로그인

시스템은 이메일과 비밀번호로 사용자를 인증할 수 있어야 한다(SHALL).

#### 처리 규칙
- 올바른 자격 증명 시 Access Token을 발급해야 한다(SHALL)
- Access Token은 httpOnly 쿠키로 설정해야 한다(SHALL)
- 토큰 만료 시간은 15분으로 설정해야 한다(SHOULD)
- 잘못된 자격 증명 시 구체적인 실패 이유를 노출하지 않아야 한다(SHALL NOT)

### Scenario: 정상 로그인

- **GIVEN** "user@example.com" 사용자가 등록되어 있고
- **AND** 비밀번호가 "securePass123"일 때
- **WHEN** 올바른 이메일과 비밀번호로 로그인하면
- **THEN** Access Token이 발급되어야 한다
- **AND** httpOnly 쿠키가 설정되어야 한다

### Scenario: 잘못된 비밀번호 로그인

- **GIVEN** "user@example.com" 사용자가 등록되어 있을 때
- **WHEN** 잘못된 비밀번호로 로그인을 시도하면
- **THEN** "이메일 또는 비밀번호가 올바르지 않습니다" 에러가 반환되어야 한다
- **AND** 토큰이 발급되지 않아야 한다

### Scenario: 미등록 이메일 로그인

- **GIVEN** "unknown@example.com"이 등록되지 않았을 때
- **WHEN** 해당 이메일로 로그인을 시도하면
- **THEN** "이메일 또는 비밀번호가 올바르지 않습니다" 에러가 반환되어야 한다

---

### REQ-003: 로그아웃

시스템은 인증된 사용자를 로그아웃시킬 수 있어야 한다(SHALL).

#### 처리 규칙
- 로그아웃 시 쿠키를 삭제해야 한다(SHALL)
- 로그아웃 후 보호된 리소스에 접근할 수 없어야 한다(SHALL)

### Scenario: 정상 로그아웃

- **GIVEN** 로그인된 사용자가 있을 때
- **WHEN** 로그아웃을 요청하면
- **THEN** 쿠키가 삭제되어야 한다
- **AND** 이후 인증이 필요한 API 호출이 거부되어야 한다

---

### REQ-004: 현재 사용자 조회

시스템은 인증된 사용자의 정보를 조회할 수 있어야 한다(SHALL).

#### 응답 정보
- `id`: 사용자 ID
- `email`: 이메일
- `name`: 이름 (있는 경우)
- `createdAt`: 가입일

#### 처리 규칙
- 비밀번호는 응답에 포함하지 않아야 한다(SHALL NOT)
- 인증되지 않은 요청은 401 에러를 반환해야 한다(SHALL)

### Scenario: 현재 사용자 조회

- **GIVEN** 로그인된 사용자가 있을 때
- **WHEN** 현재 사용자 정보를 요청하면
- **THEN** 사용자의 id, email, name이 반환되어야 한다
- **AND** 비밀번호는 포함되지 않아야 한다

### Scenario: 미인증 상태에서 사용자 조회

- **GIVEN** 로그인하지 않은 상태일 때
- **WHEN** 현재 사용자 정보를 요청하면
- **THEN** 401 Unauthorized 에러가 반환되어야 한다

---

### REQ-005: 인증 미들웨어

보호된 API는 인증 미들웨어를 통해 접근을 제어해야 한다(SHALL).

#### 처리 규칙
- 유효한 토큰이 있는 요청만 허용해야 한다(SHALL)
- 만료된 토큰은 401 에러를 반환해야 한다(SHALL)
- 변조된 토큰은 401 에러를 반환해야 한다(SHALL)

### Scenario: 유효한 토큰 요청

- **GIVEN** 유효한 Access Token이 있을 때
- **WHEN** 보호된 API를 호출하면
- **THEN** 요청이 정상 처리되어야 한다

### Scenario: 만료된 토큰 요청

- **GIVEN** 만료된 Access Token이 있을 때
- **WHEN** 보호된 API를 호출하면
- **THEN** 401 에러와 "토큰이 만료되었습니다" 메시지가 반환되어야 한다

---

### REQ-006: Task 생성자 연결

Task 생성 시 생성자 정보를 기록해야 한다(SHOULD).

#### 처리 규칙
- 로그인한 사용자가 Task 생성 시 createdBy 필드에 사용자 ID 저장(SHOULD)
- 비로그인 사용자도 Task 생성 가능 (createdBy는 null)(MAY)
- Task 조회 시 생성자 정보 포함(SHOULD)

### Scenario: 로그인 사용자 Task 생성

- **GIVEN** "user@example.com" 사용자가 로그인되어 있을 때
- **WHEN** 새 Task를 생성하면
- **THEN** Task의 createdBy에 사용자 ID가 저장되어야 한다

### Scenario: 비로그인 Task 생성

- **GIVEN** 로그인하지 않은 상태일 때
- **WHEN** 새 Task를 생성하면
- **THEN** Task가 생성되어야 한다
- **AND** createdBy는 null이어야 한다

---

### REQ-007: Task 담당자 연결

Task의 담당자를 등록된 사용자와 연결할 수 있어야 한다(SHOULD).

#### 처리 규칙
- assignee 필드에 사용자 ID 또는 이름 저장 가능(SHALL)
- 등록된 사용자 ID인 경우 User와 연결(SHOULD)
- 담당자별 Task 필터링 지원(SHALL)

### Scenario: 등록된 사용자를 담당자로 지정

- **GIVEN** "user@example.com" 사용자가 등록되어 있을 때
- **WHEN** Task의 담당자로 해당 사용자를 지정하면
- **THEN** Task가 해당 사용자와 연결되어야 한다

---

## 비기능 요구사항

### NFR-001: 보안

- 비밀번호는 평문으로 저장하거나 전송해서는 안 된다(SHALL NOT)
- Access Token은 httpOnly, secure 쿠키로 설정해야 한다(SHALL)
- HTTPS 환경에서만 운영해야 한다(SHALL) - 프로덕션 환경

### NFR-002: 성능

- 로그인 응답은 500ms 이내여야 한다(SHOULD)
- 토큰 검증은 50ms 이내여야 한다(SHOULD)

### NFR-003: 에러 메시지

- 모든 인증 관련 에러 메시지는 한글로 제공해야 한다(SHALL)

---

## API 설계

### 인증 API

```
POST   /api/auth/register    # 회원가입
POST   /api/auth/login       # 로그인
POST   /api/auth/logout      # 로그아웃
GET    /api/auth/me          # 현재 사용자 조회
```

### 요청/응답 예시

#### 회원가입

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePass123",
  "name": "홍길동"
}
```

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "홍길동"
    }
  }
}
```

#### 로그인

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePass123"
}
```

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "홍길동"
    }
  }
}
// Set-Cookie: token=<jwt>; HttpOnly; Path=/
```

#### 로그아웃

```http
POST /api/auth/logout
Cookie: token=<jwt>
```

```json
{
  "success": true,
  "message": "로그아웃되었습니다"
}
// Set-Cookie: token=; HttpOnly; Path=/; Max-Age=0
```

---

## 데이터 모델

### User

```typescript
interface User {
  id: string;           // cuid
  email: string;        // unique
  password: string;     // bcrypt hashed (응답에서 제외)
  name?: string;
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
```

### Prisma Schema 변경

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

## 프론트엔드 변경

### 새 컴포넌트
- `LoginPage.vue`: 로그인 페이지
- `RegisterPage.vue`: 회원가입 페이지
- `UserMenu.vue`: 사용자 메뉴 (로그인/로그아웃)

### 라우트 가드
- 보호된 라우트는 인증 확인 후 접근 허용
- 미인증 시 로그인 페이지로 리다이렉트

### 상태 관리
- `useAuth` composable: 인증 상태 및 사용자 정보 관리

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2025-12-23 | 최초 작성 |
