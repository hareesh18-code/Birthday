/* ============================================================
   OUR JOURNEY — shared interactivity
   Works across all 5 pages; each function checks the DOM
   for its own elements before doing anything.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     1. Personalize — single source of truth for names/dates.
        Edit CONFIG below once; it fills every page automatically.
     ---------------------------------------------------------- */
  var CONFIG = {
    herName: "My Love",
    yourName: "Yours, Always",
    birthdayLine: "Happy birthday to the best part of my every day."
  };

  function personalize() {
    document.querySelectorAll("[data-her-name]").forEach(function (el) {
      el.textContent = CONFIG.herName;
    });
    document.querySelectorAll("[data-your-name]").forEach(function (el) {
      el.textContent = CONFIG.yourName;
    });
  }

  /* ----------------------------------------------------------
     2. Ambient petals + sparkles
     ---------------------------------------------------------- */
  function buildAmbientFX() {
    var layer = document.querySelector(".ambient-fx");
    if (!layer || reduceMotion) return;

    var petalSVG =
      '<svg viewBox="0 0 32 32"><path d="M16 2 C24 6 28 14 22 22 C18 28 14 28 10 22 C4 14 8 6 16 2Z" fill="currentColor"/></svg>';
    var petalColors = ["#C2415A", "#E8A6AE", "#7A1F3D", "#C9A24B"];

    var petalCount = window.innerWidth < 640 ? 7 : 12;
    for (var i = 0; i < petalCount; i++) {
      var p = document.createElement("div");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "vw";
      p.style.color = petalColors[i % petalColors.length];
      p.style.width = p.style.height = 10 + Math.random() * 10 + "px";
      p.style.animationDuration = 9 + Math.random() * 10 + "s, " + (3 + Math.random() * 3) + "s";
      p.style.animationDelay = -(Math.random() * 18) + "s, " + -(Math.random() * 4) + "s";
      p.innerHTML = petalSVG;
      layer.appendChild(p);
    }

    var sparkleCount = window.innerWidth < 640 ? 10 : 18;
    for (var j = 0; j < sparkleCount; j++) {
      var s = document.createElement("div");
      s.className = "sparkle";
      s.style.top = Math.random() * 100 + "vh";
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = 2 + Math.random() * 3 + "s";
      s.style.animationDelay = -(Math.random() * 4) + "s";
      layer.appendChild(s);
    }
  }

  /* ----------------------------------------------------------
     3. Envelope reveal (homepage hero)
     ---------------------------------------------------------- */
  function setupEnvelope() {
    var env = document.querySelector(".envelope");
    var banner = document.querySelector(".birthday-banner");
    if (!env) return;

    function open() {
      if (env.classList.contains("is-open")) return;
      env.classList.add("is-open");
      env.setAttribute("aria-expanded", "true");
      if (banner) {
        setTimeout(function () {
          banner.classList.add("is-visible");
          banner.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        }, 500);
      }
    }
    env.addEventListener("click", open);
    env.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  }

  /* ----------------------------------------------------------
     4. Polaroid photo uploads — click a frame, pick a photo.
        In-memory only (FileReader -> <img>), nothing is stored
        or uploaded anywhere; it simply previews your photo.
     ---------------------------------------------------------- */
  function setupPolaroids() {
    document.querySelectorAll(".polaroid__input").forEach(function (input) {
      input.addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        var frame = input.closest(".polaroid__frame");
        var img = frame.querySelector("img");
        var reader = new FileReader();
        reader.onload = function (ev) {
          img.src = ev.target.result;
          frame.classList.add("has-photo");
        };
        reader.readAsDataURL(file);
      });
    });
  }

  /* ----------------------------------------------------------
     5. Quote carousel (homepage)
     ---------------------------------------------------------- */
  function setupQuoteCarousel() {
    var root = document.querySelector(".quote-carousel");
    if (!root) return;
    var slides = root.querySelectorAll(".quote-slide");
    var dotsWrap = root.parentElement.querySelector(".quote-dots");
    if (!slides.length) return;

    var idx = 0;
    var timer;

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var b = document.createElement("button");
        if (i === 0) b.classList.add("is-active");
        b.setAttribute("aria-label", "Show quote " + (i + 1));
        b.addEventListener("click", function () { show(i); restart(); });
        dotsWrap.appendChild(b);
      });
    }

    function show(i) {
      slides[idx].classList.remove("is-active");
      if (dotsWrap) dotsWrap.children[idx].classList.remove("is-active");
      idx = i;
      slides[idx].classList.add("is-active");
      if (dotsWrap) dotsWrap.children[idx].classList.add("is-active");
    }

    function next() { show((idx + 1) % slides.length); }
    function restart() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(next, 5200);
    }

    slides[0].classList.add("is-active");
    restart();
  }

  /* ----------------------------------------------------------
     6. Proposal moment (final chapter)
     ---------------------------------------------------------- */
  function setupProposal() {
    var yes = document.querySelector("[data-proposal-yes]");
    var answer = document.querySelector(".proposal-answer");
    var burstLayer = document.querySelector(".burst");
    if (!yes) return;

    yes.addEventListener("click", function () {
      if (answer) {
        answer.classList.add("is-visible");
      }
      if (burstLayer && !reduceMotion) {
        spawnBurst(burstLayer);
      }
      yes.disabled = true;
    });
  }

  function spawnBurst(layer) {
    var shapes = ["❤", "✦", "❀"];
    for (var i = 0; i < 26; i++) {
      var el = document.createElement("span");
      el.textContent = shapes[i % shapes.length];
      el.style.position = "absolute";
      el.style.left = 50 + (Math.random() * 60 - 30) + "%";
      el.style.top = "55%";
      el.style.fontSize = 12 + Math.random() * 18 + "px";
      el.style.color = i % 2 ? "#C2415A" : "#C9A24B";
      el.style.opacity = "0";
      el.style.transition = "transform 1.1s cubic-bezier(.2,.8,.3,1), opacity 1.1s ease";
      layer.appendChild(el);
      requestAnimationFrame(function (node) {
        return function () {
          var angle = Math.random() * Math.PI * 2;
          var dist = 80 + Math.random() * 160;
          node.style.transform =
            "translate(" + Math.cos(angle) * dist + "px," + (Math.sin(angle) * dist - 60) + "px) rotate(" +
            (Math.random() * 360) + "deg)";
          node.style.opacity = "1";
        };
      }(el));
      setTimeout(function (node) { return function () { node.style.opacity = "0"; }; }(el), 1000);
      setTimeout(function (node) { return function () { node.remove(); }; }(el), 2200);
    }
  }

  /* ----------------------------------------------------------
     init
     ---------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    personalize();
    buildAmbientFX();
    setupEnvelope();
    setupPolaroids();
    setupQuoteCarousel();
    setupProposal();
  });
})();