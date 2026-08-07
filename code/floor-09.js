// 지하 9층 | 바닥이 없다 — 이중 반복 + 변수
//
// 신호 좌표   -28 / 26 / 4
// 준비물   에이전트 슬롯 1 → 발판용 블록
// 새로 배우는 것   반복 안에 반복 넣기. 한 변의 길이를 변수로
// 관찰 포인트   deckSide 숫자와 한 변의 칸 수가 같은가? 블록은 몇 개 필요한가?
//
// 9층은 바닥이 통째로 내려앉았다. 네모난 착륙 발판을 만들어야 한다.
// 한 변을 놓고 오른쪽으로 도는 것을 네 번 반복하면 사각형이 된다.
// 바깥 반복 = 변의 개수(4), 안쪽 반복 = 한 변의 길이.

let deckSide = 6

// [sig9] 9층 신호 지점으로 투입한다
player.onChat("sig9", function () {
    agent.teleport(world(-28, 26, 4), EAST)
    loops.pause(400)
    player.say("9층 진입. 바닥 붕괴")
})

// [deck] 네모난 착륙 발판을 만든다
player.onChat("deck", function () {
    agent.setSlot(1)
    loops.pause(200)
    for (let side = 0; side < 4; side++) {
        for (let i = 0; i < deckSide; i++) {
            agent.place(DOWN)
            loops.pause(300)
            agent.move(FORWARD, 1)
            loops.pause(300)
        }
        agent.turn(RIGHT_TURN)
        loops.pause(300)
    }
    player.say("착륙 발판 완성")
})
