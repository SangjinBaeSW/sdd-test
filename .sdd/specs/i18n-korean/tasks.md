---
spec: SPEC-002
plan: plan.md
title: UI 한글화 작업 목록
version: 1.0.0
created: 2025-12-23
updated: 2025-12-23
---

# 작업 목록: UI 한글화 및 Alert 메시지 한글화

## 요약

| 구분 | 개수 |
|------|------|
| 전체 작업 | 6 |
| 완료 | 6 |
| 진행 중 | 0 |
| 대기 | 0 |

---

## Phase 1: 공통 메시지 상수

### I18N-001: 공통 메시지 상수 파일 생성

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** 없음

#### 설명
shared 패키지에 STATUS_LABELS, PRIORITY_LABELS 등 공통 상수 정의

#### 완료 조건
- [x] `packages/shared/src/messages.ts` 생성
- [x] STATUS_LABELS 상수 (백로그, 준비됨, 진행 중, 검토 중, 완료)
- [x] PRIORITY_LABELS 상수 (긴급, 높음, 보통, 낮음)
- [x] shared 패키지 index.ts에 export 추가

---

## Phase 2: 프론트엔드 UI 한글화

### I18N-002: App.vue 및 BoardView.vue 한글화

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** I18N-001

#### 설명
헤더, 버튼, 로딩/에러 메시지 한글화

#### 완료 조건
- [x] App.vue: "Project Board" → "프로젝트 보드"
- [x] BoardView.vue: "+ New Task" → "+ 새 작업"
- [x] BoardView.vue: "Loading..." → "불러오는 중..."
- [x] BoardView.vue: 에러 메시지 한글화

---

### I18N-003: BoardColumn.vue 한글화

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** I18N-001

#### 설명
보드 컬럼명을 STATUS_LABELS 사용하여 한글화

#### 완료 조건
- [x] STATUS_LABELS import
- [x] 컬럼 타이틀에 한글 레이블 적용
- [x] Backlog → 백로그, Ready → 준비됨, In Progress → 진행 중, Review → 검토 중, Done → 완료

---

### I18N-004: TaskCard.vue 및 TaskForm.vue 한글화

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** 없음

#### 설명
Task 카드 버튼과 폼 레이블 한글화

#### 완료 조건
- [x] TaskCard.vue: "Edit" → "수정", "Delete" → "삭제"
- [x] TaskForm.vue: 모달 제목 "New Task" → "새 작업", "Edit Task" → "작업 수정"
- [x] TaskForm.vue: 레이블 (제목, 설명, 우선순위, 담당자, 연결된 스펙, 마감일)
- [x] TaskForm.vue: 버튼 "Cancel" → "취소", "Create" → "생성", "Update" → "수정"
- [x] TaskForm.vue: placeholder 한글화

---

## Phase 3: Alert 메시지 한글화

### I18N-005: Alert/Confirm 메시지 한글화

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** I18N-002

#### 설명
BoardView.vue의 alert/confirm 메시지 한글화

#### 완료 조건
- [x] 삭제 확인: "이 작업을 삭제하시겠습니까?"
- [x] 저장 실패: "작업 저장에 실패했습니다"
- [x] 상태 변경 실패: API 에러 메시지 표시 (백엔드에서 한글 제공)
- [x] 삭제 실패: "작업 삭제에 실패했습니다"

---

## Phase 4: 백엔드 에러 메시지 한글화

### I18N-006: 백엔드 에러 메시지 한글화

- **상태:** ✅ 완료
- **우선순위:** 🔴 HIGH
- **의존성:** 없음

#### 설명
API 에러 응답 메시지를 한글로 변경

#### 완료 조건
- [x] errorHandler.ts: VALIDATION_ERROR → "잘못된 요청 데이터입니다"
- [x] errorHandler.ts: NOT_FOUND → "작업을 찾을 수 없습니다"
- [x] statusTransition.ts: INVALID_TRANSITION → "X에서 Y로 상태를 변경할 수 없습니다"
- [x] statusTransition.ts: SPEC_REQUIRED → "Ready 상태로 이동하려면 스펙이 연결되어야 합니다"
- [x] statusTransition.ts: WIP 경고 → "담당자가 이미 N개의 작업을 진행 중입니다"
- [x] routes/tasks.ts: NOT_FOUND → "작업을 찾을 수 없습니다"

---

## 의존성 그래프

```
I18N-001 (공통 상수)
    │
    ├──▶ I18N-002 (App, BoardView)
    │         │
    │         └──▶ I18N-005 (Alert 메시지)
    │
    └──▶ I18N-003 (BoardColumn)

I18N-004 (TaskCard, TaskForm) ── 독립

I18N-006 (백엔드) ── 독립
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2025-12-23 | 최초 작성 |
