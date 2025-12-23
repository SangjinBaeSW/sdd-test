import type { TaskStatus, Priority } from './types.js';

// 상태 레이블 (한글)
export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: '백로그',
  ready: '준비됨',
  'in-progress': '진행 중',
  review: '검토 중',
  done: '완료',
};

// 우선순위 레이블 (한글)
export const PRIORITY_LABELS: Record<Priority, string> = {
  P0: '긴급',
  P1: '높음',
  P2: '보통',
  P3: '낮음',
};

// 에러 메시지 (한글)
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: '잘못된 요청 데이터입니다',
  NOT_FOUND: '작업을 찾을 수 없습니다',
  INTERNAL_ERROR: '서버 오류가 발생했습니다',
  DUPLICATE_ERROR: '이미 존재하는 항목입니다',
  INVALID_TRANSITION: (from: string, to: string) =>
    `'${STATUS_LABELS[from as TaskStatus] || from}'에서 '${STATUS_LABELS[to as TaskStatus] || to}'로 상태를 변경할 수 없습니다`,
  SPEC_REQUIRED: 'Ready 상태로 이동하려면 스펙이 연결되어야 합니다',
  WIP_LIMIT_WARNING: (assignee: string, count: number, limit: number) =>
    `담당자 '${assignee}'가 이미 ${count}개의 작업을 진행 중입니다 (제한: ${limit}개). 강제 진행하려면 force 옵션을 사용하세요.`,
} as const;

// 인증 에러 메시지 (한글)
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
  EMAIL_EXISTS: '이미 등록된 이메일입니다',
  PASSWORD_TOO_SHORT: '비밀번호는 8자 이상이어야 합니다',
  INVALID_EMAIL: '유효한 이메일 형식이 아닙니다',
  UNAUTHORIZED: '로그인이 필요합니다',
  TOKEN_EXPIRED: '토큰이 만료되었습니다',
  TOKEN_INVALID: '유효하지 않은 토큰입니다',
  LOGOUT_SUCCESS: '로그아웃되었습니다',
} as const;

// 인증 UI 레이블 (한글)
export const AUTH_LABELS = {
  LOGIN: '로그인',
  LOGOUT: '로그아웃',
  REGISTER: '회원가입',
  EMAIL: '이메일',
  PASSWORD: '비밀번호',
  PASSWORD_CONFIRM: '비밀번호 확인',
  NAME: '이름',
  LOGIN_TITLE: '로그인',
  REGISTER_TITLE: '회원가입',
  NO_ACCOUNT: '계정이 없으신가요?',
  HAS_ACCOUNT: '이미 계정이 있으신가요?',
  PLACEHOLDER_EMAIL: '이메일을 입력하세요',
  PLACEHOLDER_PASSWORD: '비밀번호를 입력하세요',
  PLACEHOLDER_NAME: '이름을 입력하세요 (선택)',
} as const;

// UI 레이블 (한글)
export const UI_LABELS = {
  // 헤더
  APP_TITLE: '프로젝트 보드',

  // 버튼
  NEW_TASK: '+ 새 작업',
  EDIT: '수정',
  DELETE: '삭제',
  CANCEL: '취소',
  CREATE: '생성',
  UPDATE: '수정',

  // 폼 레이블
  FORM_NEW_TASK: '새 작업',
  FORM_EDIT_TASK: '작업 수정',
  FORM_TITLE: '제목',
  FORM_DESCRIPTION: '설명',
  FORM_PRIORITY: '우선순위',
  FORM_ASSIGNEE: '담당자',
  FORM_SPEC: '연결된 스펙',
  FORM_DUE_DATE: '마감일',

  // 플레이스홀더
  PLACEHOLDER_TITLE: '작업 제목을 입력하세요',
  PLACEHOLDER_DESCRIPTION: '작업 설명을 입력하세요',
  PLACEHOLDER_ASSIGNEE: '담당자 이름',
  PLACEHOLDER_SPEC: '예: SPEC-001',

  // 상태 메시지
  LOADING: '불러오는 중...',
  NO_TASKS: '작업이 없습니다',
  ERROR_LOAD: '작업 목록을 불러오는데 실패했습니다',

  // 확인 메시지
  CONFIRM_DELETE: '이 작업을 삭제하시겠습니까?',

  // 에러 메시지
  ERROR_SAVE: '작업 저장에 실패했습니다',
  ERROR_DELETE: '작업 삭제에 실패했습니다',
  ERROR_STATUS: '상태 변경에 실패했습니다',
} as const;
