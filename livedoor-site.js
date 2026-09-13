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

  function neutralizeLegacyPseudoTags() {
    document.querySelectorAll(".article-body-inner p").forEach(function (p) {
      if (p.dataset.otlLegacyTags === "1") return;

      var raw = (p.textContent || "").trim();
      if (!/^タグ\s*[:：]/.test(raw)) return;

      var names = raw
        .replace(/^タグ\s*[:：]\s*/, "")
        .split("/")
        .map(function (s) { return s.trim(); })
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

  function run() {
    normalizeHimariColumns();
    neutralizeLegacyPseudoTags();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();