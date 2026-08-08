// 에이전트와 함께해요 2 | 지하 12층 — 신호를 따라서
// 1~12차시 누적 통합본 | 폭스러닝센터 AI 연구소
//
// 수업에서는 차시별 파일(floor-01.js ~ floor-12.js)을 하나씩 이어 붙인다.
// 이 파일은 연구원이 전체 흐름을 확인하거나 진도를 따라잡을 때 쓴다.
//
// [전제]  1탄 「에이전트와 함께해요」 수료 수준
//   move · turn · place · destroy · collectAll · setSlot · for · if + detect · 중첩 반복
//
// [이 프로그램에서 새로 배우는 것]
//   1차시  world(x,y,z) + agent.teleport      절대 좌표
//   2차시  onChat 의 num1                     채팅으로 숫자 넘기기
//   3차시  num1 num2 num3                     매개변수 여러 개
//   4차시  let 변수                            명령이 끝나도 남는 값
//   5차시  Y = 62 - 층 x 4                    변수끼리 계산      ★
//   6차시  world(base + i * gap, ...)         반복 변수를 좌표에  ★
//   7차시  조건 안에서 변수 키우기               개수를 세서 보고
//   8차시  i 와 j 를 각각 다른 축에              면 채우기
//   9차시  sum = sum + x                      누적 합계
//  10차시  dx = 목표 - 현재                    거리 계산
//  11차시  전부 합치기                                            ★
//  12차시  통합 미션과 발표
//
// [층 -> Y 규칙]  Y = 62 - 층 x 4
//   1층 58 · 2층 54 · 3층 50 · 4층 46 · 5층 42 · 6층 38
//   7층 34 · 8층 30 · 9층 26 · 10층 22 · 11층 18 · 12층 14
//
// [MakeCode 붙여넣기]  JS 탭에 통째로 붙여넣은 뒤 Blocks 탭으로 전환한다.
//   회색 JS 블록이 하나라도 나오면 그 문법을 교체해야 한다. code/README.md 참고.



// ==========================================================
// 1차시
// ==========================================================

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

// ==========================================================
// 2차시
// ==========================================================

// 지하 2층 | 숫자를 실어 보낸다 — 채팅 명령 매개변수
//
// 신호 좌표      -4 / 54 / -6
// 새로 배우는 것  player.onChat 의 num1 — 채팅창에서 숫자를 받아온다
// 관찰 포인트     숫자를 안 주고 그냥 dive 만 치면 어떻게 되는가
//
// 1탄에서는 칸 수를 바꾸려면 MakeCode를 열어 숫자를 고치고 다시 저장했다.
// 이제는 채팅창에 이렇게 친다.
//
//     dive 3
//
// 그러면 3이 num1 안으로 들어온다. 코드는 한 번도 안 고친다.
// num1 은 첫 번째 숫자, num2 는 두 번째, num3 은 세 번째다.

// [dive] num1 층만큼 내려간다.  예)  dive 3
// 한 층은 4칸이다. 3층이면 12칸
player.onChat("dive", function (num1) {
    let downFloors = num1
    if (downFloors < 1) {
        downFloors = 1
    }
    for (let i = 0; i < downFloors * 4; i++) {
        agent.move(DOWN, 1)
        loops.pause(250)
    }
    player.say(downFloors)
    player.say("층 하강 완료")
})

// [rise] num1 층만큼 올라온다.  예)  rise 2
player.onChat("rise", function (num1) {
    let upFloors = num1
    if (upFloors < 1) {
        upFloors = 1
    }
    for (let i = 0; i < upFloors * 4; i++) {
        agent.move(UP, 1)
        loops.pause(250)
    }
    player.say(upFloors)
    player.say("층 상승 완료")
})

// [fwd] 앞으로 num1 칸 간다.  예)  fwd 10
player.onChat("fwd", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    for (let i = 0; i < steps; i++) {
        agent.move(FORWARD, 1)
        loops.pause(250)
    }
    player.say(steps)
})

// [dig] 앞으로 num1 칸 파며 전진한다.  예)  dig 8
player.onChat("dig", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    for (let i = 0; i < steps; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            agent.destroy(FORWARD)
            loops.pause(250)
            agent.collectAll()
            loops.pause(250)
        }
        agent.move(FORWARD, 1)
        loops.pause(250)
    }
    player.say("굴착 완료")
})

// [sig2] 2층 신호 지점으로 투입
player.onChat("sig2", function () {
    agent.teleport(world(-4, 54, -6), WEST)
    loops.pause(400)
    player.say("2층 신호 지점 도착")
})

// ==========================================================
// 3차시
// ==========================================================

