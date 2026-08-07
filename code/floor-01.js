// 지하 1층 | 관제실 개소 — 좌표를 읽는다
//
// 신호 좌표   -12 / 58 / 8
// 새로 배우는 것   X · Y · Z 가 각각 무엇인지
// 관찰 포인트   내 좌표와 에이전트 좌표가 같은가?

// [mark] 에이전트를 내 옆으로 불러 관제 시작 지점을 잡는다
player.onChat("mark", function () {
    agent.teleportToPlayer()
    loops.pause(400)
    player.say("관제 시작 지점 확보")
})

// [spin] 제자리에서 한 바퀴 돌며 주변을 확인한다
player.onChat("spin", function () {
    for (let i = 0; i < 4; i++) {
        agent.turn(RIGHT_TURN)
        loops.pause(400)
    }
    player.say("주변 확인 완료")
})
