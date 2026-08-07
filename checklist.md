# 제작 체크리스트

## 1단계 — 저장소 골격
- [x] 폴더 구조 생성 (`docs` `lesson-plans` `code` `world` `operations`)
- [x] `context-notes.md` — 전제·좌표 규칙·코딩 범위 기준값
- [x] `checklist.md`
- [x] `README.md`

## 2단계 — 코드 예제
- [x] `code/floor-01.js` ~ `floor-12.js` (차시별)
- [x] `code/all-floors.js` (누적 통합본)
- [x] `code/README.md` — 붙여넣기 절차 + 매개변수 + 블록 변환 주의사항

## 3단계 — 강의지도안
- [x] `lesson-plans/01.md` ~ `12.md`
- [x] `lesson-plans/README.md` — 12차시 한눈에 + 1탄 대비표

## 4단계 — 월드
- [x] `world/build.js` — 지하 12층 + 수직 갱도 자동 생성
- [x] `world/README.md` — 월드 설정, 빌드 순서, 차시별 슬롯

## 5단계 — 아이용 웹 교재
- [x] `docs/index.html` — 12층 단면도 + 1탄 대비표
- [x] `docs/floor.html` — 층별 교재 (데이터 구동)
- [x] `docs/data/floors.js` — 12개 층 콘텐츠
- [x] `docs/data/build_floors.py` — 생성기. 코드를 고치면 다시 돌린다
- [x] `docs/css/style.css` / `docs/js/app.js`

## 6단계 — 운영 문서
- [x] `operations/rehearsal.md`
- [x] `operations/troubleshooting.md`

## 7단계 — 배포
- [x] GitHub 저장소 (`sungJJoo/fox-signal-12`, public)
- [x] GitHub Pages (main / docs)

---

# 첫 수업 전 반드시 확인할 것 — 실기 검증

문서 작업으로는 확인할 수 없다. **마인크래프트 에듀케이션을 실제로 켜고** 확인한다.

## A. 새로 도입한 API (가장 중요)

1탄에 없던 것이라 실기 확인이 안 되어 있다.

- [ ] `agent.teleport(world(x, y, z), WEST)` 가 의도한 절대 좌표로 가는가
- [ ] `world()` 와 `pos()` 의 차이 — 1차시 `go` / `near` 비교 시연이 실제로 성립하는가
- [ ] **`player.onChat("dive", function (num1) {...})` 가 채팅 `dive 3` 으로 값을 받는가**
- [ ] 매개변수 두 개(`jump -26 2`), 세 개(`warp -12 42 8`)가 정상 동작하는가
- [ ] 숫자를 안 주고 `dive` 만 쳤을 때 `num1` 이 0으로 들어오는가 (2차시 실패 장치의 전제)
- [ ] 음수 매개변수(`jump -26 2`)의 마이너스 부호가 제대로 전달되는가

## B. 블록 변환

- [ ] `code/all-floors.js` 를 JS 탭에 붙여넣고 Blocks 탭에서 **전부 컬러 블록**으로 나오는가
- [ ] `onChat` 의 `num1` 파라미터가 블록에서 드래그 가능한 형태로 보이는가
- [ ] `변수 = 변수 + 1` 이 블록으로 변환되는가
- [ ] `if (num2 == 1)` 비교 블록이 변환되는가
- [ ] 회색 JS 블록이 나온 문법은 `code/README.md` 표를 보고 교체

## C. 월드

- [ ] `world/build.js` `buildall` 실행 시간 측정 — 렉이 심하면 `buildone` 으로 층별 실행
- [ ] 12개 층 홀이 겹치거나 뚫리지 않았는지 `check` 로 육안 확인
- [ ] 6층이 아이가 화면을 볼 수 있는 최소 밝기인지 (너무 어두우면 `props` 에 조명 2개만 추가)
- [ ] 7층 조약돌이 `count 12` 로 정확히 세어지는가 (의도 4개)
- [ ] 8층 물이 층 홀 밖으로 새지 않는가. `raft` 가 물 위에 깔리는가
- [ ] 9층 구멍이 `deck9 6` 범위를 덮는가
- [ ] 12층 조약돌 통로가 `dive12` 2단계에서 10칸 안에 들어오는가

## D. 좌표 경계

- [ ] `row 6 3` 마지막 좌표가 홀 안(X ≥ −30)인가
- [ ] `raft 8 10` 이 물 구간(X −10~−2, Z −8~2)을 벗어나지 않는가
- [ ] `relight 6 11` 의 유도등 좌표가 갱도 주변 홀 안에 있는가
- [ ] `dive12` 4단계 마지막 유도등(−28)이 12층 신호원 단상과 겹치는가 (의도된 것)

## E. 시간

- [ ] 차시별 코드 조립에 걸리는 실제 시간 측정. 55분을 넘으면 마지막 **선택** 명령을 뺀다
- [ ] `raft 6 4`(24회 텔레포트), `relight 6 11`(18회)의 실행 시간
- [ ] `dive12` 전체 실행 시간. 5분을 넘으면 `deckW` `deckD` 기본값을 4로

## F. 배포

- [ ] 수업용 노트북에서 웹 교재 QR 접속 확인
- [ ] 코드 복사 버튼이 학교 네트워크 브라우저에서 동작하는가
- [ ] 기록이 브라우저에 저장되고 다음 접속 때 남아 있는가

---

## 코드를 고쳤을 때

`code/floor-NN.js` 를 고치면 웹 교재도 같이 갱신해야 한다.

```bash
python docs/data/build_floors.py
```

`docs/data/floors.js` 가 다시 만들어진다. 그 다음 commit + push.
