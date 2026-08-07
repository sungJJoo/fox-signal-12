// 지하 11층 | 전층 스캔 — 변수를 하나씩 늘린다
//
// 신호 좌표   -18 / 18 / -12
// 새로 배우는 것   변수 누적. 반복할 때마다 변수를 1씩 키운다
// 관찰 포인트   층이 내려갈 때마다 Y가 정확히 4씩 줄어드는가?
//
// 신호가 강해졌다. 관제실은 1층부터 11층까지 전부 다시 훑으라고 지시한다.
// 층마다 명령을 따로 만들면 11개가 필요하다. 하지만 변수를 하나씩 키우면 명령은 하나면 된다.
//
//   scanFloor 가 1 → 2 → 3 ... 으로 커지고
//   Y = 62 - scanFloor × 4 가 그때그때 다시 계산된다

let scanFloor = 1

// [sig11] 11층 신호 지점으로 투입한다
player.onChat("sig11", function () {
    agent.teleport(world(-18, 18, -12), WEST)
    loops.pause(400)
    player.say("11층 진입. 신호 강함")
})

// [scan] 1층부터 11층까지 순서대로 내려가며 좌표를 보고한다
player.onChat("scan", function () {
    scanFloor = 1
    for (let i = 0; i < 11; i++) {
        let scanY = 62 - scanFloor * 4
        agent.teleport(world(-12, scanY, 8), WEST)
        loops.pause(700)
        player.say(scanY)
        scanFloor = scanFloor + 1
    }
    player.say("전층 스캔 완료")
})
