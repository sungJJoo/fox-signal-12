// 지하 6층 | 꺼진 조명 — 개수와 간격을 변수로
//
// 신호 좌표   0 / 38 / 16
// 준비물   에이전트 슬롯 1 → 글로우스톤(발광석)
// 새로 배우는 것   반복 횟수와 이동 거리를 변수로 빼기
// 관찰 포인트   lampGap 을 바꾸면 유도등 간격이 정말 그만큼 달라지는가?
//
// 6층은 조명이 죽어 있다. 바닥 블록을 발광석으로 갈아끼워 유도등을 심는다.
// destroy 로 바닥을 걷어낸 다음 place 로 채워야 한다. 순서가 바뀌면 설치가 안 된다.

let lampCount = 5
let lampGap = 3

// [sig6] 6층 신호 지점으로 투입한다
player.onChat("sig6", function () {
    agent.teleport(world(0, 38, 16), WEST)
    loops.pause(400)
    player.say("6층 진입. 조명 없음")
})

// [light] 유도등을 일정 간격으로 심는다
player.onChat("light", function () {
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < lampCount; i++) {
        agent.destroy(DOWN)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, lampGap)
        loops.pause(400)
    }
    player.say("유도등 설치 완료")
})
