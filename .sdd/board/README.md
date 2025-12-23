# Project Board

작업 관리를 위한 Project Board입니다.

## 상태 (Status)

| 상태 | 설명 |
|------|------|
| Backlog | 등록된 작업 (아직 준비 안됨) |
| Ready | 스펙 작성 완료, 작업 시작 가능 |
| In Progress | 진행 중 |
| Review | 코드 리뷰 중 |
| Done | 완료 |

## 우선순위 (Priority)

| 우선순위 | 설명 |
|----------|------|
| P0 | Critical - 즉시 처리 |
| P1 | High - 현재 스프린트 내 처리 |
| P2 | Medium - 다음 스프린트 고려 |
| P3 | Low - 백로그 |

## 현재 보드

### Backlog
<!-- 새 작업은 여기에 추가 -->

### Ready
<!-- 스펙 작성 완료된 작업 -->

### In Progress
<!-- 진행 중인 작업 -->

### Review
<!-- 리뷰 대기 중인 작업 -->

### Done
<!-- 완료된 작업 -->

---

## 명령어

```bash
# 새 작업 생성
sdd task new "작업 제목"

# 작업 상태 변경
sdd task move TASK-001 in-progress

# 작업 목록 보기
sdd task list
sdd task list --status in-progress
sdd task list --priority P0
```
