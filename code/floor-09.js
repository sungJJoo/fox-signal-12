// 지하 9층 | 값을 쌓아간다 — 변수 누적
//
// 신호 좌표      -25 / 26 / 7      무너진 바닥 한가운데 섬처럼 남아 있다
// 준비물         슬롯 1 → 석재 64개
// 새로 배우는 것  변수를 내가 직접 키운다. 합계를 만든다
// 관찰 포인트     sum 은 반복할 때마다 어떻게 변하는가
//
// 6층의 i 는 for 가 알아서 1씩 키워줬다. 내가 정할 수 없었다.
// 이제 내가 만든 변수를 내가 원하는 만큼 키운다.
//
//     sum = sum + 24     한 번 돌 때마다 24씩 쌓인다
//     f   = f + 1        한 번 돌 때마다 한 층씩 내려간다
//
// 9층은 바닥이 내려앉았다. 여러 층을 점검하고 재료가 얼마나 드는지 계산해야 한다.

let sum = 0
let scanFloor = 1

// [total] num1 개 층에 한 변 num2 짜리 발판을 놓으면 블록이 총 몇 개 드는지 쌓아간다
// 예)  total 4 6
player.onChat("total", function (num1, num2) {
    let floors = num1
    let side = num2
    if (floors < 1) {
        floors = 1
    }
    if (side < 2) {
        side = 2
    }
    sum = 0
    for (let i = 0; i < floors; i++) {
        sum = sum + side * 4
        player.say(sum)
        loops.pause(500)
    }
    player.say("총 블록 수")
    loops.pause(300)
    player.say(sum)
})

// [down] num1 층부터 num2 층까지 한 층씩 내려가며 좌표를 보고한다.  예)  down 1 9
player.onChat("down", function (num1, num2) {
    scanFloor = num1
    if (scanFloor < 1) {
        scanFloor = 1
    }
    let last = num2
    if (last < scanFloor) {
        last = scanFloor
    }
    for (let i = 0; i < last - scanFloor + 1; i++) {
        let y = 62 - scanFloor * 4
        agent.teleport(world(-12, y, 8), WEST)
        loops.pause(600)
        player.say(scanFloor)
        loops.pause(200)
        player.say(y)
        scanFloor = scanFloor + 1
    }
    player.say("하강 점검 완료")
})

// [up] 아래에서 위로 올라오며 점검한다.  예)  up 9 1
player.onChat("up", function (num1, num2) {
    scanFloor = num1
    let last = num2
    if (last > scanFloor) {
        last = scanFloor
    }
    for (let i = 0; i < scanFloor - last + 1; i++) {
        let y = 62 - scanFloor * 4
        agent.teleport(world(-12, y, 8), WEST)
        loops.pause(600)
        player.say(scanFloor)
        loops.pause(200)
        player.say(y)
        scanFloor = scanFloor - 1
    }
    player.say("상승 점검 완료")
})

// [deck9] 9층 붕괴 구간에 한 변 num1 짜리 발판을 만든다.  예)  deck9 6
player.onChat("deck9", function (num1) {
    let side = num1
    if (side < 2) {
        side = 2
    }
    agent.teleport(world(-28, 26, 4), EAST)
    loops.pause(500)
    agent.setSlot(1)
    loops.pause(200)
    sum = 0
    for (let turn = 0; turn < 4; turn++) {
        for (let i = 0; i < side; i++) {
            agent.place(DOWN)
            loops.pause(250)
            sum = sum + 1
            agent.move(FORWARD, 1)
            loops.pause(250)
        }
        agent.turn(RIGHT_TURN)
        loops.pause(250)
    }
    player.say("사용한 블록")
    loops.pause(300)
    player.say(sum)
})

// [sig9] 9층 신호 지점으로 투입. 붕괴 구멍 한가운데 남은 섬이다
player.onChat("sig9", function () {
    agent.teleport(world(-25, 26, 7), EAST)
    loops.pause(400)
    player.say("9층 진입. 바닥 붕괴")
})

// [edge] 발판을 놓기 시작할 붕괴 가장자리로 간다. deck9 는 여기서 시작한다
player.onChat("edge", function () {
    agent.teleport(world(-28, 26, 4), EAST)
    loops.pause(400)
    player.say("붕괴 가장자리 도착")
})
