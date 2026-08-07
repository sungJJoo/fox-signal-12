// 지하 2층 | 첫 하강 — Y가 곧 깊이다
//
// 신호 좌표   -12 / 54 / 14
// 새로 배우는 것   위아래 이동. Y 숫자가 줄면 더 깊은 곳이다
// 관찰 포인트   dive 한 번에 Y가 얼마나 줄어드는가?

// [dive] 한 층 내려간다
player.onChat("dive", function () {
    for (let i = 0; i < 4; i++) {
        agent.move(DOWN, 1)
        loops.pause(300)
    }
    player.say("한 층 하강")
})

// [rise] 한 층 올라온다
player.onChat("rise", function () {
    for (let i = 0; i < 4; i++) {
        agent.move(UP, 1)
        loops.pause(300)
    }
    player.say("한 층 상승")
})
