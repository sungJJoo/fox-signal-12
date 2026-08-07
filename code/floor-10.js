// 지하 10층 | 길을 표시하라 — 슬롯 전환 + 간격 변수
//
// 신호 좌표   0 / 22 / 22
// 준비물   에이전트 슬롯 1 → 통로용 블록,  슬롯 2 → 눈에 띄는 색 블록
// 새로 배우는 것   setSlot 으로 재료 바꾸기
// 관찰 포인트   슬롯 번호를 바꾸면 놓이는 블록이 정말 달라지는가?
//
// 10층은 갈림길이 많아서 지나온 길을 잃기 쉽다. 표식을 남겨야 한다.
// 에이전트 인벤토리는 칸(슬롯)마다 다른 블록이 들어 있다.
// setSlot 은 "몇 번 칸의 재료를 쓸지" 고르는 명령이다.

let tagCount = 5
let tagGap = 4

// [sig10] 10층 신호 지점으로 투입한다
player.onChat("sig10", function () {
    agent.teleport(world(0, 22, 22), WEST)
    loops.pause(400)
    player.say("10층 진입. 갈림길 다수")
})

// [tag] 일정 간격으로 경로 표식을 남긴다
player.onChat("tag", function () {
    for (let i = 0; i < tagCount; i++) {
        agent.setSlot(2)
        loops.pause(200)
        agent.destroy(DOWN)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, tagGap)
        loops.pause(400)
    }
    player.say("경로 표식 완료")
})

// [stripe] 두 가지 재료를 번갈아 깔아 줄무늬 경로를 만든다
player.onChat("stripe", function () {
    for (let i = 0; i < 6; i++) {
        agent.setSlot(1)
        loops.pause(200)
        agent.destroy(DOWN)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, 1)
        loops.pause(300)
        agent.setSlot(2)
        loops.pause(200)
        agent.destroy(DOWN)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(300)
        agent.move(FORWARD, 1)
        loops.pause(300)
    }
    player.say("줄무늬 경로 완성")
})
