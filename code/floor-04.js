// 지하 4층 | 숫자에 이름 붙이기 — 변수
//
// 신호 좌표   -20 / 46 / 8
// 새로 배우는 것   변수. 숫자를 코드 안에 흩어놓지 않고 한 곳에 모은다
// 관찰 포인트   맨 위 숫자 세 개만 바꿔도 에이전트가 다른 곳으로 가는가?
//
// 층이 바뀔 때마다 코드 속 숫자를 찾아서 고치는 건 귀찮고 실수도 난다.
// 숫자에 이름을 붙여 맨 위에 모아두면, 고칠 곳이 한 군데뿐이다.

let signalX = -20
let signalY = 46
let signalZ = 8

// [go4] 변수에 적힌 좌표로 투입한다
player.onChat("go4", function () {
    agent.teleport(world(signalX, signalY, signalZ), WEST)
    loops.pause(400)
    player.say(signalY)
})
