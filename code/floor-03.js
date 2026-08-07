// 지하 3층 | 좌표 투입 — 절대 좌표로 직접 보낸다
//
// 신호 좌표   -4 / 50 / 8
// 새로 배우는 것   agent.teleport 와 world(x, y, z)
// 관찰 포인트   dive 를 여러 번 한 것과 drop 한 번은 무엇이 다른가?
//
// world(x, y, z) 는 지도 위의 절대 좌표다. 에이전트가 어디 있든 그 지점으로 간다.
// pos(x, y, z) 는 내 위치에서 얼마나 떨어졌는지를 뜻한다. 둘은 완전히 다르다.

// [drop] 3층 신호 지점으로 곧장 투입한다
player.onChat("drop", function () {
    agent.teleport(world(-4, 50, 8), WEST)
    loops.pause(400)
    player.say("3층 신호 지점 도착")
})

// [home] 1층 갱도 입구로 복귀시킨다
player.onChat("home", function () {
    agent.teleport(world(-12, 58, 8), WEST)
    loops.pause(400)
    player.say("갱도 입구 복귀")
})
