(function () {
  "use strict";

  function normalizeHimariColumns() {
    document.querySelectorAll(".himari-column").forEach(function (box) {
      if (box.dataset.otlNormalized === "1") return;

      var img = box.querySelector('img[alt="ひまり"]');
      var strong = box.querySelector("strong");
      if (!img || !strong) return;

      var titleP = strong.closest("p");
      var commentP = null;

      Array.prototype.forEach.call(box.children, function (child) {
        if (
          !commentP &&
          child.tagName === "P" &&
          child !== titleP &&
          child.textContent.trim() !== ""
        ) {
          commentP = child;
        }
      });

      if (!commentP) return;

      var title = document.createElement("div");
      title.className = "himari-note-title";
      title.textContent = strong.textContent.trim();

      var body = document.createElement("div");
      body.className = "himari-note-body";

      img.className = "himari-note-image";
      img.removeAttribute("style");
      img.removeAttribute("width");

      var text = document.createElement("div");
      text.className = "himari-note-text";

      commentP.removeAttribute("style");
      text.appendChild(commentP);

      body.appendChild(img);
      body.appendChild(text);

      box.className = "himari-note";
      box.removeAttribute("style");
      box.innerHTML = "";
      box.appendChild(title);
      box.appendChild(body);
      box.dataset.otlNormalized = "1";
    });
  }

  function applyResponsiveHimariLayout() {
    var isMobile = window.matchMedia("(max-width: 600px)").matches;

    document.querySelectorAll(".himari-note").forEach(function (box) {
      var body = box.querySelector(".himari-note-body");
      var img = box.querySelector(".himari-note-image");
      var text = box.querySelector(".himari-note-text");

      if (!body || !img || !text) return;

      if (isMobile) {
        /* スマホ版：省スペース2カラム */
        body.style.setProperty("display", "grid", "important");
        body.style.setProperty(
          "grid-template-columns",
          "110px minmax(0, 1fr)",
          "important"
        );
        body.style.setProperty("gap", "10px", "important");
        body.style.setProperty("align-items", "start", "important");

        img.style.setProperty("width", "110px", "important");
        img.style.setProperty("max-width", "110px", "important");
        img.style.setProperty("height", "auto", "important");
        img.style.setProperty("margin", "0", "important");
        img.style.setProperty("display", "block", "important");

        text.style.setProperty("min-width", "0", "important");
      } else {
        /* PC版：既存CSSへ戻す */
        body.style.removeProperty("display");
        body.style.removeProperty("grid-template-columns");
        body.style.removeProperty("gap");
        body.style.removeProperty("align-items");

        img.style.removeProperty("width");
        img.style.removeProperty("max-width");
        img.style.removeProperty("height");
        img.style.removeProperty("margin");
        img.style.removeProperty("display");

        text.style.removeProperty("min-width");
      }
    });
  }

  function neutralizeLegacyPseudoTags() {
    document.querySelectorAll(".article-body-inner p").forEach(function (p) {
      if (p.dataset.otlLegacyTags === "1") return;

      var raw = (p.textContent || "").trim();
      if (!/^タグ\s*[:：]/.test(raw)) return;

      var names = raw
        .replace(/^タグ\s*[:：]\s*/, "")
        .split("/")
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);

      if (!names.length) return;

      p.className = "article-tags article-tags-from-body";
      p.removeAttribute("style");
      p.innerHTML = "";

      var label = document.createElement("span");
      label.className = "article-tags-label";
      label.textContent = "タグ:";
      p.appendChild(label);

      names.forEach(function (name) {
        var span = document.createElement("span");
        span.className = "article-tag-link article-tag-link-unresolved";
        span.textContent = name;
        p.appendChild(span);
      });

      p.dataset.otlLegacyTags = "1";
    });
  }

  function linkifyHeaderBanner() {
    var wrap = document.querySelector(".header-inner01");
    if (!wrap || wrap.querySelector(".otl-header-home-link")) return;

    if (getComputedStyle(wrap).position === "static") {
      wrap.style.position = "relative";
    }

    var overlay = document.createElement("a");
    overlay.className = "otl-header-home-link";
    overlay.href = "https://oshikatsu.ldblog.jp/";
    overlay.setAttribute("aria-label", "推し活タイムライン トップページへ");
    overlay.style.cssText =
      "position:absolute;inset:0;z-index:2;display:block;cursor:pointer;";

    wrap.appendChild(overlay);
    wrap.dataset.otlBannerLinked = "1";
  }

  function run() {
    linkifyHeaderBanner();
    normalizeHimariColumns();
    applyResponsiveHimariLayout();
    neutralizeLegacyPseudoTags();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("resize", applyResponsiveHimariLayout);
})();
