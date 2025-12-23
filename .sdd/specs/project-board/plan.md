---
spec: SPEC-001
title: 프로젝트 보드 구현 계획
version: 1.0.0
status: draft
created: 2025-12-23
updated: 2025-12-23
---

# 구현 계획: 프로젝트 보드 기본기능

## 요약

프로젝트 보드의 Task CRUD 및 상태 관리 기능을 구현한다.
백엔드 API와 프론트엔드 Board UI를 포함한다.

---

## 기술 결정

### TD-001: 백엔드 프레임워크

**선택:** Node.js + Express.js

**근거:**
- 빠른 프로토타이핑 가능
- TypeScript 지원으로 타입 안정성 확보
- 풍부한 미들웨어 생태계

**대안 검토:**
- NestJS: 구조화된 아키텍처, 하지만 초기 설정 복잡
- Fastify: 성능 우수, 하지만 커뮤니티 규모 작음

---

### TD-002: 데이터베이스

**선택:** SQLite + Prisma ORM

**근거:**
- 별도 DB 서버 설치 불필요 (파일 기반)
- 개발/테스트 환경 간편
- Prisma로 타입 안전한 쿼리 작성
- 추후 PostgreSQL 등으로 마이그레이션 용이

**대안 검토:**
- JSON 파일: 단순하지만 동시성/쿼리 제한
- PostgreSQL: 프로덕션급이나 초기 셋업 부담

---

### TD-003: 프론트엔드 프레임워크

**선택:** Vue 3 + Composition API

**근거:**
- 반응형 상태 관리 용이
- 컴포넌트 기반 UI 구성
- TypeScript 완벽 지원

**대안 검토:**
- React: 생태계 크지만 상태 관리 별도 라이브러리 필요
- Svelte: 번들 크기 작지만 학습 곡선

---

### TD-004: 드래그 앤 드롭

**선택:** Vue Draggable (SortableJS 기반)

**근거:**
- Vue 3 공식 지원
- 터치 디바이스 호환
- 컬럼 간 이동 지원

---

### TD-005: ID 생성 전략

**선택:** 순차 번호 기반 (TASK-XXX)

**근거:**
- 가독성 높음
- 요구사항 명시 형식
- 마지막 ID 추적 필요 (메타데이터 테이블 활용)

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vue 3)                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ Backlog │  │  Ready  │  │In Prog. │  │  Done   │     │
│  │  Column │  │  Column │  │  Column │  │  Column │     │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘     │
│       └────────────┴────────────┴────────────┘          │
│                         │                                │
│                    Drag & Drop                           │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTP/REST
┌─────────────────────────┼───────────────────────────────┐
│                    Backend (Express)                     │
│  ┌──────────────────────┴───────────────────────────┐   │
│  │                   API Router                      │   │
│  │   /api/tasks  /api/tasks/:id  /api/tasks/:id/status│  │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────┴───────────────────────────┐   │
│  │              Task Service Layer                   │   │
│  │   - Validation (상태 전이 규칙)                    │   │
│  │   - Business Logic (WIP 제한)                     │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────┴───────────────────────────┐   │
│  │              Prisma ORM                           │   │
│  └──────────────────────┬───────────────────────────┘   │
└─────────────────────────┼───────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │  SQLite   │
                    │   (DB)    │
                    └───────────┘
```

---

## 구현 단계

### Phase 1: 프로젝트 기반 구조

프로젝트 초기 설정 및 개발 환경 구성

**산출물:**
- [ ] 모노레포 구조 설정 (packages/backend, packages/frontend)
- [ ] TypeScript 설정
- [ ] ESLint/Prettier 설정
- [ ] 공통 타입 정의 (packages/shared)

**예상 작업:**
- 프로젝트 디렉토리 구조 생성
- package.json 설정
- tsconfig.json 설정
- 린터/포맷터 설정

---

### Phase 2: 데이터베이스 및 모델

Prisma ORM 설정 및 Task 모델 정의

**산출물:**
- [ ] Prisma 스키마 정의
- [ ] 마이그레이션 생성
- [ ] Seed 데이터 스크립트

**Prisma Schema:**
```prisma
model Task {
  id          String   @id           // "TASK-001"
  title       String
  description String?
  status      String   @default("backlog")
  priority    String   @default("P2")
  assignee    String?
  spec        String?
  dueDate     DateTime?
  created     DateTime @default(now())
  updated     DateTime @updatedAt
}

