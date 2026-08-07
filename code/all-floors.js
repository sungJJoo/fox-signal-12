// 지하 12층 — 신호를 따라서 | 1~12차시 누적 통합본
// 폭스러닝센터 AI 연구소
//
// 이 파일은 12차시 전체 코드를 순서대로 이어붙인 것이다.
// 수업에서는 차시별 파일(floor-01.js ~ floor-12.js)을 하나씩 추가하고,
// 이 파일은 연구원이 전체 흐름을 확인하거나 진도를 따라잡을 때 쓴다.
//
// [층 → Y 규칙]  Y = 62 - 층 x 4
//   1층 58 · 2층 54 · 3층 50 · 4층 46 · 5층 42 · 6층 38
//   7층 34 · 8층 30 · 9층 26 · 10층 22 · 11층 18 · 12층 14
//
// [MakeCode 붙여넣기]  JS 탭에 통째로 붙여넣은 뒤 블록 탭으로 전환한다.
//   회색 JS 블록이 하나라도 나오면 그 문법을 교체해야 한다. code/README.md 참고.


// ==========================================================
// 1차시
// ==========================================================

// 지하 1층 | 관제실 개소 — 좌표를 읽는다
//
// 신호 좌표   -12 / 58 / 8
// 새로 배우는 것   X · Y · Z 가 각각 무엇인지
// 관찰 포인트   내 좌표와 에이전트 좌표가 같은가?

// [mark] 에이전트를 내 옆으로 불러 관제 시작 지점을 잡는다
player.onChat("mark", function () {
    agent.teleportToPlayer()
    loops.pause(400)
    player.say("관제 시작 지점 확보")
})

// [spin] 제자리에서 한 바퀴 돌며 주변을 확인한다
player.onChat("spin", function () {
    for (let i = 0; i < 4; i++) {
        agent.turn(RIGHT_TURN)
        loops.pause(400)
    }
    player.say("주변 확인 완료")
})

// ==========================================================
// 2차시
// ==========================================================

// 지하 2층 | 첫 하강 — Y가 곧 깊이다
//
// 신호 좌표   -12 / 54 / 14
// 새로 배우는 것   위아래 이동. Y 숫자가 줄면 더 깊은 곳이다
// 관찰 포인트   dive 한 번에 Y가 얼마나 줄어드는가?

// [dive] 한 층 내려간다
player.onChat("dive", function () {
    for (let i = 0; i < 4; i++) {
        agent.move(DOWN, 1)
        loops.pause(300)
    }
    player.say("한 층 하강")
})

// [rise] 한 층 올라온다
player.onChat("rise", function () {
    for (let i = 0; i < 4; i++) {
        agent.move(UP, 1)
        loops.pause(300)
    }
    player.say("한 층 상승")
})

// ==========================================================
// 3차시
// ==========================================================

// 지하 3층 | 좌표 투입 — 절대 좌표로 직접 보낸다
//
// 신호 좌표   -4 / 50 / 8
// 새로 배우는 것   agent.teleport 와 world(x, y, z)
// 관찰 포인트   dive 를 여러 번 한 것과 drop 한 번은 무엇이 다른가?
//
// world(x, y, z) 는 지도 위의 절대 좌표다. 에이전트가 어디 있든 그 지점으로 간다.
// pos(x, y, z) 는 내 위치에서 얼마나 떨어졌는지를 뜻한다. 둘은 완전히 다르다.

// [drop] 3층 신호 지점으로 곧장 투입한다
player.onChat("drop", function () {
    agent.teleport(world(-4, 50, 8), WEST)
    loops.pause(400)
    player.say("3층 신호 지점 도착")
})

// [home] 1층 갱도 입구로 복귀시킨다
player.onChat("home", function () {
    agent.teleport(world(-12, 58, 8), WEST)
    loops.pause(400)
    player.say("갱도 입구 복귀")
})

// ==========================================================
// 4차시
// ==========================================================

// 지하 4층 | 숫자에 이름 붙이기 — 변수
//
// 신호 좌표   -20 / 46 / 8
// 새로 배우는 것   변수. 숫자를 코드 안에 흩어놓지 않고 한 곳에 모은다
// 관찰 포인트   맨 위 숫자 세 개만 바꿔도 에이전트가 다른 곳으로 가는가?
//
// 층이 바뀔 때마다 코드 속 숫자를 찾아서 고치는 건 귀찮고 실수도 난다.
// 숫자에 이름을 붙여 맨 위에 모아두면, 고칠 곳이 한 군데뿐이다.

