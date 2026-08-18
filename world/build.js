// 월드 구성 코드 | 에이전트와 함께해요 2 — 지하 12층 시설 건설
// 폭스러닝센터 AI 연구소
//
// 연구원 전용이다. 아이에게 보여주지 않는다.
// 수업용과 별개의 MakeCode 프로젝트를 하나 더 만들어 붙여넣고 채팅으로 실행한다.
// 이 파일은 블록 코딩으로 변환할 필요가 없어서 사용자 함수를 쓴다.
//
// [실행]
//   buildall     지하 1~12층 전체 + 갱도 (4~6분, 렉 있음)
//   buildone     buildFloor 변수의 층 하나만
//   shaft        수직 갱도만 다시 뚫는다
//   check        1~12층 갱도를 훑는다
//   checksig     12개 신호 지점을 훑는다
//   reset        buildFloor 층을 처음 상태로 되돌린다
//
// [층 구조]  모든 층이 같은 뼈대를 쓴다
//
//        Z 24 ┌──────── 외곽 배관 ────────┐
//             │                            │
//             │   ● ● ● ● ●  ← 층 번호 점   │
//             │   ┌─────┐                  │
//             │   │ 관제 │ ← 갱도 (-12, 8)  │
//             │   │  홀  │   문 네 개        │
//             │   └─────┘        ▣ 신호 지점 │
//             │                            │
//       Z -14 └────────────────────────────┘
//            X -30                        X 2
//
// [규칙 하나]  신호 표식은 에이전트가 서는 높이(Y)에 아무것도 놓지 않는다.
//              바닥(Y-1)과 천장(Y+2)에만 놓는다. 그래야 그 좌표로 투입할 수 있다.
//
// [미션 동선]  아래는 비워둔다. 여기에 구조물을 놓으면 코드가 막힌다
//    6층  Z=16 의 X -28~-13  /  X=-12 의 Z -12~4  /  대각선 (-28,-12)~(-19,-3)
//    7층  Z=20 의 X -24~-12          ← 여기만 일부러 막는다
//    8층  X -10~-2, Z -8~2           ← 물
//    9층  X -30~-20, Z 2~12          ← 바닥 없음. 가운데 신호 지점만 섬으로 남는다
//   10층  Z=8 의 X -12~0  /  X=0 의 Z 8~22
//   11층  Z=8 의 X -12~-30  /  네 귀퉁이 (-26,-10) (-2,-10) (-2,20) (-26,20)
//   12층  Z=8 의 X -12~-28

// ============================================================
// 재료 — 블록 이름에서 오류가 나면 여기만 바꾼다
//
// MakeCode 의 블록 상수 이름은 게임 안 이름과 다를 때가 있다.
// "Cannot find name 'XXX'" 오류가 나면 이렇게 찾는다.
//   1. Blocks 탭으로 간다
//   2. 왼쪽 [블록] 카테고리에서 원하는 블록을 아무 데나 하나 끌어다 놓는다
//   3. JavaScript 탭으로 바꾼다
//   4. 거기 적힌 이름을 복사해서 아래 목록에 붙인다
//   5. 2번에서 끌어다 놓은 블록은 지운다
//
// 확인된 것 (2026-08 Minecraft Education) — QUARTZ_BLOCK 은 없는 이름이다
// ============================================================

let MAT_SHELL = STONE
let MAT_WALL = STONE_BRICKS
let MAT_HALL = POLISHED_ANDESITE
let MAT_LAMP = GLOWSTONE
let MAT_RUBBLE = COBBLESTONE
let MAT_DEBRIS = GRAVEL
let MAT_CONSOLE = IRON_BLOCK
let MAT_SIGNAL = IRON_BLOCK
let MAT_CORE = REDSTONE_BLOCK
let MAT_PIPE = IRON_BARS

let buildFloor = 1

// ============================================================
// 좌표 계산
// ============================================================

function floorY(f: number): number {
    return 62 - f * 4
}

function signalX(f: number): number {
    if (f == 1) return -22
    if (f == 2) return -4
    if (f == 3) return -26
    if (f == 4) return 0
    if (f == 5) return -12
    if (f == 6) return 0
    if (f == 7) return -24
    if (f == 8) return -6
    if (f == 9) return -25
    if (f == 10) return 0
    if (f == 11) return -18
    return -12
}

function signalZ(f: number): number {
    if (f == 1) return 18
    if (f == 2) return -6
    if (f == 3) return 2
    if (f == 4) return 20
    if (f == 5) return -10
    if (f == 6) return 16
    if (f == 7) return 20
    if (f == 8) return -10
    if (f == 9) return 7
    if (f == 10) return 22
    if (f == 11) return -12
    return 8
}

