# cursor-demo

RFC 5322 기반 이메일 검증·정규화 ES Module 라이브러리입니다.

## 설치 및 테스트

```bash
npm test
```

## 사용 예

```javascript
import { getValidEmails, uniqueValidEmails } from './src/index.js';

getValidEmails([
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'not-an-email' },
]); // ['alice@example.com']

uniqueValidEmails([
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'alice@example.com' },
  { name: 'Carol', email: 'carol@test.org' },
]); // ['alice@example.com', 'carol@test.org']
```

자세한 API 스펙은 [`docs/validator.md`](docs/validator.md)를 참고하세요.

---

## 릴리스 노트

### v1.0.0 — 이메일 검증·정규화 모듈 초기 릴리스

RFC 5322 기반 이메일 검증, 정규화, 사용자 목록 필터링, 로그인 검증을 제공하는 ES Module 라이브러리 첫 공개 버전입니다.

#### ✨ 기능

- **`isValidEmail`** — RFC 5322 정규식과 RFC 3696 길이 제한(로컬 파트 64자, 전체 254자)으로 이메일 형식 검증 (`src/validator.js`)
- **`normalizeEmail`** — 앞뒤 공백 제거 및 소문자 변환 (`src/normalize.js`)
- **이메일 목록 유틸** — `extractEmails`, `getValidEmails`, `uniqueValidEmails`로 사용자 배열에서 유효한 이메일만 추출 (`src/email.js`)
- **`login`** — 로그인 시 `isValidEmail`로 이메일 형식을 검증 (`src/auth.js`)
- **단위 테스트** — `email.test.js`, `normalize.test.js`로 검증·정규화 동작 커버
- **스펙 문서** — `docs/validator.md`에 API, 검증 규칙, AI 리팩터링 기준 정리
- **Cursor 코딩 규칙** — `.cursor/rules/coding-style.mdc` (한국어 주석, JSDoc, ES Modules 등)

#### 🧹 기타

- Node.js 내장 테스트 러너(`node --test`) 설정 (`package.json`)
- ES Module(`"type": "module"`) 프로젝트 구조

### v1.0.0 이후 패치 (18ac488 → ec1a755)

#### 🐛 버그 수정

- RFC 5322 이메일 정규식 따옴표 로컬 파트 패턴의 불필요한 닫는 괄호 제거 (`3ee243a`)
- `docs/validator.md` 마크다운 닫는 코드블록 정리

#### 🧹 기타

- PR 준비용 Cursor 커맨드 `prep-pr` 추가 (테스트 실행, 변경 요약, 커밋 메시지 제안)
- README 릴리스 노트·사용 예 정리 및 release-notes 스킬 추가 (`ec1a755`)

### v1.1.0 — Cursor 훅·보안 감사 및 이메일 검증 개선 (ec1a755 → HEAD)

에이전트 감사 훅, 파괴적 명령 차단, 보안 감사 서브에이전트 추가와 이메일 정규식 개선.

#### ✨ 기능

- **Cursor 훅** — 파일 편집·셸 실행 전후 audit 로그 기록 (`.cursor/hooks/audit.mjs`, `audit.sh`, `.cursor/hooks.json`)
- **`rm -rf` 차단 훅** — 파괴적 삭제 명령 자동 차단 및 에이전트 안내 메시지 반환 (`.cursor/hooks/block-rm.mjs`)
- **security-auditor 에이전트** — 코드 변경 보안 취약점 검토용 Cursor 서브에이전트 (`.cursor/agents/security-auditor.md`)

#### 🐛 버그 수정

- RFC 5322 이메일 정규식을 emailregex.com 패턴으로 교체, IP 옥텟 검증 버그 수정 (`src/validator.js`, `e71bb34`)

#### 🧹 기타

- RFC 5322 정규식 오타 수정 PR 머지 (#2, `58b6c55`)
- v1.1.0 릴리스 노트 README 정리 (`8e7cd02`)
