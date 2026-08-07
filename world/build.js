// 월드 구성 코드 | 에이전트와 함께해요 2 — 지하 12층 + 수직 갱도 자동 생성
// 폭스러닝센터 AI 연구소
//
// 이 코드는 연구원 전용이다. 아이에게 보여주지 않는다.
// 별도의 MakeCode 프로젝트를 하나 더 만들어 붙여넣고, 채팅으로 실행한다.
//
// [실행 순서]
//   1. buildall   지하 1~12층 전체 + 갱도를 한 번에 만든다 (1~2분, 렉 주의)
//   2. props      층별 장치(조명·붕괴·침수·신호원)를 설치한다
//   3. check      1층부터 12층까지 훑으며 눈으로 확인한다
//
//   렉이 심하면 buildall 대신 buildone 을 층 번호를 바꿔가며 12번 실행한다.
//
// [좌표 규칙]  Y = 62 - 층 x 4
//   층 홀 내부   X -30 ~ 2,  Z -14 ~ 24,  Y 층Y ~ 층Y+2
//   층 바닥      Y 층Y-1
//   돌 외벽      X -31 ~ 3,  Z -15 ~ 25,  Y 층Y-2 ~ 층Y+3
//   수직 갱도    X -13 ~ -11, Z 7 ~ 9,  Y 14 ~ 79

let buildFloor = 1

// ============================================================
// [buildone] 층 하나만 만든다. buildFloor 값을 바꿔가며 실행한다
// ============================================================
player.onChat("buildone", function () {
    let fy = 62 - buildFloor * 4

    // 물·용암 차단용 돌 껍질
    blocks.fill(STONE, world(-31, fy - 2, -15), world(3, fy + 3, 25), FillOperation.Replace)
    loops.pause(600)

    // 안쪽을 비운다. 바닥(fy - 1)은 돌로 남는다
    blocks.fill(AIR, world(-30, fy, -14), world(2, fy + 2, 24), FillOperation.Replace)
    loops.pause(600)

    player.say(buildFloor)
})

// ============================================================
// [buildall] 12개 층 + 수직 갱도를 한 번에 만든다
// ============================================================
player.onChat("buildall", function () {
    player.say("지하 시설 건설 시작")

    for (let f = 1; f <= 12; f++) {
        let fy = 62 - f * 4
        blocks.fill(STONE, world(-31, fy - 2, -15), world(3, fy + 3, 25), FillOperation.Replace)
        loops.pause(500)
        blocks.fill(AIR, world(-30, fy, -14), world(2, fy + 2, 24), FillOperation.Replace)
        loops.pause(500)
        player.say(f)
    }

    // 지상 구간 갱도 — 지형을 뚫고 내려온다
    blocks.fill(STONE, world(-14, 62, 6), world(-10, 79, 10), FillOperation.Replace)
    loops.pause(500)
    blocks.fill(AIR, world(-13, 62, 7), world(-11, 79, 9), FillOperation.Replace)
    loops.pause(500)

    // 지하 구간 갱도 — 12개 층을 관통한다
    blocks.fill(AIR, world(-13, 14, 7), world(-11, 61, 9), FillOperation.Replace)
    loops.pause(500)

    player.say("지하 시설 건설 완료")
})

// ============================================================
// [props] 층별 장치를 설치한다. buildall 다음에 실행한다
// ============================================================
player.onChat("props", function () {
    player.say("층별 장치 설치 시작")

    // --- 조명 : 6층만 빼고 전 층에 격자 조명 ---
    // 6층은 어두워야 한다. 6차시가 조명 설치 차시다
    for (let f = 1; f <= 12; f++) {
        if (f != 6) {
            let ly = 62 - f * 4
            for (let gx = 0; gx < 4; gx++) {
                for (let gz = 0; gz < 5; gz++) {
                    blocks.place(GLOWSTONE, world(-28 + gx * 8, ly + 2, -12 + gz * 8))
                }
            }
        }
        loops.pause(300)
    }
    player.say("조명 설치 완료")

    // --- 7층 : 무너진 통로 ---
    // 신호 지점 (-24, 34, 20) 에서 동쪽으로 진행. clear 명령이 뚫을 대상
    blocks.place(COBBLESTONE, world(-22, 34, 20))
    blocks.place(COBBLESTONE, world(-19, 34, 20))
    blocks.place(COBBLESTONE, world(-19, 35, 20))
    blocks.place(COBBLESTONE, world(-16, 34, 20))
    blocks.place(COBBLESTONE, world(-16, 35, 20))
    blocks.place(COBBLESTONE, world(-14, 34, 20))
    loops.pause(400)
    player.say("7층 붕괴 구간 설치")

    // --- 8층 : 침수 ---
    // 신호 지점 (-6, 30, -10) 에서 남쪽으로 진행. bridge 명령이 건널 대상
    blocks.fill(AIR, world(-10, 29, -8), world(-2, 29, 2), FillOperation.Replace)
    loops.pause(400)
    blocks.fill(WATER, world(-10, 29, -8), world(-2, 29, 2), FillOperation.Replace)
    loops.pause(400)
    player.say("8층 침수 구간 설치")

    // --- 9층 : 바닥 붕괴 ---
    // 신호 지점 (-28, 26, 4) 주변 바닥을 걷어낸다. deck 명령이 발판을 만들 자리
    blocks.fill(AIR, world(-30, 25, 2), world(-20, 25, 12), FillOperation.Replace)
    loops.pause(400)
    player.say("9층 붕괴 구간 설치")

    // --- 12층 : 신호원 ---
    // 30년 전 봉인된 최초의 에이전트가 있던 자리
    blocks.fill(COBBLESTONE, world(-13, 14, 8), world(-22, 14, 8), FillOperation.Replace)
    loops.pause(400)
    blocks.fill(IRON_BLOCK, world(-30, 13, 6), world(-26, 13, 10), FillOperation.Replace)
    loops.pause(400)
    blocks.place(GLOWSTONE, world(-28, 14, 8))
    blocks.place(IRON_BLOCK, world(-28, 15, 8))
    loops.pause(400)
    player.say("12층 신호원 설치")

    player.say("층별 장치 설치 완료")
})

// ============================================================
// [check] 1층부터 12층까지 훑으며 눈으로 확인한다
// ============================================================
player.onChat("check", function () {
    for (let f = 1; f <= 12; f++) {
        let cy = 62 - f * 4
        agent.teleport(world(-12, cy, 8), WEST)
        loops.pause(1200)
        player.say(cy)
    }
    player.say("전층 확인 완료")
})

// ============================================================
// [reset] 한 층을 처음 상태로 되돌린다. buildFloor 값을 바꿔서 실행
// 아이가 층을 망가뜨렸을 때 쓴다
// ============================================================
player.onChat("reset", function () {
    let ry = 62 - buildFloor * 4

    blocks.fill(STONE, world(-31, ry - 2, -15), world(3, ry + 3, 25), FillOperation.Replace)
    loops.pause(600)
    blocks.fill(AIR, world(-30, ry, -14), world(2, ry + 2, 24), FillOperation.Replace)
    loops.pause(600)
    blocks.fill(AIR, world(-13, ry - 1, 7), world(-11, ry + 2, 9), FillOperation.Replace)
    loops.pause(400)

    if (buildFloor != 6) {
        for (let gx = 0; gx < 4; gx++) {
            for (let gz = 0; gz < 5; gz++) {
                blocks.place(GLOWSTONE, world(-28 + gx * 8, ry + 2, -12 + gz * 8))
            }
        }
    }

    player.say(buildFloor)
})
