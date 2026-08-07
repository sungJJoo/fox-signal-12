// 지하 3층 | 좌표를 채팅으로 — 매개변수 두세 개
//
// 신호 좌표      -26 / 50 / 2
// 새로 배우는 것  num1 · num2 · num3 — 숫자를 세 개까지 받는다
// 관찰 포인트     명령 하나가 몇 가지 결과를 만들 수 있는가
//
// 좌표는 숫자 세 개다. 채팅으로 세 개를 다 넘길 수 있다면
// 명령 하나로 이 월드 어디든 보낼 수 있다.
//
//     jump -26 2      3층 안에서 X, Z 만 지정 (Y는 코드에 박혀 있다)
//     warp -12 42 8   좌표 세 개를 전부 지정

// [jump] 3층 안에서 X, Z 만 지정해 이동.  예)  jump -26 2
player.onChat("jump", function (num1, num2) {
    agent.teleport(world(num1, 50, num2), WEST)
    loops.pause(400)
    player.say("3층 이동 완료")
})

// [warp] 좌표 세 개를 전부 채팅으로.  예)  warp -12 42 8
player.onChat("warp", function (num1, num2, num3) {
    agent.teleport(world(num1, num2, num3), WEST)
    loops.pause(400)
    player.say("좌표 투입 완료")
})

// [deck] 한 변이 num1 칸인 네모 발판을 만든다.  예)  deck 6
// 1탄에서 만들던 box 와 구조는 같다. 크기를 채팅으로 준다는 것만 다르다
player.onChat("deck", function (num1) {
    let side = num1
    if (side < 2) {
        side = 2
    }
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
    player.say(side)
    player.say("발판 완성")
})

// [tower] 높이 num1 짜리 사각 기둥을 세운다.  예)  tower 8
player.onChat("tower", function (num1) {
    let height = num1
    if (height < 1) {
        height = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let f = 0; f < height; f++) {
        for (let w = 0; w < 4; w++) {
            agent.place(FORWARD)
            loops.pause(250)
            agent.turn(RIGHT_TURN)
            loops.pause(250)
        }
        agent.move(UP, 1)
        loops.pause(250)
    }
    player.say(height)
    player.say("층 기둥 완성")
})

// [sig3] 3층 신호 지점으로 투입
player.onChat("sig3", function () {
    agent.teleport(world(-26, 50, 2), EAST)
    loops.pause(400)
    player.say("3층 신호 지점 도착")
})
