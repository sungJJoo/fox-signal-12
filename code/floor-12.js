// 지하 12층 | 신호원 — 통합 미션과 발표
//
// 신호 좌표      -12 / 14 / 8      갱도 바로 아래. 신호는 계속 발밑에 있었다
// 준비물         슬롯 1 → 석재,  슬롯 2 → 글로우스톤
// 새로 배우는 것  새 문법 없음. 지금까지 만든 것을 하나로 잇는다
// 관찰 포인트     단계 순서를 바꾸면 결과가 어떻게 달라지는가
//
// dive12 는 네 단계다. 각 단계는 전부 이전 차시에서 만든 것이다.
//
//   1단계  층 번호로 Y를 계산해 투입      5차시
//   2단계  막힌 곳을 세며 통로 확보       7차시
//   3단계  두 반복 변수로 착륙장 채우기    8차시
//   4단계  i 로 좌표를 계산해 유도등 설치  6차시

let missionFloor = 12
let deckW = 5
let deckD = 5
let hit = 0

// [dive12] 12층 진입 통합 루틴.  예)  dive12
player.onChat("dive12", function () {
    // 1단계 — 층 계산 투입
    let y = 62 - missionFloor * 4
    agent.teleport(world(-12, y, 8), WEST)
    loops.pause(600)
    player.say(y)

    // 2단계 — 막힌 곳을 세며 통로 확보
    hit = 0
    for (let i = 0; i < 10; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            hit = hit + 1
            agent.destroy(FORWARD)
            loops.pause(250)
            agent.collectAll()
            loops.pause(250)
        }
        agent.move(FORWARD, 1)
        loops.pause(250)
    }
    player.say("막힌 곳")
    loops.pause(300)
    player.say(hit)

    // 3단계 — 착륙장 채우기
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < deckW; i++) {
        for (let j = 0; j < deckD; j++) {
            agent.teleport(world(-24 + i, y, 4 + j), WEST)
            loops.pause(250)
            agent.destroy(DOWN)
            loops.pause(200)
            agent.place(DOWN)
            loops.pause(200)
        }
    }
    player.say("착륙장 완성")

    // 4단계 — 유도등 설치
    agent.setSlot(2)
    loops.pause(200)
    for (let i = 0; i < 4; i++) {
        agent.teleport(world(-22 - i * 2, y, 8), WEST)
        loops.pause(300)
        agent.destroy(DOWN)
        loops.pause(200)
        agent.place(DOWN)
        loops.pause(200)
    }
    player.say("신호원 도달")
})

// ============================================================
// 나만의 관제 루틴 — 여기부터 직접 만든다
//
// 규칙 세 가지
//   1. 층과 크기는 채팅으로 받는다. 코드에 숫자를 박지 않는다
//   2. 좌표는 계산으로 만든다. 손으로 세지 않는다
//   3. 완성 못 해도 된다. 무엇을 바꿨고 결과가 어떻게 달라졌는지 기록하면 성공이다
//
// 쓸 수 있는 재료
//   agent.teleport(world(x, y, z), WEST)
//   agent.move / turn / place / destroy / collectAll / setSlot
//   if (agent.detect(AgentDetection.Block, FORWARD)) { } else { }
//   for (let i = 0; i < n; i++) { }
//   let y = 62 - 층 * 4
//   변수 = 변수 + 1
// ============================================================

let myCount = 0

// [mine] 나만의 루틴.  예)  mine 9 6
// num1 = 층,  num2 = 크기
player.onChat("mine", function (num1, num2) {
    let y = 62 - num1 * 4
    let size = num2
    if (size < 1) {
        size = 1
    }
    agent.teleport(world(-12, y, 8), WEST)
    loops.pause(600)
    player.say("루틴 시작")
    myCount = 0

    // ↓ 여기에 직접 이어붙인다
    // for (let i = 0; i < size; i++) {
    //     agent.teleport(world(-12 - i, y, 8), WEST)
    //     loops.pause(300)
    //     agent.place(DOWN)
    //     loops.pause(200)
    //     myCount = myCount + 1
    // }

    player.say("루틴 종료")
    loops.pause(300)
    player.say(myCount)
})

// [sig12] 12층 신호 지점으로 투입
player.onChat("sig12", function () {
    agent.teleport(world(-12, 14, 8), WEST)
    loops.pause(400)
    player.say("12층 도착")
})