// 지하 3층 | 좌표를 채팅으로 — 매개변수 두세 개
//
// 신호 좌표      -26 / 50 / 2
// 새로 배우는 것  num1 · num2 · num3 — 숫자를 세 개까지 받는다
// 관찰 포인트     명령 하나가 몇 가지 결과를 만들 수 있는가
//
// 좌표는 숫자 세 개다. 채팅으로 세 개를 다 넘길 수 있다면
// 명령 하나로 이 월드 어디든 보낼 수 있다.
//
//     jump -26 2      3층 안에서 X, Z 만 지정 (Y는 코드에 박혀 있다)
//     warp -12 42 8   좌표 세 개를 전부 지정

// [jump] 3층 안에서 X, Z 만 지정해 이동.  예)  jump -26 2
player.onChat("jump", function (num1, num2) {
    agent.teleport(world(num1, 50, num2), WEST)
    loops.pause(400)
    player.say("3층 이동 완료")
})

// [warp] 좌표 세 개를 전부 채팅으로.  예)  warp -12 42 8
player.onChat("warp", function (num1, num2, num3) {
    agent.teleport(world(num1, num2, num3), WEST)
    loops.pause(400)
    player.say("좌표 투입 완료")
})

// [deck] 한 변이 num1 칸인 네모 발판을 만든다.  예)  deck 6
// 1탄에서 만들던 box 와 구조는 같다. 크기를 채팅으로 준다는 것만 다르다
player.onChat("deck", function (num1) {
    let side = num1
    if (side < 2) {
        side = 2
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let turn = 0; turn < 4; turn++) {
        for (let i = 0; i < side; i++) {
            if (agent.detect(AgentDetection.Block, DOWN)) {
                agent.destroy(DOWN)
                loops.pause(250)
            }
            agent.place(DOWN)
            loops.pause(250)
            agent.move(FORWARD, 1)
            loops.pause(250)
        }
        agent.turn(RIGHT_TURN)
        loops.pause(250)
    }
    player.say(side)
    player.say("발판 완성")
})

// [tower] 높이 num1 짜리 사각 기둥을 세운다.  예)  tower 8
player.onChat("tower", function (num1) {
    let height = num1
    if (height < 1) {
        height = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let f = 0; f < height; f++) {
        for (let w = 0; w < 4; w++) {
            agent.place(FORWARD)
            loops.pause(250)
            agent.turn(RIGHT_TURN)
            loops.pause(250)
        }
        agent.move(UP, 1)
        loops.pause(250)
    }
    player.say(height)
    player.say("층 기둥 완성")
})

// [sig3] 3층 신호 지점으로 투입
player.onChat("sig3", function () {
    agent.teleport(world(-26, 50, 2), EAST)
    loops.pause(400)
    player.say("3층 신호 지점 도착")
})

// ==========================================================
// 4차시
// ==========================================================

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

// ==========================================================
// 5차시
// ==========================================================

// 지하 5층 | 층 계산기 — 변수끼리 계산한다      ★ 핵심 차시
//
// 신호 좌표      -12 / 42 / -10
// 새로 배우는 것  규칙을 식으로 만들어 코드에 넣는다
// 관찰 포인트     층 번호 하나만 주면 열두 개 층 어디든 갈 수 있는가
//
// 지금까지는 층마다 Y를 표에서 찾아 손으로 쳤다. 그런데 규칙이 있다.
//
//     58 · 54 · 50 · 46 · 42 ...   4씩 줄어든다
//     0층이 있다면 62일 것이다
//
//              Y = 62 - 층 x 4
//
// 규칙을 코드로 쓰면 표가 필요 없다. 층 번호 하나만 있으면 된다.
// 곱하기가 빼기 안에 들어가야 한다. 순서를 틀리면 결과가 어긋난다.

let floorNow = 5

// [depth] 층 번호를 주면 Y만 계산해서 알려준다. 이동은 안 한다.  예)  depth 9
player.onChat("depth", function (num1) {
    let y = 62 - num1 * 4
    player.say(num1)
    loops.pause(300)
    player.say(y)
})

// [floor] 층 번호만 주면 계산해서 그 층 갱도로 투입한다.  예)  floor 9
player.onChat("floor", function (num1) {
    floorNow = num1
    let y = 62 - floorNow * 4
    agent.teleport(world(-12, y, 8), WEST)
    loops.pause(500)
    player.say(floorNow)
    loops.pause(300)
    player.say(y)
})

// [at] 층과 X, Z 를 함께 준다. Y는 코드가 계산한다.  예)  at 7 -24 20
player.onChat("at", function (num1, num2, num3) {
    let y = 62 - num1 * 4
    agent.teleport(world(num2, y, num3), WEST)
    loops.pause(500)
    player.say("투입 완료")
    loops.pause(300)
    player.say(y)
})

