// 지하 5층 | 층 계산기 — 규칙을 코드로 만든다
//
// 신호 좌표   -12 / 42 / -2
// 새로 배우는 것   변수끼리 계산하기
// 관찰 포인트   targetFloor 를 1부터 12까지 바꾸면 Y가 규칙대로 나오는가?
//
// 지금까지 층마다 Y를 표에서 찾아 적었다. 그런데 규칙이 있다.
//
//        Y = 62 - 층 × 4
//
// 규칙을 코드로 쓰면 표가 필요 없다. 층 번호 하나만 바꾸면 된다.
// 이게 코드가 "확장된다"는 뜻이다.

let targetFloor = 5

// [floor] 층 번호만 보고 Y를 계산해서 갱도로 투입한다
player.onChat("floor", function () {
    let depth = 62 - targetFloor * 4
    agent.teleport(world(-12, depth, 8), WEST)
    loops.pause(400)
    player.say(depth)
})

// [sig5] 5층 신호 지점으로 직접 간다
player.onChat("sig5", function () {
    agent.teleport(world(-12, 42, -2), WEST)
    loops.pause(400)
    player.say("5층 신호 지점 도착")
})
