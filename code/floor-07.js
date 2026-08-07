// 지하 7층 | 막힌 곳을 센다 — 조건 안에서 변수 키우기
//
// 신호 좌표      -24 / 34 / 20
// 새로 배우는 것  if 안에서 변수를 1씩 키운다. 결과를 숫자로 보고한다
// 관찰 포인트     같은 구간을 두 번 지나가면 count 가 같게 나오는가
//
// 1탄의 조건 판단은 "막히면 부수고 아니면 간다"까지였다. 결과가 남지 않았다.
// 관제실은 보고를 받아야 한다. 몇 군데가 막혀 있었는지 숫자로 알아야 한다.
//
//     blocked = blocked + 1
//
// 조건이 참일 때마다 변수를 1씩 키우면 그게 곧 개수가 된다.

let blocked = 0
let opened = 0

// [count] num1 칸 가면서 막힌 곳이 몇 군데인지 세서 보고한다.  예)  count 12
player.onChat("count", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    blocked = 0
    opened = 0
    for (let i = 0; i < steps; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            blocked = blocked + 1
            agent.destroy(FORWARD)
            loops.pause(250)
            agent.collectAll()
            loops.pause(250)
        } else {
            opened = opened + 1
        }
        agent.move(FORWARD, 1)
        loops.pause(250)
    }
    player.say("막힌 곳")
    loops.pause(300)
    player.say(blocked)
    loops.pause(300)
    player.say("뚫린 곳")
    loops.pause(300)
    player.say(opened)
})

// [clear] num1 칸 뚫으며 전진한다. 세지는 않는다.  예)  clear 15
player.onChat("clear", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    for (let i = 0; i < steps; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            agent.destroy(FORWARD)
            loops.pause(250)
            agent.collectAll()
            loops.pause(250)
        } else {
            agent.move(FORWARD, 1)
            loops.pause(250)
        }
    }
    player.say("통로 확보")
})

// [free] 지금 자리에서 열린 방향이 몇 개인지 센다
player.onChat("free", function () {
    opened = 0
    if (agent.detect(AgentDetection.Block, FORWARD)) {
        player.say("앞 막힘")
    } else {
        opened = opened + 1
    }
    if (agent.detect(AgentDetection.Block, BACK)) {
        player.say("뒤 막힘")
    } else {
        opened = opened + 1
    }
    if (agent.detect(AgentDetection.Block, LEFT)) {
        player.say("왼쪽 막힘")
    } else {
        opened = opened + 1
    }
    if (agent.detect(AgentDetection.Block, RIGHT)) {
        player.say("오른쪽 막힘")
    } else {
        opened = opened + 1
    }
    player.say("열린 방향")
    loops.pause(300)
    player.say(opened)
})

// [away] 막히면 부수지 않고 오른쪽으로 돌아서 피해 간다.  예)  away 10
player.onChat("away", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    blocked = 0
    for (let i = 0; i < steps; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            blocked = blocked + 1
            agent.turn(RIGHT_TURN)
            loops.pause(250)
        } else {
            agent.move(FORWARD, 1)
            loops.pause(250)
        }
    }
    player.say("우회 횟수")
    loops.pause(300)
    player.say(blocked)
})

// [sig7] 7층 신호 지점으로 투입
player.onChat("sig7", function () {
    agent.teleport(world(-24, 34, 20), EAST)
    loops.pause(400)
    player.say("7층 진입. 통로 붕괴")
})