// [build] num1 층 갱도 옆에 한 변 num2 짜리 발판을 만든다.  예)  build 9 6
// 층 계산과 1탄에서 하던 발판 만들기를 하나로 잇는다
player.onChat("build", function (num1, num2) {
    let y = 62 - num1 * 4
    let side = num2
    if (side < 2) {
        side = 2
    }
    agent.teleport(world(-12, y, 8), WEST)
    loops.pause(500)
    agent.setSlot(1)
    loops.pause(200)
    for (let turn = 0; turn < 4; turn++) {
        for (let i = 0; i < side; i++) {
            if (agent.detect(AgentDetection.Block, DOWN)) {
                agent.destroy(DOWN)
                loops.pause(250)
            }
            agent.place(DOWN)
            loops.pause(250)
            agent.move(FORWARD, 1)
            loops.pause(250)
        }
        agent.turn(RIGHT_TURN)
        loops.pause(250)
    }
    player.say(y)
    player.say("발판 완성")
})

// [sig5] 5층 신호 지점으로 투입
player.onChat("sig5", function () {
    agent.teleport(world(-12, 42, -10), SOUTH)
    loops.pause(400)
    player.say("5층 신호 지점 도착")
})

// ==========================================================
// 6차시
// ==========================================================

// 지하 6층 | 반복 변수를 좌표에 쓴다      ★ 핵심 차시
//
// 신호 좌표      0 / 38 / 16
// 준비물         슬롯 1 → 글로우스톤(발광석)
// 새로 배우는 것  for 의 i 를 좌표 계산에 넣는다
// 관찰 포인트     이동하며 놓는 것과 좌표를 찍어서 놓는 것은 무엇이 다른가
//
// 1탄에서 i 는 "몇 번 했는지" 세는 데만 썼다. 실제로 쓰지는 않았다.
// i 를 좌표에 곱하면 매번 다른 자리로 정확히 보낼 수 있다.
//
//     i = 0  →  X = -28 + 0 x 3 = -28
//     i = 1  →  X = -28 + 1 x 3 = -25
//     i = 2  →  X = -28 + 2 x 3 = -22
//
// 6층은 조명이 죽어 있다. 유도등을 정확한 자리에 심어야 한다.

// [row] X 방향으로 num1 개를 num2 칸 간격으로 심는다.  예)  row 6 3
player.onChat("row", function (num1, num2) {
    let count = num1
    let gap = num2
    if (count < 1) {
        count = 1
    }
    if (gap < 1) {
        gap = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < count; i++) {
        agent.teleport(world(-28 + i * gap, 38, 16), WEST)
        loops.pause(350)
        agent.destroy(DOWN)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(250)
    }
    player.say("가로 설치 완료")
})

// [col] Z 방향으로 num1 개를 num2 칸 간격으로 심는다.  예)  col 5 4
player.onChat("col", function (num1, num2) {
    let count = num1
    let gap = num2
    if (count < 1) {
        count = 1
    }
    if (gap < 1) {
        gap = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < count; i++) {
        agent.teleport(world(-12, 38, -12 + i * gap), WEST)
        loops.pause(350)
        agent.destroy(DOWN)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(250)
    }
    player.say("세로 설치 완료")
})

// [diag] i 를 X와 Z 두 곳에 함께 쓴다. 대각선으로 놓인다.  예)  diag 10
// 층 높이가 3칸뿐이라 Y에는 i 를 쓸 수 없다. 왜 그런지 생각해보자
// 관제 홀을 통과하지 않도록 남서쪽 빈 구역에서 시작한다
player.onChat("diag", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < steps; i++) {
        agent.teleport(world(-28 + i, 38, -12 + i), WEST)
        loops.pause(350)
        agent.destroy(DOWN)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(250)
    }
    player.say("대각선 설치 완료")
})

// [drill] 1층부터 num1 층까지 한 층씩 내려가며 좌표를 보고한다.  예)  drill 6
// i 로 층 번호를 만들고, 그 층 번호로 다시 Y를 계산한다
player.onChat("drill", function (num1) {
    let last = num1
    if (last < 1) {
        last = 1
    }
    for (let i = 0; i < last; i++) {
        let f = i + 1
        let y = 62 - f * 4
        agent.teleport(world(-12, y, 8), WEST)
        loops.pause(600)
        player.say(y)
    }
    player.say("하강 점검 완료")
})

// [sig6] 6층 신호 지점으로 투입
player.onChat("sig6", function () {
    agent.teleport(world(0, 38, 16), WEST)
    loops.pause(400)
    player.say("6층 진입. 조명 없음")
})

// ==========================================================
// 7차시
// ==========================================================

