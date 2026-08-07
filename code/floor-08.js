// 지하 8층 | 면을 채운다 — 반복 변수 두 개
//
// 신호 좌표      -6 / 30 / -10
// 준비물         슬롯 1 → 석재 64개
// 새로 배우는 것  i 와 j 를 각각 다른 좌표축에 쓴다
// 관찰 포인트     i 와 j 를 서로 바꿔 넣으면 결과가 어떻게 달라지는가
//
// 6층에서는 i 하나로 선을 만들었다. 반복을 하나 더 겹치고
// 두 개의 반복 변수를 X와 Z에 나눠 주면 면이 된다.
//
//     for i  (가로)
//         for j  (세로)
//             world(baseX + i, y, baseZ + j)
//
// 8층은 물에 잠겼다. 한 줄 다리로는 못 건넌다. 넓은 부교가 필요하다.

let baseX = -10
let baseZ = -8

// [line] 한 줄만 깐다. 6층 방식 복습.  예)  line 10
player.onChat("line", function (num1) {
    let len = num1
    if (len < 1) {
        len = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < len; i++) {
        agent.teleport(world(baseX + i, 30, baseZ), WEST)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(250)
    }
    player.say("한 줄 완성")
})

// [raft] 가로 num1 x 세로 num2 부교를 만든다.  예)  raft 8 10
player.onChat("raft", function (num1, num2) {
    let w = num1
    let d = num2
    if (w < 1) {
        w = 1
    }
    if (d < 1) {
        d = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < d; j++) {
            agent.teleport(world(baseX + i, 30, baseZ + j), WEST)
            loops.pause(250)
            agent.place(DOWN)
            loops.pause(200)
        }
    }
    player.say("부교 완성")
})

// [need] 부교에 블록이 몇 개 필요한지 미리 계산해서 보고한다.  예)  need 8 10
player.onChat("need", function (num1, num2) {
    let total = num1 * num2
    player.say("필요 블록")
    loops.pause(300)
    player.say(total)
    if (total > 64) {
        player.say("인벤토리 부족")
    } else {
        player.say("설치 가능")
    }
})

// [frame] 테두리만 두른다. 안쪽은 비운다.  예)  frame 8 10
player.onChat("frame", function (num1, num2) {
    let w = num1
    let d = num2
    if (w < 2) {
        w = 2
    }
    if (d < 2) {
        d = 2
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < w; i++) {
        agent.teleport(world(baseX + i, 30, baseZ), WEST)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(200)
        agent.teleport(world(baseX + i, 30, baseZ + d - 1), WEST)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(200)
    }
    for (let j = 0; j < d; j++) {
        agent.teleport(world(baseX, 30, baseZ + j), WEST)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(200)
        agent.teleport(world(baseX + w - 1, 30, baseZ + j), WEST)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(200)
    }
    player.say("테두리 완성")
})

// [sig8] 8층 신호 지점으로 투입
player.onChat("sig8", function () {
    agent.teleport(world(-6, 30, -10), SOUTH)
    loops.pause(400)
    player.say("8층 진입. 침수 확인")
})