let signalX = -20
let signalY = 46
let signalZ = 8

// [go4] 변수에 적힌 좌표로 투입한다
player.onChat("go4", function () {
    agent.teleport(world(signalX, signalY, signalZ), WEST)
    loops.pause(400)
    player.say(signalY)
})

// ==========================================================
// 5차시
// ==========================================================

// 지하 5층 | 층 계산기 — 규칙을 코드로 만든다
//
// 신호 좌표   -12 / 42 / -2
// 새로 배우는 것   변수끼리 계산하기
// 관찰 포인트   targetFloor 를 1부터 12까지 바꾸면 Y가 규칙대로 나오는가?
//
// 지금까지 층마다 Y를 표에서 찾아 적었다. 그런데 규칙이 있다.
//
//        Y = 62 - 층 × 4
//
// 규칙을 코드로 쓰면 표가 필요 없다. 층 번호 하나만 바꾸면 된다.
// 이게 코드가 "확장된다"는 뜻이다.

let targetFloor = 5

// [floor] 층 번호만 보고 Y를 계산해서 갱도로 투입한다
player.onChat("floor", function () {
    let depth = 62 - targetFloor * 4
    agent.teleport(world(-12, depth, 8), WEST)
    loops.pause(400)
    player.say(depth)
})

// [sig5] 5층 신호 지점으로 직접 간다
player.onChat("sig5", function () {
    agent.teleport(world(-12, 42, -2), WEST)
    loops.pause(400)
    player.say("5층 신호 지점 도착")
})

// ==========================================================
// 6차시
// ==========================================================

// 지하 6층 | 꺼진 조명 — 개수와 간격을 변수로
//
// 신호 좌표   0 / 38 / 16
// 준비물   에이전트 슬롯 1 → 글로우스톤(발광석)
// 새로 배우는 것   반복 횟수와 이동 거리를 변수로 빼기
// 관찰 포인트   lampGap 을 바꾸면 유도등 간격이 정말 그만큼 달라지는가?
//
// 6층은 조명이 죽어 있다. 바닥 블록을 발광석으로 갈아끼워 유도등을 심는다.
// destroy 로 바닥을 걷어낸 다음 place 로 채워야 한다. 순서가 바뀌면 설치가 안 된다.

let lampCount = 5
let lampGap = 3

// [sig6] 6층 신호 지점으로 투입한다
player.onChat("sig6", function () {
    agent.teleport(world(0, 38, 16), WEST)
    loops.pause(400)
    player.say("6층 진입. 조명 없음")
})

// [light] 유도등을 일정 간격으로 심는다
player.onChat("light", function () {
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < lampCount; i++) {
        agent.destroy(DOWN)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, lampGap)
        loops.pause(400)
    }
    player.say("유도등 설치 완료")
})

// ==========================================================
// 7차시
// ==========================================================

// 지하 7층 | 무너진 통로 — 조건 판단
//
// 신호 좌표   -24 / 34 / 20
// 새로 배우는 것   if / else 와 detect. 상황을 보고 다르게 행동하기
// 관찰 포인트   같은 [clear] 명령인데 막힌 곳과 뚫린 곳에서 왜 다르게 움직이는가?
//
// 7층 통로는 군데군데 무너져 있다. 어디가 막혔는지 관제실에서는 알 수 없다.
// 그래서 "막혔으면 치우고, 안 막혔으면 나아간다"는 판단을 에이전트에게 맡긴다.

let steps = 12

// [sig7] 7층 신호 지점으로 투입한다
player.onChat("sig7", function () {
    agent.teleport(world(-24, 34, 20), EAST)
    loops.pause(400)
    player.say("7층 진입. 통로 붕괴 확인")
})

// [clear] 막혔으면 치우고, 비었으면 전진한다
player.onChat("clear", function () {
    for (let i = 0; i < steps; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            agent.destroy(FORWARD)
            loops.pause(300)
            agent.collectAll()
            loops.pause(300)
        } else {
            agent.move(FORWARD, 1)
            loops.pause(300)
        }
    }
    player.say("통로 확보")
})

// ==========================================================
// 8차시
// ==========================================================

// 지하 8층 | 물이 찬 층 — 길이를 변수로
//
// 신호 좌표   -6 / 30 / -10
// 준비물   에이전트 슬롯 1 → 통로용 블록(석재 등)
// 새로 배우는 것   변수 하나로 결과물의 크기를 정한다
// 관찰 포인트   bridgeLength 숫자와 실제로 놓인 블록 개수가 정확히 같은가?
//
// 8층은 물에 잠겼다. 에이전트가 지나갈 안전 통로를 깔아야 한다.
// 물 위에는 아래가 비어 있으니 destroy 없이 place 만 해도 된다. 6층과 비교해보자.