// 지하 7층 | 막힌 곳을 센다 — 조건 안에서 변수 키우기
//
// 신호 좌표      -24 / 34 / 20
// 새로 배우는 것  if 안에서 변수를 1씩 키운다. 결과를 숫자로 보고한다
// 관찰 포인트     같은 구간을 두 번 지나가면 count 가 같게 나오는가
//
// 1탄의 조건 판단은 "막히면 부수고 아니면 간다"까지였다. 결과가 남지 않았다.
// 관제실은 보고를 받아야 한다. 몇 군데가 막혀 있었는지 숫자로 알아야 한다.
//
//     blocked = blocked + 1
//
// 조건이 참일 때마다 변수를 1씩 키우면 그게 곧 개수가 된다.

let blocked = 0
let opened = 0

// [count] num1 칸 가면서 막힌 곳이 몇 군데인지 세서 보고한다.  예)  count 12
player.onChat("count", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    blocked = 0
    opened = 0
    for (let i = 0; i < steps; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            blocked = blocked + 1
            agent.destroy(FORWARD)
            loops.pause(250)
            agent.collectAll()
            loops.pause(250)
        } else {
            opened = opened + 1
        }
        agent.move(FORWARD, 1)
        loops.pause(250)
    }
    player.say("막힌 곳")
    loops.pause(300)
    player.say(blocked)
    loops.pause(300)
    player.say("뚫린 곳")
    loops.pause(300)
    player.say(opened)
})

// [clear] num1 칸 뚫으며 전진한다. 세지는 않는다.  예)  clear 15
player.onChat("clear", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    for (let i = 0; i < steps; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            agent.destroy(FORWARD)
            loops.pause(250)
            agent.collectAll()
            loops.pause(250)
        } else {
            agent.move(FORWARD, 1)
            loops.pause(250)
        }
    }
    player.say("통로 확보")
})

// [free] 지금 자리에서 열린 방향이 몇 개인지 센다
player.onChat("free", function () {
    opened = 0
    if (agent.detect(AgentDetection.Block, FORWARD)) {
        player.say("앞 막힘")
    } else {
        opened = opened + 1
    }
    if (agent.detect(AgentDetection.Block, BACK)) {
        player.say("뒤 막힘")
    } else {
        opened = opened + 1
    }
    if (agent.detect(AgentDetection.Block, LEFT)) {
        player.say("왼쪽 막힘")
    } else {
        opened = opened + 1
    }
    if (agent.detect(AgentDetection.Block, RIGHT)) {
        player.say("오른쪽 막힘")
    } else {
        opened = opened + 1
    }
    player.say("열린 방향")
    loops.pause(300)
    player.say(opened)
})

// [away] 막히면 부수지 않고 오른쪽으로 돌아서 피해 간다.  예)  away 10
player.onChat("away", function (num1) {
    let steps = num1
    if (steps < 1) {
        steps = 1
    }
    blocked = 0
    for (let i = 0; i < steps; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            blocked = blocked + 1
            agent.turn(RIGHT_TURN)
            loops.pause(250)
        } else {
            agent.move(FORWARD, 1)
            loops.pause(250)
        }
    }
    player.say("우회 횟수")
    loops.pause(300)
    player.say(blocked)
})

// [sig7] 7층 신호 지점으로 투입
player.onChat("sig7", function () {
    agent.teleport(world(-24, 34, 20), EAST)
    loops.pause(400)
    player.say("7층 진입. 통로 붕괴")
})

// ==========================================================
// 8차시
// ==========================================================

// 지하 8층 | 면을 채운다 — 반복 변수 두 개
//
// 신호 좌표      -6 / 30 / -10
// 준비물         슬롯 1 → 석재 64개
// 새로 배우는 것  i 와 j 를 각각 다른 좌표축에 쓴다
// 관찰 포인트     i 와 j 를 서로 바꿔 넣으면 결과가 어떻게 달라지는가
//
// 6층에서는 i 하나로 선을 만들었다. 반복을 하나 더 겹치고
// 두 개의 반복 변수를 X와 Z에 나눠 주면 면이 된다.
//
//     for i  (가로)
//         for j  (세로)
//             world(baseX + i, y, baseZ + j)
//
// 8층은 물에 잠겼다. 한 줄 다리로는 못 건넌다. 넓은 부교가 필요하다.

let baseX = -10
let baseZ = -8

// [line] 한 줄만 깐다. 6층 방식 복습.  예)  line 10
player.onChat("line", function (num1) {
    let len = num1
    if (len < 1) {
        len = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < len; i++) {
        agent.teleport(world(baseX + i, 30, baseZ), WEST)
        loops.pause(300)
        agent.place(DOWN)
        loops.pause(250)
    }
    player.say("한 줄 완성")
})

// [raft] 가로 num1 x 세로 num2 부교를 만든다.  예)  raft 8 10
player.onChat("raft", function (num1, num2) {
    let w = num1
    let d = num2
    if (w < 1) {
        w = 1
    }
    if (d < 1) {
        d = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < d; j++) {
            agent.teleport(world(baseX + i, 30, baseZ + j), WEST)
            loops.pause(250)
            agent.place(DOWN)
            loops.pause(200)
        }
    }
    player.say("부교 완성")
})

