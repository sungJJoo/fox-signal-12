// 아이용 웹 교재의 12개 층 콘텐츠 원본
// 이 파일 하나만 고치면 표지와 층 페이지가 함께 바뀐다.

window.FLOORS = [
  {
    n: 1,
    y: 58, x: -12, z: 8,
    title: "관제실 개소",
    subtitle: "좌표를 읽는다",
    learn: "X · Y · Z 좌표 읽기",
    cmds: ["mark", "spin"],
    story:
      "3주 전부터 지하에서 신호가 올라와. 신호는 언제나 같은 숫자 세 개만 반복해.\n\n" +
      "연구소는 그게 좌표라는 걸 알아냈어. 하지만 사람은 내려갈 수 없어.\n" +
      "내려갈 수 있는 건 에이전트뿐이야.\n\n" +
      "오늘부터 너는 관제실 오퍼레이터다.",
    mission: [
      "설정에서 좌표 보기를 켠다",
      "앞으로 걸어보고 세 숫자 중 뭐가 변하는지 확인한다",
      "옆으로도 걸어보고, 제자리에서 점프도 해본다",
      "mark 명령을 만들어 에이전트를 불러온다",
      "spin 명령으로 주변을 한 바퀴 확인한다"
    ],
    code:
      'player.onChat("mark", function () {\n' +
      '    agent.teleportToPlayer()\n' +
      '    loops.pause(400)\n' +
      '    player.say("관제 시작 지점 확보")\n' +
      '})\n\n' +
      'player.onChat("spin", function () {\n' +
      '    for (let i = 0; i < 4; i++) {\n' +
      '        agent.turn(RIGHT_TURN)\n' +
      '        loops.pause(400)\n' +
      '    }\n' +
      '    player.say("주변 확인 완료")\n' +
      '})',
    observe: [
      "앞으로 걸었을 때 변한 숫자는 어느 것?",
      "제자리에서 점프했을 때 변한 숫자는?",
      "관제를 시작한 좌표 세 개를 적어봐",
      "신호의 58은 우리보다 위일까 아래일까? 왜 그렇게 생각해?"
    ],
    stretch: [
      "spin 의 반복 횟수 4를 8로 바꾸면 어떻게 될까. 먼저 예상하고 실행해봐",
      "이 월드에서 Y가 가장 낮은 곳은 얼마까지 내려갈까"
    ],
    tip: "좌표는 화면 왼쪽 위에 있어. 안 보이면 설정 → 게임 → 좌표 보기를 켜."
  },

  {
    n: 2,
    y: 54, x: -12, z: 14,
    title: "첫 하강",
    subtitle: "Y가 곧 깊이다",
    learn: "위아래 이동, 반복 횟수",
    cmds: ["dive", "rise"],
    story:
      "갱도 뚜껑이 열렸어. 아래는 완전히 캄캄해.\n\n" +
      "관제실 화면에 새 신호가 떴어. 어제는 58이었는데 오늘은 54야.\n" +
      "신호가 더 아래로 내려갔어.",
    mission: [
      "지난주 프로젝트를 연다 — 새로 만들지 않는다",
      "agent.move(DOWN, 1) 을 하나만 만들어 실행한다",
      "dive 명령을 만든다. 실행 전에 Y가 얼마나 줄지 먼저 말해본다",
      "rise 명령은 혼자 만들어본다. DOWN 을 UP 으로 바꾸면 돼",
      "반복 횟수를 4 → 8 → 12 로 바꿔가며 표를 채운다"
    ],
    code:
      'player.onChat("dive", function () {\n' +
      '    for (let i = 0; i < 4; i++) {\n' +
      '        agent.move(DOWN, 1)\n' +
      '        loops.pause(300)\n' +
      '    }\n' +
      '    player.say("한 층 하강")\n' +
      '})\n\n' +
      'player.onChat("rise", function () {\n' +
      '    for (let i = 0; i < 4; i++) {\n' +
      '        agent.move(UP, 1)\n' +
      '        loops.pause(300)\n' +
      '    }\n' +
      '    player.say("한 층 상승")\n' +
      '})',
    observe: [
      "dive 한 번에 Y가 얼마나 줄었어?",
      "반복 횟수 8로 바꾸면? (예상 → 실제)",
      "반복 횟수 12로 바꾸면? (예상 → 실제)",
      "지하 5층까지 가려면 dive 를 몇 번 쳐야 해?",
      "dive 를 50번 치라고 하면 너는 어떻게 할래?"
    ],
    stretch: [
      "dive 와 rise 를 번갈아 실행하면 정확히 제자리로 돌아올까",
      "agent.move(DOWN, 4) 한 줄과 move(DOWN, 1) 을 4번 반복하는 건 결과가 같을까. 과정은?"
    ],
    tip: "명령이 절반만 실행되면 loops.pause 가 빠진 거야. 에이전트도 쉴 틈이 필요해."
  },

  {
    n: 3,
    y: 50, x: -4, z: 8,
    title: "좌표 투입",
    subtitle: "절대 좌표로 직접 보낸다",
    learn: "agent.teleport 와 world(x, y, z)",
    cmds: ["drop", "home"],
    story:
      "3층 신호는 갱도에서 멀리 떨어진 곳에서 와.\n" +
      "걸어서 보내면 몇 분이 걸려.\n\n" +
      "관제실에는 더 빠른 방법이 있어. 좌표를 직접 찍어서 투입하는 것.",
    mission: [
      "drop 명령을 만들어 3층 신호 지점으로 곧장 보낸다",
      "화면 좌표가 -4 / 50 / 8 인지 확인한다",
      "world 를 pos 로 바꿔서 실행해본다. 어디로 가는지 확인",
      "플레이어가 멀리 이동한 뒤 두 명령을 각각 다시 실행한다",
      "확인이 끝나면 반드시 world 로 되돌린다",
      "home 명령의 좌표는 혼자 채워본다"
    ],
    code:
      'player.onChat("drop", function () {\n' +
      '    agent.teleport(world(-4, 50, 8), WEST)\n' +
      '    loops.pause(400)\n' +
      '    player.say("3층 신호 지점 도착")\n' +
      '})\n\n' +
      'player.onChat("home", function () {\n' +
      '    agent.teleport(world(-12, 58, 8), WEST)\n' +
      '    loops.pause(400)\n' +
      '    player.say("갱도 입구 복귀")\n' +
      '})',
    observe: [
      "world 로 실행했을 때 도착한 좌표는?",
      "pos 로 바꿔서 실행했을 때 도착한 좌표는?",
      "내가 멀리 이동한 뒤 다시 실행하면 world 는 어떻게 돼?",
      "pos 는 어떻게 돼?",
      "world 와 pos 의 차이를 한 문장으로 써봐"
    ],
    stretch: [
      "Y만 바꿔서 실행하면 어떻게 될까. X와 Z만 바꾸면?",
      "없는 좌표(예: Y를 300)를 넣으면 에이전트는 어떻게 될까",
      "마지막 값 WEST 를 EAST 로 바꾸면 뭐가 달라질까. 위치? 방향?"
    ],
    tip: "world 는 지도 위의 그 지점. pos 는 내 위치에서 그만큼 떨어진 곳. 완전히 달라."
  },

  {
    n: 4,
    y: 46, x: -20, z: 8,
    title: "숫자에 이름 붙이기",
    subtitle: "변수",
    learn: "변수",
    cmds: ["go4"],
    story:
      "4층 신호는 3층과 반대편에서 와.\n\n" +
      "관제실 기록관이 한마디 해.\n" +
      '"매번 코드를 뒤져서 숫자를 고칠 거야? 열두 층인데?"',
    mission: [
      "3차시 drop 을 4층용으로 고쳐본다. 숫자를 세 개 다 바꿔야 한다",
      "다시 5층용으로 고친다. 또 세 개",
      "귀찮아졌으면 성공이다. 이제 숫자를 밖으로 꺼낸다",
      "변수 세 개를 만들고 이름을 직접 지어본다",
      "world 블록의 숫자 자리에 변수 블록을 끼워 넣는다",
      "맨 위 세 줄만 고쳐서 여러 층으로 보내본다"
    ],
    code:
      'let signalX = -20\n' +
      'let signalY = 46\n' +
      'let signalZ = 8\n\n' +
      'player.onChat("go4", function () {\n' +
      '    agent.teleport(world(signalX, signalY, signalZ), WEST)\n' +
      '    loops.pause(400)\n' +
      '    player.say(signalY)\n' +
      '})',
    observe: [
      "내가 지은 변수 이름 세 개는?",
      "왜 그렇게 이름 지었어?",
      "3차시 방식이랑 뭐가 달라졌어? 한 문장으로",
      "목적지를 바꿀 때 이제 몇 군데를 고치면 돼?"
    ],
    stretch: [
      "변수 이름을 a, b, c 로 바꿔놓고 다음 주에 열어봐. 무슨 숫자인지 알 수 있을까",
      "signalY 는 코드 두 군데에서 쓰이고 있어. 값을 한 번 바꾸면 두 곳이 다 바뀔까"
    ],
    tip: "변수는 onChat 안이 아니라 맨 위 바깥에 만들어야 해. 안에 있으면 매번 처음으로 돌아가."
  },

  {
    n: 5,
    y: 42, x: -12, z: -2,
    title: "층 계산기",
    subtitle: "규칙을 코드로 만든다",
    learn: "변수끼리 계산하기",
    cmds: ["floor", "sig5"],
    key: true,
    story:
      "Z가 처음으로 마이너스로 넘어갔어.\n\n" +
      "그리고 관제실 기록관이 지금까지의 층별 Y를 표로 붙여놨어.\n" +
      "58 · 54 · 50 · 46 · 42 ...\n\n" +
      '"너, 이거 안 보여?"',
    mission: [
      "종이에 1~4층 Y를 적는다. 58 / 54 / 50 / 46",
      "층이 1 늘 때마다 Y는 몇씩 변하는지 찾는다",
      "0층이 있다면 Y는 몇일지 거꾸로 계산한다",
      "식을 만든다 → Y = 62 - 층 × 4",
      "종이로 먼저 검산한다. 3층 넣으면 50 나오나? 12층은?",
      "식을 코드로 옮긴다. 곱하기가 빼기 안에 들어가야 한다",
      "targetFloor 만 1~12 로 바꿔가며 실행한다"
    ],
    code:
      'let targetFloor = 5\n\n' +
      'player.onChat("floor", function () {\n' +
      '    let depth = 62 - targetFloor * 4\n' +
      '    agent.teleport(world(-12, depth, 8), WEST)\n' +
      '    loops.pause(400)\n' +
      '    player.say(depth)\n' +
      '})\n\n' +
      'player.onChat("sig5", function () {\n' +
      '    agent.teleport(world(-12, 42, -2), WEST)\n' +
      '    loops.pause(400)\n' +
      '    player.say("5층 신호 지점 도착")\n' +
      '})',
    observe: [
      "층이 1 늘 때마다 Y는 몇씩 변해?",
      "식을 그대로 적어봐",
      "6층부터 12층까지 Y를 계산해서 적어봐 (게임으로 확인하기 전에!)",
      "코드를 안 고치고 층을 바꿀 수 있었던 이유는?"
    ],
    stretch: [
      "지하 20층이 있다면 Y는? 계산하면 -18이 나와. 실제로 넣으면 어떻게 될까. 왜?",
      "층 간격이 4가 아니라 6이라면 식은 어떻게 바뀔까",
      "62 를 다른 숫자로 바꾸면 뭐가 달라질까"
    ],
    tip: "오늘이 제일 중요한 날이야. 아직 아무도 안 가본 12층 좌표를 계산으로 먼저 알아냈어."
  },

  {
    n: 6,
    y: 38, x: 0, z: 16,
    title: "꺼진 조명",
    subtitle: "개수와 간격을 변수로",
    learn: "블록 설치, 슬롯, 개수·간격 변수",
    cmds: ["sig6", "light"],
    slot: "슬롯 1 → 글로우스톤",
    story:
      "6층은 조명이 전부 죽어 있어. 화면이 새까매.\n\n" +
      "에이전트는 볼 수 있지만 관제실은 아무것도 못 봐.\n" +
      "유도등을 바닥에 심어야 해.",
    mission: [
      "sig6 로 6층에 보낸다. 화면이 어두운 걸 확인한다",
      "에이전트를 우클릭해 슬롯 1에 글로우스톤이 있는지 본다",
      "setSlot(1) 다음에 place(DOWN) 만 실행해본다 — 안 될 거다",
      "왜 안 되는지 생각해본다. 발밑에 뭐가 있지?",
      "destroy(DOWN) 을 앞에 붙여서 다시 실행한다",
      "light 명령을 완성한다",
      "lampCount 와 lampGap 을 따로따로 바꿔가며 표를 채운다"
    ],
    code:
      'let lampCount = 5\n' +
      'let lampGap = 3\n\n' +
      'player.onChat("sig6", function () {\n' +
      '    agent.teleport(world(0, 38, 16), WEST)\n' +
      '    loops.pause(400)\n' +
      '    player.say("6층 진입. 조명 없음")\n' +
      '})\n\n' +
      'player.onChat("light", function () {\n' +
      '    agent.setSlot(1)\n' +
      '    loops.pause(200)\n' +
      '    for (let i = 0; i < lampCount; i++) {\n' +
      '        agent.destroy(DOWN)\n' +
      '        loops.pause(300)\n' +
      '        agent.place(DOWN)\n' +
      '        loops.pause(300)\n' +
      '        agent.move(FORWARD, lampGap)\n' +
      '        loops.pause(400)\n' +
      '    }\n' +
      '    player.say("유도등 설치 완료")\n' +
      '})',
    observe: [
      "destroy 없이 place 만 했을 때 왜 안 됐을까?",
      "lampCount 5 / lampGap 3 → 결과는?",
      "lampCount 10 / lampGap 3 → 결과는?",
      "lampCount 5 / lampGap 6 → 결과는?",
      "두 변수는 각각 무엇을 바꾸는 거야?"
    ],
    stretch: [
      "유도등 10개를 2칸 간격으로 깔려면 두 숫자를 어떻게? 마지막 등은 몇 칸 앞?",
      "lampGap 을 0으로 하면 어떻게 될까. 왜?",
      "슬롯 1의 블록을 바꾸면 유도등 대신 뭐가 깔릴까"
    ],
    tip: "순서가 결과를 만들어. place → destroy 로 거꾸로 하면 놓았다가 다시 부숴.",
    shot: true
  },

  {
    n: 7,
    y: 34, x: -24, z: 20,
    title: "무너진 통로",
    subtitle: "조건 판단",
    learn: "if / else 와 detect",
    cmds: ["sig7", "clear"],
    slot: "슬롯 1 → 글로우스톤 (지난주 유지)",
    story:
      "7층 통로는 군데군데 무너져 있어. 어디가 막혔는지는 내려가 봐야 알아.\n\n" +
      "관제실은 볼 수 없어.\n" +
      "그렇다면 에이전트가 스스로 판단하게 해야 해.",
    mission: [
      "sig7 로 7층에 보낸다",
      "agent.move(FORWARD, 12) 를 그냥 실행해본다. 막힌 데서 멈춘다",
      "12번 다 부수라고 하면? 그것도 아니다",
      "look 명령으로 detect 를 혼자 써본다. 막힌 곳과 뚫린 곳에서 각각",
      "clear 명령을 만든다. 반복 안에 조건이 들어가는 첫 구조다",
      "막힌 구간과 뚫린 구간에서 각각 실행해 비교한다",
      "collectAll 을 지우고 실행해본다. 부순 블록이 어디로 가는지"
    ],
    code:
      'let steps = 12\n\n' +
      'player.onChat("look", function () {\n' +
      '    if (agent.detect(AgentDetection.Block, FORWARD)) {\n' +
      '        player.say("앞이 막혔다")\n' +
      '    } else {\n' +
      '        player.say("앞이 비었다")\n' +
      '    }\n' +
      '})\n\n' +
      'player.onChat("sig7", function () {\n' +
      '    agent.teleport(world(-24, 34, 20), EAST)\n' +
      '    loops.pause(400)\n' +
      '    player.say("7층 진입. 통로 붕괴 확인")\n' +
      '})\n\n' +
      'player.onChat("clear", function () {\n' +
      '    for (let i = 0; i < steps; i++) {\n' +
      '        if (agent.detect(AgentDetection.Block, FORWARD)) {\n' +
      '            agent.destroy(FORWARD)\n' +
      '            loops.pause(300)\n' +
      '            agent.collectAll()\n' +
      '            loops.pause(300)\n' +
      '        } else {\n' +
      '            agent.move(FORWARD, 1)\n' +
      '            loops.pause(300)\n' +
      '        }\n' +
      '    }\n' +
      '    player.say("통로 확보")\n' +
      '})',
    observe: [
      "막힌 곳에서 clear 를 실행하면 에이전트는 뭘 해?",
      "뚫린 곳에서 실행하면?",
      "같은 코드인데 왜 다르게 움직여?",
      "if 는 무슨 뜻이야? else 는?",
      "collectAll 을 지우면 어떻게 돼?"
    ],
    stretch: [
      "if 와 else 안의 내용을 통째로 바꾸면? 실행 전에 예상해봐",
      "FORWARD 를 DOWN 으로 바꾸면 에이전트는 뭘 확인하게 될까",
      "steps 를 30으로 늘리면 어디까지 갈까"
    ],
    tip: "else 블록이 안 보이면 if 블록 왼쪽 아래 톱니바퀴를 눌러."
  },

  {
    n: 8,
    y: 30, x: -6, z: -10,
    title: "물이 찬 층",
    subtitle: "길이를 변수로",
    learn: "재고 나서 코딩하기",
    cmds: ["sig8", "bridge"],
    slot: "슬롯 1 → 석재 (글로우스톤에서 교체)",
    story:
      "8층은 물에 잠겼어. 통로도 바닥도 안 보여.\n\n" +
      "부술 것도 없어. 밟을 것을 만들면서 가야 해.",
    mission: [
      "슬롯 1의 글로우스톤을 석재로 바꾼다",
      "sig8 로 8층에 보낸다",
      "destroy 없이 place(DOWN) 만 해본다 — 이번엔 된다",
      "왜 6층에서는 안 됐는데 여기서는 될까 생각해본다",
      "물의 폭을 직접 잰다. 물 시작 Z 와 끝 Z 를 읽고 뺀다",
      "잰 숫자를 bridgeLength 에 넣고 한 번에 건넌다",
      "일부러 3 모자라게 넣어 실행해본다"
    ],
    code:
      'let bridgeLength = 10\n\n' +
      'player.onChat("sig8", function () {\n' +
      '    agent.teleport(world(-6, 30, -10), SOUTH)\n' +
      '    loops.pause(400)\n' +
      '    player.say("8층 진입. 침수 확인")\n' +
      '})\n\n' +
      'player.onChat("bridge", function () {\n' +
      '    agent.setSlot(1)\n' +
      '    loops.pause(200)\n' +
      '    for (let i = 0; i < bridgeLength; i++) {\n' +
      '        agent.place(DOWN)\n' +
      '        loops.pause(300)\n' +
      '        agent.move(FORWARD, 1)\n' +
      '        loops.pause(300)\n' +
      '    }\n' +
      '    player.say("안전 통로 완성")\n' +
      '})',
    observe: [
      "물 시작 Z는?",
      "물 끝 Z는?",
      "필요한 길이는? (끝 − 시작)",
      "6층에서는 destroy 가 필요했는데 8층에서는 왜 필요 없었어?",
      "3 모자라게 넣었을 때 어디서 멈췄어? 좌표로 적어봐"
    ],
    stretch: [
      "통로 폭을 2칸으로 만들려면? 명령을 두 번 쓰는 것과 코드를 고치는 것 중 뭐가 나을까",
      "place(DOWN) 을 place(FORWARD) 로 바꾸면 뭐가 만들어질까",
      "7층 clear 처럼 if 를 넣어 '차 있으면 부수고 놓기'로 바꿀 수 있을까"
    ],
    tip: "짐작하지 말고 재. 좌표가 있으니까 정확한 숫자를 알 수 있어.",
    shot: true
  },

  {
    n: 9,
    y: 26, x: -28, z: 4,
    title: "바닥이 없다",
    subtitle: "이중 반복",
    learn: "반복 안에 반복 넣기",
    cmds: ["sig9", "deck"],
    slot: "슬롯 1 → 석재 64개",
    story:
      "9층은 바닥이 통째로 내려앉았어. 발 디딜 곳이 없어.\n\n" +
      "한 줄짜리 통로로는 부족해. 네모난 착륙 발판을 만들어야 해.",
    mission: [
      "컴퓨터를 켜지 말고 종이에 정사각형을 그린다",
      "에이전트에게 시킬 순서를 종이에 문장으로 쓴다",
      "뭘 네 번 반복했는지 찾는다",
      "한 변만 먼저 코드로 만든다 (8차시 bridge 와 같은 구조다)",
      "바깥에 반복을 하나 더 감싼다",
      "turn 을 안쪽 반복 안에 넣고 실행해본다 — 제자리를 돈다",
      "turn 을 안쪽 반복 뒤로 옮긴다",
      "deckSide 를 바꿔가며 필요한 블록 수를 먼저 계산한다"
    ],
    code:
      'let deckSide = 6\n\n' +
      'player.onChat("sig9", function () {\n' +
      '    agent.teleport(world(-28, 26, 4), EAST)\n' +
      '    loops.pause(400)\n' +
      '    player.say("9층 진입. 바닥 붕괴")\n' +
      '})\n\n' +
      'player.onChat("deck", function () {\n' +
      '    agent.setSlot(1)\n' +
      '    loops.pause(200)\n' +
      '    for (let side = 0; side < 4; side++) {\n' +
      '        for (let i = 0; i < deckSide; i++) {\n' +
      '            agent.place(DOWN)\n' +
      '            loops.pause(300)\n' +
      '            agent.move(FORWARD, 1)\n' +
      '            loops.pause(300)\n' +
      '        }\n' +
      '        agent.turn(RIGHT_TURN)\n' +
      '        loops.pause(300)\n' +
      '    }\n' +
      '    player.say("착륙 발판 완성")\n' +
      '})',
    observe: [
      "종이에 쓴 순서를 옮겨 적어봐",
      "바깥 반복은 무엇을 세는 거야? (한 단어로)",
      "안쪽 반복은 무엇을 세는 거야?",
      "deckSide 6일 때 블록은 몇 개 필요할까. 계산으로 먼저",
      "실제로는 몇 개 썼어?"
    ],
    stretch: [
      "4 를 3 으로 바꾸면 뭐가 만들어질까. 6 으로 바꾸면? 각도가 맞을까",
      "RIGHT_TURN 을 LEFT_TURN 으로 바꾸면 어느 방향으로 그려질까",
      "발판을 2층으로 쌓으려면 move(UP, 1) 을 어디에 넣어야 할까"
    ],
    tip: "코드보다 종이가 먼저야. 순서를 못 쓰면 코드도 못 짜.",
    shot: true
  },

  {
    n: 10,
    y: 22, x: 0, z: 22,
    title: "길을 표시하라",
    subtitle: "슬롯 전환",
    learn: "setSlot 으로 재료 바꾸기",
    cmds: ["sig10", "tag", "stripe"],
    slot: "슬롯 1 → 석재, 슬롯 2 → 눈에 띄는 색 블록",
    story:
      "10층은 갈림길이 많아. 에이전트가 어디를 지나왔는지 관제실에서는 알 수 없어.\n" +
      "같은 길을 두 번 가고 있는지도 몰라.\n\n" +
      "지나온 자리에 표식을 남겨야 해.",
    mission: [
      "에이전트 인벤토리를 열어 슬롯 1과 2를 확인한다",
      "슬롯을 바꿔가며 두 칸에 서로 다른 블록을 놓아본다",
      "setSlot(2) 를 지우고 실행해본다. 뭐가 달라지는지",
      "tag 명령을 만든다. 6차시 light 와 구조가 같다",
      "stripe 명령을 만든다. 반복 한 번에 두 칸이 깔린다",
      "실행 전에 길이가 몇 칸이 될지 예상한다",
      "반복 횟수와 슬롯 순서를 바꿔 나만의 무늬를 만든다"
    ],
    code:
      'let tagCount = 5\n' +
      'let tagGap = 4\n\n' +
      'player.onChat("sig10", function () {\n' +
      '    agent.teleport(world(0, 22, 22), WEST)\n' +
      '    loops.pause(400)\n' +
      '    player.say("10층 진입. 갈림길 다수")\n' +
      '})\n\n' +
      'player.onChat("tag", function () {\n' +
      '    for (let i = 0; i < tagCount; i++) {\n' +
      '        agent.setSlot(2)\n' +
      '        loops.pause(200)\n' +
      '        agent.destroy(DOWN)\n' +
      '        loops.pause(300)\n' +
      '        agent.place(DOWN)\n' +
      '        loops.pause(300)\n' +
      '        agent.move(FORWARD, tagGap)\n' +
      '        loops.pause(400)\n' +
      '    }\n' +
      '    player.say("경로 표식 완료")\n' +
      '})',
    observe: [
      "슬롯 1과 슬롯 2에는 각각 뭐가 들어 있어?",
      "setSlot 을 안 쓰면 어떻게 돼?",
      "stripe 는 반복 6번인데 길이가 몇 칸이야?",
      "왜 반복 횟수랑 길이가 달라?"
    ],
    stretch: [
      "슬롯 3에 또 다른 블록을 넣고 세 가지 색 무늬를 만들어봐",
      "tagGap 을 1로 하면 tag 와 stripe 는 뭐가 달라질까",
      "표식을 바닥이 아니라 벽에 남기려면 place(DOWN) 을 어떻게 바꿔야 할까"
    ],
    tip: "setSlot 을 안 쓰면 마지막에 고른 칸이 계속 유지돼.",
    shot: true
  },

  {
    n: 11,
    y: 18, x: -18, z: -12,
    title: "전층 스캔",
    subtitle: "변수를 하나씩 늘린다",
    learn: "변수 누적",
    cmds: ["sig11", "scan"],
    key: true,
    story:
      "신호가 갑자기 강해졌어. 12층이 코앞이야.\n\n" +
      "관제실은 마지막 점검을 지시해. 1층부터 11층까지 전부 다시 훑을 것.\n" +
      "층마다 명령을 만들면 열한 개야. 하나로 끝낼 방법이 있어.",
    mission: [
      "5차시 floor 명령을 targetFloor 만 바꿔가며 11번 실행해본다",
      "지루해지면 멈춘다. 지금 뭘 반복한 거지?",
      "count 명령으로 변수 누적을 먼저 확인한다. 1 2 3 4 5 가 찍힌다",
      "scan 명령을 만든다",
      "맨 앞 초기화 줄을 지우고 두 번 연속 실행해본다",
      "반복 횟수, 초기값, + 1 을 각각 바꿔가며 실험한다"
    ],
    code:
      'let scanFloor = 1\n\n' +
      'player.onChat("count", function () {\n' +
      '    scanFloor = 1\n' +
      '    for (let i = 0; i < 5; i++) {\n' +
      '        player.say(scanFloor)\n' +
      '        scanFloor = scanFloor + 1\n' +
      '    }\n' +
      '})\n\n' +
      'player.onChat("sig11", function () {\n' +
      '    agent.teleport(world(-18, 18, -12), WEST)\n' +
      '    loops.pause(400)\n' +
      '    player.say("11층 진입. 신호 강함")\n' +
      '})\n\n' +
      'player.onChat("scan", function () {\n' +
      '    scanFloor = 1\n' +
      '    for (let i = 0; i < 11; i++) {\n' +
      '        let scanY = 62 - scanFloor * 4\n' +
      '        agent.teleport(world(-12, scanY, 8), WEST)\n' +
      '        loops.pause(700)\n' +
      '        player.say(scanY)\n' +
      '        scanFloor = scanFloor + 1\n' +
      '    }\n' +
      '    player.say("전층 스캔 완료")\n' +
      '})',
    observe: [
      "채팅창에 찍힌 Y 열한 개를 순서대로 적어봐",
      "scanFloor = scanFloor + 1 은 무슨 뜻이야? 한 문장으로",
      "맨 앞 초기화 줄을 지우고 두 번 실행하면 어떻게 돼?",
      "+ 1 을 + 2 로 바꾸면 어떤 층만 가?",
      "12층 Y는 얼마야? 다음 주에 거기로 간다"
    ],
    stretch: [
      "12층부터 1층까지 거꾸로 올라가게 하려면 뭘 바꿔야 할까",
      "스캔하면서 각 층에 표식을 남기려면 어디에 뭘 넣어야 할까",
      "loops.pause(700) 을 100으로 줄이면 어떻게 될까. 왜?"
    ],
    tip: "scanFloor = scanFloor + 1 은 수학의 등호랑 달라. '오른쪽을 계산해서 왼쪽에 다시 넣는다'는 뜻이야."
  },

  {
    n: 12,
    y: 14, x: -12, z: 8,
    title: "신호원",
    subtitle: "전체 통합과 발표",
    learn: "새 문법 없음. 지금까지 배운 걸 잇는다",
    cmds: ["dive12", "mine"],
    slot: "슬롯 1 → 석재, 슬롯 2 → 글로우스톤",
    story:
      "마지막 신호가 왔어. X도 Z도 갱도와 똑같아.\n\n" +
      "열두 주 동안 옆으로 옮겨다니며 찾았는데,\n" +
      "신호는 계속 우리 발밑에 있었어.",
    mission: [
      "1층 갱도 입구 좌표와 12층 신호 좌표를 비교한다",
      "코드를 열기 전에 네 단계를 종이에 쓴다",
      "dive12 를 조립한다. 새로 짜지 말고 이전 차시 코드를 복사한다",
      "실행한다. 2~3분 걸린다",
      "3단계와 2단계 순서를 바꿔 실행해본다",
      "mine 템플릿에 나만의 루틴을 만든다",
      "1분 동안 발표한다"
    ],
    code:
      'let missionFloor = 12\n' +
      'let deckSize = 5\n\n' +
      'player.onChat("dive12", function () {\n' +
      '    let missionY = 62 - missionFloor * 4\n' +
      '    agent.teleport(world(-12, missionY, 8), WEST)\n' +
      '    loops.pause(600)\n' +
      '    player.say(missionY)\n\n' +
      '    for (let i = 0; i < 10; i++) {\n' +
      '        if (agent.detect(AgentDetection.Block, FORWARD)) {\n' +
      '            agent.destroy(FORWARD)\n' +
      '            loops.pause(300)\n' +
      '            agent.collectAll()\n' +
      '            loops.pause(300)\n' +
      '        } else {\n' +
      '            agent.move(FORWARD, 1)\n' +
      '            loops.pause(300)\n' +
      '        }\n' +
      '    }\n' +
      '    player.say("통로 확보")\n\n' +
      '    agent.setSlot(1)\n' +
      '    loops.pause(200)\n' +
      '    for (let side = 0; side < 4; side++) {\n' +
      '        for (let i = 0; i < deckSize; i++) {\n' +
      '            agent.destroy(DOWN)\n' +
      '            loops.pause(300)\n' +
      '            agent.place(DOWN)\n' +
      '            loops.pause(300)\n' +
      '            agent.move(FORWARD, 1)\n' +
      '            loops.pause(300)\n' +
      '        }\n' +
      '        agent.turn(RIGHT_TURN)\n' +
      '        loops.pause(300)\n' +
      '    }\n' +
      '    player.say("착륙 발판 완성")\n\n' +
      '    agent.setSlot(2)\n' +
      '    loops.pause(200)\n' +
      '    for (let i = 0; i < 3; i++) {\n' +
      '        agent.destroy(DOWN)\n' +
      '        loops.pause(300)\n' +
      '        agent.place(DOWN)\n' +
      '        loops.pause(300)\n' +
      '        agent.move(FORWARD, 2)\n' +
      '        loops.pause(400)\n' +
      '    }\n' +
      '    player.say("신호원 도달")\n' +
      '})\n\n' +
      'let myFloor = 1\n' +
      'let mySize = 4\n\n' +
      'player.onChat("mine", function () {\n' +
      '    let myY = 62 - myFloor * 4\n' +
      '    agent.teleport(world(-12, myY, 8), WEST)\n' +
      '    loops.pause(600)\n' +
      '    player.say("나만의 관제 루틴 시작")\n\n' +
      '    // ↓ 여기에 직접 이어붙인다\n\n' +
      '    player.say("루틴 종료")\n' +
      '})',
    observe: [
      "1층 갱도 좌표와 12층 신호 좌표를 나란히 적어봐. 뭐가 같아?",
      "네 단계를 순서대로 적어봐. 각각 몇 차시 것을 썼어?",
      "3단계와 2단계 순서를 바꾸면 어떻게 됐어?",
      "내 루틴 이름은? 어떤 변수를 뒀어?",
      "그 변수를 바꾸면 뭐가 달라져?",
      "잘 안 된 건 뭐였어?",
      "열두 주 중에 제일 기억에 남는 층은? 왜?"
    ],
    stretch: [
      "12층에서 지상까지 되돌아 올라오는 루틴을 만들어봐",
      "scan 을 12층까지 늘리고, 층마다 표식을 남기게 고쳐봐",
      "내가 만들고 싶은 층을 하나 설계해봐. 좌표, 상황, 필요한 명령을 종이에"
    ],
    tip: "완성 못 해도 괜찮아. 뭘 바꿨고 결과가 어떻게 달라졌는지 기록하면 그게 성공이야.",
    shot: true,
    ending:
      "12층 안쪽에 오래된 에이전트 한 대가 서 있다.\n" +
      "30년 전 이 시설이 봉인될 때 혼자 남겨진 최초의 에이전트다.\n\n" +
      "신호는 좌표를 보내며 계속 이렇게 말하고 있었다.\n\n" +
      "\"여기 있어.\""
  }
];
