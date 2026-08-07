// 웹 교재 공용 스크립트 — 표지 렌더링, 층 페이지 렌더링, 기록 저장

(function () {
  "use strict";

  var F = window.FLOORS || [];
  var KEY = "signal12";

  /* ---------- 저장소 ---------- */

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function put(path, value) {
    var d = load();
    d[path] = value;
    save(d);
  }

  function get(path) {
    var d = load();
    return d[path];
  }

  // 층 하나라도 기록이 있으면 방문한 것으로 본다
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
        '<span class="floor-n">지하 ' + f.n + '층</span>' +
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
    document.title = "지하 " + f.n + "층 · " + f.title + " | 신호를 따라서";

    var h = "";

    /* 상단 이동 */
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

    /* 헤더 */
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

    /* 오늘의 신호 */
    h +=
      "<section><h2>오늘의 신호</h2>" +
      '<div class="story">' + esc(f.story) + "</div></section>";

    /* 오늘의 임무 */
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
        "<li><label><input type=\"checkbox\" data-k=\"" + id + "\"" +
        (get(id) === true ? " checked" : "") +
        "><span>" + esc(m) + "</span></label></li>";
    });
    h += "</ul></section>";

    /* 코드 */
    h +=
      "<section><h2>오늘의 코드</h2>" +
      '<div class="codebox">' +
      '<button class="copy" id="copybtn">복사</button>' +
      "<pre id=\"code\">" + esc(f.code) + "</pre>" +
      "</div>" +
      '<p class="codenote">MakeCode 에디터 오른쪽 위 <b>JavaScript</b> 탭에 붙여넣고, 다시 <b>Blocks</b> 탭으로 바꾸면 블록으로 보여.</p>' +
      "</section>";

    /* 관찰 기록 */
    h += "<section><h2>관찰 기록</h2>";
    f.observe.forEach(function (q, i) {
      var id = "f" + f.n + ":o" + i;
      h +=
        '<div class="field">' +
        "<label><b>" + String(i + 1).padStart(2, "0") + "</b>" + esc(q) + "</label>" +
        '<textarea data-k="' + id + '"></textarea>' +
        "</div>";
    });
    h += '<div class="saved" id="saved"></div></section>';

    /* 바꿔보기 */
    h += "<section><h2>바꿔보기</h2><ul class=\"stretch\">";
    f.stretch.forEach(function (s) {
      h += "<li>" + esc(s) + "</li>";
    });
    h += "</ul></section>";

    /* TIP */
    if (f.tip) {
      h += "<section><div class=\"tip\"><b>TIP</b>" + esc(f.tip) + "</div></section>";
    }

    /* 스크린샷 */
    if (f.shot) {
      var nn = String(f.n).padStart(2, "0");
      h +=
        '<section><div class="shotnote">오늘 결과물을 화면 캡처해서 저장해. 파일 이름은 ' +
        "<code>" + nn + "_내이름.png</code> 형식으로.</div></section>";
    }

    /* 마지막 장면 */
    if (f.ending) {
      h += '<section><h2>마지막 장면</h2><div class="ending">' + esc(f.ending) + "</div></section>";
    }

    /* 내보내기 */
    h +=
      '<div class="export">' +
      '<button class="btn" id="exportbtn">내 기록 전부 내보내기</button>' +
      "</div>";

    /* 하단 이동 */
    h +=
      '<div class="pager">' +
      (n > 1 ? '<a href="floor.html?f=' + (n - 1) + '">← 지하 ' + (n - 1) + "층</a>" : "<span></span>") +
      (n < F.length ? '<a href="floor.html?f=' + (n + 1) + '">지하 ' + (n + 1) + "층 →</a>" : '<a href="./">목차로</a>') +
      "</div>";

    h +=
      "<footer>지하 12층 — 신호를 따라서<br>폭스러닝센터 AI 연구소</footer>";

    host.innerHTML = h;

    bindInputs();
    bindCopy(f.code);
    bindExport();
  }

  /* ---------- 입력 바인딩 ---------- */

  function bindInputs() {
    var note = document.getElementById("saved");
    var timer = null;

    function flash() {
      if (!note) return;
      note.textContent = "저장됨";
      clearTimeout(timer);
      timer = setTimeout(function () {
        note.textContent = "";
      }, 1400);
    }

    document.querySelectorAll("textarea[data-k]").forEach(function (el) {
      var v = get(el.dataset.k);
      if (typeof v === "string") el.value = v;
      el.addEventListener("input", function () {
        put(el.dataset.k, el.value);
        flash();
      });
    });

    document.querySelectorAll('input[type="checkbox"][data-k]').forEach(function (el) {
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
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(ok, fallback);
      } else {
        fallback();
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
    });
  }

  /* ---------- 기록 내보내기 ---------- */

  function bindExport() {
    var btn = document.getElementById("exportbtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var d = load();
      var out = ["지하 12층 — 신호를 따라서 | 관제 기록", ""];

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

      if (out.length <= 2) {
        alert("아직 기록한 내용이 없어.");
        return;
      }

      var blob = new Blob([out.join("\n")], { type: "text/plain;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "signal12_관제기록.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    });
  }

  /* ---------- 시작 ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderIndex();
    renderFloor();
  });
})();
