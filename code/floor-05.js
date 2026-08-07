// 지하 5층 | 층 계산기 — 변수끼리 계산한다      ★ 핵심 차시
//
// 신호 좌표      -12 / 42 / -10
// 새로 배우는 것  규칙을 식으로 만들어 코드에 넣는다
// 관찰 포인트     층 번호 하나만 주면 열두 개 층 어디든 갈 수 있는가
//
// 지금까지는 층마다 Y를 표에서 찾아 손으로 쳤다. 그런데 규칙이 있다.
//
//     58 · 54 · 50 · 46 · 42 ...   4씩 줄어든다
//     0층이 있다면 62일 것이다
//
//              Y = 62 - 층 x 4
//
// 규칙을 코드로 쓰면 표가 필요 없다. 층 번호 하나만 있으면 된다.
// 곱하기가 빼기 안에 들어가야 한다. 순서를 틀리면 결과가 어긋난다.

let floorNow = 5

// [depth] 층 번호를 주면 Y만 계산해서 알려준다. 이동은 안 한다.  예)  depth 9
player.onChat("depth", function (num1) {
    let y = 62 - num1 * 4
    player.say(num1)
    loops.pause(300)
    player.say(y)
})

// [floor] 층 번호만 주면 계산해서 그 층 갱도로 투입한다.  예)  floor 9
player.onChat("floor", function (num1) {
    floorNow = num1
    let y = 62 - floorNow * 4
    agent.teleport(world(-12, y, 8), WEST)
    loops.pause(500)
    player.say(floorNow)
    loops.pause(300)
    player.say(y)
})

// [at] 층과 X, Z 를 함께 준다. Y는 코드가 계산한다.  예)  at 7 -24 20
player.onChat("at", function (num1, num2, num3) {
    let y = 62 - num1 * 4
    agent.teleport(world(num2, y, num3), WEST)
    loops.pause(500)
    player.say("투입 완료")
    loops.pause(300)
    player.say(y)
})

// [build] num1 층 갱도 옆에 한 변 num2 짜리 발판을 만든다.  예)  build 9 6
// 층 계산과 1탄에서 하던 발판 만들기를 하나로 잇는다
player.onChat("build", function (num1, num2) {
    let y = 62 - num1 * 4
    let side = num2
    if (side < 2) {
        side = 2
    }
    agent.teleport(world(-12, y, 8), WEST)
    loops.pause(500)
    agent.setSlot(1)
    loops.pause(200)
    for (let turn = 0; turn < 4; turn++) {
        for (let i = 0; i < side; i++) {
            if (agent.detect(AgentDetection.Block, DOWN)) {
                agent.destroy(DOWN)
                loops.pause(250)
            }
            agent.place(DOWN)
            loops.pause(250)
            agent.move(FORWARD, 1)
            loops.pause(250)
        }
        agent.turn(RIGHT_TURN)
        loops.pause(250)
    }
    player.say(y)
    player.say("발판 완성")
})

// [sig5] 5층 신호 지점으로 투입
player.onChat("sig5", function () {
    agent.teleport(world(-12, 42, -10), SOUTH)
    loops.pause(400)
    player.say("5층 신호 지점 도착")
})