// [need] 부교에 블록이 몇 개 필요한지 미리 계산해서 보고한다.  예)  need 8 10
player.onChat("need", function (num1, num2) {
    let total = num1 * num2
    player.say("필요 블록")
    loops.pause(300)
    player.say(total)
    if (total > 64) {
        player.say("인벤토리 부족")
    } else {
        player.say("설치 가능")
    }
})

// [frame] 테두리만 두른다. 안쪽은 비운다.  예)  frame 8 10
player.onChat("frame", function (num1, num2) {
    let w = num1
    let d = num2
    if (w < 2) {
        w = 2
    }
    if (d < 2) {
        d = 2
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < w; i++) {
        agent.teleport(world(baseX + i, 30, baseZ), WEST)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(200)
        agent.teleport(world(baseX + i, 30, baseZ + d - 1), WEST)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(200)
    }
    for (let j = 0; j < d; j++) {
        agent.teleport(world(baseX, 30, baseZ + j), WEST)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(200)
        agent.teleport(world(baseX + w - 1, 30, baseZ + j), WEST)
        loops.pause(250)
        agent.place(DOWN)
        loops.pause(200)
    }
    player.say("테두리 완성")
})

// [sig8] 8층 신호 지점으로 투입
player.onChat("sig8", function () {
    agent.teleport(world(-6, 30, -10), SOUTH)
    loops.pause(400)
    player.say("8층 진입. 침수 확인")
})

// ==========================================================
// 9차시
// ==========================================================

// 지하 9층 | 값을 쌓아간다 — 변수 누적
//
// 신호 좌표      -25 / 26 / 7      무너진 바닥 한가운데 섬처럼 남아 있다
// 준비물         슬롯 1 → 석재 64개
// 새로 배우는 것  변수를 내가 직접 키운다. 합계를 만든다
// 관찰 포인트     sum 은 반복할 때마다 어떻게 변하는가
//
// 6층의 i 는 for 가 알아서 1씩 키워줬다. 내가 정할 수 없었다.
// 이제 내가 만든 변수를 내가 원하는 만큼 키운다.
//
//     sum = sum + 24     한 번 돌 때마다 24씩 쌓인다
//     f   = f + 1        한 번 돌 때마다 한 층씩 내려간다
//
// 9층은 바닥이 내려앉았다. 여러 층을 점검하고 재료가 얼마나 드는지 계산해야 한다.

let sum = 0
let scanFloor = 1

// [total] num1 개 층에 한 변 num2 짜리 발판을 놓으면 블록이 총 몇 개 드는지 쌓아간다
// 예)  total 4 6
player.onChat("total", function (num1, num2) {
    let floors = num1
    let side = num2
    if (floors < 1) {
        floors = 1
    }
    if (side < 2) {
        side = 2
    }
    sum = 0
    for (let i = 0; i < floors; i++) {
        sum = sum + side * 4
        player.say(sum)
        loops.pause(500)
    }
    player.say("총 블록 수")
    loops.pause(300)
    player.say(sum)
})

// [down] num1 층부터 num2 층까지 한 층씩 내려가며 좌표를 보고한다.  예)  down 1 9
player.onChat("down", function (num1, num2) {
    scanFloor = num1
    if (scanFloor < 1) {
        scanFloor = 1
    }
    let last = num2
    if (last < scanFloor) {
        last = scanFloor
    }
    for (let i = 0; i < last - scanFloor + 1; i++) {
        let y = 62 - scanFloor * 4
        agent.teleport(world(-12, y, 8), WEST)
        loops.pause(600)
        player.say(scanFloor)
        loops.pause(200)
        player.say(y)
        scanFloor = scanFloor + 1
    }
    player.say("하강 점검 완료")
})

// [up] 아래에서 위로 올라오며 점검한다.  예)  up 9 1
player.onChat("up", function (num1, num2) {
    scanFloor = num1
    let last = num2
    if (last > scanFloor) {
        last = scanFloor
    }
    for (let i = 0; i < scanFloor - last + 1; i++) {
        let y = 62 - scanFloor * 4
        agent.teleport(world(-12, y, 8), WEST)
        loops.pause(600)
        player.say(scanFloor)
        loops.pause(200)
        player.say(y)
        scanFloor = scanFloor - 1
    }
    player.say("상승 점검 완료")
})

