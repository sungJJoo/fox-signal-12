// 지하 4층 | 값을 기억시킨다 — 변수
//
// 신호 좌표      0 / 46 / 20
// 준비물         슬롯 2 → 눈에 띄는 색 블록
// 새로 배우는 것  let 변수 — 명령이 끝나도 남는 값
// 관찰 포인트     set 으로 한 번 기억시키면 몇 개의 명령이 그 값을 쓰는가
//
// num1 은 명령이 실행되는 동안에만 산다. 명령이 끝나면 사라진다.
// 그래서 warp 로 간 자리를 mark 는 알 수가 없다. 매번 좌표를 다시 쳐야 한다.
//
// 여러 명령이 함께 쓸 값은 명령 바깥에 두어야 한다. 그게 변수다.
// 변수는 맨 위에 만든다. onChat 안에 만들면 명령이 끝날 때 같이 사라진다.

let targetX = 0
let targetY = 46
let targetZ = 20

// [set] 목표 좌표를 기억시킨다.  예)  set 0 46 20
player.onChat("set", function (num1, num2, num3) {
    targetX = num1
    targetY = num2
    targetZ = num3
    player.say("좌표 기억 완료")
})

// [show] 기억한 좌표를 보고한다. 숫자를 안 줘도 대답한다
player.onChat("show", function () {
    player.say(targetX)
    loops.pause(300)
    player.say(targetY)
    loops.pause(300)
    player.say(targetZ)
})

// [move] 기억한 좌표로 이동한다. 좌표를 다시 칠 필요가 없다
player.onChat("move", function () {
    agent.teleport(world(targetX, targetY, targetZ), WEST)
    loops.pause(400)
    player.say("기억한 좌표로 이동")
})

// [mark] 기억한 좌표에 표식을 설치한다. move 와 같은 값을 쓴다
player.onChat("mark", function () {
    agent.teleport(world(targetX, targetY, targetZ), WEST)
    loops.pause(400)
    agent.setSlot(2)
    loops.pause(200)
    agent.destroy(DOWN)
    loops.pause(250)
    agent.place(DOWN)
    loops.pause(250)
    player.say("표식 설치 완료")
})

// [home] 기억한 층의 갱도 입구로 복귀한다. Y만 기억한 값을 쓴다
player.onChat("home", function () {
    agent.teleport(world(-12, targetY, 8), WEST)
    loops.pause(400)
    player.say("갱도 복귀")
})

// [ring] 기억한 좌표를 중심으로 표식 네 개를 num1 칸 떨어뜨려 놓는다.  예)  ring 5
player.onChat("ring", function (num1) {
    let gap = num1
    if (gap < 1) {
        gap = 1
    }
    agent.setSlot(2)
    loops.pause(200)
    agent.teleport(world(targetX + gap, targetY, targetZ), WEST)
    loops.pause(350)
    agent.destroy(DOWN)
    loops.pause(250)
    agent.place(DOWN)
    loops.pause(250)
    agent.teleport(world(targetX - gap, targetY, targetZ), WEST)
    loops.pause(350)
    agent.destroy(DOWN)
    loops.pause(250)
    agent.place(DOWN)
    loops.pause(250)
    agent.teleport(world(targetX, targetY, targetZ + gap), WEST)
    loops.pause(350)
    agent.destroy(DOWN)
    loops.pause(250)
    agent.place(DOWN)
    loops.pause(250)
    agent.teleport(world(targetX, targetY, targetZ - gap), WEST)
    loops.pause(350)
    agent.destroy(DOWN)
    loops.pause(250)
    agent.place(DOWN)
    loops.pause(250)
    player.say("사방 표식 완료")
})
