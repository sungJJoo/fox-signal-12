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