// [deck9] 9층 붕괴 구간에 한 변 num1 짜리 발판을 만든다.  예)  deck9 6
player.onChat("deck9", function (num1) {
    let side = num1
    if (side < 2) {
        side = 2
    }
    agent.teleport(world(-28, 26, 4), EAST)
    loops.pause(500)
    agent.setSlot(1)
    loops.pause(200)
    sum = 0
    for (let turn = 0; turn < 4; turn++) {
        for (let i = 0; i < side; i++) {
            agent.place(DOWN)
            loops.pause(250)
            sum = sum + 1
            agent.move(FORWARD, 1)
            loops.pause(250)
        }
        agent.turn(RIGHT_TURN)
        loops.pause(250)
    }
    player.say("사용한 블록")
    loops.pause(300)
    player.say(sum)
})

// [sig9] 9층 신호 지점으로 투입. 붕괴 구멍 한가운데 남은 섬이다
player.onChat("sig9", function () {
    agent.teleport(world(-25, 26, 7), EAST)
    loops.pause(400)
    player.say("9층 진입. 바닥 붕괴")
})

// [edge] 발판을 놓기 시작할 붕괴 가장자리로 간다. deck9 는 여기서 시작한다
player.onChat("edge", function () {
    agent.teleport(world(-28, 26, 4), EAST)
    loops.pause(400)
    player.say("붕괴 가장자리 도착")
})

// ==========================================================
// 10차시
// ==========================================================

// 지하 10층 | 거리를 계산한다 — 두 좌표의 차
//
// 신호 좌표      0 / 22 / 22
// 준비물         슬롯 1 → 석재,  슬롯 2 → 눈에 띄는 색 블록
// 새로 배우는 것  좌표끼리 빼서 거리를 구한다. 부호가 방향을 알려준다
// 관찰 포인트     dist 결과가 음수로 나오면 어느 쪽으로 가야 하는가
//
// 지금까지는 몇 칸을 갈지 눈대중으로 정했다. 계산하면 정확히 알 수 있다.
//
//     dx = 목표X - 지금X
//     dz = 목표Z - 지금Z
//
// dx 가 양수면 X가 커지는 쪽, 음수면 작아지는 쪽이다.
// 차이가 12면 깔아야 할 칸은 13개다. 9차시에서 배운 "끝 - 시작 + 1" 이 여기서 또 나온다.
//
// 10층은 갈림길이 많다. 길이를 재고 그만큼만 깔아야 재료가 남는다.

let shaftX = -12
let shaftZ = 8

// roadx 가 끝난 자리를 기억한다. roadz 는 여기서 이어 깐다.
// 이게 없으면 두 길이 갱도에서 각각 뻗어나가 L자가 안 된다
let roadEndX = -12

// [dist] 갱도에서 목표 지점까지의 X차이, Z차이를 보고한다.  예)  dist 0 22
player.onChat("dist", function (num1, num2) {
    let dx = num1 - shaftX
    let dz = num2 - shaftZ
    player.say("X 차이")
    loops.pause(300)
    player.say(dx)
    loops.pause(400)
    player.say("Z 차이")
    loops.pause(300)
    player.say(dz)
})

// [roadx] 갱도에서 X 방향으로 num1 칸 길을 깐다
// num2 는 방향. 1이면 X가 커지는 쪽, 그 외는 작아지는 쪽
// 예)  roadx 13 1
player.onChat("roadx", function (num1, num2) {
    let len = num1
    if (len < 1) {
        len = 1
    }
    let step = -1
    if (num2 == 1) {
        step = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < len; i++) {
        agent.teleport(world(shaftX + i * step, 22, shaftZ), WEST)
        loops.pause(300)
        agent.destroy(DOWN)
        loops.pause(200)
        agent.place(DOWN)
        loops.pause(200)
    }
    roadEndX = shaftX + (len - 1) * step
    player.say("가로 길 완성")
    loops.pause(300)
    player.say(roadEndX)
})

// [roadz] roadx 가 끝난 자리에서 Z 방향으로 num1 칸 이어 깐다.  예)  roadz 15 1
// roadx 를 먼저 실행해야 이어진다. 안 하면 갱도에서 곧장 뻗는다
player.onChat("roadz", function (num1, num2) {
    let len = num1
    if (len < 1) {
        len = 1
    }
    let step = -1
    if (num2 == 1) {
        step = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < len; i++) {
        agent.teleport(world(roadEndX, 22, shaftZ + i * step), WEST)
        loops.pause(300)
        agent.destroy(DOWN)
        loops.pause(200)
        agent.place(DOWN)
        loops.pause(200)
    }
    player.say("세로 길 완성")
})

// [tag] 갱도에서 X 방향으로 num1 개 표식을 num2 칸 간격으로 남긴다.  예)  tag 4 4
// 층 홀은 X 2 까지다. 개수 x 간격이 그 밖으로 나가면 벽에 박힌다
player.onChat("tag", function (num1, num2) {
    let count = num1
    let gap = num2
    if (count < 1) {
        count = 1
    }
    if (gap < 1) {
        gap = 1
    }
    agent.setSlot(2)
    loops.pause(200)
    for (let i = 0; i < count; i++) {
        agent.teleport(world(shaftX + i * gap, 22, shaftZ), WEST)
        loops.pause(300)
        agent.destroy(DOWN)
        loops.pause(200)
        agent.place(DOWN)
        loops.pause(200)
    }
    player.say("경로 표식 완료")
})

