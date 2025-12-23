---
id: SPEC-002
title: UI 한글화 및 Alert 메시지 한글화
version: 1.0.0
status: draft
created: 2025-12-23
updated: 2025-12-23
author:
constitution: 1.1.0
---

# SPEC-002: UI 한글화 및 Alert 메시지 한글화

## 개요

프로젝트 보드의 모든 UI 텍스트와 시스템 메시지를 한글로 제공한다.

## 범위

### 포함
- 프론트엔드 UI 텍스트
- 버튼, 레이블, 헤더
- Alert/Confirm 메시지
- 에러 메시지
- 백엔드 API 에러 메시지

### 제외
- Task ID (TASK-XXX 형식 유지)
- 기술적 에러 코드

---

## 요구사항

### REQ-001: 헤더 및 네비게이션 한글화

모든 헤더와 네비게이션 텍스트는 한글로 표시해야 한다(SHALL).

| 현재 (영문) | 변경 (한글) |
|-------------|-------------|
| Project Board | 프로젝트 보드 |
| + New Task | + 새 작업 |

### Scenario: 헤더 표시

- **GIVEN** 사용자가 보드 페이지에 접속했을 때
- **WHEN** 페이지가 로드되면
- **THEN** 헤더에 "프로젝트 보드"가 표시되어야 한다

---

### REQ-002: 보드 컬럼 한글화

보드의 상태 컬럼명은 한글로 표시해야 한다(SHALL).

| 현재 (영문) | 변경 (한글) |
|-------------|-------------|
| Backlog | 백로그 |
| Ready | 준비됨 |
| In Progress | 진행 중 |
| Review | 검토 중 |
| Done | 완료 |

### Scenario: 컬럼명 표시

- **GIVEN** 보드 뷰가 로드되었을 때
- **WHEN** 5개의 컬럼이 표시되면
- **THEN** 각 컬럼명이 한글로 표시되어야 한다

---

### REQ-003: Task 폼 한글화

Task 생성/수정 폼의 모든 레이블과 버튼은 한글로 표시해야 한다(SHALL).

| 현재 (영문) | 변경 (한글) |
|-------------|-------------|
| New Task | 새 작업 |
| Edit Task | 작업 수정 |
| Title * | 제목 * |
| Description | 설명 |
| Priority | 우선순위 |
| Assignee | 담당자 |
| Linked Spec | 연결된 스펙 |
| Due Date | 마감일 |
| Cancel | 취소 |
| Create | 생성 |
| Update | 수정 |

### Scenario: 폼 레이블 표시

- **GIVEN** 사용자가 새 작업 버튼을 클릭했을 때
- **WHEN** 폼 모달이 표시되면
- **THEN** 모든 레이블이 한글로 표시되어야 한다

---

### REQ-004: Task 카드 버튼 한글화

Task 카드의 액션 버튼은 한글로 표시해야 한다(SHALL).

| 현재 (영문) | 변경 (한글) |
|-------------|-------------|
| Edit | 수정 |
| Delete | 삭제 |

---

### REQ-005: Alert 메시지 한글화

사용자에게 표시되는 모든 Alert 메시지는 한글로 표시해야 한다(SHALL).

| 현재 (영문) | 변경 (한글) |
|-------------|-------------|
| Are you sure you want to delete this task? | 이 작업을 삭제하시겠습니까? |
| Failed to save task | 작업 저장에 실패했습니다 |
| Failed to update status | 상태 변경에 실패했습니다 |
| Failed to delete task | 작업 삭제에 실패했습니다 |
| Failed to load tasks | 작업 목록을 불러오는데 실패했습니다 |

### Scenario: 삭제 확인 메시지

- **GIVEN** 사용자가 Task 삭제 버튼을 클릭했을 때
- **WHEN** 확인 다이얼로그가 표시되면
- **THEN** "이 작업을 삭제하시겠습니까?" 메시지가 표시되어야 한다

---

### REQ-006: 백엔드 에러 메시지 한글화

API에서 반환하는 사용자 대상 에러 메시지는 한글로 제공해야 한다(SHALL).

| 에러 코드 | 현재 (영문) | 변경 (한글) |
|-----------|-------------|-------------|
| VALIDATION_ERROR | Invalid request data | 잘못된 요청 데이터입니다 |
| NOT_FOUND | Task not found | 작업을 찾을 수 없습니다 |
| INVALID_TRANSITION | Cannot transition from X to Y | X에서 Y로 상태를 변경할 수 없습니다 |
| SPEC_REQUIRED | Task must have a linked spec to move to ready status | Ready 상태로 이동하려면 스펙이 연결되어야 합니다 |
| WIP_LIMIT_WARNING | Assignee already has N tasks in progress | 담당자가 이미 N개의 작업을 진행 중입니다 |

### Scenario: 스펙 필수 에러

- **GIVEN** 스펙이 연결되지 않은 Task가 있을 때
- **WHEN** 해당 Task를 Ready 상태로 변경하려 하면
- **THEN** "Ready 상태로 이동하려면 스펙이 연결되어야 합니다" 에러가 표시되어야 한다

---

### REQ-007: 로딩/빈 상태 메시지 한글화

로딩 및 빈 상태 메시지는 한글로 표시해야 한다(SHALL).

| 현재 (영문) | 변경 (한글) |
|-------------|-------------|
| Loading... | 불러오는 중... |
| No tasks | 작업이 없습니다 |

---

## 비기능 요구사항

### NFR-001: 일관성

모든 한글 텍스트는 일관된 어투(존칭)를 사용해야 한다(SHALL).
- 버튼/레이블: 명사형 (예: "생성", "수정")
- 메시지: 존칭 (예: "~했습니다", "~하시겠습니까?")

### NFR-002: 확장성

향후 다국어 지원을 위해 텍스트를 별도 상수로 관리해야 한다(SHOULD).

---

## 변경 대상 파일

### Frontend
- `packages/frontend/src/App.vue`
- `packages/frontend/src/views/BoardView.vue`
- `packages/frontend/src/components/BoardColumn.vue`
- `packages/frontend/src/components/TaskCard.vue`
- `packages/frontend/src/components/TaskForm.vue`

### Backend
- `packages/backend/src/middleware/errorHandler.ts`
- `packages/backend/src/services/statusTransition.ts`
- `packages/backend/src/routes/tasks.ts`

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2025-12-23 | 최초 작성 |
