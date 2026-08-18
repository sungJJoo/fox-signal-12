# 월드 실기 검증 — Minecraft MCP 연결

`checklist.md` 의 A~D 항목은 마인크래프트를 실제로 켜야 확인할 수 있다.
MCP를 붙여두면 **Claude가 직접 게임에 명령을 보내서** 그 항목들을 대신 확인한다.

이건 선택 사항이다. 안 붙여도 `checklist.md` 를 손으로 짚어가며 하면 된다.

---

## 무엇이 설치되어 있나

| 항목 | 값 |
|---|---|
| 프로젝트 | [Mming-Lab/minecraft-bedrock-education-mcp](https://github.com/Mming-Lab/minecraft-bedrock-education-mcp) |
| 라이선스 | MIT |
| 설치 위치 | `C:\Users\new\.claude\mcp-servers\minecraft-edu-mcp` |
| 등록 이름 | `minecraft-edu` (user 스코프) |
| 연결 방식 | 로컬 웹소켓 `localhost:8001`. 마인크래프트가 이쪽으로 접속해 온다 |
| 설치 방법 | `npm ci --ignore-scripts` — lockfile 고정 버전, 생명주기 스크립트 실행 안 함 |

Education Edition에는 Java판 프로토콜도 RCON도 없다. `/connect` 웹소켓이 유일한 외부 연결 통로이고, 이 MCP가 그것을 쓴다.

---

## ⚠ 먼저 알아야 할 것 — MakeCode 와 동시에 못 쓴다

**Minecraft Education 은 웹소켓 연결을 하나만 유지한다.**
MakeCode(Code Builder)도 게임에 웹소켓으로 붙어 있다. `/connect` 를 치면 그 연결이 MCP 쪽으로 넘어가고, **그 순간 MakeCode 가 끊긴다.**

끊기면 이런 증상이 나온다.

- 채팅 명령(`dive 3` 등)을 쳐도 **아무 반응이 없다**
- 게임에 `서버가 닫혔습니다` / `연결할 수 없습니다` 가 뜬다

| 연결 상태 | 할 수 있는 것 |
|---|---|
| **MakeCode 연결** (기본) | 코드 실행 — `build.js`, 수업 코드 |
| **MCP 연결** (`/connect` 후) | 월드 검사 — 좌표 읽기, 블록 확인, 에이전트 위치 |

**번갈아 쓴다.** 순서는 이렇다.

1. MakeCode 로 `buildall` 을 돌려 월드를 세운다
2. `/connect localhost:8001/ws` 로 MCP 에 붙어 결과를 검사한다
3. 검사가 끝나면 월드에서 나갔다 들어오거나 `C` 키로 Code Builder 를 껐다 켜서 MakeCode 연결을 되돌린다

**수업 중에는 MCP 를 연결하지 않는다.** 아이들 코드가 전부 멈춘다.

**코드 동작(채팅 명령, 매개변수)은 MCP 로 검증할 수 없다.** MakeCode 가 연결돼 있어야 하는데 그 상태에서는 MCP 가 못 붙기 때문이다. 그건 사람이 화면 좌표를 보며 확인한다.

---

## 쓰는 순서

**1. 마인크래프트 에듀케이션에서 `signal-12` 월드를 연다.** 치트 허용 상태여야 한다.

**2. 채팅창(`T`)에 접속 명령을 친다.**

```
/connect localhost:8001/ws
```

"연결되었습니다" 가 뜨면 준비 끝이다.

**3. Claude에게 검증을 시킨다.** 예를 들면

> "checklist.md C 항목대로 12개 층 신호 표식에 에이전트를 보내서 전부 한가운데 서는지 확인해줘"

> "6층에서 row 6 3 이 놓을 여섯 좌표에 실제로 블록이 놓이는지 확인해줘"

> "`agent.teleport(world(-12, 14, 8), WEST)` 가 진짜 12층으로 가는지 봐줘"

**4. 끝나면 게임을 닫거나 월드를 나가면 연결이 끊긴다.**

---

## 이걸로 확인할 수 있는 것

`checklist.md` 항목과 대응한다.

| 체크리스트 | MCP로 확인 가능? |
|---|---|
| A. `agent.teleport` + `world()` 동작 | ✗ **MakeCode 코드라 MCP 로는 못 본다.** 사람이 화면 좌표로 확인 |
| A. `onChat` 매개변수 | ✗ 같은 이유. 사람이 확인 |
| B. 블록 변환 (회색 JS 블록) | ✗ MakeCode 화면을 봐야 한다 |
| C. 12개 층 홀 · 신호 표식 좌표 | ○ `teleport` + `get_position` |
| C. 7층 잔해 개수 | ○ `detect_block` |
| C. 8층 물 · 9층 구멍 | ○ `query_block_data` |
| D. 좌표 경계 (홀 밖으로 나가는지) | ○ `teleport` 후 `get_position` |
| E. 실행 시간 | △ 대략만 |

**MakeCode 로 실행되는 것은 전부 사람이 확인해야 한다.** MCP 가 붙어 있는 동안에는 MakeCode 가 끊겨서 채팅 명령이 아예 안 돈다.
MCP 는 **이미 만들어진 월드의 상태를 읽는 데** 쓴다. 코드가 제대로 도는지는 못 본다.

---

## 도구 목록

```
agent    move · turn · teleport · place_block · mine_block · collect_item
         detect_block · get_position · get_inventory · set_item_in_slot
blocks   set_block · fill_area(replace/keep/destroy) · query_block_data
player   플레이어 상태와 이동
world    시간 · 날씨 · 난이도 · 스폰
camera   시점
system   스코어보드 등
```

`blocks.fill_area` 는 `world/build.js` 가 쓰는 것과 같은 기능이다. 빌드 코드를 게임에서 직접 시험해볼 수 있다.

---

## 알아둘 것

- **MCP를 등록한 직후에는 도구가 안 잡힌다.** Claude Code 세션을 새로 시작해야 한다
- 마인크래프트가 켜져 있고 `/connect` 를 친 상태에서만 동작한다. 게임이 없으면 도구는 그냥 실패한다
- 이 MCP가 게임에 보내는 것은 슬래시 명령이다. **월드를 바꿀 수 있다.** 검증은 원본이 아니라 **복제본 월드**에서 하는 게 안전하다
- 커뮤니티 1인 프로젝트다. 마지막 커밋이 2026년 2월이라 Education Edition이 크게 업데이트되면 깨질 수 있다
- 외부로 나가는 통신은 위키 검색 도구의 `minecraft.wiki` 하나뿐이다. 나머지는 전부 로컬이다

## 문제 해결

| 증상 | 대응 |
|---|---|
| 도구가 목록에 없다 | 세션을 새로 시작한다 |
| `/connect` 후 반응 없음 | 서버가 안 떠 있다. `claude mcp list` 로 상태 확인 |
| 포트 충돌 | 8001을 다른 프로그램이 쓰고 있다. 그 프로그램을 끄거나 서버 포트를 바꾼다 |
| 명령은 가는데 아무 일도 안 일어남 | 월드에 치트가 꺼져 있다 |
| 게임 업데이트 후 안 됨 | 저장소에서 `git pull && npm ci --ignore-scripts && npm run build` |

제거하려면

```bash
claude mcp remove minecraft-edu
```
