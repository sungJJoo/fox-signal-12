# 제작 체크리스트

## 1단계 — 저장소 골격
- [x] 폴더 구조 생성 (`docs` `lesson-plans` `code` `world` `operations`)
- [x] `context-notes.md` — 좌표 규칙·코딩 범위 기준값 확정
- [x] `checklist.md`
- [x] `README.md`

## 2단계 — 코드 예제
- [x] `code/floor-01.js` ~ `floor-12.js` (차시별)
- [x] `code/all-floors.js` (12차시 누적 통합본)
- [x] `code/README.md` — MakeCode 붙여넣기 절차 + 블록 변환 주의사항

## 3단계 — 강의지도안
- [x] `lesson-plans/01.md` ~ `12.md`
- [x] `lesson-plans/README.md` — 12차시 한눈에 보기

## 4단계 — 월드
- [x] `world/build.js` — 지하 12층 + 수직 갱도 자동 생성
- [x] `world/README.md` — 월드 설정, 빌드 순서, 슬롯 준비

## 5단계 — 아이용 웹 교재
- [x] `docs/index.html` — 12층 단면도 지도
- [x] `docs/floor.html` — 층별 교재 (데이터 구동)
- [x] `docs/data/floors.js` — 12개 층 콘텐츠 원본
- [x] `docs/css/style.css` / `docs/js/app.js`

## 6단계 — 운영 문서
- [x] `operations/rehearsal.md` — 시연 동선, 막힘 지점 Top 5
- [x] `operations/troubleshooting.md`

## 7단계 — 배포
- [x] GitHub 저장소 생성 (`sungJJoo/fox-signal-12`, public)
- [x] push
- [x] GitHub Pages 활성화 (main / docs)

---

## 첫 수업 전 반드시 확인할 것 (실기 검증)

문서 작업으로는 확인할 수 없는 항목이다. **마인크래프트 에듀케이션을 실제로 켜고** 확인한다.

- [ ] `agent.teleport(world(x, y, z), WEST)` 가 의도한 절대 좌표로 가는가
- [ ] `world()` 와 `pos()` 를 바꿔 썼을 때 어떻게 다른지 직접 확인 (아이에게 보여줄 장면)
- [ ] `world/build.js` 실행 시간 측정 — 렉이 심하면 층별 빌드(`bf`)로 나눠 실행
- [ ] 12개 층 홀이 겹치거나 뚫리지 않았는지 육안 확인
- [ ] 6층 조명 없음 상태에서 아이가 화면을 볼 수 있는 최소 밝기인지 확인
- [ ] 8층 물이 층 홀 밖으로 새지 않는지 확인
- [ ] 에이전트 슬롯 1·2·3·4 준비물 확정 후 `world/README.md` 갱신
- [ ] 각 차시 코드를 MakeCode JS 탭에 붙여넣어 **전부 블록으로 변환되는지** 확인 (회색 JS 블록이 나오면 그 문법 교체)
- [ ] 웹 교재 사이트를 수업용 노트북에서 열어 QR 접속 확인
