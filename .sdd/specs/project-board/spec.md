---
id: SPEC-001
title: 프로젝트 보드 기본기능
version: 1.0.0
status: draft
created: 2025-12-23
updated: 2025-12-23
author:
constitution: 1.1.0
---

# SPEC-001: 프로젝트 보드 기본기능

## 개요

프로젝트의 작업(Task)을 생성, 조회, 수정, 삭제하고 상태를 관리하는 기본 기능을 제공한다.

## 용어 정의

| 용어 | 정의 |
|------|------|
| Task | 프로젝트에서 수행해야 할 개별 작업 단위 |
| Board | Task들을 상태별로 시각화하여 보여주는 화면 |
| Status | Task의 현재 진행 상태 (Backlog, Ready, In Progress, Review, Done) |
| Priority | Task의 우선순위 (P0, P1, P2, P3) |

## 요구사항

### REQ-001: Task 생성

시스템은 새로운 Task를 생성할 수 있어야 한다(SHALL).

#### 필수 속성
- `id`: 고유 식별자 (자동 생성, 형식: TASK-XXX)
- `title`: 작업 제목 (필수)
- `status`: 초기 상태는 `backlog`(SHALL)
- `priority`: 기본값 `P2`
- `created`: 생성 일시 (자동)

#### 선택 속성
- `description`: 상세 설명
- `assignee`: 담당자
- `spec`: 연결된 스펙 ID
- `dueDate`: 마감일

### Scenario: 새 Task 생성

- **GIVEN** 사용자가 보드에 접근했을 때
- **WHEN** 제목 "로그인 기능 구현"으로 새 Task를 생성하면
- **THEN** TASK-001 형식의 ID가 자동 부여되어야 한다
- **AND** 상태는 `backlog`로 설정되어야 한다
- **AND** 우선순위는 `P2`로 설정되어야 한다

---

### REQ-002: Task 목록 조회

시스템은 Task 목록을 조회할 수 있어야 한다(SHALL).

#### 조회 옵션
- 전체 목록 조회(SHALL)
- 상태별 필터링(SHALL)
- 우선순위별 필터링(SHALL)
- 담당자별 필터링(SHOULD)

### Scenario: 상태별 Task 조회

- **GIVEN** 다양한 상태의 Task가 존재할 때
- **WHEN** `in-progress` 상태로 필터링하면
- **THEN** `in-progress` 상태의 Task만 조회되어야 한다

### Scenario: 빈 목록 조회

- **GIVEN** Task가 없을 때
- **WHEN** Task 목록을 조회하면
- **THEN** 빈 목록이 반환되어야 한다

---

### REQ-003: Task 상태 변경

시스템은 Task의 상태를 변경할 수 있어야 한다(SHALL).

#### 허용 상태 전이

```
backlog → ready
ready → in-progress
in-progress → review
review → done
review → in-progress (반려 시)
done → in-progress (재오픈 시)
```

#### 제약 조건
- 스펙이 연결되지 않은 Task는 `ready` 상태로 전이할 수 없다(SHALL NOT)
- `in-progress` 상태의 Task는 담당자당 최대 2개까지만 허용한다(SHOULD)

### Scenario: 정상 상태 전이

- **GIVEN** `backlog` 상태의 Task가 있고 스펙이 연결되어 있을 때
- **WHEN** 상태를 `ready`로 변경하면
- **THEN** 상태가 `ready`로 변경되어야 한다
- **AND** `updated` 필드가 갱신되어야 한다

### Scenario: 스펙 없이 Ready 전이 시도

- **GIVEN** `backlog` 상태의 Task가 있고 스펙이 연결되어 있지 않을 때
- **WHEN** 상태를 `ready`로 변경하려 하면
- **THEN** 오류가 발생해야 한다
- **AND** 상태는 `backlog`로 유지되어야 한다

---

### REQ-004: Task 수정

시스템은 Task의 속성을 수정할 수 있어야 한다(SHALL).

#### 수정 가능 속성
- `title`
- `description`
- `priority`
- `assignee`
- `spec`
- `dueDate`

#### 수정 불가 속성
- `id` (SHALL NOT)
- `created` (SHALL NOT)

### Scenario: Task 제목 수정

- **GIVEN** TASK-001이 존재할 때
- **WHEN** 제목을 "로그인 API 구현"으로 수정하면
- **THEN** 제목이 변경되어야 한다
- **AND** `updated` 필드가 갱신되어야 한다

---

### REQ-005: Task 삭제

시스템은 Task를 삭제할 수 있어야 한다(SHALL).

#### 제약 조건
- `done` 상태가 아닌 Task는 삭제 전 확인을 요청해야 한다(SHOULD)
- 삭제된 Task는 복구할 수 없다(SHALL NOT)

### Scenario: Task 삭제

- **GIVEN** TASK-001이 존재할 때
- **WHEN** 해당 Task를 삭제하면
- **THEN** Task가 목록에서 제거되어야 한다

---

### REQ-006: Board 뷰

시스템은 Task를 상태별 컬럼으로 시각화해야 한다(SHALL).

#### 컬럼 구성
1. Backlog
2. Ready
3. In Progress
4. Review
5. Done

#### 표시 정보
- Task ID(SHALL)
- 제목(SHALL)
- 우선순위 뱃지(SHALL)
- 담당자(SHOULD)
- 마감일(MAY)

### Scenario: Board 뷰 표시

- **GIVEN** 여러 상태의 Task가 존재할 때
- **WHEN** Board 뷰를 열면
- **THEN** 각 상태별 컬럼에 해당 Task가 표시되어야 한다
- **AND** 각 컬럼 내에서는 우선순위 순으로 정렬되어야 한다

---

## 비기능 요구사항

### NFR-001: 응답 시간

- Task 목록 조회는 500ms 이내에 응답해야 한다(SHOULD)
- 개별 Task 조회는 200ms 이내에 응답해야 한다(SHOULD)

### NFR-002: 데이터 영속성

- 모든 Task 변경사항은 즉시 저장되어야 한다(SHALL)
- 시스템 재시작 후에도 데이터가 유지되어야 한다(SHALL)

---

## API 설계

### Task CRUD

```
POST   /api/tasks          # Task 생성
GET    /api/tasks          # Task 목록 조회
GET    /api/tasks/:id      # Task 상세 조회
PATCH  /api/tasks/:id      # Task 수정
DELETE /api/tasks/:id      # Task 삭제
```

### Task 상태 변경

```
PATCH  /api/tasks/:id/status
Body: { "status": "in-progress" }
```

### 필터링

```
GET /api/tasks?status=in-progress
GET /api/tasks?priority=P0
GET /api/tasks?assignee=user@example.com
```

---

## 데이터 모델

```typescript
interface Task {
  id: string;           // "TASK-001"
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: string;
  spec?: string;        // "SPEC-001"
  dueDate?: string;     // ISO 8601
  created: string;      // ISO 8601
  updated: string;      // ISO 8601
}

type TaskStatus = 'backlog' | 'ready' | 'in-progress' | 'review' | 'done';
type Priority = 'P0' | 'P1' | 'P2' | 'P3';
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2025-12-23 | 최초 작성 |