// ============================================================
// 1) 빈 층 파내기 — 물·용암 차단 껍질 + 내부 비움
// ============================================================

function carveFloor(f: number) {
    let y = floorY(f)
    blocks.fill(MAT_SHELL, world(-31, y - 2, -15), world(3, y + 3, 25), FillOperation.Replace)
    loops.pause(500)
    blocks.fill(AIR, world(-30, y, -14), world(2, y + 2, 24), FillOperation.Replace)
    loops.pause(500)
}

// ============================================================
// 2) 관제 홀 — 갱도를 감싼 방. 사방에 문이 하나씩
//    문 위치가 6·10·11·12층 미션 동선과 맞물린다
// ============================================================

function buildHall(f: number) {
    let y = floorY(f)

    blocks.fill(MAT_HALL, world(-16, y - 1, 4), world(-8, y - 1, 12), FillOperation.Replace)
    loops.pause(300)

    blocks.fill(MAT_WALL, world(-16, y, 4), world(-16, y + 2, 12), FillOperation.Replace)
    blocks.fill(MAT_WALL, world(-8, y, 4), world(-8, y + 2, 12), FillOperation.Replace)
    blocks.fill(MAT_WALL, world(-16, y, 4), world(-8, y + 2, 4), FillOperation.Replace)
    blocks.fill(MAT_WALL, world(-16, y, 12), world(-8, y + 2, 12), FillOperation.Replace)
    loops.pause(400)

    // 서 / 동 / 남 / 북 출입구
    blocks.fill(AIR, world(-16, y, 8), world(-16, y + 1, 8), FillOperation.Replace)
    blocks.fill(AIR, world(-8, y, 8), world(-8, y + 1, 8), FillOperation.Replace)
    blocks.fill(AIR, world(-12, y, 4), world(-12, y + 1, 4), FillOperation.Replace)
    blocks.fill(AIR, world(-12, y, 12), world(-12, y + 1, 12), FillOperation.Replace)
    loops.pause(400)

    // 관제 콘솔 — 미션 동선(Z=8)을 피해 Z=6 과 Z=10 에 둔다
    blocks.place(MAT_CONSOLE, world(-15, y, 6))
    blocks.place(MAT_CONSOLE, world(-14, y, 6))
    blocks.place(MAT_CORE, world(-15, y + 1, 6))
    blocks.place(MAT_CONSOLE, world(-15, y, 10))
    blocks.place(MAT_CONSOLE, world(-14, y, 10))
    blocks.place(MAT_LAMP, world(-14, y + 1, 10))
    loops.pause(300)
}

// ============================================================
// 3) 층 번호 표시 — 북쪽 문 밖 바닥에 발광석 점을 층 수만큼
//    아이가 도착하자마자 세어서 몇 층인지 안다
// ============================================================

function floorDots(f: number) {
    let y = floorY(f)
    for (let i = 0; i < f; i++) {
        blocks.place(MAT_LAMP, world(-17 + i, y - 1, 14))
    }
    loops.pause(300)
}

// ============================================================
// 4) 천장 격자 조명 — 6층만 뺀다 (6차시가 조명 설치 차시다)
// ============================================================

function ceilingLights(f: number) {
    if (f == 6) return
    let y = floorY(f)
    for (let gx = 0; gx < 4; gx++) {
        for (let gz = 0; gz < 5; gz++) {
            blocks.place(MAT_LAMP, world(-28 + gx * 8, y + 2, -12 + gz * 8))
        }
    }
    loops.pause(400)
}

// ============================================================
// 5) 외곽 배관 — 방이 아니라 시설로 보이게 한다
//    바깥 테두리에만 놓아 미션 동선을 건드리지 않는다
// ============================================================

function perimeter(f: number) {
    let y = floorY(f)
    for (let i = 0; i < 6; i++) {
        let z = -13 + i * 7
        blocks.place(MAT_PIPE, world(-30, y, z))
        blocks.place(MAT_PIPE, world(-30, y + 1, z))
        blocks.place(MAT_PIPE, world(2, y, z))
        blocks.place(MAT_PIPE, world(2, y + 1, z))
    }
    for (let j = 0; j < 5; j++) {
        let x = -29 + j * 7
        blocks.place(MAT_PIPE, world(x, y, -14))
        blocks.place(MAT_PIPE, world(x, y + 1, -14))
        blocks.place(MAT_PIPE, world(x, y + 1, 24))
    }
    loops.pause(400)
}

