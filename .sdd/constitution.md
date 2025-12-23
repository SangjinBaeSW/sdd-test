---
version: 1.1.0
created: 2025-12-23
updated: 2025-12-23
---

# Constitution: sdd-test

> 이 프로젝트의 모든 설계와 구현은 아래 원칙을 준수해야 한다(SHALL).

## 핵심 원칙

### 1. 품질 우선

- 모든 기능은 테스트와 함께 구현해야 한다(SHALL)
- 코드 리뷰 없이 머지해서는 안 된다(SHALL NOT)

### 2. 명세 우선

- 모든 기능은 스펙 문서가 먼저 작성되어야 한다(SHALL)
- 스펙은 RFC 2119 키워드를 사용해야 한다(SHALL)
- 모든 요구사항은 GIVEN-WHEN-THEN 시나리오를 포함해야 한다(SHALL)

## 작업 관리 (Project Board)

### 워크플로우

- 모든 작업은 Board에 등록되어야 한다(SHALL)
- 작업 상태: `Backlog` → `Ready` → `In Progress` → `Review` → `Done`
- 한 번에 `In Progress` 상태인 작업은 담당자당 2개 이하여야 한다(SHOULD)

### 작업 우선순위

- **P0 (Critical)**: 즉시 처리 필요
- **P1 (High)**: 현재 스프린트 내 처리
- **P2 (Medium)**: 다음 스프린트 고려
- **P3 (Low)**: 백로그

### 작업 연결

- 모든 작업은 관련 스펙 문서와 연결되어야 한다(SHALL)
- 커밋 메시지에 작업 ID를 포함해야 한다(SHOULD)
- 형식: `[TASK-001] 커밋 메시지`

## 금지 사항

- 스펙 없이 기능을 구현해서는 안 된다(SHALL NOT)
- 테스트 없이 배포해서는 안 된다(SHALL NOT)
- Board에 등록하지 않은 작업을 진행해서는 안 된다(SHALL NOT)

## 기술 스택

- (프로젝트에 맞게 수정하세요)

## 품질 기준

- 테스트 커버리지: 80% 이상(SHOULD)
