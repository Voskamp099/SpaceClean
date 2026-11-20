/*
 * SpaceClean English presentation layer.
 * English is the default (no query flag). Simplified Chinese is opt-in via ?lang=zh.
 * This file never changes the app logic — it only swaps visible DOM text and
 * an attribute value through an ordered dictionary + a MutationObserver so
 * dynamically generated text (toasts, score board, copy feedback) is covered.
 */
(function () {
  if (new URLSearchParams(window.location.search).get("lang") === "zh") {
    document.documentElement.lang = "zh-CN";
    document.addEventListener("DOMContentLoaded", function () {
      if (document.getElementById("sc-lang-en")) return;
      var a = document.createElement("a");
      a.id = "sc-lang-en"; a.href = "?"; a.textContent = "EN";
      a.setAttribute("aria-label", "View in English");
      a.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2000;font:700 12px/1 system-ui,sans-serif;color:#0f172a;background:#38bdf8;padding:6px 11px;border-radius:20px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.35)";
      document.body.appendChild(a);
    });
    return;
  }
  if (window.__scI18nOn) return;
  window.__scI18nOn = true;
  document.documentElement.lang = "en";

  // Ordered longest-first so short keys never corrupt longer strings.
  var PAIRS = [
    ["打工人的提效神器 | SpaceClean Pro", "SpaceClean Pro | A productivity tool for the everyday grind"],
    ["删中文间空格，保留英文间/中英间的空格。", "Remove spaces between Chinese characters, keep spacing within and between English words."],
    ["每清理 1000 个字符，离下班就更近一步。", "Every 1,000 characters cleaned brings clocking-out one step closer."],
    ["格式化的是文本，整顿的是心情。", "It is the text we format, and the mood we fix."],
    ["删掉了多余的空格，就像删掉了多余的焦虑。", "Deleting stray spaces feels like deleting stray anxiety."],
    ["又是为职场效率添砖加瓦的一天 🧱", "Another day spent laying bricks for workplace efficiency 🧱"],
    ["保持整洁，不仅是为了代码，更是为了尊严。", "Staying tidy is not just about code, it is about dignity."],
    ["少即是多，简单即是高效。今晚不加班！", "Less is more, simple is efficient. No overtime tonight!"],
    ["哪怕生活有缝隙，文本也可以没有。", "Life may have gaps; the text does not have to."],
    ["这一刻，你掌控了文本，而不是被文本掌控。", "In this moment you control the text, instead of being controlled by it."],
    ["又解决了一个小麻烦，给自己点个赞！", "Solved one more small nuisance — give yourself a thumbs-up!"],
    ["简洁，是成年人最大的体面。", "Simplicity is an adult's greatest dignity."],
    ["在这里粘贴那些乱七八糟的文字吧...", "Paste your messy text here..."],
    ["这里会出现干净清爽的成果...", "Your clean, tidy result appears here..."],
    ["保留段落结构，只去除多余的杂乱。", "Keep the paragraph structure, strip only the clutter."],
    ["去除每行开头结尾，保留整齐排版。", "Trim the edges of each line for a tidy layout."],
    ["把连续的空格合并为一个，强迫症福音。", "Collapse runs of spaces into one — a gift for perfectionists."],
    ["删光所有空格、换行，最极致的压缩。", "Strip every space and line break for maximum compression."],
    ["原始文本 (INPUT)", "Original text (INPUT)"],
    ["清理结果 (OUTPUT)", "Cleaned result (OUTPUT)"],
    ["打工人语录", "Office quotes"],
    ["效率提升中...", "Productivity in progress..."],
    ["摸鱼积分", "Slack-off points"],
    ["清理模式", "Cleanup modes"],
    ["状态设置", "Status settings"],
    ["⚡ 实时处理", "⚡ Live processing"],
    ["立即执行", "Run now"],
    ["✨ 全部去除", "✨ Remove all"],
    ["📝 保留换行", "📝 Keep line breaks"],
    ["✂️ 首尾修剪", "✂️ Trim edges"],
    ["🧱 压缩多余", "🧱 Collapse extras"],
    ["🌐 中英保留", "🌐 Keep CJK & Latin"],
    ["🗑️ 清空", "🗑️ Clear"],
    ["🚀 开始清理", "🚀 Start cleaning"],
    ["📋 复制结果", "📋 Copy result"],
    ["✅ 已复制", "✅ Copied"],
    ["PRO", "PRO"],
    ["同样", "similarly"]
  ].filter(function (p) { return p[0] !== p[1]; });

  var ATTRS = ["placeholder", "title", "aria-label", "alt"];
  var busy = false;

  function translate(s) {
    if (!s || !/[\u4e00-\u9fff]/.test(s)) return s;
    var out = s;
    for (var i = 0; i < PAIRS.length; i++) {
      if (out.indexOf(PAIRS[i][0]) !== -1) out = out.split(PAIRS[i][0]).join(PAIRS[i][1]);
    }
    return out;
  }

  function patchTextNode(n) {
    if (!n.nodeValue || !/[\u4e00-\u9fff]/.test(n.nodeValue)) return;
    var t = translate(n.nodeValue);
    if (t !== n.nodeValue) n.nodeValue = t;
  }

  function patchElement(el) {
    if (!el || !el.attributes) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      if (v && /[\u4e00-\u9fff]/.test(v)) el.setAttribute(ATTRS[i], translate(v));
    }
  }

  function patchTree(root) {
    if (!root) return;
    if (root.nodeType === 3) { patchTextNode(root); return; }
    patchElement(root);
    if (!root.querySelectorAll) return;
    var els = root.querySelectorAll("*");
    for (var i = 0; i < els.length; i++) patchElement(els[i]);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var n;
    while ((n = walker.nextNode())) patchTextNode(n);
  }

  function patchAll() {
    if (busy) return;
    busy = true;
    try {
      document.title = translate(document.title);
      patchTree(document.documentElement);
      addSwitch();
    } finally { busy = false; }
  }

  function addSwitch() {
    if (document.getElementById("sc-lang-switch")) return;
    var a = document.createElement("a");
    a.id = "sc-lang-switch";
    a.href = "?lang=zh";
    a.textContent = "中文";
    a.setAttribute("aria-label", "Switch to Chinese");
    a.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:2000;font:600 12px/1 system-ui,sans-serif;color:#0f172a;background:#38bdf8;padding:6px 11px;border-radius:20px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.35)";
    document.body.appendChild(a);
  }

  function boot() {
    patchAll();
    var obs = new MutationObserver(function (muts) {
      if (busy) return;
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === "childList") {
          for (var j = 0; j < m.addedNodes.length; j++) patchTree(m.addedNodes[j]);
        } else if (m.type === "characterData") {
          patchTextNode(m.target);
        } else if (m.type === "attributes") {
          patchElement(m.target);
        }
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
