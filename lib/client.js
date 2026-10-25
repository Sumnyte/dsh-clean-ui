window.__ModuleLoader__.load({
  id: "dsh-clean-ui",
  factory: function () {
    var module = { exports: {} };
    var exports = module.exports;

    var BLUE = "var(--dsw-alias-state-business-primary,#2f6fed)";

    /* ==================================================================
     * CONFIG — everything you are likely to want to change lives here.
     * Values are read once when the plugin loads (i.e. at app start).
     * ================================================================== */
    var CONFIG = {
      configVersion: 4,          // bumped when a stored default needs migrating
      preset: "custom",          // "custom" | "author" | "stock"

      /* typography */
      lineHeight: 1.75,          // conversation body line-height
      bodyWeight: 350,           // p / li / td / dd / blockquote
      headingWeight: 500,        // h1..h6 (700 in stock DSH)
      strongWeight: 500,         // bold inside markdown

      /* header */
      headerHeight: 50,          // px, conversation header
      titleSize: 17,             // px, session title
      headerPaddingTop: 14,      // px, pushes title/icons/tabs down a little
      tabOffsetY: 6,             // px, extra nudge for the tab strip

      /* tab strip */
      tabFontSize: 14,           // px
      tabColor: "#5b6169",       // idle tab colour
      barHeight: 2,              // px, the sliding pill
      tabRise: 6,                // px, how far the strip rises while fading in
      modeFontSize: 15,          // px, PTC / agent-preset mode badge
      modeOffsetY: 0,            // px, nudge the mode/task badge cell up/down

      /* sidebar */
      sidebarFontSize: 16,       // px, nav + workspace + session rows

      /* transcript column */
      columnMaxWidth: 1400,      // px cap
      columnRatio: 0.96,         // fraction of the parent width

      /* top fade (mask on the scroll container) */
      featherStart: -16,         // px relative to the header's bottom edge
      featherEnd: 46,            // px

      /* misc layout */
      composerGap: 8,            // card-to-edge air while the row is hidden
      statsRowGap: 12,           // symmetric air above and below the shown row
      composerHeight: 72,        // px, minimum height of the composer input

      /* bottom status row under the composer.
         features.hideStats = true hides the whole row; when it is false only
         the items ticked here are shown (an empty selection hides the row). */
      stats: { speed: true, cache: true, context: true },

      /* top-right utility buttons: true = keep visible, false = hide.
         explorer is the directory split (文件资源管理器 + 更多打开方式),
         bottomPanel = 展开底部面板, diagnostics = 上下文诊断. */
      topButtons: { explorer: true, more: true, sidebar: true, bottomPanel: true, diagnostics: true },

      /* feature switches */
      features: {
        hoverTabs: true,         // tabs hidden until the header is hovered
        hideOnCollision: true,   // fade the tabs out when the title would collide
        feather: true,           // feathered top edge
        widerColumn: true,       // widen the transcript column
        sidebarFont: true,       // bump sidebar typography
        hideStats: true,         // composer token/cache/context row
        hidePtcChip: true,       // "PTC 模式" / agent-preset mode badge
        hideTaskChip: false,     // "N 个后台任务运行中" chip
        hideViewMore: true,      // conversation-view "more" button
        hideMoreNav: true,       // rc.3 sidebar "更多" entry
        composerWidth: true      // make the composer card as wide as the transcript
      }
    };

    /* ==================================================================
     * PRESETS — "stock" is a special no-op preset (the plugin only keeps
     * its Ctrl+Alt+L panel); "author" is the look this plugin was tuned
     * with; "custom" keeps whatever the user has tuned.
     * ================================================================== */
    var PRESETS = {
      author: {
        lineHeight: 1.65,
        bodyWeight: 370,
        headingWeight: 490,
        strongWeight: 490,
        headerHeight: 42,
        titleSize: 17,
        headerPaddingTop: 14,
        tabOffsetY: 6,
        tabFontSize: 15,
        tabColor: "#5b6169",
        barHeight: 2,
        tabRise: 6,
        modeFontSize: 15,
        modeOffsetY: 0,
        sidebarFontSize: 16,
        columnMaxWidth: 980,
        columnRatio: 0.67,
        featherStart: -16,
        featherEnd: 46,
        composerGap: 17,
        statsRowGap: 6,
        composerHeight: 62,
        stats: { speed: true, cache: true, context: true },
        topButtons: { explorer: false, more: false, sidebar: true, bottomPanel: false, diagnostics: false },
        features: {
          hoverTabs: true,
          hideOnCollision: true,
          feather: true,
          widerColumn: true,
          sidebarFont: true,
          hideStats: false,
          hidePtcChip: false,
          hideTaskChip: false,
          hideViewMore: true,
          hideMoreNav: false,
          composerWidth: true
        }
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
      CONFIG.features.hidePtcChip ? "[class*='headerActions']>span[title]:has(>svg){display:none!important}" : "",
      /* 2) exact: ui-agent-preset's AgentPresetLabel; kept as its own rule so an engine that */
      /*    rejects :has() above cannot invalidate this selector list                          */
      CONFIG.features.hidePtcChip ? "[class*='dscfja_label']{display:none!important}" : "",
      /* mode badge typography (agent preset + PTC chips) */
      "[class*='dscfja_label'],[class*='dscfja_label'] *{font-size:" + CONFIG.modeFontSize + "px!important}",
      "[data-dsh-mode-badge],[data-dsh-mode-badge] *{font-size:" + CONFIG.modeFontSize + "px!important}",
      /* runtime marker for PTC / background-task chips found by text */
      "[data-dsh-mode-hidden]{display:none!important}",
      /* nudge the whole mode/task badge cell down and give it a soft fade */
      "[class*='headerActions']{position:relative!important;top:" + CONFIG.modeOffsetY + "px!important;transition:opacity .18s ease,visibility 0s linear 0s!important}",
      /* pin the badge cell at creation time: the host mounts the background-task
         chip at 16px/28px, so a JS pass would flash it larger for one frame */
      "[class*='headerActions']{font-size:" + CONFIG.modeFontSize + "px!important;line-height:22px!important;height:22px!important;min-height:22px!important;max-height:22px!important;align-items:center!important}",
      "[class*='headerActions'] *{font-size:" + CONFIG.modeFontSize + "px!important;line-height:22px!important}",
      "[class*='dscfja_label']{font-size:" + CONFIG.modeFontSize + "px!important}",
      "[class*='dscfja_label'],[class*='headerActions']>span[title]:has(>svg),[data-dsh-mode-badge]{transition:opacity .18s ease,visibility 0s linear 0s!important}",
      /* while the tab strip is revealed (header hover), fade the badge cell
         and any out-of-header mode chip away until the strip retracts */
      "[data-slot='conversation.header'] > header[data-dsh-strip='1'] [class*='headerActions']," +
      "[data-slot='conversation.header'] > header[data-dsh-strip='1'] [class*='dscfja_label']," +
      "[data-slot='conversation.header'] > header[data-dsh-strip='1'] [class*='headerActions']>span[title]:has(>svg)," +
      "[data-slot='conversation.header'] > header[data-dsh-strip='1'] [data-dsh-mode-badge]{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .18s ease,visibility 0s linear .18s!important}",

      /* the open-in-app split is controlled per-button by applyTopButtons */

      /* hide the conversation-view "more" button */
      CONFIG.features.hideViewMore ? "[aria-label*='更多会话视图'],[title*='更多会话视图'],[aria-label*='More conversation']{display:none!important}" : "",

      /* better-sidebar typography: slightly larger nav labels */
      "[data-dsh-better-sidebar],[data-dsh-sidebar]{font-size:16px!important}",
      "[data-dsh-better-sidebar] button,[data-dsh-better-sidebar] a,[data-dsh-better-sidebar] [role='button'],[data-dsh-sidebar] button,[data-dsh-sidebar] a,[data-dsh-sidebar] [role='button']{font-size:16px!important;line-height:1.55!important}",

      /* body copy weight: one notch below regular for a lighter read */
      "html body [class*='_markdown_'] :is(p,li,td,dd,blockquote){font-weight:" + CONFIG.bodyWeight + "!important}",

      /* softer headings: 700 reads as "shouting" with MiSans */
      "html body [class*='_markdown_'] :is(h1,h2,h3,h4,h5,h6){font-weight:" + CONFIG.headingWeight + "!important;letter-spacing:0!important}",
      "html body [class*='_markdown_'] :is(strong,b){font-weight:" + CONFIG.strongWeight + "!important}",
      /* the host's table hover swaps padding-bottom:5px -> 0 and switches the
         overflow, which pulls the next block up 5px; keep the reserved space */
      "html body [class*='_tableScroll_'].md-table-wide:hover{overflow-x:auto!important;padding-bottom:var(--dsh-scrollbar-width,5px)!important}",
      "html body [class*='_tableScroll_'].md-table-wide > *{padding-bottom:var(--dsh-scrollbar-width,5px)!important}",

      /* ---- compact header ---- */
      "[data-slot='conversation.header'] > header{position:relative;height:" + CONFIG.headerHeight + "px!important;min-height:" + CONFIG.headerHeight + "px!important;padding-top:0!important;padding-bottom:0!important;align-items:center!important;overflow:visible!important;border-bottom:0!important;box-shadow:none!important}",
      "[data-slot='conversation.session.header'] > div{min-height:0!important;height:auto!important;padding-top:0!important;padding-bottom:0!important}",
      "[data-slot='conversation.session.header'] > div:first-child,[data-slot='conversation.session.header'] > div:first-child *{font-size:" + CONFIG.titleSize + "px!important}",

      /* bottom status row: the row is hidden as a whole, or individual items
         are hidden through the dock's data-dsh-stats-hide list. The host's own
         data-composer-stat attributes survive re-renders, so only the context
         meter (which has no such marker) gets one from us. */
      "[data-composer-dock][data-dsh-stats-off='1']{display:none!important}",
      "[data-composer-dock][data-dsh-stats-hide~='speed'] [data-composer-stat='activity']," +
      "[data-composer-dock][data-dsh-stats-hide~='cache'] [data-composer-stat='usage']," +
      "[data-composer-dock][data-dsh-stats-hide~='context'] [data-dsh-stat='context']{display:none!important}",
      /* top-right utility buttons hidden from the panel */
      "[data-dsh-top-hidden]{display:none!important}",
      /* neutralise wallpaper glass on the composer */
      "[data-composer-card]{margin-bottom:" + CONFIG.composerGap + "px!important;--we-glass-alpha:0!important;--we-capsule-glass-fill:transparent!important;--we-chat-glass-fill:transparent!important;--we-tool-glass-fill:transparent!important}",
      /* taller input area (the host's editable div owns the height) */
      "[data-composer-card] div[class*='_input']{min-height:" + CONFIG.composerHeight + "px!important}",
      /* restore composer contrast */
      "[data-composer-card] button,[data-composer-card] button *{opacity:1!important;filter:none!important}",

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

    function hideModeBadges() {
      var marked = document.querySelectorAll("[data-dsh-mode-hidden]");
      for (var m = 0; m < marked.length; m++) {
        marked[m].removeAttribute("data-dsh-mode-hidden");
        if (marked[m].style.getPropertyValue("display") === "none") {
          marked[m].style.removeProperty("display");
        }
      }
      var header = headerEl();
      var roots = [document.body];
      for (var r = 0; r < roots.length; r++) {
        var nodes = roots[r].querySelectorAll("span,div,button");
        for (var i = 0; i < nodes.length; i++) {
          var el = nodes[i];
          if (el.closest("[data-dsh-lh-panel]")) continue;
          var text = (el.textContent || "").trim();
          if (!text || text.length > 24) continue;
          if (text !== "PTC 模式" && text.indexOf("后台任务运行中") === -1) continue;
          if (el.childElementCount > 3) continue;
          if (!(header && header.contains(el))) {
            var rr = el.getBoundingClientRect();
            if (rr.top > 160) continue;
          }
          var target = el;
          var parent = el.parentElement;
          if (parent && parent !== document.body && (parent.textContent || "").trim() === text &&
              parent.childElementCount <= 2) target = parent;
          target.setAttribute("data-dsh-mode-badge", "1");
          var isTask = text.indexOf("后台任务运行中") !== -1;
          if (isTask ? CONFIG.features.hideTaskChip : CONFIG.features.hidePtcChip) {
            target.setAttribute("data-dsh-mode-hidden", "1");
          }
        }
      }
      styleModeBadges();
    }

    // the host sets the badge font through an inline style; the stylesheet
    // !important loses against it, so pin the size inline with priority
    function styleModeBadges() {
      var px = CONFIG.modeFontSize + "px";
      var labels = document.querySelectorAll("[class*='dscfja_label']");
      for (var i = 0; i < labels.length; i++) {
        labels[i].style.setProperty("font-size", px, "important");
      }
      // the task chip lives in another headerActions cell (28px high, 16px
      // font); pin every mode/task cell to the 22px mode-badge height
      var actions = document.querySelectorAll("[class*='headerActions']");
      for (var a = 0; a < actions.length; a++) {
        actions[a].style.setProperty("font-size", px, "important");
        actions[a].style.setProperty("line-height", "22px", "important");
        actions[a].style.setProperty("height", "22px", "important");
        actions[a].style.setProperty("min-height", "22px", "important");
        actions[a].style.setProperty("max-height", "22px", "important");
        actions[a].style.setProperty("align-items", "center", "important");
        // every mode (PTC / standard / creative) may use a different label
        // class with its own 17px inline-important font; pin all descendants
        var hk = actions[a].querySelectorAll("*");
        for (var hki = 0; hki < hk.length; hki++) {
          hk[hki].style.setProperty("font-size", px, "important");
          hk[hki].style.setProperty("line-height", "22px", "important");
        }
      }
      var marked = document.querySelectorAll("[data-dsh-mode-badge]");
      for (var m = 0; m < marked.length; m++) {
        marked[m].style.setProperty("font-size", px, "important");
        var kids = marked[m].querySelectorAll("*");
        for (var k = 0; k < kids.length; k++) {
          kids[k].style.setProperty("font-size", px, "important");
        }
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
    var flushing = false;
    var flushTimer = null;

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
      if (!sc) return;
      if (!CONFIG.features.feather) {
        sc.style.removeProperty("-webkit-mask-image");
        sc.style.removeProperty("mask-image");
        return;
      }
      var header = headerEl();
      if (!header) return;
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

    function hideSidebarMore() {
      var marked = document.querySelectorAll("[data-dsh-more-hidden]");
      for (var m = 0; m < marked.length; m++) {
        marked[m].removeAttribute("data-dsh-more-hidden");
        marked[m].style.removeProperty("display");
      }
      if (!CONFIG.features.hideMoreNav) return;
      var all = document.querySelectorAll("span,div,a,button,[role='button']");
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if ((el.textContent || "").trim() !== "更多") continue;
        var r = el.getBoundingClientRect();
        // the visible nav row (the old hashed moreAnchor class is gone)
        if (r.left > 320 || r.width < 100 || r.height < 20 || r.height > 60) continue;
        el.style.setProperty("display", "none", "important");
        el.setAttribute("data-dsh-more-hidden", "1");
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

    /* ------------------------------------------------------------------ */
    /* bottom status row: hide it, or show only the chosen items          */
    /* ------------------------------------------------------------------ */
    function statEnabled(kind) {
      return !!(CONFIG.stats && CONFIG.stats[kind]);
    }

    function contextMeterEl(dock) {
      // the context meter is the dock's own control: a button whose whole label
      // is the bare percentage (ring icon + "21%"), not one of the stat pills
      var buttons = dock.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        var b = buttons[i];
        if (b.closest("[data-composer-stat]")) continue;
        if (!/^\d{1,3}%$/.test((b.textContent || "").trim())) continue;
        var el = b;
        while (el && el.parentElement !== dock) el = el.parentElement;
        if (el && el.parentElement === dock) return el;
      }
      // fallback for a markup without a button: the dock child that carries
      // nothing but the percentage
      for (var c = 0; c < dock.children.length; c++) {
        var kid = dock.children[c];
        if (kid.querySelector("[data-composer-stat]")) continue;
        if (/^\d{1,3}%$/.test((kid.textContent || "").trim())) return kid;
      }
      return null;
    }

    function applyComposerStats() {
      var dock = document.querySelector("[data-composer-dock]");
      if (!dock) return;
      var card = document.querySelector("[data-composer-card]");
      var bar = dock.parentElement;

      // Shown: one symmetric gap above and below the row. The host already
      // contributes dock padding-top and root padding-bottom, so subtract
      // those and let both visible gaps equal statsRowGap. Hidden: restore
      // the plain card margin (composerGap) the hidden layout is tuned for.
      var setRowGap = function (on) {
        if (!card) return;
        if (!on) {
          card.style.removeProperty("margin-bottom");
          dock.style.removeProperty("padding-bottom");
          return;
        }
        var gap = Math.max(0, Number(CONFIG.statsRowGap) || 0);
        var topInset = parseFloat(getComputedStyle(dock).paddingTop) || 0;
        var bottomInset = bar ? (parseFloat(getComputedStyle(bar).paddingBottom) || 0) : 0;
        card.style.setProperty("margin-bottom", Math.max(0, gap - topInset) + "px", "important");
        dock.style.setProperty("padding-bottom", Math.max(0, gap - bottomInset) + "px", "important");
      };

      if (CONFIG.features.hideStats || (!statEnabled("speed") && !statEnabled("cache") && !statEnabled("context"))) {
        dock.setAttribute("data-dsh-stats-off", "1");
        dock.removeAttribute("data-dsh-stats-hide");
        setRowGap(false);
        return;
      }
      dock.removeAttribute("data-dsh-stats-off");
      setRowGap(true);

      var hide = [];
      if (!statEnabled("speed")) hide.push("speed");
      if (!statEnabled("cache")) hide.push("cache");
      if (!statEnabled("context")) hide.push("context");
      if (hide.length) dock.setAttribute("data-dsh-stats-hide", hide.join(" "));
      else dock.removeAttribute("data-dsh-stats-hide");

      // the context meter has no host marker of its own; tag it once per mount
      var context = contextMeterEl(dock);
      if (context) context.setAttribute("data-dsh-stat", "context");
    }

    function widenColumn() {
      var marked = document.querySelectorAll("[data-dsh-wide]");
      if (!CONFIG.features.widerColumn) {
        for (var r = 0; r < marked.length; r++) {
          marked[r].removeAttribute("data-dsh-wide");
          marked[r].style.removeProperty("width");
          marked[r].style.removeProperty("max-width");
          marked[r].style.removeProperty("margin-left");
          marked[r].style.removeProperty("margin-right");
        }
        return;
      }
      // the transcript lives inside the conversation scroll body; the header's
      // own subtree no longer contains it in current builds
      var scroll = document.querySelector("[data-conversation-scroll]");
      var root = scroll || document.body;
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

    function columnEl() {
      var marked = document.querySelector("[data-dsh-wide]");
      if (marked) return marked;
      // widerColumn off: fall back to the widest text column in the transcript
      var scope = document.querySelector("[data-conversation-scroll]") || document.body;
      var cols = scope.querySelectorAll("div[class*='_column']");
      var best = null;
      var bestW = 0;
      for (var i = 0; i < cols.length; i++) {
        if ((cols[i].textContent || "").length < 40) continue;
        var w = cols[i].getBoundingClientRect().width;
        if (w > bestW) { best = cols[i]; bestW = w; }
      }
      return best;
    }

    // make the composer card exactly as wide as the transcript column
    function matchComposerWidth() {
      var card = document.querySelector("[data-composer-card]");
      if (!card) return;
      if (!CONFIG.features.composerWidth) {
        try {
          card.style.removeProperty("max-width");
          card.style.removeProperty("width");
        } catch (e) {}
        return;
      }
      var col = columnEl();
      if (!col) return;
      var w = Math.round(col.getBoundingClientRect().width);
      if (w < 320) return;
      var want = w + "px";
      if (card.style.getPropertyValue("max-width") !== want ||
          card.style.getPropertyPriority("max-width") !== "important") {
        card.style.setProperty("max-width", want, "important");
      }
      if (card.style.getPropertyValue("width") !== "100%" ||
          card.style.getPropertyPriority("width") !== "important") {
        card.style.setProperty("width", "100%", "important");
      }
    }

    var TOP_BUTTONS = {
      explorer: ["用 文件资源管理器 打开", "更多打开方式"],
      more: ["更多操作"],
      sidebar: ["打开右侧边栏", "打开右侧栏"],
      bottomPanel: ["展开底部面板"],
      diagnostics: ["上下文诊断"]
    };

    function topButtonLabel(el) {
      return (el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || "").trim();
    }

    // per-button visibility for the five top-right utility buttons; scoped to the
    // conversation header so sidebar chrome (分栏/全屏/收起) is never touched
    function applyTopButtons() {
      var header = document.querySelector("[data-slot='conversation.header'] > header");
      if (!header) return;
      var targets = [];
      var split = null;
      // anchor on the directory opener itself: its closest split wrapper owns
      // the rounded group border, so hiding only the two buttons leaves a line
      var opener = header.querySelector("[data-open-target='directory']");
      if (opener) {
        var candidate = opener.closest("[class*='_split']");
        if (candidate && header.contains(candidate)) split = candidate;
      }
      if (!split) {
        var splits = document.querySelectorAll("[class*='headerUtilities'] [class*='_split']");
        for (var s = 0; s < splits.length; s++) {
          if (header.contains(splits[s]) && splits[s].querySelector("[data-open-target='directory']")) {
            split = splits[s];
            break;
          }
        }
      }
      if (split) {
        if (CONFIG.topButtons.explorer) {
          if (split.style.getPropertyValue("display")) split.style.removeProperty("display");
          // the old group-hide pass set inline display:none on the two inner
          // buttons; clearing only the wrapper left the group border as a line
          var kids = split.querySelectorAll("button,[role='button'],a");
          for (var k2 = 0; k2 < kids.length; k2++) {
            if (kids[k2].style.getPropertyValue("display")) kids[k2].style.removeProperty("display");
          }
        } else {
          targets.push(split);
        }
      }
      var nodes = header.querySelectorAll("button,[role='button'],a");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var lab = topButtonLabel(el);
        if (!lab) continue;
        var key = null;
        for (var k in TOP_BUTTONS) {
          if (!Object.prototype.hasOwnProperty.call(TOP_BUTTONS, k)) continue;
          if (TOP_BUTTONS[k].indexOf(lab) !== -1) { key = k; break; }
        }
        if (!key) continue;
        if (key === "explorer" && split) continue;
        if (CONFIG.topButtons[key]) {
          if (el.style.getPropertyValue("display")) el.style.removeProperty("display");
        } else if (targets.indexOf(el) === -1) {
          targets.push(el);
        }
      }
      var marked = document.querySelectorAll("[data-dsh-top-hidden]");
      for (var m = 0; m < marked.length; m++) {
        if (targets.indexOf(marked[m]) === -1) marked[m].removeAttribute("data-dsh-top-hidden");
      }
      for (var t = 0; t < targets.length; t++) {
        if (!targets[t].hasAttribute("data-dsh-top-hidden")) {
          targets[t].setAttribute("data-dsh-top-hidden", "1");
        }
      }
    }

    function flush() {
      if (flushing) return;
      flushing = true;
      try {
        // debounced layout pass: the status row plus the two geometry passes
        // that only this pass owns (top feather, transcript column width).
        try { applyComposerStats(); } catch (e) {}
        try { ensureTopFade(); } catch (e) {}
        try { widenColumn(); } catch (e) {}
        try { matchComposerWidth(); } catch (e) {}
        try { applyTopButtons(); } catch (e) {}
        try { hideModeBadges(); } catch (e) {}
        // boot beats and mutations reach this pass, so the delayed sidebar gets caught
        try { hideSidebarMore(); } catch (e) {}
      } finally {
        flushing = false;
      }
    }

    var scheduleFlush = safe(function () {
      if (flushTimer) return;
      flushTimer = setTimeout(safe(function () {
        flushTimer = null;
        flush();
      }), 150);
    });

    function installPanelHotkey() {
      document.addEventListener("keydown", function (e) {
        if (!e.ctrlKey || !e.altKey) return;
        if (String(e.key).toLowerCase() !== "l") return;
        e.preventDefault();
        togglePanel();
      });
    }

    function apply(ctx) {
      if (typeof document === "undefined") return;

      // a hot reload creates a new generation; drop any panel the old one left
      try {
        var stale = document.querySelectorAll("[data-dsh-lh-panel]");
        for (var si = 0; si < stale.length; si++) stale[si].remove();
      } catch (e) {}

      // stock preset keeps the panel only: no CSS, no DOM passes
      if (CONFIG.preset === "stock") {
        installPanelHotkey();
        return;
      }

      var existingTag = document.querySelector("style[data-dsh-clean-ui]");
      if (!existingTag) {
        styleTag = document.createElement("style");
        styleTag.setAttribute("data-dsh-clean-ui", "1");
        styleTag.textContent = css;
        document.head.appendChild(styleTag);
      } else {
        styleTag = existingTag;
        // a hot reload carries new CSS but reuses the page's old tag
        try { styleTag.textContent = css; } catch (e) {}
      }

      if (!CONFIG.features.hoverTabs) {
        var hdr0 = headerEl();
        if (hdr0) hdr0.setAttribute("data-dsh-strip", "1");
      }

      installPanelHotkey();

      var raf = null;
      document.addEventListener("mousemove", safe(function (e) {
        if (raf) return;
        raf = requestAnimationFrame(safe(function () {
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
          } else {
            // no tab was active, but the strip may be pinned by an earlier run
            var hdrS = headerEl();
            if (hdrS && hdrS.getAttribute("data-dsh-strip") === "1") hideTabs();
          }
        }));
      }), { passive: true });

      window.addEventListener("resize", scheduleFlush);
      window.addEventListener("resize", safe(syncTabCollision));
      window.addEventListener("scroll", scheduleFlush, { passive: true, capture: true });

      /* re-apply the mode/task inline font/height on the same microtask as a
         host re-render, so the 17px/16px host sizes never paint */
      var badgeObserver = null;
      var badgeHeader = null;
      var badgeApplying = false;
      function applyBadgeStyles() {
        if (badgeApplying) return;
        badgeApplying = true;
        try {
          if (badgeObserver) badgeObserver.disconnect();
          styleModeBadges();
        } catch (e) {
        } finally {
          badgeApplying = false;
          if (badgeObserver && badgeHeader) {
            try {
              badgeObserver.observe(badgeHeader, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["style", "class"]
              });
            } catch (e) {}
          }
        }
      }
      function watchBadges() {
        var h = headerEl();
        if (!h) return;
        if (badgeObserver && badgeHeader === h) return;
        try { if (badgeObserver) badgeObserver.disconnect(); } catch (e) {}
        badgeHeader = h;
        badgeObserver = new MutationObserver(applyBadgeStyles);
        try {
          badgeObserver.observe(h, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["style", "class"]
          });
        } catch (e) {}
        applyBadgeStyles();
      }

      /* the observer only schedules work; flush() runs later and never */
      /* re-triggers itself through its own writes                     */
      var fixRaf = null;
      var fixSoon = function () {
        if (fixRaf) return;
        fixRaf = requestAnimationFrame(function () {
          fixRaf = null;
          try { watchBadges(); } catch (e) {}
          if (CONFIG.features.sidebarFont) { try { enlargeSidebar(); } catch (e) {} }
          try { enlargeHeaderTitle(); } catch (e) {}
          if (CONFIG.features.hideOnCollision) { try { syncTabCollision(); } catch (e) {} }
          try { styleTabs(); } catch (e) {}
          try { shiftHeaderContent(); } catch (e) {}
          try { hideSidebarMore(); } catch (e) {}
          try { applyComposerStats(); } catch (e) {}
          var now2 = Date.now();
          if (now2 - (styleTabs._lastScan || 0) > 50) {
            styleTabs._lastScan = now2;
            try { hideModeBadges(); } catch (e) {}
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
      document.addEventListener("transitionend", function () {
        try { enlargeSidebar(); } catch (e) {}
        try { syncTabCollision(); } catch (e) {}
        try { hideSidebarMore(); } catch (e) {}
      }, true);

      try { watchBadges(); } catch (e) {}
      fixSoon();
      try { flush(); } catch (e) {}
      // the sidebar finishes rendering (and fonts settle) a few beats after boot
      [0, 120, 300, 700, 1400, 2600, 4500].forEach(function (ms) {
        setTimeout(safe(function () { fixSoon(); flush(); }), ms);
      });
      try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fixSoon(); }); } catch (e) {}

      // the host repaints the stat labels often; the observers miss a mount that
      // changes no childList shape, so re-assert the row on a slow beat as well
      var statsTimer = setInterval(safe(applyComposerStats), 800);

      if (ctx && typeof ctx.effect === "function") {
        ctx.effect(function () {
          return function () {
            try {
              if (hideTimer) clearTimeout(hideTimer);
              if (flushTimer) clearTimeout(flushTimer);
              if (statsTimer) clearInterval(statsTimer);
              try { if (badgeObserver) badgeObserver.disconnect(); } catch (e) {}
            } catch (e) {}
          };
        });
      }
    }


    /* ------------------------------------------------------------------ */
    /* persistence + live re-apply (no host APIs involved)                */
    /* ------------------------------------------------------------------ */
    var STORE_KEY = "dsh-clean-ui:config";
    var LEGACY_STORE_KEY = "dsh-line-height:config";

    function loadStored() {
      try {
        var raw = localStorage.getItem(STORE_KEY);
        if (!raw) {
          // carry settings over from the pre-rename plugin id
          raw = localStorage.getItem(LEGACY_STORE_KEY);
          if (raw) {
            try {
              localStorage.setItem(STORE_KEY, raw);
              localStorage.removeItem(LEGACY_STORE_KEY);
            } catch (e) {}
          }
        }
        if (!raw) return;
        var saved = JSON.parse(raw);
        for (var k in saved) {
          if (!Object.prototype.hasOwnProperty.call(saved, k)) continue;
          if (k === "features" && saved.features) {
            for (var f in saved.features) {
              if (Object.prototype.hasOwnProperty.call(CONFIG.features, f)) CONFIG.features[f] = !!saved.features[f];
            }
          } else if (k === "stats" && saved.stats) {
            var st = saved.stats;
            // "activity" was the old combined speed + cache switch
            if (typeof st.speed === "boolean") CONFIG.stats.speed = st.speed;
            else if (typeof st.activity === "boolean") CONFIG.stats.speed = st.activity;
            if (typeof st.cache === "boolean") CONFIG.stats.cache = st.cache;
            else if (typeof st.activity === "boolean") CONFIG.stats.cache = st.activity;
            if (typeof st.context === "boolean") CONFIG.stats.context = st.context;
          } else if (k === "topButtons" && saved.topButtons) {
            for (var tb in saved.topButtons) {
              if (Object.prototype.hasOwnProperty.call(CONFIG.topButtons, tb)) CONFIG.topButtons[tb] = !!saved.topButtons[tb];
            }
          } else if (Object.prototype.hasOwnProperty.call(CONFIG, k)) {
            CONFIG[k] = saved[k];
          }
        }
        // "statsMode: hidden" is the old two-state switch: keep the row hidden
        if (saved.statsMode === "hidden") CONFIG.features.hideStats = true;
        // v2 tightened the card footer default; v3 replaced the bottom-only
        // gap with one symmetric gap above and below the shown row; v4
        // thinned the tab indicator from 4px to 2px
        var version = typeof saved.configVersion === "number" ? saved.configVersion : 0;
        if (version < 2 && CONFIG.composerGap === 18) CONFIG.composerGap = 8;
        if (version < 3) CONFIG.statsRowGap = 12;
        if (version < 4 && CONFIG.barHeight === 4) CONFIG.barHeight = 2;
        if (["stock", "author", "custom"].indexOf(CONFIG.preset) === -1) CONFIG.preset = "custom";
      } catch (e) {}
    }

    function saveStored() {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(CONFIG)); } catch (e) {}
    }

    // Switch presets by copying the values and reloading: a reload is the only
    // reliable way to remove every inline tweak the themed mode installed.
    function usePreset(name) {
      if (name === CONFIG.preset) return;
      if (name === "stock" || name === "custom") {
        CONFIG.preset = name;
        CONFIG.configVersion = 4;
        saveStored();
        try { location.reload(); } catch (e) {}
        return;
      }
      var p = PRESETS[name];
      if (!p) return;
      for (var k in p) {
        if (!Object.prototype.hasOwnProperty.call(p, k)) continue;
        if (k === "features") {
          for (var f in p.features) {
            if (Object.prototype.hasOwnProperty.call(CONFIG.features, f)) CONFIG.features[f] = p.features[f];
          }
        } else if (k === "stats") {
          for (var s in p.stats) {
            if (Object.prototype.hasOwnProperty.call(CONFIG.stats, s)) CONFIG.stats[s] = p.stats[s];
          }
        } else {
          CONFIG[k] = p[k];
        }
      }
      CONFIG.preset = name;
      CONFIG.configVersion = 3;
      saveStored();
      try { location.reload(); } catch (e) {}
    }

    var styleTag = null;

    function refreshStyles() {
      if (!styleTag || !styleTag.isConnected) styleTag = document.querySelector("style[data-dsh-clean-ui]");
      if (!styleTag) return;
      try { styleTag.textContent = buildCss(); } catch (e) {}
    }

    function rerun() {
      // one full pass, exactly like boot — a subset drifted the composer layout
      try {
        if (!CONFIG.features.hoverTabs) {
          var hdrT = headerEl();
          if (hdrT) hdrT.setAttribute("data-dsh-strip", "1");
        } else {
          // turning hover mode back on must retract a strip that the off state
          // had left pinned open
          hideTabs();
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
      ["featherEnd", "羽化终点", 10, 120, 1],
      ["composerGap", "隐藏时下留白", 0, 30, 1],
      ["statsRowGap", "状态行上下留白", 0, 40, 1],
      ["composerHeight", "输入框高度", 36, 160, 2]
    ];

    var FLAG_FIELDS = [
      ["hoverTabs", "悬停才显示 tab"],
      ["feather", "顶沿羽化"],
      ["widerColumn", "加宽正文列"],
      ["composerWidth", "输入框与正文同宽"],
      ["hidePtcChip", "隐藏模式徽章"],
      ["hideTaskChip", "隐藏后台任务"]
    ];

    var panelEl = null;

    function closePanel() {
      if (panelEl && panelEl.parentNode) panelEl.parentNode.removeChild(panelEl);
      panelEl = null;
    }

    function buildPanel() {
      var reset = function () {
        CONFIG.preset = "custom";
        CONFIG.configVersion = 4;
        saveStored();
        refreshStyles();
        rerun();
      };
      var wrap = document.createElement("div");
      wrap.setAttribute("data-dsh-lh-panel", "1");
      // the theme's layer tokens can be translucent over a wallpaper; a solid
      // backdrop keeps the panel readable
      var dark = false;
      try {
        dark = document.body.hasAttribute("data-ds-dark-theme") ||
          document.documentElement.hasAttribute("data-ds-dark-theme") ||
          getComputedStyle(document.body).colorScheme.indexOf("dark") !== -1;
      } catch (e) {}
      var panelBg = dark ? "rgba(26,30,36,0.97)" : "rgba(255,255,255,0.97)";
      wrap.style.cssText = [
        "position:fixed", "right:16px", "bottom:16px", "z-index:2147483647",
        "width:340px", "max-height:86vh", "overflow:auto",
        "background:" + panelBg, "color:" + (dark ? "#e8eaed" : "#111"),
        "border:1px solid rgba(127,127,127,.30)", "border-radius:12px",
        "box-shadow:0 12px 32px rgba(0,0,0,.28)", "padding:12px 14px",
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

      /* presets: stock (no-op), the author's look, or the user's own values */
      var presetBox = document.createElement("div");
      presetBox.style.cssText = "margin:0 0 10px;padding:8px 10px;border-radius:8px;background:rgba(127,127,127,.12)";
      var pTitle = document.createElement("div");
      pTitle.textContent = "预设";
      pTitle.style.cssText = "margin-bottom:6px;color:var(--dsw-alias-label-caption,#6b7280)";
      presetBox.appendChild(pTitle);
      var pRow = document.createElement("div");
      pRow.style.cssText = "display:flex;gap:6px;flex-wrap:wrap";
      [["stock", "默认外观"], ["author", "作者预设"], ["custom", "自定义"]].forEach(function (it) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = it[1];
        var active = CONFIG.preset === it[0];
        b.style.cssText = "padding:3px 9px;border-radius:7px;cursor:pointer;font:inherit;border:1px solid " +
          (active ? "var(--dsw-alias-state-business-primary,#2f6fed)" : "rgba(127,127,127,.35)") +
          ";background:" + (active ? "var(--dsw-alias-state-business-primary,#2f6fed)" : "rgba(127,127,127,.15)") +
          ";color:" + (active ? "#fff" : "inherit");
        b.onclick = function () { usePreset(it[0]); };
        pRow.appendChild(b);
      });
      presetBox.appendChild(pRow);
      var pNote = document.createElement("div");
      pNote.textContent = "切换预设会刷新页面；拖滑块后变为自定义";
      pNote.style.cssText = "margin-top:4px;color:var(--dsw-alias-label-caption,#6b7280);opacity:.85";
      presetBox.appendChild(pNote);
      wrap.appendChild(presetBox);

      if (CONFIG.preset === "stock") {
        var stockNote = document.createElement("div");
        stockNote.textContent = "当前为默认外观：插件不做任何改动，只保留本面板（Ctrl+Alt+L）。选择「作者预设」或「自定义」可恢复美化。";
        stockNote.style.cssText = "padding:8px 10px;border-radius:8px;background:rgba(127,127,127,.12);line-height:1.6";
        wrap.appendChild(stockNote);
        document.body.appendChild(wrap);
        panelEl = wrap;
        return;
      }

      /* the five top-right utility buttons: tick to keep each one visible */
      var topBox = document.createElement("div");
      topBox.style.cssText = "margin:0 0 10px;padding:8px 10px;border-radius:8px;background:rgba(127,127,127,.12)";
      var topHead = document.createElement("div");
      topHead.textContent = "顶部按钮（勾选=显示）";
      topHead.style.cssText = "margin-bottom:4px;color:var(--dsw-alias-label-caption,#6b7280)";
      topBox.appendChild(topHead);
      [["explorer", "文件资源管理器（含更多打开方式）"], ["more", "更多操作"], ["sidebar", "打开右侧边栏"], ["bottomPanel", "展开底部面板"], ["diagnostics", "上下文诊断"]].forEach(function (f) {
        var lab = document.createElement("label");
        lab.style.cssText = "display:flex;align-items:center;gap:8px;padding:2px 0;cursor:pointer";
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = CONFIG.topButtons[f[0]] !== false;
        cb.onchange = function () { CONFIG.topButtons[f[0]] = cb.checked; reset(); };
        var span = document.createElement("span");
        span.textContent = f[1];
        lab.appendChild(cb); lab.appendChild(span);
        topBox.appendChild(lab);
      });
      wrap.appendChild(topBox);

      var tabNote = document.createElement("div");
      tabNote.textContent = "tab 由各插件注册：对话/轨迹来自 DSH，上下文/编队来自 dsh-context；本插件对整条 tab 生效。";
      tabNote.style.cssText = "margin:0 0 10px;color:var(--dsw-alias-label-caption,#6b7280);opacity:.85;line-height:1.5";
      wrap.appendChild(tabNote);

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
      sep.style.cssText = "height:1px;background:rgba(127,127,127,.22);margin:10px 0";
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

      var statsSep = document.createElement("div");
      statsSep.style.cssText = "height:1px;background:rgba(127,127,127,.22);margin:10px 0";
      wrap.appendChild(statsSep);

      /* the bottom status row: hide it whole, or pick the items to keep */
      var statsBox = document.createElement("div");
      statsBox.style.cssText = "padding:8px 10px;border-radius:8px;background:rgba(127,127,127,.12)";
      var statsHead = document.createElement("div");
      statsHead.textContent = "底部状态行";
      statsHead.style.cssText = "margin-bottom:4px;color:var(--dsw-alias-label-caption,#6b7280)";
      statsBox.appendChild(statsHead);

      var hideRow = document.createElement("label");
      hideRow.style.cssText = "display:flex;align-items:center;gap:8px;padding:2px 0;cursor:pointer";
      var hideCb = document.createElement("input");
      hideCb.type = "checkbox";
      hideCb.checked = !!CONFIG.features.hideStats;
      var hideText = document.createElement("span");
      hideText.textContent = "隐藏整行";
      hideRow.appendChild(hideCb); hideRow.appendChild(hideText);
      statsBox.appendChild(hideRow);

      var itemHint = document.createElement("div");
      itemHint.textContent = "不隐藏时显示：";
      itemHint.style.cssText = "margin:4px 0 2px 20px;color:var(--dsw-alias-label-caption,#6b7280)";
      statsBox.appendChild(itemHint);

      var itemRows = [];
      [["speed", "输出速度 tok/s"], ["cache", "缓存命中率"], ["context", "上下文占比"]].forEach(function (it) {
        var lab = document.createElement("label");
        lab.style.cssText = "display:flex;align-items:center;gap:8px;padding:2px 0 2px 20px;cursor:pointer";
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!CONFIG.stats[it[0]];
        cb.onchange = function () {
          CONFIG.stats[it[0]] = cb.checked;
          reset();
        };
        var span = document.createElement("span");
        span.textContent = it[1];
        lab.appendChild(cb); lab.appendChild(span);
        statsBox.appendChild(lab);
        itemRows.push([cb, lab]);
      });

      var statsNote = document.createElement("div");
      statsNote.textContent = "全部不选等同于隐藏整行";
      statsNote.style.cssText = "margin:4px 0 0 20px;color:var(--dsw-alias-label-caption,#6b7280);opacity:.85";
      statsBox.appendChild(statsNote);

      var syncStatsRows = function () {
        for (var i = 0; i < itemRows.length; i++) {
          itemRows[i][0].disabled = !!CONFIG.features.hideStats;
          itemRows[i][1].style.opacity = CONFIG.features.hideStats ? "0.45" : "1";
        }
        itemHint.style.opacity = CONFIG.features.hideStats ? "0.45" : "1";
        statsNote.style.opacity = CONFIG.features.hideStats ? "0.45" : "0.85";
      };
      hideCb.onchange = function () {
        CONFIG.features.hideStats = hideCb.checked;
        syncStatsRows();
        reset();
      };
      syncStatsRows();
      wrap.appendChild(statsBox);

      var foot = document.createElement("div");
      foot.style.cssText = "display:flex;gap:8px;margin-top:12px";
      var rb = document.createElement("button");
      rb.type = "button";
      rb.textContent = "恢复默认";
      rb.style.cssText = "padding:5px 12px;border-radius:8px;cursor:pointer;border:1px solid rgba(127,127,127,.35);background:rgba(127,127,127,.12);color:inherit";
      rb.onclick = function () { try { localStorage.removeItem(STORE_KEY); location.reload(); } catch (e) {} };
      foot.appendChild(rb);
      wrap.appendChild(foot);

      document.body.appendChild(wrap);
      panelEl = wrap;
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
