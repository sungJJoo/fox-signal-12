// 지하 2층 | 숫자를 실어 보낸다 — 채팅 명령 매개변수
//
// 신호 좌표      -4 / 54 / -6
// 새로 배우는 것  player.onChat 의 num1 — 채팅창에서 숫자를 받아온다
// 관찰 포인트     숫자를 안 주고 그냥 dive 만 치면 어떻게 되는가
//
// 1탄에서는 칸 수를 바꾸려면 MakeCode를 열어 숫자를 고치고 다시 저장했다.
// 이제는 채팅창에 이렇게 친다.
//
//     dive 3
//
// 그러면 3이 num1 안으로 들어온다. 코드는 한 번도 안 고친다.
// num1 은 첫 번째 숫자, num2 는 두 번째, num3 은 세 번째다.

// [dive] num1 층만큼 내려간다.  예)  dive 3
// 한 층은 4칸이다. 3층이면 12칸
player.onChat("dive", function (num1) {
    let downFloors = num1
    if (downFloors < 1) {
        downFloors = 1
    }
    for (let i = 0; i < downFloors * 4; i++) {
        agent.move(DOWN, 1)
        loops.pause(250)
    }
    player.say(downFloors)
    player.say("층 하강 완료")
})

// [rise] num1 층만큼 올라온다.  예)  rise 2
player.onChat("rise", function (num1) {
    let upFloors = num1
    if (upFloors < 1) {
        upFloors = 1
    }
    for (let i = 0; i < upFloors * 4; i++) {
        agent.move(UP, 1)
        loops.pause(250)
    }
    player.say(upFloors)
    player.say("층 상승 완료")
})

// [fwd] 앞으로 num1 칸 간다.  예)  fwd 10
player.onChat("fwd", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    for (let i = 0; i < steps; i++) {
        agent.move(FORWARD, 1)
        loops.pause(250)
    }
    player.say(steps)
})

// [dig] 앞으로 num1 칸 파며 전진한다.  예)  dig 8
player.onChat("dig", function (num1) {
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
        }
        agent.move(FORWARD, 1)
        loops.pause(250)
    }
    player.say("굴착 완료")
})

// [sig2] 2층 신호 지점으로 투입
player.onChat("sig2", function () {
    agent.teleport(world(-4, 54, -6), WEST)
    loops.pause(400)
    player.say("2층 신호 지점 도착")
})