model Metadata {
  key   String @id
  value String
}
```

---

### Phase 3: 백엔드 API

Express 서버 및 REST API 구현

**산출물:**
- [ ] Express 서버 설정
- [ ] Task CRUD API 엔드포인트
- [ ] 상태 변경 API (전이 규칙 검증 포함)
- [ ] 필터링/정렬 기능
- [ ] 에러 핸들링 미들웨어
- [ ] API 테스트 (Jest)

**API 엔드포인트:**
| Method | Path | 설명 |
|--------|------|------|
| POST | /api/tasks | Task 생성 |
| GET | /api/tasks | Task 목록 (필터링 지원) |
| GET | /api/tasks/:id | Task 상세 |
| PATCH | /api/tasks/:id | Task 수정 |
| DELETE | /api/tasks/:id | Task 삭제 |
| PATCH | /api/tasks/:id/status | 상태 변경 |

---

### Phase 4: 상태 전이 로직

비즈니스 규칙 구현

**산출물:**
- [ ] 상태 전이 유효성 검사기
- [ ] 스펙 연결 검증 (backlog → ready)
- [ ] WIP 제한 검증 (in-progress 최대 2개)
- [ ] 비즈니스 로직 단위 테스트

**상태 전이 매트릭스:**
```
From \ To    | backlog | ready | in-progress | review | done
-------------|---------|-------|-------------|--------|------
backlog      |    -    |   ✓*  |      ✗      |   ✗    |  ✗
ready        |    ✓    |   -   |      ✓      |   ✗    |  ✗
in-progress  |    ✗    |   ✗   |      -      |   ✓    |  ✗
review       |    ✗    |   ✗   |      ✓      |   -    |  ✓
done         |    ✗    |   ✗   |      ✓      |   ✗    |  -

* 스펙 연결 필수
```

---

### Phase 5: 프론트엔드 기본 UI

Vue 3 프로젝트 및 기본 컴포넌트

**산출물:**
- [ ] Vue 3 프로젝트 설정 (Vite)
- [ ] API 클라이언트 (Axios)
- [ ] TaskCard 컴포넌트
- [ ] TaskForm 컴포넌트 (생성/수정)
- [ ] 기본 스타일링

---

### Phase 6: Board 뷰 구현

칸반 보드 UI 및 드래그 앤 드롭

**산출물:**
- [ ] BoardColumn 컴포넌트
- [ ] BoardView 페이지
- [ ] 드래그 앤 드롭 구현
- [ ] 상태 변경 연동
- [ ] 우선순위별 정렬
- [ ] 필터 UI

---

### Phase 7: 통합 및 테스트

E2E 테스트 및 최종 검증

**산출물:**
- [ ] E2E 테스트 (Playwright)
- [ ] 스펙 시나리오 검증
- [ ] 성능 테스트 (응답 시간 확인)
- [ ] 문서화

---

## 리스크 분석

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|-------------|-----------|
| SQLite 동시성 제한 | 중 | 낮 | WAL 모드 활성화, 추후 PostgreSQL 마이그레이션 고려 |
| 드래그 앤 드롭 버그 | 중 | 중 | SortableJS 안정 버전 사용, 충분한 E2E 테스트 |
| 상태 전이 로직 복잡도 | 중 | 중 | 상태 머신 패턴 적용, 단위 테스트 강화 |
| 타입 불일치 | 낮 | 중 | 공유 타입 패키지로 일관성 유지 |

---

## 테스트 전략

### 단위 테스트
- 상태 전이 검증기
- ID 생성기
- 필터링 로직

### 통합 테스트
- API 엔드포인트
- 데이터베이스 CRUD

### E2E 테스트
- Task 생성 시나리오
- 드래그 앤 드롭으로 상태 변경
- 필터링 동작

### 테스트 커버리지 목표
- 단위 테스트: 90%+
- 통합 테스트: 80%+
- E2E: 핵심 시나리오 100%

---

## 의존성 목록

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.x",
    "@prisma/client": "^5.x",
    "cors": "^2.8.x",
    "zod": "^3.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "typescript": "^5.x",
    "jest": "^29.x",
    "@types/express": "^4.x"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "vue": "^3.4.x",
    "vue-router": "^4.x",
    "axios": "^1.x",
    "vuedraggable": "^4.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "typescript": "^5.x",
    "@vitejs/plugin-vue": "^5.x"
  }
}
```

---

## 디렉토리 구조

```
project-board/
├── packages/
│   ├── shared/                 # 공유 타입
│   │   └── src/
│   │       └── types.ts
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── index.ts        # 엔트리포인트
│   │   │   ├── routes/
│   │   │   │   └── tasks.ts
│   │   │   ├── services/
│   │   │   │   ├── taskService.ts
│   │   │   │   └── statusTransition.ts
│   │   │   └── middleware/
│   │   │       └── errorHandler.ts
│   │   └── tests/
│   └── frontend/
│       ├── src/
│       │   ├── main.ts
│       │   ├── App.vue
│       │   ├── components/
│       │   │   ├── TaskCard.vue
│       │   │   ├── TaskForm.vue
│       │   │   └── BoardColumn.vue
│       │   ├── views/
│       │   │   └── BoardView.vue
│       │   └── api/
│       │       └── taskApi.ts
│       └── tests/
├── package.json                # 워크스페이스 루트
└── tsconfig.base.json
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2025-12-23 | 최초 작성 |
