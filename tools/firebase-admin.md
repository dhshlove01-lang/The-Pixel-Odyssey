# 마스터 콘솔 관리자 등록 (Firebase, 한 번만)

마스터 콘솔(test 서버 F9)의 **정식에 적용** 버튼은 관리자 계정만 쓸 수 있다.
관리자인지는 서버의 `admins/<내 UID>` 값이 `true` 인지로 정한다. 아무나 정식 수치를 바꾸지 못하게 서버 규칙도 함께 넣는다.

## 1. 내 UID 확인
test 서버에 **관리자로 쓸 아이디로 로그인** → F9 → **🚀 정식 적용** 탭.
빨간 칸에 `admins / XXXXXXXX = true 를 추가` 라고 나온다. 이 `XXXXXXXX` 가 내 UID.

## 2. 관리자 등록
Firebase 콘솔 → 프로젝트 `devil-renown` → **Realtime Database** → **데이터** 탭
- 맨 위(루트)의 `+` → 이름 `admins` 
- 그 아래 `+` → 이름 = 내 UID, 값 = `true` (불리언)

## 3. 규칙 추가
같은 화면의 **규칙** 탭에서, 이미 있는 `"rules": { ... }` 안에 아래 네 덩어리를 **추가**한다(다른 줄은 지우지 말 것).

```json
"admins": {
  "$uid": { ".read": "auth != null && auth.uid === $uid" }
},
"tuning": {
  ".read": true,
  ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
},
"dev_tuning": {
  ".read": true,
  ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
},
"tuning_log": {
  ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
  ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
}
```

**게시**를 누른다.

> 주의: 규칙 맨 위에 `".read": true` 나 `".write": true` 가 루트에 바로 있으면, 아래 규칙으로 막아도 소용이 없다(Firebase 규칙은 위에서 허락하면 아래에서 못 막는다). 그런 줄이 있으면 Claude 에게 규칙 전체를 보여 주고 같이 고친다.

## 4. 확인
test 서버를 새로 고침 → F9 → 🚀 정식 적용 탭에 초록색 **관리자 확인됨** 이 뜨면 끝.

## 저장 위치 (참고)
| 경로 | 내용 |
|---|---|
| `dev_tuning` | test 서버 수치 (관리자 창에서 바꾸면 자동 저장) |
| `tuning` | 정식 서버 수치 (정식에 적용 버튼) |
| `tuning_log` | 정식 적용 기록 (되돌리기용: 적용 전·후 값) |
| `admins/<UID>` | 관리자 표시 |
