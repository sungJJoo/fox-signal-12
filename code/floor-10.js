// 지하 10층 | 거리를 계산한다 — 두 좌표의 차
//
// 신호 좌표      0 / 22 / 22
// 준비물         슬롯 1 → 석재,  슬롯 2 → 눈에 띄는 색 블록
// 새로 배우는 것  좌표끼리 빼서 거리를 구한다. 부호가 방향을 알려준다
// 관찰 포인트     dist 결과가 음수로 나오면 어느 쪽으로 가야 하는가
//
// 지금까지는 몇 칸을 갈지 눈대중으로 정했다. 계산하면 정확히 알 수 있다.
//
//     dx = 목표X - 지금X
//     dz = 목표Z - 지금Z
//
// dx 가 양수면 X가 커지는 쪽, 음수면 작아지는 쪽이다.
// 10층은 갈림길이 많다. 길이를 재고 그만큼만 깔아야 재료가 남는다.

let shaftX = -12
let shaftZ = 8

// [dist] 갱도에서 목표 지점까지의 X차이, Z차이를 보고한다.  예)  dist 0 22
player.onChat("dist", function (num1, num2) {
    let dx = num1 - shaftX
    let dz = num2 - shaftZ
    player.say("X 차이")
    loops.pause(300)
    player.say(dx)
    loops.pause(400)
    player.say("Z 차이")
    loops.pause(300)
    player.say(dz)
})

// [roadx] X 방향으로 num1 칸 길을 깐다. num2 는 방향 (1이면 커지는 쪽, 그 외는 작아지는 쪽)
// 예)  roadx 12 1
player.onChat("roadx", function (num1, num2) {
    let len = num1
    if (len < 1) {
        len = 1
    }
    let step = -1
    if (num2 == 1) {
        step = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < len; i++) {
        agent.teleport(world(shaftX + i * step, 22, shaftZ), WEST)
        loops.pause(300)
        agent.destroy(DOWN)
        loops.pause(200)
        agent.place(DOWN)
        loops.pause(200)
    }
    player.say("가로 길 완성")
})

// [roadz] Z 방향으로 num1 칸 길을 깐다. num2 는 방향.  예)  roadz 14 1
player.onChat("roadz", function (num1, num2) {
    let len = num1
    if (len < 1) {
        len = 1
    }
    let step = -1
    if (num2 == 1) {
        step = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < len; i++) {
        agent.teleport(world(shaftX, 22, shaftZ + i * step), WEST)
        loops.pause(300)
        agent.destroy(DOWN)
        loops.pause(200)
        agent.place(DOWN)
        loops.pause(200)
    }
    player.say("세로 길 완성")
})

// [tag] 갱도에서 X 방향으로 num1 개 표식을 num2 칸 간격으로 남긴다.  예)  tag 5 4
player.onChat("tag", function (num1, num2) {
    let count = num1
    let gap = num2
    if (count < 1) {
        count = 1
    }
    if (gap < 1) {
        gap = 1
    }
    agent.setSlot(2)
    loops.pause(200)
    for (let i = 0; i < count; i++) {
        agent.teleport(world(shaftX + i * gap, 22, shaftZ), WEST)
        loops.pause(300)
        agent.destroy(DOWN)
        loops.pause(200)
        agent.place(DOWN)
        loops.pause(200)
    }
    player.say("경로 표식 완료")
})

// [sig10] 10층 신호 지점으로 투입
player.onChat("sig10", function () {
    agent.teleport(world(0, 22, 22), WEST)
    loops.pause(400)
    player.say("10층 진입. 갈림길 다수")
})
