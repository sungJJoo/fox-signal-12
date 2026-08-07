// 지하 7층 | 무너진 통로 — 조건 판단
//
// 신호 좌표   -24 / 34 / 20
// 새로 배우는 것   if / else 와 detect. 상황을 보고 다르게 행동하기
// 관찰 포인트   같은 [clear] 명령인데 막힌 곳과 뚫린 곳에서 왜 다르게 움직이는가?
//
// 7층 통로는 군데군데 무너져 있다. 어디가 막혔는지 관제실에서는 알 수 없다.
// 그래서 "막혔으면 치우고, 안 막혔으면 나아간다"는 판단을 에이전트에게 맡긴다.

let steps = 12

// [sig7] 7층 신호 지점으로 투입한다
player.onChat("sig7", function () {
    agent.teleport(world(-24, 34, 20), EAST)
    loops.pause(400)
    player.say("7층 진입. 통로 붕괴 확인")
})

// [clear] 막혔으면 치우고, 비었으면 전진한다
player.onChat("clear", function () {
    for (let i = 0; i < steps; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            agent.destroy(FORWARD)
            loops.pause(300)
            agent.collectAll()
            loops.pause(300)
        } else {
            agent.move(FORWARD, 1)
            loops.pause(300)
        }
    }
    player.say("통로 확보")
})