// ============================================================
// 6) 신호 지점 표식
//    가운데 Y 칸은 반드시 비워둔다. 거기로 에이전트를 투입하기 때문이다
// ============================================================

function signalMark(f: number) {
    let y = floorY(f)
    let sx = signalX(f)
    let sz = signalZ(f)

    // 바닥 3x3 강철 단상, 한가운데는 붉은 코어
    blocks.fill(MAT_SIGNAL, world(sx - 1, y - 1, sz - 1), world(sx + 1, y - 1, sz + 1), FillOperation.Replace)
    loops.pause(250)
    blocks.place(MAT_CORE, world(sx, y - 1, sz))

    // 네 귀퉁이 기둥 — 가운데는 비운다
    blocks.place(MAT_PIPE, world(sx - 1, y, sz - 1))
    blocks.place(MAT_PIPE, world(sx + 1, y, sz - 1))
    blocks.place(MAT_PIPE, world(sx - 1, y, sz + 1))
    blocks.place(MAT_PIPE, world(sx + 1, y, sz + 1))

    // 천장 표시등
    blocks.place(MAT_LAMP, world(sx, y + 2, sz))
    loops.pause(300)
}

// ============================================================
// 7) 층별 시설
// ============================================================

function floorProps(f: number) {
    let y = floorY(f)

    // --- 7층 : 무너진 통로 ---
    // Z=20 선의 잔해가 count 12 의 셀 대상이다 (의도 4군데)
    if (f == 7) {
        blocks.place(MAT_RUBBLE, world(-22, y, 20))
        blocks.place(MAT_RUBBLE, world(-19, y, 20))
        blocks.place(MAT_RUBBLE, world(-16, y, 20))
        blocks.place(MAT_RUBBLE, world(-14, y, 20))
        blocks.place(MAT_RUBBLE, world(-19, y + 1, 20))
        blocks.place(MAT_RUBBLE, world(-16, y + 1, 20))
        // 통로 양옆 무너진 벽
        blocks.fill(MAT_DEBRIS, world(-26, y, 18), world(-13, y, 18), FillOperation.Replace)
        blocks.fill(MAT_DEBRIS, world(-26, y, 22), world(-13, y, 22), FillOperation.Replace)
        loops.pause(400)
    }

    // --- 8층 : 침수 ---
    if (f == 8) {
        blocks.fill(AIR, world(-10, y - 1, -8), world(-2, y - 1, 2), FillOperation.Replace)
        loops.pause(300)
        blocks.fill(WATER, world(-10, y - 1, -8), world(-2, y - 1, 2), FillOperation.Replace)
        loops.pause(400)
        // 물가 표시는 바닥(Y-1)에만. 벽으로 세우면 bridge 가 막힌다
        blocks.fill(MAT_WALL, world(-11, y - 1, -9), world(-1, y - 1, -9), FillOperation.Replace)
        blocks.fill(MAT_WALL, world(-11, y - 1, 3), world(-1, y - 1, 3), FillOperation.Replace)
        loops.pause(300)
    }

    // --- 9층 : 바닥 붕괴 ---
    // 신호 지점(-25, 7)만 섬으로 남는다. deck9 가 그 둘레에 발판을 만든다
    if (f == 9) {
        blocks.fill(AIR, world(-30, y - 1, 2), world(-20, y - 1, 12), FillOperation.Replace)
        loops.pause(400)
        blocks.fill(MAT_DEBRIS, world(-19, y - 1, 2), world(-19, y - 1, 12), FillOperation.Replace)
        loops.pause(300)
    }

    // --- 10층 : 갈림길 ---
    // Z=8 통로와 X=0 통로만 남기고 나머지를 벽으로 나눈다
    if (f == 10) {
        blocks.fill(MAT_WALL, world(-6, y, 6), world(2, y + 2, 6), FillOperation.Replace)
        blocks.fill(MAT_WALL, world(-6, y, 10), world(-2, y + 2, 10), FillOperation.Replace)
        blocks.fill(MAT_WALL, world(-4, y, 12), world(-4, y + 2, 20), FillOperation.Replace)
        blocks.fill(MAT_WALL, world(-20, y, 12), world(-20, y + 2, 18), FillOperation.Replace)
        blocks.fill(MAT_WALL, world(-24, y, -2), world(-18, y + 2, -2), FillOperation.Replace)
        loops.pause(400)
    }

    // --- 11층 : 신호 증폭기 ---
    if (f == 11) {
        blocks.fill(MAT_WALL, world(-21, y, -15), world(-21, y + 2, -9), FillOperation.Replace)
        blocks.fill(MAT_WALL, world(-15, y, -15), world(-15, y + 2, -9), FillOperation.Replace)
        blocks.place(MAT_CORE, world(-18, y + 2, -14))
        loops.pause(400)
    }

    // --- 12층 : 봉인 격납고 ---
    if (f == 12) {
        // 갱도에서 서쪽으로 무너진 통로. dive12 2단계가 뚫는다
        blocks.fill(MAT_RUBBLE, world(-22, y, 8), world(-13, y, 8), FillOperation.Replace)
        loops.pause(400)
        // 격납고 벽과 문
        blocks.fill(MAT_WALL, world(-31, y, 4), world(-25, y + 2, 4), FillOperation.Replace)
        blocks.fill(MAT_WALL, world(-31, y, 12), world(-25, y + 2, 12), FillOperation.Replace)
        blocks.fill(MAT_WALL, world(-25, y, 4), world(-25, y + 2, 12), FillOperation.Replace)
        blocks.fill(AIR, world(-25, y, 8), world(-25, y + 1, 8), FillOperation.Replace)
        loops.pause(400)
        // 최초의 에이전트가 서 있던 단상. 서는 칸은 비워둔다
        blocks.fill(MAT_SIGNAL, world(-30, y - 1, 6), world(-26, y - 1, 10), FillOperation.Replace)
        blocks.place(MAT_CORE, world(-28, y - 1, 8))
        blocks.place(MAT_LAMP, world(-28, y + 2, 8))
        blocks.place(MAT_PIPE, world(-30, y, 6))
        blocks.place(MAT_PIPE, world(-30, y, 10))
        blocks.place(MAT_PIPE, world(-26, y, 6))
        blocks.place(MAT_PIPE, world(-26, y, 10))
        loops.pause(400)
    }
}

