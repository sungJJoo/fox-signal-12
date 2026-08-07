// 웹 교재 공용 스크립트 — 이름별 기록 분리, 구글 시트 동기화, 표지·층 페이지 렌더링

(function () {
  "use strict";

  var F = window.FLOORS || [];
  var CFG = window.SIGNAL12_CONFIG || {};
  var SHEET = (CFG.SHEET_URL || "").trim();
  var TOKEN = (CFG.TOKEN || "").trim();

  var K_STUDENT = "signal12:student";
  var K_DATA = "signal12:data:";

  var syncTimer = null;
  var syncQueue = {};
  var syncState = "idle";

  /* ---------- 이름 ---------- */

  function student() {
    try {
      return localStorage.getItem(K_STUDENT) || "";
    } catch (e) {
      return "";
    }
  }

  function setStudent(name) {
    try {
      localStorage.setItem(K_STUDENT, name);
    } catch (e) { /* 저장 불가 환경이면 그냥 넘어간다 */ }
  }

  /* ---------- 저장소 ---------- */

  function load() {
    var who = student();
    if (!who) return {};
    try {
      return JSON.parse(localStorage.getItem(K_DATA + who) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveAll(data) {
    var who = student();
    if (!who) return;
    try {
      localStorage.setItem(K_DATA + who, JSON.stringify(data));
    } catch (e) { /* 용량 초과 등 */ }
  }

  function put(path, value, meta) {
    var d = load();
    d[path] = value;
    saveAll(d);
    if (meta) queueSync(path, value, meta);
  }

  function get(path) {
    return load()[path];
  }

  function floorDone(n) {
    var d = load();
    var prefix = "f" + n + ":";
    for (var k in d) {
      if (k.indexOf(prefix) === 0) {
        var v = d[k];
        if (v === true) return true;
        if (typeof v === "string" && v.trim() !== "") return true;
      }
    }
    return false;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ---------- 구글 시트 동기화 ---------- */
  // POST 는 Content-Type 을 text/plain 으로 보낸다.
  // application/json 으로 보내면 브라우저가 preflight(OPTIONS)를 먼저 던지는데
  // Apps Script 웹앱은 OPTIONS 를 처리하지 못해 요청이 통째로 실패한다.

  function setSyncState(s) {
    syncState = s;
    var el = document.getElementById("syncstate");
    if (!el) return;
    if (!SHEET) {
      el.textContent = "이 브라우저에만 저장";
      el.className = "syncstate off";
      return;
    }
    if (s === "saving") {
      el.textContent = "시트 저장 중";
      el.className = "syncstate busy";
    } else if (s === "ok") {
      el.textContent = "시트 저장됨";
      el.className = "syncstate ok";
    } else if (s === "fail") {
      el.textContent = "시트 연결 안 됨 (기록은 안전함)";
      el.className = "syncstate fail";
    } else {
      el.textContent = "시트 연결됨";
      el.className = "syncstate";
    }
  }

  function queueSync(key, value, meta) {
    if (!SHEET || !student()) return;
    syncQueue[key] = { value: value, floor: meta.floor, label: meta.label };
    clearTimeout(syncTimer);
    syncTimer = setTimeout(flushSync, 1500);
  }

  function flushSync() {
    if (!SHEET || !student()) return;
    var items = [];
    for (var k in syncQueue) {
      items.push({
        key: k,
        value: syncQueue[k].value,
        floor: syncQueue[k].floor,
        label: syncQueue[k].label
      });
    }
    if (!items.length) return;
    syncQueue = {};
    setSyncState("saving");

    postSheet(items).then(function (ok) {
      setSyncState(ok ? "ok" : "fail");
    });
  }

  function postSheet(items) {
    return fetch(SHEET, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "save",
        token: TOKEN,
        student: student(),
        items: items
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) { return !!(res && res.ok); })
      .catch(function () { return false; });
  }

  // 시트에서 이 이름의 기록을 가져와 로컬에 없는 항목만 채운다.
  // 로컬에 이미 쓴 내용을 시트 값이 덮어쓰지 않게 한다.
  function pullFromSheet(name) {
    if (!SHEET || !name) return Promise.resolve(0);
    setSyncState("saving");
    var url = SHEET + "?student=" + encodeURIComponent(name);
    if (TOKEN) url += "&token=" + encodeURIComponent(TOKEN);
    return fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok || !res.data) {
          setSyncState("fail");
          return 0;
        }
        var local = load();
        var added = 0;
        for (var k in res.data) {
          var cur = local[k];
          var empty = cur === undefined || cur === null ||
            (typeof cur === "string" && cur.trim() === "");
          if (empty) {
            local[k] = res.data[k];
            added++;
          }
        }
        saveAll(local);
        setSyncState("ok");
        return added;
      })
      .catch(function () {
        setSyncState("fail");
        return 0;
      });
  }

  // 로컬에 있는 기록 전체를 시트로 올린다 (이름을 처음 등록했을 때)
  function pushAll() {
    if (!SHEET || !student()) return Promise.resolve();
    var d = load();
    var items = [];
    F.forEach(function (f) {
      f.observe.forEach(function (q, i) {
        var k = "f" + f.n + ":o" + i;
        if (typeof d[k] === "string" && d[k].trim() !== "") {
          items.push({ key: k, value: d[k], floor: f.n, label: q });
        }
      });
    });
    if (!items.length) return Promise.resolve();
    setSyncState("saving");
    return postSheet(items).then(function (ok) {
      setSyncState(ok ? "ok" : "fail");
    });
  }

  /* ---------- 이름 막대 ---------- */

  function renderStudentBar() {
    var host = document.getElementById("studentbar");
    if (!host) return;
    var who = student();

    if (!who) {
      host.innerHTML =
        '<div class="sbar ask">' +
        '<label for="sname">이름을 넣어야 기록이 저장돼</label>' +
        '<input id="sname" type="text" maxlength="20" placeholder="이름 또는 번호" autocomplete="off">' +
        '<button class="btn" id="sok">시작</button>' +
        "</div>" +
        '<p class="sbar-note">같은 노트북을 다른 친구가 써도 이름이 다르면 기록이 안 섞여.' +
        (SHEET ? " 다른 노트북에 앉아도 이름만 넣으면 지난 기록을 불러와." : "") +
        "</p>";

      var input = document.getElementById("sname");
      var go = function () {
        var v = input.value.trim();
        if (!v) {
          input.focus();
          return;
        }
        setStudent(v);
        var after = function () {
          renderStudentBar();
          renderIndex();
          renderFloor();
        };
        if (SHEET) {
          pullFromSheet(v).then(function (n) {
            after();
            if (n > 0) {
              var note = document.querySelector(".sbar-note");
              if (note) note.textContent = "지난 기록 " + n + "개를 불러왔어.";
            }
          });
        } else {
          after();
        }
      };
      document.getElementById("sok").addEventListener("click", go);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") go();
      });
      return;
    }

    host.innerHTML =
      '<div class="sbar">' +
      '<span class="sbar-who">기록 대상 <b>' + esc(who) + "</b></span>" +
      '<span class="syncstate" id="syncstate"></span>' +
      '<button class="btn small" id="schange">이름 바꾸기</button>' +
      "</div>";

    setSyncState(SHEET ? "idle" : "off");

    document.getElementById("schange").addEventListener("click", function () {
      setStudent("");
      renderStudentBar();
      renderIndex();
      renderFloor();
    });
  }

  /* ---------- 표지 ---------- */

  function renderIndex() {
    var host = document.getElementById("shaft");
    if (!host) return;

    var done = 0;
    var html = "";

    F.forEach(function (f) {
      var ok = floorDone(f.n);
      if (ok) done++;
      html +=
        '<a class="floor' + (ok ? " done" : "") + (f.key ? " key" : "") + '" href="floor.html?f=' + f.n + '">' +
        '<div class="floor-top">' +
        '<span class="floor-n">지하 ' + f.n + "층</span>" +
        '<span class="floor-title">' + esc(f.title) + "</span>" +
        '<span class="floor-y">Y ' + f.y + "</span>" +
        "</div>" +
        '<div class="floor-sub">' + esc(f.subtitle) + " · " + esc(f.learn) + "</div>" +
        "</a>";
    });

    host.innerHTML = html;

    var bar = document.querySelector(".bar > i");
    var count = document.querySelector(".progress .count");
    if (bar) bar.style.width = Math.round((done / F.length) * 100) + "%";
    if (count) count.textContent = done + " / " + F.length + " 층";
  }

  /* ---------- 층 페이지 ---------- */

  function renderFloor() {
    var host = document.getElementById("floor");
    if (!host) return;

    var n = parseInt(new URLSearchParams(location.search).get("f"), 10);
    if (!(n >= 1 && n <= F.length)) n = 1;

    var f = F[n - 1];
    document.title = "지하 " + f.n + "층 · " + f.title + " | 에이전트와 함께해요 2";

    var h = "";

    h +=
      '<nav class="topnav">' +
      (n > 1
        ? '<a href="floor.html?f=' + (n - 1) + '">← 지하 ' + (n - 1) + "층</a>"
        : '<span class="disabled">← 지상</span>') +
      '<a href="./">목차</a>' +
      (n < F.length
        ? '<a href="floor.html?f=' + (n + 1) + '">지하 ' + (n + 1) + "층 →</a>"
        : '<span class="disabled">최하층</span>') +
      "</nav>";

    h += '<div id="studentbar"></div>';

    h +=
      '<header class="fhead">' +
      '<p class="eyebrow">' + f.n + " / 12 · 지하 " + f.n + "층</p>" +
      "<h1>" + esc(f.title) + "</h1>" +
      '<p class="sub">' + esc(f.subtitle) + "</p>" +
      '<div class="coords">' +
      '<div class="coord"><i>신호</i><b>' + f.x + " / " + f.y + " / " + f.z + "</b></div>" +
      '<div class="coord"><i>깊이</i><b>Y ' + f.y + "</b><span> = 62 − " + f.n + " × 4</span></div>" +
      "</div>" +
      "</header>";

    h +=
      "<section><h2>오늘의 신호</h2>" +
      '<div class="story">' + esc(f.story) + "</div></section>";

    h += "<section><h2>오늘의 임무</h2>";
    h += '<div class="chips">';
    h += '<span class="chip">' + esc(f.learn) + "</span>";
    (f.cmds || []).forEach(function (c) {
      h += '<span class="chip">' + esc(c) + "</span>";
    });
    if (f.slot) h += '<span class="chip slot">' + esc(f.slot) + "</span>";
    h += "</div>";
    h += '<ul class="tasks">';
    f.mission.forEach(function (m, i) {
      var id = "f" + f.n + ":m" + i;
      h +=
        '<li><label><input type="checkbox" data-k="' + id + '"' +
        (get(id) === true ? " checked" : "") +
        "><span>" + esc(m) + "</span></label></li>";
    });
    h += "</ul></section>";

    h +=
      "<section><h2>오늘의 코드</h2>" +
      '<div class="codebox">' +
      '<button class="copy" id="copybtn">복사</button>' +
      '<pre id="code">' + esc(f.code) + "</pre>" +
      "</div>" +
      '<p class="codenote">MakeCode 에디터 오른쪽 위 <b>JavaScript</b> 탭에 붙여넣고, 다시 <b>Blocks</b> 탭으로 바꾸면 블록으로 보여.</p>' +
      "</section>";

    h += "<section><h2>관찰 기록</h2>";
    f.observe.forEach(function (q, i) {
      var id = "f" + f.n + ":o" + i;
      h +=
        '<div class="field">' +
        "<label><b>" + String(i + 1).padStart(2, "0") + "</b>" + esc(q) + "</label>" +
        '<textarea data-k="' + id + '" data-floor="' + f.n + '" data-label="' + esc(q) + '"></textarea>' +
        "</div>";
    });
    h += '<div class="saved" id="saved"></div></section>';

    h += '<section><h2>바꿔보기</h2><ul class="stretch">';
    f.stretch.forEach(function (s) {
      h += "<li>" + esc(s) + "</li>";
    });
    h += "</ul></section>";

    if (f.tip) {
      h += '<section><div class="tip"><b>TIP</b>' + esc(f.tip) + "</div></section>";
    }

    if (f.shot) {
      var nn = String(f.n).padStart(2, "0");
      h +=
        '<section><div class="shotnote">오늘 결과물을 화면 캡처해서 저장해. 파일 이름은 ' +
        "<code>" + nn + "_내이름.png</code> 형식으로.</div></section>";
    }

    if (f.ending) {
      h += '<section><h2>마지막 장면</h2><div class="ending">' + esc(f.ending) + "</div></section>";
    }

    h +=
      '<div class="export">' +
      '<button class="btn" id="exportbtn">내 기록 전부 내보내기</button>' +
      "</div>";

    h +=
      '<div class="pager">' +
      (n > 1 ? '<a href="floor.html?f=' + (n - 1) + '">← 지하 ' + (n - 1) + "층</a>" : "<span></span>") +
      (n < F.length ? '<a href="floor.html?f=' + (n + 1) + '">지하 ' + (n + 1) + "층 →</a>" : '<a href="./">목차로</a>') +
      "</div>";

    h += "<footer>에이전트와 함께해요 2 — 지하 12층<br>폭스러닝센터 AI 연구소</footer>";

    host.innerHTML = h;

    renderStudentBar();
    bindInputs();
    bindCopy(f.code);
    bindExport();
  }

  /* ---------- 입력 바인딩 ---------- */

  function bindInputs() {
    var note = document.getElementById("saved");
    var timer = null;
    var locked = !student();

    function flash(msg) {
      if (!note) return;
      note.textContent = msg;
      clearTimeout(timer);
      timer = setTimeout(function () {
        note.textContent = "";
      }, 1600);
    }

    document.querySelectorAll("textarea[data-k]").forEach(function (el) {
      var v = get(el.dataset.k);
      if (typeof v === "string") el.value = v;
      if (locked) {
        el.placeholder = "위에 이름을 먼저 넣어줘";
        el.disabled = true;
        return;
      }
      el.addEventListener("input", function () {
        put(el.dataset.k, el.value, {
          floor: el.dataset.floor,
          label: el.dataset.label
        });
        flash("저장됨");
      });
    });

    document.querySelectorAll('input[type="checkbox"][data-k]').forEach(function (el) {
      if (locked) {
        el.disabled = true;
        return;
      }
      el.addEventListener("change", function () {
        put(el.dataset.k, el.checked);
      });
    });
  }

  /* ---------- 코드 복사 ---------- */

  function bindCopy(code) {
    var btn = document.getElementById("copybtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      function ok() {
        btn.textContent = "복사됨";
        btn.classList.add("ok");
        setTimeout(function () {
          btn.textContent = "복사";
          btn.classList.remove("ok");
        }, 1600);
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = code;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          ok();
        } catch (e) {
          btn.textContent = "직접 복사해";
        }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(ok, fallback);
      } else {
        fallback();
      }
    });
  }

  /* ---------- 기록 내보내기 ---------- */

  function bindExport() {
    var btn = document.getElementById("exportbtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var who = student();
      if (!who) {
        alert("위에 이름을 먼저 넣어줘.");
        return;
      }
      var d = load();
      var out = ["에이전트와 함께해요 2 — 지하 12층 | 관제 기록", who, ""];

      F.forEach(function (f) {
        var lines = [];
        f.observe.forEach(function (q, i) {
          var v = d["f" + f.n + ":o" + i];
          if (typeof v === "string" && v.trim() !== "") {
            lines.push("  " + q);
            lines.push("  → " + v.trim());
            lines.push("");
          }
        });
        if (lines.length) {
          out.push("[ 지하 " + f.n + "층 · " + f.title + " ]  신호 " + f.x + " / " + f.y + " / " + f.z);
          out.push("");
          out = out.concat(lines);
        }
      });

      if (out.length <= 3) {
        alert("아직 기록한 내용이 없어.");
        return;
      }

      var blob = new Blob([out.join("\n")], { type: "text/plain;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "signal12_" + who + "_관제기록.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    });
  }

  /* ---------- 시작 ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderFloor();
    renderStudentBar();
    renderIndex();
    if (SHEET && student()) pushAll();
  });
})();