let bridgeLength = 10

// [sig8] 8층 신호 지점으로 투입한다
player.onChat("sig8", function () {
    agent.teleport(world(-6, 30, -10), SOUTH)
    loops.pause(400)
    player.say("8층 진입. 침수 확인")
})

// [bridge] 안전 통로를 깐다
player.onChat("bridge", function () {
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < bridgeLength; i++) {
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, 1)
        loops.pause(300)
    }
    player.say("안전 통로 완성")
})

// ==========================================================
// 9차시
// ==========================================================

// 지하 9층 | 바닥이 없다 — 이중 반복 + 변수
//
// 신호 좌표   -28 / 26 / 4
// 준비물   에이전트 슬롯 1 → 발판용 블록
// 새로 배우는 것   반복 안에 반복 넣기. 한 변의 길이를 변수로
// 관찰 포인트   deckSide 숫자와 한 변의 칸 수가 같은가? 블록은 몇 개 필요한가?
//
// 9층은 바닥이 통째로 내려앉았다. 네모난 착륙 발판을 만들어야 한다.
// 한 변을 놓고 오른쪽으로 도는 것을 네 번 반복하면 사각형이 된다.
// 바깥 반복 = 변의 개수(4), 안쪽 반복 = 한 변의 길이.

let deckSide = 6

// [sig9] 9층 신호 지점으로 투입한다
player.onChat("sig9", function () {
    agent.teleport(world(-28, 26, 4), EAST)
    loops.pause(400)
    player.say("9층 진입. 바닥 붕괴")
})

// [deck] 네모난 착륙 발판을 만든다
player.onChat("deck", function () {
    agent.setSlot(1)
    loops.pause(200)
    for (let side = 0; side < 4; side++) {
        for (let i = 0; i < deckSide; i++) {
            agent.place(DOWN)
            loops.pause(300)
            agent.move(FORWARD, 1)
            loops.pause(300)
        }
        agent.turn(RIGHT_TURN)
        loops.pause(300)
    }
    player.say("착륙 발판 완성")
})

// ==========================================================
// 10차시
// ==========================================================

// 지하 10층 | 길을 표시하라 — 슬롯 전환 + 간격 변수
//
// 신호 좌표   0 / 22 / 22
// 준비물   에이전트 슬롯 1 → 통로용 블록,  슬롯 2 → 눈에 띄는 색 블록
// 새로 배우는 것   setSlot 으로 재료 바꾸기
// 관찰 포인트   슬롯 번호를 바꾸면 놓이는 블록이 정말 달라지는가?
//
// 10층은 갈림길이 많아서 지나온 길을 잃기 쉽다. 표식을 남겨야 한다.
// 에이전트 인벤토리는 칸(슬롯)마다 다른 블록이 들어 있다.
// setSlot 은 "몇 번 칸의 재료를 쓸지" 고르는 명령이다.

let tagCount = 5
let tagGap = 4

// [sig10] 10층 신호 지점으로 투입한다
player.onChat("sig10", function () {
    agent.teleport(world(0, 22, 22), WEST)
    loops.pause(400)
    player.say("10층 진입. 갈림길 다수")
})

// [tag] 일정 간격으로 경로 표식을 남긴다
player.onChat("tag", function () {
    for (let i = 0; i < tagCount; i++) {
        agent.setSlot(2)
        loops.pause(200)
        agent.destroy(DOWN)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, tagGap)
        loops.pause(400)
    }
    player.say("경로 표식 완료")
})

// [stripe] 두 가지 재료를 번갈아 깔아 줄무늬 경로를 만든다
player.onChat("stripe", function () {
    for (let i = 0; i < 6; i++) {
        agent.setSlot(1)
        loops.pause(200)
        agent.destroy(DOWN)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, 1)
        loops.pause(300)
        agent.setSlot(2)
        loops.pause(200)
        agent.destroy(DOWN)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, 1)
        loops.pause(300)
    }
    player.say("줄무늬 경로 완성")
})

// ==========================================================
// 11차시
// ==========================================================

