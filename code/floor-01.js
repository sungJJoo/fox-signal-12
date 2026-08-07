// 지하 1층 | 다시 만난 에이전트 — 절대 좌표
//
// 신호 좌표      -22 / 58 / 18
// 갱도 입구      -12 / 58 / 8
// 이미 아는 것    move · turn · place · destroy · collectAll · setSlot · for · if + detect
// 새로 배우는 것  world(x, y, z) 와 agent.teleport
// 관찰 포인트     go 와 near 는 어디로 가는가. 내가 자리를 옮긴 뒤 다시 실행하면?
//
// 1탄에서 쓰던 teleportToPlayer 는 언제나 "내 옆"으로 왔다.
// 지하는 내가 갈 수 없는 곳이다. 좌표를 찍어서 보내야 한다.
//
//   world(x, y, z)   지도 위의 그 지점. 내가 어디 있든 같은 곳
//   pos(x, y, z)     내 위치에서 그만큼 떨어진 곳. 내가 움직이면 같이 움직인다

// [back] 1탄에서 쓰던 소환. 비교용으로 남겨둔다
player.onChat("back", function () {
    agent.teleportToPlayer()
    loops.pause(400)
    player.say("에이전트 소환")
})

// [go] 갱도 입구로 절대 좌표 투입
player.onChat("go", function () {
    agent.teleport(world(-12, 58, 8), WEST)
    loops.pause(400)
    player.say("갱도 입구 도착")
})

// [near] 같은 숫자를 상대 좌표로 준다. go 와 무엇이 다른지 비교한다
player.onChat("near", function () {
    agent.teleport(pos(-12, 58, 8), WEST)
    loops.pause(400)
    player.say("상대 좌표 이동")
})

// [sig] 1층 신호 지점으로 투입
player.onChat("sig", function () {
    agent.teleport(world(-22, 58, 18), WEST)
    loops.pause(400)
    player.say("1층 신호 지점 도착")
})

// [look] 여섯 방향을 모두 감지해서 보고한다
// 1탄의 see 는 네 방향이었고 막혔을 때만 말했다. 이제 열렸을 때도 말한다
player.onChat("look", function () {
    if (agent.detect(AgentDetection.Block, FORWARD)) {
        player.say("앞 막힘")
    } else {
        player.say("앞 열림")
    }
    loops.pause(200)
    if (agent.detect(AgentDetection.Block, BACK)) {
        player.say("뒤 막힘")
    } else {
        player.say("뒤 열림")
    }
    loops.pause(200)
    if (agent.detect(AgentDetection.Block, LEFT)) {
        player.say("왼쪽 막힘")
    } else {
        player.say("왼쪽 열림")
    }
    loops.pause(200)
    if (agent.detect(AgentDetection.Block, RIGHT)) {
        player.say("오른쪽 막힘")
    } else {
        player.say("오른쪽 열림")
    }
    loops.pause(200)
    if (agent.detect(AgentDetection.Block, UP)) {
        player.say("위 막힘")
    } else {
        player.say("위 열림")
    }
    loops.pause(200)
    if (agent.detect(AgentDetection.Block, DOWN)) {
        player.say("아래 막힘")
    } else {
        player.say("아래 열림")
    }
    player.say("탐색 완료")
})
