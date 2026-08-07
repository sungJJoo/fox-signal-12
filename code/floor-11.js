// 지하 11층 | 스스로 훑는다 — 전부 합친다      ★ 핵심 차시
//
// 신호 좌표      -18 / 18 / -12
// 준비물         슬롯 1 → 글로우스톤
// 새로 배우는 것  새 문법 없음. 매개변수 · 계산 · 반복 변수 · 누적을 한 명령 안에서 쓴다
// 관찰 포인트     명령 하나가 몇 개 층을 처리하는가
//
// 신호가 강해졌다. 12층 직전이다. 관제실은 마지막 점검을 지시한다.
// 층마다 명령을 만들면 열한 개다. 지금까지 배운 걸 합치면 하나면 된다.
//
//   매개변수    어느 층부터 어느 층까지인지 채팅으로 받는다
//   누적        층 번호를 1씩 키운다
//   계산        층 번호로 Y를 매번 다시 구한다
//   반복 변수   i 로 유도등 자리를 계산한다

let checkFloor = 1
let lampTotal = 0

// [scan] num1 층부터 num2 층까지 순서대로 훑으며 좌표를 보고한다.  예)  scan 1 11
player.onChat("scan", function (num1, num2) {
    checkFloor = num1
    if (checkFloor < 1) {
        checkFloor = 1
    }
    let last = num2
    if (last < checkFloor) {
        last = checkFloor
    }
    for (let i = 0; i < last - checkFloor + 1; i++) {
        let y = 62 - checkFloor * 4
        agent.teleport(world(-12, y, 8), WEST)
        loops.pause(600)
        player.say(y)
        checkFloor = checkFloor + 1
    }
    player.say("전층 스캔 완료")
})

// [light] num1 층 갱도에서 X 방향으로 유도등 num2 개를 num3 칸 간격으로 심는다
// 예)  light 11 6 3
player.onChat("light", function (num1, num2, num3) {
    let y = 62 - num1 * 4
    let count = num2
    let gap = num3
    if (count < 1) {
        count = 1
    }
    if (gap < 1) {
        gap = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < count; i++) {
        agent.teleport(world(-12 - i * gap, y, 8), WEST)
        loops.pause(350)
        agent.destroy(DOWN)
        loops.pause(200)
        agent.place(DOWN)
        loops.pause(200)
        lampTotal = lampTotal + 1
    }
    player.say("설치 누적")
    loops.pause(300)
    player.say(lampTotal)
})

// [relight] num1 층부터 num2 층까지 모든 층에 유도등 세 개씩 심는다.  예)  relight 6 11
// scan 과 light 를 하나로 합친 형태다
player.onChat("relight", function (num1, num2) {
    checkFloor = num1
    let last = num2
    if (last < checkFloor) {
        last = checkFloor
    }
    lampTotal = 0
    agent.setSlot(1)
    loops.pause(200)
    for (let f = 0; f < last - checkFloor + 1; f++) {
        let y = 62 - checkFloor * 4
        for (let i = 0; i < 3; i++) {
            agent.teleport(world(-12 - i * 4, y, 8), WEST)
            loops.pause(300)
            agent.destroy(DOWN)
            loops.pause(200)
            agent.place(DOWN)
            loops.pause(200)
            lampTotal = lampTotal + 1
        }
        player.say(y)
        checkFloor = checkFloor + 1
    }
    player.say("총 설치")
    loops.pause(300)
    player.say(lampTotal)
})

// [patrol] num1 층 홀의 네 귀퉁이를 순찰하며 감지 결과를 보고한다.  예)  patrol 11
player.onChat("patrol", function (num1) {
    let y = 62 - num1 * 4
    for (let i = 0; i < 4; i++) {
        if (i == 0) {
            agent.teleport(world(-28, y, -12), WEST)
        }
        if (i == 1) {
            agent.teleport(world(0, y, -12), WEST)
        }
        if (i == 2) {
            agent.teleport(world(0, y, 22), WEST)
        }
        if (i == 3) {
            agent.teleport(world(-28, y, 22), WEST)
        }
        loops.pause(600)
        if (agent.detect(AgentDetection.Block, DOWN)) {
            player.say("바닥 있음")
        } else {
            player.say("바닥 없음")
        }
    }
    player.say("순찰 완료")
})

// [sig11] 11층 신호 지점으로 투입
player.onChat("sig11", function () {
    agent.teleport(world(-18, 18, -12), WEST)
    loops.pause(400)
    player.say("11층 진입. 신호 강함")
})
