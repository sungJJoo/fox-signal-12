// 지하 6층 | 반복 변수를 좌표에 쓴다      ★ 핵심 차시
//
// 신호 좌표      0 / 38 / 16
// 준비물         슬롯 1 → 글로우스톤(발광석)
// 새로 배우는 것  for 의 i 를 좌표 계산에 넣는다
// 관찰 포인트     이동하며 놓는 것과 좌표를 찍어서 놓는 것은 무엇이 다른가
//
// 1탄에서 i 는 "몇 번 했는지" 세는 데만 썼다. 실제로 쓰지는 않았다.
// i 를 좌표에 곱하면 매번 다른 자리로 정확히 보낼 수 있다.
//
//     i = 0  →  X = -28 + 0 x 3 = -28
//     i = 1  →  X = -28 + 1 x 3 = -25
//     i = 2  →  X = -28 + 2 x 3 = -22
//
// 6층은 조명이 죽어 있다. 유도등을 정확한 자리에 심어야 한다.

// [row] X 방향으로 num1 개를 num2 칸 간격으로 심는다.  예)  row 6 3
player.onChat("row", function (num1, num2) {
    let count = num1
    let gap = num2
    if (count < 1) {
        count = 1
    }
    if (gap < 1) {
        gap = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < count; i++) {
        agent.teleport(world(-28 + i * gap, 38, 16), WEST)
        loops.pause(350)
        agent.destroy(DOWN)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(250)
    }
    player.say("가로 설치 완료")
})

// [col] Z 방향으로 num1 개를 num2 칸 간격으로 심는다.  예)  col 5 4
player.onChat("col", function (num1, num2) {
    let count = num1
    let gap = num2
    if (count < 1) {
        count = 1
    }
    if (gap < 1) {
        gap = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < count; i++) {
        agent.teleport(world(-12, 38, -12 + i * gap), WEST)
        loops.pause(350)
        agent.destroy(DOWN)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(250)
    }
    player.say("세로 설치 완료")
})

// [diag] i 를 X와 Z 두 곳에 함께 쓴다. 대각선으로 놓인다.  예)  diag 10
// 층 높이가 3칸뿐이라 Y에는 i 를 쓸 수 없다. 왜 그런지 생각해보자
player.onChat("diag", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < steps; i++) {
        agent.teleport(world(-24 + i, 38, 2 + i), WEST)
        loops.pause(350)
        agent.destroy(DOWN)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(250)
    }
    player.say("대각선 설치 완료")
})

// [drill] 1층부터 num1 층까지 한 층씩 내려가며 좌표를 보고한다.  예)  drill 6
// i 로 층 번호를 만들고, 그 층 번호로 다시 Y를 계산한다
player.onChat("drill", function (num1) {
    let last = num1
    if (last < 1) {
        last = 1
    }
    for (let i = 0; i < last; i++) {
        let f = i + 1
        let y = 62 - f * 4
        agent.teleport(world(-12, y, 8), WEST)
        loops.pause(600)
        player.say(y)
    }
    player.say("하강 점검 완료")
})

// [sig6] 6층 신호 지점으로 투입
player.onChat("sig6", function () {
    agent.teleport(world(0, 38, 16), WEST)
    loops.pause(400)
    player.say("6층 진입. 조명 없음")
})