// ============================================================
// 층 하나를 통째로 짓는다
// 순서 주의 — floorProps 로 바닥을 걷어낸 뒤에 signalMark 를 올려야
// 9층 신호 지점이 붕괴 구멍 속에서 섬으로 살아남는다
// ============================================================

function buildOneFloor(f: number) {
    carveFloor(f)
    buildHall(f)
    floorDots(f)
    ceilingLights(f)
    perimeter(f)
    floorProps(f)
    signalMark(f)
    // 갱도가 이 층을 관통하도록 마지막에 뚫는다
    blocks.fill(AIR, world(-13, floorY(f) - 1, 7), world(-11, floorY(f) + 3, 9), FillOperation.Replace)
    loops.pause(300)
}

// ============================================================
// 수직 갱도 — 지상부터 12층까지 관통
// ============================================================

function buildShaft() {
    blocks.fill(MAT_SHELL, world(-14, 62, 6), world(-10, 79, 10), FillOperation.Replace)
    loops.pause(400)
    blocks.fill(AIR, world(-13, 62, 7), world(-11, 79, 9), FillOperation.Replace)
    loops.pause(400)
    blocks.fill(AIR, world(-13, 14, 7), world(-11, 61, 9), FillOperation.Replace)
    loops.pause(400)
    // 갱도 벽면 유도등 — 한 층마다 하나씩. 내려가는 동안 층이 지나가는 게 보인다
    for (let i = 0; i < 12; i++) {
        let f = i + 1
        blocks.place(MAT_LAMP, world(-14, floorY(f) + 1, 8))
    }
    loops.pause(300)
}

// ============================================================
// 채팅 명령
// ============================================================

player.onChat("buildall", function () {
    player.say("지하 시설 건설 시작")
    for (let i = 0; i < 12; i++) {
        let f = i + 1
        buildOneFloor(f)
        player.say(f)
    }
    buildShaft()
    player.say("지하 시설 건설 완료")
})

player.onChat("buildone", function () {
    buildOneFloor(buildFloor)
    player.say(buildFloor)
    player.say("층 완료")
})

player.onChat("reset", function () {
    buildOneFloor(buildFloor)
    player.say(buildFloor)
    player.say("층 복구 완료")
})

player.onChat("shaft", function () {
    buildShaft()
    player.say("갱도 관통 완료")
})

player.onChat("check", function () {
    for (let i = 0; i < 12; i++) {
        let f = i + 1
        agent.teleport(world(-12, floorY(f), 8), WEST)
        loops.pause(1200)
        player.say(f)
    }
    player.say("전층 확인 완료")
})

player.onChat("checksig", function () {
    for (let i = 0; i < 12; i++) {
        let f = i + 1
        agent.teleport(world(signalX(f), floorY(f), signalZ(f)), WEST)
        loops.pause(1200)
        player.say(f)
    }
    player.say("신호 지점 확인 완료")
})