// [sig10] 10층 신호 지점으로 투입
player.onChat("sig10", function () {
    agent.teleport(world(0, 22, 22), WEST)
    loops.pause(400)
    player.say("10층 진입. 갈림길 다수")
})

// ==========================================================
// 11차시
// ==========================================================

// 지하 11층 | 스스로 훑는다 — 전부 합친다      ★ 핵심 차시
//
// 신호 좌표      -18 / 18 / -12
// 준비물         슬롯 1 → 글로우스톤
// 새로 배우는 것  새 문법 없음. 매개변수 · 계산 · 반복 변수 · 누적을 한 명령 안에서 쓴다
// 관찰 포인트     명령 하나가 몇 개 층을 처리하는가
//
// 신호가 강해졌다. 12층 직전이다. 관제실은 마지막 점검을 지시한다.
// 층마다 명령을 만들면 열한 개다. 지금까지 배운 걸 합치면 하나면 된다.
//
//   매개변수    어느 층부터 어느 층까지인지 채팅으로 받는다
//   누적        층 번호를 1씩 키운다
//   계산        층 번호로 Y를 매번 다시 구한다
//   반복 변수   i 로 유도등 자리를 계산한다

let checkFloor = 1
let lampTotal = 0

// [scan] num1 층부터 num2 층까지 순서대로 훑으며 좌표를 보고한다.  예)  scan 1 11
player.onChat("scan", function (num1, num2) {
    checkFloor = num1
    if (checkFloor < 1) {
        checkFloor = 1
    }
    let last = num2
    if (last < checkFloor) {
        last = checkFloor
    }
    for (let i = 0; i < last - checkFloor + 1; i++) {
        let y = 62 - checkFloor * 4
        agent.teleport(world(-12, y, 8), WEST)
        loops.pause(600)
        player.say(y)
        checkFloor = checkFloor + 1
    }
    player.say("전층 스캔 완료")
})

// [light] num1 층 갱도에서 X 방향으로 유도등 num2 개를 num3 칸 간격으로 심는다
// 예)  light 11 6 3
player.onChat("light", function (num1, num2, num3) {
    let y = 62 - num1 * 4
    let count = num2
    let gap = num3
    if (count < 1) {
        count = 1
    }
    if (gap < 1) {
        gap = 1
    }
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < count; i++) {
        agent.teleport(world(-12 - i * gap, y, 8), WEST)
        loops.pause(350)
        agent.destroy(DOWN)
        loops.pause(200)
        agent.place(DOWN)
        loops.pause(200)
        lampTotal = lampTotal + 1
    }
    player.say("설치 누적")
    loops.pause(300)
    player.say(lampTotal)
})

// [relight] num1 층부터 num2 층까지 모든 층에 유도등 세 개씩 심는다.  예)  relight 6 11
// scan 과 light 를 하나로 합친 형태다
player.onChat("relight", function (num1, num2) {
    checkFloor = num1
    let last = num2
    if (last < checkFloor) {
        last = checkFloor
    }
    lampTotal = 0
    agent.setSlot(1)
    loops.pause(200)
    for (let f = 0; f < last - checkFloor + 1; f++) {
        let y = 62 - checkFloor * 4
        for (let i = 0; i < 3; i++) {
            agent.teleport(world(-12 - i * 4, y, 8), WEST)
            loops.pause(300)
            agent.destroy(DOWN)
            loops.pause(200)
            agent.place(DOWN)
            loops.pause(200)
            lampTotal = lampTotal + 1
        }
        player.say(y)
        checkFloor = checkFloor + 1
    }
    player.say("총 설치")
    loops.pause(300)
    player.say(lampTotal)
})

// [patrol] num1 층 홀의 네 귀퉁이를 순찰하며 감지 결과를 보고한다.  예)  patrol 11
player.onChat("patrol", function (num1) {
    let y = 62 - num1 * 4
    for (let i = 0; i < 4; i++) {
        if (i == 0) {
            agent.teleport(world(-26, y, -10), WEST)
        }
        if (i == 1) {
            agent.teleport(world(-2, y, -10), WEST)
        }
        if (i == 2) {
            agent.teleport(world(-2, y, 20), WEST)
        }
        if (i == 3) {
            agent.teleport(world(-26, y, 20), WEST)
        }
        loops.pause(600)
        if (agent.detect(AgentDetection.Block, DOWN)) {
            player.say("바닥 있음")
        } else {
            player.say("바닥 없음")
        }
    }
    player.say("순찰 완료")
})

