window.__ModuleLoader__.load({
  id: "dsh-line-height",
  factory: function () {
    var module = { exports: {} };
    var exports = module.exports;

    var BLUE = "var(--dsw-alias-state-business-primary,#2f6fed)";

    /* ==================================================================
     * CONFIG — everything you are likely to want to change lives here.
     * Values are read once when the plugin loads (i.e. at app start).
     * ================================================================== */
    var CONFIG = {
      /* typography */
      lineHeight: 1.75,          // conversation body line-height
      bodyWeight: 350,           // p / li / td / dd / blockquote
      headingWeight: 500,        // h1..h6 (700 in stock DSH)
      strongWeight: 500,         // bold inside markdown

      /* header */
      headerHeight: 50,          // px, conversation header
      titleSize: 17,             // px, session title
      headerPaddingTop: 14,      // px, pushes title/icons/tabs down a little
      tabOffsetY: 4,             // px, extra nudge for the tab strip

      /* tab strip */
      tabFontSize: 14,           // px
      tabColor: "#5b6169",       // idle tab colour
      barHeight: 4,              // px, the sliding pill
      tabRise: 6,                // px, how far the strip rises while fading in

      /* sidebar */
      sidebarFontSize: 16,       // px, nav + workspace + session rows

      /* transcript column */
      columnMaxWidth: 1400,      // px cap
      columnRatio: 0.96,         // fraction of the parent width

      /* top fade (mask on the scroll container) */
      featherStart: -16,         // px relative to the header's bottom edge
      featherEnd: 46,            // px

      /* misc layout */
      composerGap: 18,

      /* bottom status row: "hidden" hides it entirely; "custom" shows only the
         items ticked in stats. Applies when features.hideStats is off. */
      statsMode: "hidden",
      stats: { speed: true, cache: true, context: true },           // px of breathing room under the composer

      /* feature switches */
      features: {
        hoverTabs: true,         // tabs hidden until the header is hovered
        hideOnCollision: true,   // fade the tabs out when the title would collide
        feather: true,           // feathered top edge
        widerColumn: true,       // widen the transcript column
        sidebarFont: true,       // bump sidebar typography
        hideStats: true,         // composer token/cache/context row
        hideHeaderButtons: true, // "展开底部面板" + "上下文诊断"
        hidePtcChip: true,       // "PTC 模式" / "后台任务运行中" chips
        hideViewMore: true,      // conversation-view "more" button
        hideMoreNav: true        // rc.3 sidebar "更多" entry
      }
    };

    function buildCss() {
      return [
      /* ---- conversation typography ---- */
      "html body [class*='_markdown_']{line-height:" + CONFIG.lineHeight + "}",
      "html body [class*='_markdown_'] p{margin-top:0;margin-bottom:12px}",
      "html body [class*='_markdown_'] li{margin-bottom:6px}",

      /* blanket pseudo: kill any painted pill inside the header */
      "[data-slot='conversation.header'] header *::before,[data-slot='conversation.header'] header *::after{background:none!important;background-image:none!important;box-shadow:none!important;border:0!important}",

      /* no capsule: tab buttons never paint a background, in any state */
      "[data-conversation-tabs] button,[data-conversation-tabs] button:hover,[data-conversation-tabs] button:focus,[data-conversation-tabs] button:focus-visible,[data-conversation-tabs] button[aria-selected='true'],[data-conversation-tabs] [role='tab'],[data-conversation-tabs] [role='tab']:hover,[data-conversation-tabs] [role='tab'][aria-selected='true']{background:none!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;border-color:transparent!important}",
      "[data-conversation-tabs] button::before,[data-conversation-tabs] button::after,[data-conversation-tabs] [role='tab']::before,[data-conversation-tabs] [role='tab']::after{background:none!important;content:none!important;display:none!important}",

      /* hide the agent-preset badge (icon + "创造模式" / "标准模式" …) beside the session title */
      /* 1) structural: a title-bearing span with an icon in the header action cell (survives hash changes) */
      "[class*='headerActions']>span[title]:has(>svg){display:none!important}",
      /* 2) exact: ui-agent-preset's AgentPresetLabel; kept as its own rule so an engine that */
      /*    rejects :has() above cannot invalidate this selector list                          */
      "[class*='dscfja_label']{display:none!important}",

      /* hide the "在文件资源管理器中打开" split control (the open-in-app header utility) */
      /* its anchor is a Menu, so cover both shapes: cell → control, and cell → wrapper → control */
      "[class*='headerUtilities']>:has([data-open-target='directory']){display:none!important}",
      "[class*='headerUtilities']>[data-open-target='directory']{display:none!important}",

      /* hide the conversation-view "more" button */
      CONFIG.features.hideViewMore ? "[aria-label*='更多会话视图'],[title*='更多会话视图'],[aria-label*='More conversation']{display:none!important}" : "",

      /* hide the rc.3 "更多" nav entry (its wrapper token ends with moreAnchor) */
      CONFIG.features.hideMoreNav ? "[class*='moreAnchor']{display:none!important}" : "",

      /* better-sidebar typography: slightly larger nav labels */
      "[data-dsh-better-sidebar],[data-dsh-sidebar]{font-size:16px!important}",
      "[data-dsh-better-sidebar] button,[data-dsh-better-sidebar] a,[data-dsh-better-sidebar] [role='button'],[data-dsh-sidebar] button,[data-dsh-sidebar] a,[data-dsh-sidebar] [role='button']{font-size:16px!important;line-height:1.55!important}",

      /* body copy weight: one notch below regular for a lighter read */
      "html body [class*='_markdown_'] :is(p,li,td,dd,blockquote){font-weight:" + CONFIG.bodyWeight + "!important}",

      /* softer headings: 700 reads as "shouting" with MiSans */
      "html body [class*='_markdown_'] :is(h1,h2,h3,h4,h5,h6){font-weight:" + CONFIG.headingWeight + "!important;letter-spacing:0!important}",
      "html body [class*='_markdown_'] :is(strong,b){font-weight:" + CONFIG.strongWeight + "!important}",

      /* ---- compact header ---- */
      "[data-slot='conversation.header'] > header{position:relative;height:" + CONFIG.headerHeight + "px!important;min-height:" + CONFIG.headerHeight + "px!important;padding-top:0!important;padding-bottom:0!important;align-items:center!important;overflow:visible!important;border-bottom:0!important;box-shadow:none!important}",
      "[data-slot='conversation.session.header'] > div{min-height:0!important;height:auto!important;padding-top:0!important;padding-bottom:0!important}",
      "[data-slot='conversation.session.header'] > div:first-child,[data-slot='conversation.session.header'] > div:first-child *{font-size:" + CONFIG.titleSize + "px!important}",

      "[data-dsh-stat-hidden='1']{display:none!important}",
      /* neutralise wallpaper glass on the composer */
      "[data-composer-card]{margin-bottom:" + CONFIG.composerGap + "px!important;--we-glass-alpha:0!important;--we-capsule-glass-fill:transparent!important;--we-chat-glass-fill:transparent!important;--we-tool-glass-fill:transparent!important}",
      /* restore composer contrast */
      "[data-composer-card] button,[data-composer-card] button *{opacity:1!important;filter:none!important}",
      "[data-composer-card] button[aria-haspopup],[data-composer-card] button[aria-haspopup] *{color:var(--dsw-alias-label-secondary,#4a4d55)!important}",

      /* ---- tab strip: hidden unless JS marks the header ---- */
      "[data-conversation-tabs]{display:flex!important;position:absolute!important;left:calc(50% + 8px)!important;top:50%!important;z-index:80!important;pointer-events:auto!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;transform:translateY(" + CONFIG.tabRise + "px)!important;visibility:hidden!important;opacity:0!important;transition:opacity .45s ease,transform .45s cubic-bezier(.22,.61,.36,1),visibility 0s linear .5s!important}",
      "[data-slot='conversation.header'] > header[data-dsh-strip='1'] [data-conversation-tabs]{visibility:visible!important;opacity:1!important;transform:translateY(0)!important;transition:opacity .45s ease,transform .45s cubic-bezier(.22,.61,.36,1),visibility 0s linear 0s!important}",

      /* ---- tabs: plain text ---- */
      "[data-slot='conversation.header'] [data-conversation-tabs] button::before,[data-slot='conversation.header'] [data-conversation-tabs] button::after{display:none!important;content:none!important;background:none!important;border:0!important}",
      "[data-slot='conversation.header'] [data-conversation-tabs] button{border:0!important;background:transparent!important;box-shadow:none!important;outline:0!important;color:" + CONFIG.tabColor + "!important;font-size:" + CONFIG.tabFontSize + "px!important;transition:color .16s ease!important}",

      /* ---- sliding pill (lives inside the strip) ---- */
      ".dsh-tab-underline{position:absolute!important;height:" + CONFIG.barHeight + "px!important;border-radius:999px!important;background:" + BLUE + "!important;pointer-events:none!important;transform:scaleX(0);transform-origin:50% 50%;transition:left .18s cubic-bezier(.4,0,.2,1),width .26s cubic-bezier(.34,1.56,.64,1),transform .22s cubic-bezier(.22,.61,.36,1)!important}"

,      /* last on purpose: wins over the shown rule, fades instead of snapping */
      "[data-slot='conversation.header'] header[data-dsh-strip='1'] [data-conversation-tabs][data-dsh-collide='1']{opacity:0!important;visibility:hidden!important;transition:opacity .3s ease,visibility 0s linear .32s!important}"
      ].join("");
    }


    /* ------------------------------------------------------------------ */
    /* every entry point is guarded: a thrown error must never break boot  */
    /* ------------------------------------------------------------------ */
    function safe(fn, arg) {
      return function () {
        try { return fn.apply(null, arguments); } catch (e) { return undefined; }
      };
    }

    function hideByText(root) {
      var nodes = root.querySelectorAll("span,div,button");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (el.childElementCount > 1) continue;
        var text = (el.textContent || "").trim();
        if (!text || text.length > 24) continue;
        if (text !== "PTC 模式" && text.indexOf("后台任务运行中") === -1) continue;
        var target = el;
        var parent = el.parentElement;
        if (parent && (parent.textContent || "").trim() === text) target = parent;
        target.style.setProperty("display", "none", "important");
      }

    }

    var headerEl = function () {
      return document.querySelector("[data-slot='conversation.header'] > header");
    };
    var tabsEl = function (header) {
      return header ? header.querySelector("[data-conversation-tabs]") : null;
    };

    var currentTab = null;
    var hideTimer = null;
    var bar = null;
    var widened = typeof WeakSet === "function" ? new WeakSet() : null;

    function ensureBar(tabs) {
      var found = tabs.querySelector(".dsh-tab-underline");
      if (found) { bar = found; return bar; }
      bar = document.createElement("span");
      bar.className = "dsh-tab-underline";
      bar.setAttribute("aria-hidden", "true");
      tabs.appendChild(bar);
      return bar;
    }

    function paintTab(tab) {
      var header = headerEl();
      var tabs = tabsEl(header);
      if (!tabs) return;
      var btns = tabs.querySelectorAll('[role="tab"]');
      for (var i = 0; i < btns.length; i++) {
        var b = btns[i];
        if (b === tab) {
          b.setAttribute("data-dsh-active", "1");
          b.style.setProperty("color", BLUE, "important");
        } else {
          b.removeAttribute("data-dsh-active");
          b.style.removeProperty("color");
        }
      }
    }

    function placeBar(tab) {
      var header = headerEl();
      if (!header || !tab) return;
      var tabs = tabsEl(header);
      if (!tabs) return;
      var ind = ensureBar(tabs);
      ind.style.left = (tab.offsetLeft + 2) + "px";
      ind.style.top = (tab.offsetTop + tab.offsetHeight - 3) + "px";
      ind.style.width = Math.max(8, tab.offsetWidth - 4) + "px";
      ind.style.transform = "scaleX(1)";
    }

    function showTab(tab) {
      var header = headerEl();
      if (!header || !tab) return;
      header.setAttribute("data-dsh-strip", "1");
      paintTab(tab);
      placeBar(tab);
      currentTab = tab;
    }

    function hideTabs() {
      var header = headerEl();
      if (!header) return;
      header.setAttribute("data-dsh-strip", "0");
      paintTab(null);
      if (bar) bar.style.transform = "scaleX(0)";
      currentTab = null;
    }

    function pickTab(e) {
      var header = headerEl();
      var tabs = tabsEl(header);
      if (!header || !tabs) return null;
      var hr = header.getBoundingClientRect();
      if (e.clientY < hr.top || e.clientY > hr.bottom - 1) return null;
      var btns = tabs.querySelectorAll('[role="tab"]');
      if (!btns.length) return null;
      var first = btns[0].getBoundingClientRect();
      var last = btns[btns.length - 1].getBoundingClientRect();
      if (e.clientX < first.left - 60 || e.clientX > last.right + 60) return null;
      var best = null, bestD = Infinity;
      for (var i = 0; i < btns.length; i++) {
        var r = btns[i].getBoundingClientRect();
        var d = Math.abs(e.clientX - (r.left + r.right) / 2);
        if (d < bestD) { bestD = d; best = btns[i]; }
      }
      return best;
    }

    function ensureTopFade() {
      var sc = document.querySelector("[data-conversation-scroll]");
      var header = headerEl();
      if (!sc || !header) return;
      var sr = sc.getBoundingClientRect();
      var hr = header.getBoundingClientRect();
      var top = Math.max(0, Math.round(hr.bottom - sr.top));
      var start = Math.max(0, top + CONFIG.featherStart);
      var mid = top + Math.round((CONFIG.featherEnd + CONFIG.featherStart) / 3);
      var end = top + CONFIG.featherEnd;
      var g = "linear-gradient(to bottom, rgba(0,0,0,0) " + start + "px, rgba(0,0,0,.45) " + mid + "px, rgba(0,0,0,1) " + end + "px)";
      sc.style.setProperty("-webkit-mask-image", g, "important");
      sc.style.setProperty("mask-image", g, "important");
    }

    function ensureComposerGap() {
      var card = document.querySelector("[data-composer-card]");
      if (!card || !card.parentElement) return;
      var gap = document.getElementById("dsh-composer-gap");
      if (gap && gap.isConnected && gap.previousElementSibling === card) return;
      if (!gap || !gap.isConnected) {
        gap = document.createElement("div");
        gap.id = "dsh-composer-gap";
        gap.setAttribute("aria-hidden", "true");
      }
      gap.style.cssText = "height:" + CONFIG.composerGap + "px;flex:0 0 " + CONFIG.composerGap + "px;pointer-events:none";
      if (card.nextSibling) card.parentElement.insertBefore(gap, card.nextSibling);
      else card.parentElement.appendChild(gap);
    }

    function syncTabCollision() {
      var header = headerEl();
      if (!header) return;
      var tabs = tabsEl(header);
      if (!tabs) return;
      var hr = header.getBoundingClientRect();
      var tr = tabs.getBoundingClientRect();
      var stripLeft = hr.left + hr.width / 2 + 8 - (tr.width || 330) / 2;

      // measure REAL text extents with a Range, so full-width containers do not count
      var range = document.createRange();
      var maxRight = 0;
      var els = header.querySelectorAll("a,span,div,h1,h2,h3,p");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.closest("[data-conversation-tabs]")) continue;
        if (!el.firstChild) continue;
        if (el.childElementCount !== 0) continue;   // pure text nodes only
        var txt = el.textContent;
        if (!txt || !txt.trim()) continue;
        var rect;
        try {
          range.selectNodeContents(el);
          rect = range.getBoundingClientRect();
        } catch (e) { continue; }
        if (!rect || rect.width < 8 || rect.height < 6) continue;
        if (rect.left >= stripLeft) continue;          // lives on the right of the strip
        // ellipsised text reports its FULL width via Range; clamp to the visible box
        var vis = el.getBoundingClientRect();
        var right = Math.min(rect.right, vis.right);
        if (right > maxRight) maxRight = right;
      }
      var collide = maxRight > 0 && maxRight > (stripLeft - 4);
      tabs.setAttribute("data-dsh-collide", collide ? "1" : "0");
    }

    function tidyHeaderActions() {
      var header = headerEl();
      if (!header) return;
      var HIDE = ["展开底部面板", "上下文诊断"];
      var btns = header.querySelectorAll("button,[role='button'],a");
      for (var i = 0; i < btns.length; i++) {
        var b = btns[i];
        if (b.closest("[data-composer-card]")) continue;
        var label = (b.getAttribute("aria-label") || b.getAttribute("title") || b.textContent || "").trim();
        if (HIDE.indexOf(label) === -1) continue;
        b.style.setProperty("display", "none", "important");
      }
    }

    function enlargeHeaderTitle() {
      var header = headerEl();
      if (!header) return;
      var els = header.querySelectorAll("span,div,a,h1,h2,h3");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.closest("[data-conversation-tabs]")) continue;
        if (el.closest("button")) continue;
        var txt = (el.textContent || "").trim();
        if (!txt || txt.length > 80) continue;
        if (el.childElementCount > 3) continue;
        var r = el.getBoundingClientRect();
        if (r.width < 20 || r.height < 8 || r.height > 40) continue;
        if (el.style.fontSize === CONFIG.titleSize + "px") continue;
        el.style.setProperty("font-size", CONFIG.titleSize + "px", "important");
      }
    }

    function shiftHeaderContent() {
      var header = headerEl();
      var tabs = tabsEl(header);
      if (!header || !tabs) return;
      // move the whole content box down; the strip is positioned by page coords, so it stays centred
      header.style.setProperty("padding-top", CONFIG.headerPaddingTop + "px", "important");
      header.style.setProperty("padding-bottom", "0px", "important");
    }

    function styleTabs() {
      var header = headerEl();
      var tabs = tabsEl(header);
      if (!header || !tabs) return;
      var hr = header.getBoundingClientRect();
      var tr = tabs.getBoundingClientRect();
      var w = tr.width || 320;
      var th = tr.height || 25;

      tabs.style.setProperty("position", "absolute", "important");

      // target position in PAGE coordinates, then convert into the offset parent's space
      var wantLeftPage = hr.left + hr.width / 2 - w / 2;
      var wantTopPage = hr.top + hr.height / 2 - th / 2 + CONFIG.tabOffsetY;
      var op = tabs.offsetParent;
      var ox = 0, oy = 0;
      if (op && op !== document.body) {
        var or = op.getBoundingClientRect();
        ox = or.left + (op.clientLeft || 0);
        oy = or.top + (op.clientTop || 0);
      }
      tabs.style.setProperty("left", Math.round(wantLeftPage - ox) + "px", "important");
      tabs.style.setProperty("top", Math.round(wantTopPage - oy) + "px", "important");
      tabs.style.setProperty("margin", "0", "important");
      tabs.style.setProperty("background", "none", "important");
      ["--dsw-alias-bg-layer-1","--dsw-alias-bg-layer-2","--dsw-alias-bg-layer-3","--dsw-alias-interactive-bg-hover","--dsw-alias-interactive-bg-active","--dsw-alias-button-floating-fill","--dsw-alias-button-floating-hover"].forEach(function (v) {
        tabs.style.setProperty(v, "transparent", "important");
      });

      var nodes = tabs.querySelectorAll("*");
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if ((n.className || "").toString().indexOf("dsh-tab-underline") !== -1) continue;
        n.style.setProperty("background", "none", "important");
        n.style.setProperty("background-color", "transparent", "important");
        n.style.setProperty("box-shadow", "none", "important");
        n.style.setProperty("border-color", "transparent", "important");
      }
    }

    function enlargeSidebar() {
      // anchor: the 新会话 button marks the sidebar; without it we must not touch anything
      var all = document.querySelectorAll("button,a,div,span");
      var anchor = null;
      for (var a = 0; a < all.length; a++) {
        if ((all[a].textContent || "").trim() !== "新会话") continue;
        anchor = all[a];
        break;
      }
      if (!anchor) return;
      var ar = anchor.getBoundingClientRect();
      if (ar.width < 40 || ar.height < 10) return;   // sidebar collapsed / hidden
      // grow to the sidebar column: the widest ancestor that is still narrow
      var sidebarRight = ar.right;
      var up = anchor.parentElement;
      for (var k = 0; k < 6 && up && up !== document.body; k++) {
        var nr = up.getBoundingClientRect();
        if (nr.width > 540) break;
        if (nr.right > sidebarRight) sidebarRight = nr.right;
        up = up.parentElement;
      }
      var maxRight = sidebarRight + 8;               // sidebar right edge
      var els = document.querySelectorAll("div,span,a,button,li,p");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (!el.firstChild) continue;
        var txt = el.textContent;
        if (!txt || !txt.trim()) continue;
        var r = el.getBoundingClientRect();
        if (r.width < 6 || r.height < 6) continue;
        if (r.right > maxRight || r.right < 1) continue;
        if (r.height > window.innerHeight * 0.95) continue;
        if (el.style.fontSize === CONFIG.sidebarFontSize + "px") continue;
        el.style.setProperty("font-size", CONFIG.sidebarFontSize + "px", "important");
        el.style.setProperty("line-height", "1.55", "important");
      }
    }

    function statsDiagnostics() {
      try {
        return "runs=" + statsRuns + " err=" + (statsErr || "-") + " pills=" + document.querySelectorAll("[data-composer-stat]").length +
          " hid=" + document.querySelectorAll("[data-dsh-hid]").length +
          " hide=" + CONFIG.features.hideStats +
          " pick=" + (CONFIG.stats.speed ? 1 : 0) + (CONFIG.stats.cache ? 1 : 0) + (CONFIG.stats.context ? 1 : 0);
      } catch (e) { return "diag error: " + e.message; }
    }

    function statItem(kind) {
      var els = document.querySelectorAll("span,div");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var t = (el.textContent || "").trim();
        if (!t || t.length > 32) continue;
        if (kind === "speed" && t.indexOf("tok/s") !== -1) return el;
        if (kind === "cache" && (t.indexOf("缓命中") !== -1 || /cache\s*hit/i.test(t))) return el;
        if (kind === "context" && /^\d{1,3}%$/.test(t) && el.childElementCount === 0) return el;
      }
      return null;
    }

    var statsRuns = 0, statsErr = "";
    var statsWatchdog = setInterval(function () {
      try { hideComposerStats(); } catch (e) { statsErr = e.message; }
    }, 500);
    function hideComposerStats() {
      statsRuns++;
      try {
      var hideAll = CONFIG.features.hideStats || CONFIG.statsMode === "hidden";

      // 1) undo whatever we hid last time (idempotent restore)
      var marked = document.querySelectorAll("[data-dsh-hid]");
      for (var r = 0; r < marked.length; r++) {
        marked[r].style.removeProperty("display");
        marked[r].removeAttribute("data-dsh-hid");
      }
      var flagged = document.querySelectorAll("[data-dsh-stat-hidden='1']");
      for (var f = 0; f < flagged.length; f++) flagged[f].removeAttribute("data-dsh-stat-hidden");

      var keep = {
        speed: !hideAll && !!CONFIG.stats.speed,
        cache: !hideAll && !!CONFIG.stats.cache,
        context: !hideAll && !!CONFIG.stats.context
      };

      // 2) hide one element and any small wrapper above it
      var kill = function (el, climb) {
        var node = el, depth = 0;
        var maxDepth = 1;   // never touch wrappers: hide the leaf only
        while (node && node !== document.body && depth < maxDepth) {
          if (node.getBoundingClientRect().height > 48) break;
          node.style.setProperty("display", "none", "important");
          node.setAttribute("data-dsh-hid", "1");
          node = node.parentElement;
          depth++;
        }
      };

      var card = document.querySelector("[data-composer-card]");
      var guard = function (el) {
        if (!el) return false;
        if (card && (el === card || el.contains(card))) return false;
        return true;
      };

      var pctEl = null;
      (function () {
        var all = document.querySelectorAll("span,div");
        for (var q = 0; q < all.length; q++) {
          var node = all[q];
          if (!/^\d{1,3}%$/.test((node.textContent || "").trim())) continue;
          // must not be inside one of the stat pills (those carry their own number)
          if (node.closest && node.closest("[data-composer-stat]")) continue;
          pctEl = node;
          return;
        }
      })();

      // 3) per-item mode: climb only while the parent holds no other item
      if (!hideAll) {
        var sEl = statItem("speed"), cEl = statItem("cache");
        var all = [sEl, cEl, pctEl];
        var hideOne = function (el) {
          if (!el) return;
          var others = [];
          for (var o = 0; o < all.length; o++) if (all[o] && all[o] !== el) others.push(all[o]);
          var node = el, depth = 0;
          while (node && node.parentElement && node.parentElement !== document.body && depth < 4) {
            var parent = node.parentElement;
            if (parent.getBoundingClientRect().height > 48) break;
            var holds = false;
            for (var k = 0; k < others.length; k++) if (parent.contains(others[k])) { holds = true; break; }
            if (holds) break;
            node = parent;
            depth++;
          }
          node.style.setProperty("display", "none", "important");
          node.setAttribute("data-dsh-hid", "1");
        };
        if (sEl && !keep.speed) hideOne(sEl);
        if (cEl && !keep.cache) hideOne(cEl);
        if (pctEl && !keep.context) hideOne(pctEl);
        return;
      }

      } catch (e) { statsErr = e.message; }
    }

    function widenColumn() {
      var header = headerEl();
      if (!header) return;
      var root = header.parentElement;
      if (!root) return;
      var nodes = root.querySelectorAll("div");
      var limit = Math.min(nodes.length, 600);
      for (var i = 0; i < limit; i++) {
        var el = nodes[i];
        var already = el.getAttribute("data-dsh-wide") === "1";
        var w = el.clientWidth;
        var pw = el.parentElement ? el.parentElement.clientWidth : 0;
        if (!already) {
          if (w < 560 || w > 1260) continue;
          if (pw < w + 100) continue;
          if ((el.textContent || "").length < 200) continue;
          var cs = getComputedStyle(el);
          if (cs.display === "inline" || cs.position === "absolute" || cs.position === "fixed") continue;
          el.setAttribute("data-dsh-wide", "1");
        }
        if (pw < 200) continue;
        el.style.setProperty("width", Math.min(CONFIG.columnMaxWidth, Math.round(pw * CONFIG.columnRatio)) + "px", "important");
        el.style.setProperty("max-width", "none", "important");
        el.style.setProperty("margin-left", "auto", "important");
        el.style.setProperty("margin-right", "auto", "important");
      }
    }

    function flush() {
      if (flushing) return;
      flushing = true;
      try {
        if (CONFIG.features.hidePtcChip) { try { hideByText(document.body); } catch (e) {} }
        if (CONFIG.features.feather) { try { ensureTopFade(); } catch (e) {} }
        if (CONFIG.features.hideOnCollision) { try { syncTabCollision(); } catch (e) {} }
        if (CONFIG.features.hideHeaderButtons) { try { tidyHeaderActions(); } catch (e) {} }
        try { enlargeHeaderTitle(); } catch (e) {}
        if (CONFIG.features.sidebarFont) { try { enlargeSidebar(); } catch (e) {} }
        try { ensureComposerGap(); } catch (e) {}
        // always run: the function restores what it hid when the switch is off
        try { hideComposerStats(); } catch (e) {}
        if (CONFIG.features.widerColumn) { try { widenColumn(); } catch (e) {} }
        try {
          if (currentTab && !currentTab.isConnected) { hideTabs(); }
          else if (currentTab) { placeBar(currentTab); }
        } catch (e) {}
      } finally {
        flushing = false;
      }
    }

    var scheduleFlush = safe(function () {
      if (flushTimer) return;
      flushTimer = setTimeout(function () {
        flushTimer = null;
        flush();
      }, 150);
    });

    function apply(ctx) {
      if (typeof document === "undefined") return;

      var existingTag = document.querySelector("style[data-dsh-line-height]");
      if (!existingTag) {
        styleTag = document.createElement("style");
        styleTag.setAttribute("data-dsh-line-height", "1");
        styleTag.textContent = css;
        document.head.appendChild(styleTag);
      } else {
        styleTag = existingTag;
      }

      if (!CONFIG.features.hoverTabs) {
        var hdr0 = headerEl();
        if (hdr0) hdr0.setAttribute("data-dsh-strip", "1");
      }

      document.addEventListener("keydown", function (e) {
        if (!e.ctrlKey || !e.altKey) return;
        if (String(e.key).toLowerCase() !== "l") return;
        e.preventDefault();
        togglePanel();
      });

      var raf = null;
      document.addEventListener("mousemove", safe(function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          if (!CONFIG.features.hoverTabs) { var hh = headerEl(); if (hh) hh.setAttribute("data-dsh-strip", "1"); return; }
          var t = pickTab(e);
          if (t) {
            if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
            showTab(t);
          } else if (currentTab) {
            if (hideTimer) return;
            hideTimer = setTimeout(function () {
              hideTimer = null;
              try { hideTabs(); } catch (err) {}
            }, 260);
          }
        });
      }), { passive: true });

      window.addEventListener("resize", scheduleFlush);
      window.addEventListener("resize", syncTabCollision);
      window.addEventListener("scroll", scheduleFlush, { passive: true, capture: true });

      /* the observer only schedules work; flush() runs later and never */
      /* re-triggers itself through its own writes                     */
      var fixRaf = null;
      var fixSoon = function () {
        if (fixRaf) return;
        fixRaf = requestAnimationFrame(function () {
          fixRaf = null;
          if (CONFIG.features.sidebarFont) { try { enlargeSidebar(); } catch (e) {} }
          try { enlargeHeaderTitle(); } catch (e) {}
          if (CONFIG.features.hideOnCollision) { try { syncTabCollision(); } catch (e) {} }
          try { styleTabs(); } catch (e) {}
          try { shiftHeaderContent(); } catch (e) {}
          if (CONFIG.features.hideHeaderButtons) { try { tidyHeaderActions(); } catch (e) {} }
          var now2 = Date.now();
          if (now2 - (styleTabs._lastScan || 0) > 50) {
            styleTabs._lastScan = now2;
            if (CONFIG.features.hidePtcChip) { try { hideByText(document.body); } catch (e) {} }
          }
        });
        // a show/hide of the sidebar is animated; re-check a few times while it settles
        [60, 160, 320, 600, 900].forEach(function (ms) {
          setTimeout(function () {
            try { enlargeSidebar(); } catch (e) {}
            try { syncTabCollision(); } catch (e) {}
            try { styleTabs(); } catch (e) {}
          }, ms);
        });
      };
      new MutationObserver(function () { fixSoon(); scheduleFlush(); }).observe(document.body, { childList: true, subtree: true });
      document.addEventListener("transitionend", function () { try { enlargeSidebar(); } catch (e) {} try { syncTabCollision(); } catch (e) {} }, true);

      fixSoon();
      try { flush(); } catch (e) {}
      // the sidebar finishes rendering (and fonts settle) a few beats after boot
      [0, 120, 300, 700, 1400, 2600, 4500].forEach(function (ms) {
        setTimeout(function () { fixSoon(); flush(); }, ms);
      });
      try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fixSoon(); }); } catch (e) {}

      if (ctx && typeof ctx.effect === "function") {
        ctx.effect(function () {
          return function () {
            try {
              if (hideTimer) clearTimeout(hideTimer);
              if (flushTimer) clearTimeout(flushTimer);
            } catch (e) {}
          };
        });
      }
    }


    /* ------------------------------------------------------------------ */
    /* persistence + live re-apply (no host APIs involved)                */
    /* ------------------------------------------------------------------ */
    var STORE_KEY = "dsh-line-height:config";

    function loadStored() {
      try {
        var raw = localStorage.getItem(STORE_KEY);
        if (!raw) return;
        var saved = JSON.parse(raw);
        for (var k in saved) {
          if (!Object.prototype.hasOwnProperty.call(saved, k)) continue;
          if (k === "features" && saved.features) {
            for (var f in saved.features) {
              if (Object.prototype.hasOwnProperty.call(CONFIG.features, f)) CONFIG.features[f] = !!saved.features[f];
            }
          } else if (Object.prototype.hasOwnProperty.call(CONFIG, k)) {
            CONFIG[k] = saved[k];
          }
        }
      } catch (e) {}
    }

    function saveStored() {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(CONFIG)); } catch (e) {}
    }

    var styleTag = null;

    function refreshStyles() {
      if (!styleTag || !styleTag.isConnected) styleTag = document.querySelector("style[data-dsh-line-height]");
      if (!styleTag) return;
      try { styleTag.textContent = buildCss(); } catch (e) {}
    }

    function rerun() {
      // one full pass, exactly like boot — a subset drifted the composer layout
      try {
        if (!CONFIG.features.hoverTabs) {
          var hdrT = headerEl();
          if (hdrT) hdrT.setAttribute("data-dsh-strip", "1");
        }
      } catch (e) {}
      try { flush(); } catch (e) {}
    }

    var NUM_FIELDS = [
      ["lineHeight", "正文行高", 1.2, 2.4, 0.05],
      ["bodyWeight", "正文字重", 200, 700, 10],
      ["headingWeight", "标题字重", 300, 800, 10],
      ["strongWeight", "加粗字重", 300, 800, 10],
      ["headerHeight", "顶栏高度", 36, 72, 1],
      ["titleSize", "标题字号", 12, 24, 1],
      ["headerPaddingTop", "顶栏下移", 0, 30, 1],
      ["tabOffsetY", "tab 垂直微调", -10, 16, 1],
      ["tabFontSize", "tab 字号", 11, 18, 1],
      ["sidebarFontSize", "侧栏字号", 12, 20, 1],
      ["columnMaxWidth", "正文最大宽", 800, 2000, 20],
      ["columnRatio", "正文占父宽", 0.5, 1, 0.01],
      ["featherStart", "羽化起点", -60, 20, 1],
      ["featherEnd", "羽化终点", 10, 120, 1]
    ];

    var FLAG_FIELDS = [
      ["hoverTabs", "悬停才显示 tab"],
      ["feather", "顶沿羽化"],
      ["widerColumn", "加宽正文列"],
      ["hideStats", "隐藏底部状态行"],
      ["hideHeaderButtons", "隐藏顶部两个按钮"]
    ];

    var panelEl = null;
    var diagEl = null;
    var diagTimer = null;

    function closePanel() {
      if (panelEl && panelEl.parentNode) panelEl.parentNode.removeChild(panelEl);
      panelEl = null;
      diagEl = null;
      if (diagTimer) { clearInterval(diagTimer); diagTimer = null; }
    }

    function buildPanel() {
      var reset = function () { saveStored(); refreshStyles(); rerun(); };
      var wrap = document.createElement("div");
      wrap.setAttribute("data-dsh-lh-panel", "1");
      wrap.style.cssText = [
        "position:fixed", "right:16px", "bottom:16px", "z-index:2147483000",
        "width:340px", "max-height:76vh", "overflow:auto",
        "background:var(--dsw-alias-bg-layer-2,#fff)", "color:var(--dsw-alias-label-primary,#111)",
        "border:1px solid var(--dsw-alias-interactive-border,#d0d5dd)", "border-radius:12px",
        "box-shadow:0 12px 32px rgba(0,0,0,.18)", "padding:12px 14px",
        "font:12px/1.6 system-ui,-apple-system,'Segoe UI',sans-serif"
      ].join(";");

      var title = document.createElement("div");
      title.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:8px";
      var h = document.createElement("strong");
      h.textContent = "界面微调";
      h.style.cssText = "font-size:13px";
      var x = document.createElement("button");
      x.type = "button";
      x.textContent = "×";
      x.style.cssText = "border:0;background:transparent;font-size:16px;cursor:pointer;color:inherit;padding:0 4px";
      x.onclick = closePanel;
      title.appendChild(h);
      title.appendChild(x);
      wrap.appendChild(title);

      var hint = document.createElement("div");
      hint.textContent = "Ctrl+Alt+L 开关此面板 · 改动即时生效 · 保存在本机";
      hint.style.cssText = "color:var(--dsw-alias-label-caption,#6b7280);margin-bottom:10px";
      wrap.appendChild(hint);

      NUM_FIELDS.forEach(function (f) {
        var row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;gap:8px;padding:2px 0";
        var lab = document.createElement("span");
        lab.textContent = f[1];
        lab.style.cssText = "width:88px;flex:0 0 88px;color:var(--dsw-alias-label-secondary,#4a4d55)";
        var input = document.createElement("input");
        input.type = "range";
        input.min = f[2]; input.max = f[3]; input.step = f[4];
        input.value = CONFIG[f[0]];
        input.style.cssText = "flex:1;accent-color:var(--dsw-alias-state-business-primary,#2f6fed)";
        var val = document.createElement("span");
        val.textContent = String(CONFIG[f[0]]);
        val.style.cssText = "width:44px;text-align:right;font-variant-numeric:tabular-nums";
        input.oninput = function () {
          CONFIG[f[0]] = Number(input.value);
          val.textContent = String(CONFIG[f[0]]);
          reset();
        };
        row.appendChild(lab); row.appendChild(input); row.appendChild(val);
        wrap.appendChild(row);
      });

      var sep = document.createElement("div");
      sep.style.cssText = "height:1px;background:var(--dsw-alias-interactive-border,#e5e7eb);margin:10px 0";
      wrap.appendChild(sep);

      FLAG_FIELDS.forEach(function (f) {
        var lab = document.createElement("label");
        lab.style.cssText = "display:flex;align-items:center;gap:8px;padding:2px 0;cursor:pointer";
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!CONFIG.features[f[0]];
        cb.onchange = function () { CONFIG.features[f[0]] = cb.checked; reset(); };
        var span = document.createElement("span");
        span.textContent = f[1];
        lab.appendChild(cb); lab.appendChild(span);
        wrap.appendChild(lab);
      });

      var sub = document.createElement("div");
      sub.style.cssText = "margin:10px 0 0;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-1,#f7f8fa)";
      var subTitle = document.createElement("div");
      subTitle.textContent = "不隐藏时显示哪些（底部状态行）";
      subTitle.style.cssText = "margin-bottom:6px;color:var(--dsw-alias-label-caption,#6b7280)";
      sub.appendChild(subTitle);
      [["speed", "输出速度 tok/s"], ["cache", "缓存命中率"], ["context", "上下文占比"]].forEach(function (it) {
        var lab = document.createElement("label");
        lab.style.cssText = "display:flex;align-items:center;gap:8px;padding:2px 0;cursor:pointer";
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!CONFIG.stats[it[0]];
        cb.onchange = function () { CONFIG.stats[it[0]] = cb.checked; reset(); };
        var span = document.createElement("span");
        span.textContent = it[1];
        lab.appendChild(cb); lab.appendChild(span);
        sub.appendChild(lab);
      });
      wrap.appendChild(sub);

      var diag = document.createElement("div");
      diag.style.cssText = "margin-top:10px;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-1,#f7f8fa);font:11px/1.5 ui-monospace,Consolas,monospace;word-break:break-all;color:var(--dsw-alias-label-caption,#6b7280)";
      diag.textContent = statsDiagnostics();
      diagEl = diag;
      wrap.appendChild(diag);

      var foot = document.createElement("div");
      foot.style.cssText = "display:flex;gap:8px;margin-top:12px";
      var rb = document.createElement("button");
      rb.type = "button";
      rb.textContent = "恢复默认";
      rb.style.cssText = "padding:5px 12px;border-radius:8px;cursor:pointer;border:1px solid var(--dsw-alias-interactive-border,#d0d5dd);background:var(--dsw-alias-bg-layer-1,#fff);color:inherit";
      rb.onclick = function () { try { localStorage.removeItem(STORE_KEY); location.reload(); } catch (e) {} };
      foot.appendChild(rb);
      wrap.appendChild(foot);

      document.body.appendChild(wrap);
      panelEl = wrap;
      if (diagTimer) clearInterval(diagTimer);
      diagTimer = setInterval(function () { if (diagEl && diagEl.isConnected) diagEl.textContent = statsDiagnostics(); else { clearInterval(diagTimer); diagTimer = null; } }, 600);
    }

    function togglePanel() {
      if (panelEl) { closePanel(); return; }
      try { buildPanel(); } catch (e) { closePanel(); }
    }

    loadStored();
    var css = buildCss();

    exports.apply = apply;
    exports.inject = [];
    return module.exports;
  }
});
