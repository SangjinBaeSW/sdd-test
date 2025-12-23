---
spec: SPEC-002
title: UI 한글화 구현 계획
version: 1.0.0
status: draft
created: 2025-12-23
updated: 2025-12-23
---

# 구현 계획: UI 한글화 및 Alert 메시지 한글화

## 요약

프론트엔드 UI 텍스트와 백엔드 에러 메시지를 한글로 변경한다.
향후 다국어 지원을 고려하여 텍스트를 상수 파일로 분리한다.

---

## 기술 결정

### TD-001: 텍스트 관리 방식

**선택:** 상수 파일(constants) 분리

**근거:**
- 한 곳에서 모든 텍스트 관리 가능
- 향후 다국어(i18n) 라이브러리 도입 시 마이그레이션 용이
- 오타 수정이나 문구 변경 시 일괄 수정 가능

**구조:**
```
packages/
├── shared/src/
│   └── messages.ts      # 공통 메시지 상수
├── frontend/src/
│   └── constants/
│       └── labels.ts    # UI 레이블 상수
└── backend/src/
    └── constants/
        └── errors.ts    # 에러 메시지 상수
```

---

### TD-002: 상태명 매핑

**선택:** shared 패키지에 상태명 매핑 추가

**근거:**
- 프론트엔드와 백엔드에서 동일한 상태명 사용
- 타입 안전성 보장

```typescript
// packages/shared/src/messages.ts
export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: '백로그',
  ready: '준비됨',
  'in-progress': '진행 중',
  review: '검토 중',
  done: '완료',
};
```

---

## 구현 단계

### Phase 1: 공통 메시지 상수 정의

shared 패키지에 공통 메시지 상수 파일 생성

**산출물:**
- [ ] `packages/shared/src/messages.ts` 생성
- [ ] STATUS_LABELS 상수 정의
- [ ] PRIORITY_LABELS 상수 정의
- [ ] shared 패키지 재빌드

---

### Phase 2: 프론트엔드 UI 한글화

각 Vue 컴포넌트의 텍스트를 한글로 변경

**산출물:**
- [ ] App.vue - 헤더 "프로젝트 보드"
- [ ] BoardView.vue - 버튼, 로딩/에러 메시지
- [ ] BoardColumn.vue - 컬럼명 (STATUS_LABELS 사용)
- [ ] TaskCard.vue - "수정", "삭제" 버튼
- [ ] TaskForm.vue - 폼 레이블, 버튼

---

### Phase 3: 프론트엔드 Alert 메시지 한글화

Alert/Confirm 메시지 한글화

**산출물:**
- [ ] 삭제 확인 메시지
- [ ] 저장 실패 메시지
- [ ] 상태 변경 실패 메시지
- [ ] API 에러 메시지 표시 개선

---

### Phase 4: 백엔드 에러 메시지 한글화

API 에러 응답 메시지 한글화

**산출물:**
- [ ] `packages/backend/src/constants/errors.ts` 생성
- [ ] errorHandler.ts 수정
- [ ] statusTransition.ts 에러 메시지 수정
- [ ] routes/tasks.ts 에러 메시지 수정

---

## 변경 상세

### Frontend 변경 사항

| 파일 | 변경 내용 |
|------|-----------|
| App.vue | `Project Board` → `프로젝트 보드` |
| BoardView.vue | `+ New Task` → `+ 새 작업`, `Loading...` → `불러오는 중...` |
| BoardColumn.vue | 컬럼명 한글화 (STATUS_LABELS 사용) |
| TaskCard.vue | `Edit` → `수정`, `Delete` → `삭제` |
| TaskForm.vue | 전체 레이블/버튼 한글화 |

### Backend 변경 사항

| 파일 | 변경 내용 |
|------|-----------|
| errorHandler.ts | 에러 메시지 한글화 |
| statusTransition.ts | 상태 전이 에러 메시지 한글화 |
| routes/tasks.ts | NOT_FOUND 에러 메시지 한글화 |

---

## 리스크 분석

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|-------------|-----------|
| 누락된 텍스트 | 낮 | 중 | 모든 UI 수동 검토 |
| 일관성 없는 어투 | 낮 | 중 | 스펙 문서의 어투 가이드 준수 |
| shared 패키지 빌드 오류 | 중 | 낮 | 빌드 후 테스트 확인 |

---

## 테스트 전략

### 수동 테스트
- 모든 UI 화면 스크린샷 비교
- 각 에러 상황 발생시켜 메시지 확인

### 체크리스트
- [ ] 헤더 표시 확인
- [ ] 모든 컬럼명 확인
- [ ] Task 생성 폼 레이블 확인
- [ ] Task 수정 폼 레이블 확인
- [ ] 삭제 확인 다이얼로그 확인
- [ ] 스펙 미연결 에러 메시지 확인
- [ ] 상태 전이 불가 에러 메시지 확인

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2025-12-23 | 최초 작성 |