// [sig11] 11층 신호 지점으로 투입
player.onChat("sig11", function () {
    agent.teleport(world(-18, 18, -12), WEST)
    loops.pause(400)
    player.say("11층 진입. 신호 강함")
})

// ==========================================================
// 12차시
// ==========================================================

// 지하 12층 | 신호원 — 통합 미션과 발표
//
// 신호 좌표      -12 / 14 / 8      갱도 바로 아래. 신호는 계속 발밑에 있었다
// 준비물         슬롯 1 → 석재,  슬롯 2 → 글로우스톤
// 새로 배우는 것  새 문법 없음. 지금까지 만든 것을 하나로 잇는다
// 관찰 포인트     단계 순서를 바꾸면 결과가 어떻게 달라지는가
//
// dive12 는 네 단계다. 각 단계는 전부 이전 차시에서 만든 것이다.
//
//   1단계  층 번호로 Y를 계산해 투입      5차시
//   2단계  막힌 곳을 세며 통로 확보       7차시
//   3단계  두 반복 변수로 착륙장 채우기    8차시
//   4단계  i 로 좌표를 계산해 유도등 설치  6차시

let missionFloor = 12
let deckW = 5
let deckD = 5
let hit = 0

// [dive12] 12층 진입 통합 루틴.  예)  dive12
player.onChat("dive12", function () {
    // 1단계 — 층 계산 투입
    let y = 62 - missionFloor * 4
    agent.teleport(world(-12, y, 8), WEST)
    loops.pause(600)
    player.say(y)

    // 2단계 — 막힌 곳을 세며 통로 확보
    hit = 0
    for (let i = 0; i < 10; i++) {
        if (agent.detect(AgentDetection.Block, FORWARD)) {
            hit = hit + 1
            agent.destroy(FORWARD)
            loops.pause(250)
            agent.collectAll()
            loops.pause(250)
        }
        agent.move(FORWARD, 1)
        loops.pause(250)
    }
    player.say("막힌 곳")
    loops.pause(300)
    player.say(hit)

    // 3단계 — 착륙장 채우기
    agent.setSlot(1)
    loops.pause(200)
    for (let i = 0; i < deckW; i++) {
        for (let j = 0; j < deckD; j++) {
            agent.teleport(world(-24 + i, y, 4 + j), WEST)
            loops.pause(250)
            agent.destroy(DOWN)
            loops.pause(200)
            agent.place(DOWN)
            loops.pause(200)
        }
    }
    player.say("착륙장 완성")

    // 4단계 — 유도등 설치
    agent.setSlot(2)
    loops.pause(200)
    for (let i = 0; i < 4; i++) {
        agent.teleport(world(-22 - i * 2, y, 8), WEST)
        loops.pause(300)
        agent.destroy(DOWN)
        loops.pause(200)
        agent.place(DOWN)
        loops.pause(200)
    }
    player.say("신호원 도달")
})

// ============================================================
// 나만의 관제 루틴 — 여기부터 직접 만든다
//
// 규칙 세 가지
//   1. 층과 크기는 채팅으로 받는다. 코드에 숫자를 박지 않는다
//   2. 좌표는 계산으로 만든다. 손으로 세지 않는다
//   3. 완성 못 해도 된다. 무엇을 바꿨고 결과가 어떻게 달라졌는지 기록하면 성공이다
//
// 쓸 수 있는 재료
//   agent.teleport(world(x, y, z), WEST)
//   agent.move / turn / place / destroy / collectAll / setSlot
//   if (agent.detect(AgentDetection.Block, FORWARD)) { } else { }
//   for (let i = 0; i < n; i++) { }
//   let y = 62 - 층 * 4
//   변수 = 변수 + 1
// ============================================================

let myCount = 0

// [mine] 나만의 루틴.  예)  mine 9 6
// num1 = 층,  num2 = 크기
player.onChat("mine", function (num1, num2) {
    let y = 62 - num1 * 4
    let size = num2
    if (size < 1) {
        size = 1
    }
    agent.teleport(world(-12, y, 8), WEST)
    loops.pause(600)
    player.say("루틴 시작")
    myCount = 0

    // ↓ 여기에 직접 이어붙인다
    // for (let i = 0; i < size; i++) {
    //     agent.teleport(world(-12 - i, y, 8), WEST)
    //     loops.pause(300)
    //     agent.place(DOWN)
    //     loops.pause(200)
    //     myCount = myCount + 1
    // }

    player.say("루틴 종료")
    loops.pause(300)
    player.say(myCount)
})

// [sig12] 12층 신호 지점으로 투입
player.onChat("sig12", function () {
    agent.teleport(world(-12, 14, 8), WEST)
    loops.pause(400)
    player.say("12층 도착")
})

