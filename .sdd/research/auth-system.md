# 리서치: 인증 시스템

> 작성일: 2025-12-23
> 상태: 완료

## 배경

프로젝트 보드에 사용자 인증 기능을 추가하려 한다.
다음 질문에 대한 기술적 결정이 필요하다:

1. **인증 방식**: JWT vs 세션 vs OAuth
2. **비밀번호 처리**: 해싱 알고리즘 선택
3. **토큰 저장**: 쿠키 vs 로컬스토리지
4. **Task 연동**: 인증과 기존 Task 기능의 관계

---

## 비교 대상

### 옵션 A: JWT (JSON Web Token)

**개요:**
서버가 토큰을 발급하고, 클라이언트가 매 요청에 토큰을 포함하여 인증

**장점:**
- Stateless: 서버에 세션 저장 불필요
- 확장성: 여러 서버/마이크로서비스에서 동일 토큰 검증 가능
- 모바일 앱 등 다양한 클라이언트 지원 용이
- 현재 Express + Vue 스택과 호환 우수

**단점:**
- 토큰 무효화 어려움 (로그아웃 시 블랙리스트 필요)
- 토큰 크기가 세션 ID보다 큼
- 토큰 탈취 시 만료까지 악용 가능

**적용 사례:**
- SPA (Single Page Application)
- RESTful API
- 마이크로서비스 아키텍처

---

### 옵션 B: 세션 기반 인증

**개요:**
서버가 세션을 생성하고, 세션 ID를 쿠키로 클라이언트에 전달

**장점:**
- 즉시 무효화 가능 (서버에서 세션 삭제)
- 쿠키 기반으로 CSRF 보호 내장 가능
- 구현이 비교적 단순

**단점:**
- Stateful: 서버에 세션 저장 필요 (Redis 등)
- 서버 확장 시 세션 공유 문제
- CORS 환경에서 쿠키 설정 복잡

**적용 사례:**
- 전통적인 웹 애플리케이션
- 단일 서버 환경

---

### 옵션 C: OAuth 2.0 (Google, GitHub 등)

**개요:**
외부 인증 제공자를 통한 소셜 로그인

**장점:**
- 사용자가 별도 계정 생성 불필요
- 비밀번호 관리 부담 없음
- 신뢰성 높은 인증

**단점:**
- 외부 서비스 의존성
- 구현 복잡도 증가
- 오프라인 환경 지원 불가
- 프로젝트 보드 특성상 과한 구현

**적용 사례:**
- 소비자 대상 서비스
- 소셜 기능이 있는 앱

---

## 비교표

| 기준 | JWT | 세션 | OAuth |
|------|-----|------|-------|
| **구현 복잡도** | 중 | 낮 | 높 |
| **확장성** | 높 | 중 | 높 |
| **보안** | 중 | 높 | 높 |
| **즉시 로그아웃** | 어려움 | 쉬움 | N/A |
| **서버 부하** | 낮 | 중 | 낮 |
| **현재 스택 호환** | 높 | 중 | 중 |
| **학습 곡선** | 낮 | 낮 | 높 |

---

## 세부 기술 선택

### 비밀번호 해싱

| 알고리즘 | 권장 | 비고 |
|----------|------|------|
| **bcrypt** | ✅ 권장 | 업계 표준, 솔트 내장, 적응형 |
| argon2 | 좋음 | 최신, 메모리 하드, 설정 복잡 |
| scrypt | 좋음 | 메모리 하드 |
| PBKDF2 | 가능 | 레거시, bcrypt보다 약함 |

**선택: bcrypt**
- `bcrypt` npm 패키지 사용
- cost factor: 10~12 권장

### 토큰 저장 (프론트엔드)

| 방식 | 장점 | 단점 |
|------|------|------|
| **httpOnly 쿠키** | XSS 방지 | CSRF 취약, CORS 설정 필요 |
| 로컬스토리지 | 구현 간단 | XSS 취약 |
| 메모리 | 가장 안전 | 새로고침 시 로그아웃 |

