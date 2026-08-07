// 지하 8층 | 물이 찬 층 — 길이를 변수로
//
// 신호 좌표   -6 / 30 / -10
// 준비물   에이전트 슬롯 1 → 통로용 블록(석재 등)
// 새로 배우는 것   변수 하나로 결과물의 크기를 정한다
// 관찰 포인트   bridgeLength 숫자와 실제로 놓인 블록 개수가 정확히 같은가?
//
// 8층은 물에 잠겼다. 에이전트가 지나갈 안전 통로를 깔아야 한다.
// 물 위에는 아래가 비어 있으니 destroy 없이 place 만 해도 된다. 6층과 비교해보자.

let bridgeLength = 10

// [sig8] 8층 신호 지점으로 투입한다
player.onChat("sig8", function () {
    agent.teleport(world(-6, 30, -10), SOUTH)
    loops.pause(400)
    player.say("8층 진입. 침수 확인")
})

// [bridge] 안전 통로를 깐다
player.onChat("bridge", function () {
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < bridgeLength; i++) {
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, 1)
        loops.pause(300)
    }
    player.say("안전 통로 완성")
})