// 지하 11층 | 전층 스캔 — 변수를 하나씩 늘린다
//
// 신호 좌표   -18 / 18 / -12
// 새로 배우는 것   변수 누적. 반복할 때마다 변수를 1씩 키운다
// 관찰 포인트   층이 내려갈 때마다 Y가 정확히 4씩 줄어드는가?
//
// 신호가 강해졌다. 관제실은 1층부터 11층까지 전부 다시 훑으라고 지시한다.
// 층마다 명령을 따로 만들면 11개가 필요하다. 하지만 변수를 하나씩 키우면 명령은 하나면 된다.
//
//   scanFloor 가 1 → 2 → 3 ... 으로 커지고
//   Y = 62 - scanFloor × 4 가 그때그때 다시 계산된다

let scanFloor = 1

// [sig11] 11층 신호 지점으로 투입한다
player.onChat("sig11", function () {
    agent.teleport(world(-18, 18, -12), WEST)
    loops.pause(400)
    player.say("11층 진입. 신호 강함")
})

// [scan] 1층부터 11층까지 순서대로 내려가며 좌표를 보고한다
player.onChat("scan", function () {
    scanFloor = 1
    for (let i = 0; i < 11; i++) {
        let scanY = 62 - scanFloor * 4
        agent.teleport(world(-12, scanY, 8), WEST)
        loops.pause(700)
        player.say(scanY)
        scanFloor = scanFloor + 1
    }
    player.say("전층 스캔 완료")
})

// ==========================================================
// 12차시
// ==========================================================

// 지하 12층 | 신호원 — 전체 통합
//
// 신호 좌표   -12 / 14 / 8   (갱도 바로 아래. 신호는 계속 발밑에 있었다)
// 준비물   슬롯 1 → 발판용 블록,  슬롯 2 → 글로우스톤
// 새로 배우는 것   지금까지 배운 좌표·변수·반복·조건을 하나의 루틴으로 잇기
// 관찰 포인트   4단계 중 하나만 순서를 바꾸면 결과가 어떻게 달라지는가?
//
// 마지막 층이다. 관제실은 착륙 지점을 만들고 신호원까지 접근하라고 지시한다.
// 새 명령은 없다. 이미 배운 것을 순서대로 잇는 것이 오늘의 과제다.

let missionFloor = 12
let deckSize = 5

// [dive12] 12층 진입 → 통로 확보 → 발판 설치 → 유도등 설치
player.onChat("dive12", function () {
    // 1단계 — 층 번호로 Y를 계산해서 투입한다
    let missionY = 62 - missionFloor * 4
    agent.teleport(world(-12, missionY, 8), WEST)
    loops.pause(600)
    player.say(missionY)

    // 2단계 — 막힌 곳은 치우고 빈 곳은 전진한다
    for (let i = 0; i < 10; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            agent.destroy(FORWARD)
            loops.pause(300)
            agent.collectAll()
            loops.pause(300)
        } else {
            agent.move(FORWARD, 1)
            loops.pause(300)
        }
    }
    player.say("통로 확보")

    // 3단계 — 네모난 착륙 발판을 만든다
    agent.setSlot(1)
    loops.pause(200)
    for (let side = 0; side < 4; side++) {
        for (let i = 0; i < deckSize; i++) {
            agent.destroy(DOWN)
            loops.pause(300)
            agent.place(DOWN)
            loops.pause(300)
            agent.move(FORWARD, 1)
            loops.pause(300)
        }
        agent.turn(RIGHT_TURN)
        loops.pause(300)
    }
    player.say("착륙 발판 완성")

    // 4단계 — 유도등을 심어 신호원까지 길을 낸다
    agent.setSlot(2)
    loops.pause(200)
    for (let i = 0; i < 3; i++) {
        agent.destroy(DOWN)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, 2)
        loops.pause(400)
    }
    player.say("신호원 도달")
})

// ============================================================
// 나만의 관제 루틴 — 여기부터는 직접 만든다
//
// 규칙 세 가지
//   1. 층은 변수로 정한다 (숫자를 코드 속에 흩어놓지 않는다)
//   2. 크기나 개수도 변수로 뺀다 (나중에 한 군데만 고치면 되게)
//   3. 완성 못 해도 된다. 무엇을 바꿨고 결과가 어떻게 달라졌는지 기록하면 성공이다
// ============================================================

let myFloor = 1
let mySize = 4

player.onChat("mine", function () {
    let myY = 62 - myFloor * 4
    agent.teleport(world(-12, myY, 8), WEST)
    loops.pause(600)
    player.say("나만의 관제 루틴 시작")

    // ↓ 이 아래에 명령을 직접 이어붙인다
    // agent.move(FORWARD, 1)
    // agent.destroy(DOWN)
    // agent.place(DOWN)
    // agent.turn(RIGHT_TURN)
    // agent.setSlot(1)

    player.say("루틴 종료")
})