**선택: httpOnly 쿠키 + CSRF 토큰**
- 보안과 사용성 균형

### JWT 구성

```
Access Token: 15분 만료 (짧은 수명)
Refresh Token: 7일 만료 (httpOnly 쿠키)
```

---

## 아키텍처 설계

### 인증 플로우

```
1. 회원가입
   Client → POST /api/auth/register → Server
   Server: 비밀번호 bcrypt 해싱 → DB 저장

2. 로그인
   Client → POST /api/auth/login → Server
   Server: 비밀번호 검증 → JWT 발급 → 쿠키 설정

3. 인증된 요청
   Client → GET /api/tasks (Cookie: token) → Server
   Server: JWT 검증 → 요청 처리

4. 로그아웃
   Client → POST /api/auth/logout → Server
   Server: 쿠키 삭제
```

### API 엔드포인트

```
POST   /api/auth/register    # 회원가입
POST   /api/auth/login       # 로그인
POST   /api/auth/logout      # 로그아웃
GET    /api/auth/me          # 현재 사용자 정보
POST   /api/auth/refresh     # 토큰 갱신 (선택)
```

### 데이터 모델

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]   @relation("AssignedTasks")
}

model Task {
  // 기존 필드...
  assigneeId String?
  assignee   User?   @relation("AssignedTasks", fields: [assigneeId], references: [id])
  createdBy  String?
  creator    User?   @relation("CreatedTasks", fields: [createdBy], references: [id])
}
```

---

## Task 연동 방안

### 옵션 1: 선택적 인증 (권장)
- 로그인 없이도 Task 조회 가능
- 생성/수정/삭제는 로그인 필요
- 기존 기능 호환성 유지

### 옵션 2: 필수 인증
- 모든 API에 인증 필요
- 보안 강화, 기존 데이터 마이그레이션 필요

### 옵션 3: 팀/프로젝트 기반
- 프로젝트별 팀원 관리
- 구현 복잡도 높음, 향후 확장으로 고려

**선택: 옵션 1 (선택적 인증)**

---

## 보안 고려사항

### 필수 구현
- [x] 비밀번호 bcrypt 해싱
- [x] httpOnly 쿠키
- [x] HTTPS 필수 (프로덕션)
- [x] 입력값 검증 (zod)

### 권장 구현
- [ ] Rate limiting (로그인 시도 제한)
- [ ] CSRF 토큰
- [ ] 비밀번호 강도 검사

### 향후 고려
- [ ] 2단계 인증 (2FA)
- [ ] 비밀번호 재설정
- [ ] 이메일 인증

---

## 의존성 추가

```json
{
  "dependencies": {
    "bcrypt": "^5.1.x",
    "jsonwebtoken": "^9.x",
    "cookie-parser": "^1.4.x"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.x",
    "@types/jsonwebtoken": "^9.x",
    "@types/cookie-parser": "^1.4.x"
  }
}
```

---

## 결론

### 권장사항: JWT + httpOnly 쿠키

**선택 근거:**

1. **현재 스택 호환성**
   - Express + Vue SPA 구조에 JWT가 가장 적합
   - Stateless로 서버 확장 용이

2. **구현 복잡도**
   - 세션보다 Redis 등 추가 인프라 불필요
   - OAuth보다 구현 단순

3. **보안**
   - httpOnly 쿠키로 XSS 방지
   - 짧은 만료 시간으로 토큰 탈취 위험 완화

4. **확장성**
   - 향후 모바일 앱 등 추가 클라이언트 지원 가능
   - 마이크로서비스 전환 시 유리

### 구현 우선순위

1. **Phase 1**: 기본 인증 (회원가입, 로그인, 로그아웃)
2. **Phase 2**: Task 연동 (생성자/담당자 연결)
3. **Phase 3**: 보안 강화 (Rate limiting, CSRF)

---

## 참고 자료

- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://auth0.com/blog/jwt-handbook/)
- [bcrypt npm](https://www.npmjs.com/package/bcrypt)
- [Express JWT 미들웨어](https://www.npmjs.com/package/express-jwt)
