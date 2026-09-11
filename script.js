// Plantie - static site behaviour
// Vanilla JS only, no build step. Runs on any page; every selector is guarded
// so this single file can be shared by all screens without errors.

(function () {
  "use strict";

  // ---------- Shared plant data + "my plants" state (all pages) ----------
  // PLANT_DATA is the single source of truth for every plant that has its
  // own plant-<slug>.html page (plant.html itself uses the "plant.html" key
  // - it is a real, complete plant page, just one that used to never be
  // "added" by default). Adding a plant here is what makes it eligible to
  // be added to "my plants" via the button on its own page (see "Add/remove
  // from my plants" below), and is also what lets it display correctly on
  // home.html/my-plants.html once added - the shelf/grid renderers below
  // read straight from this table. A future new plant-<slug>.html page
  // needs a row here (exactly like it already needed one for the identify
  // flow) before its own button can do anything.
  // location must match the "צמח בית"/"צמח חוץ" stat tile written on that
  // plant's own page (see FIGMA_BUILD_LOG.md - check the source docs, never
  // guess; a real mismatch was found and fixed here once already). needsWater
  // is just the default status shown until changed by hand via the button -
  // there is no real watering-schedule engine behind it.
  var PLANT_DATA = {
    "plant.html": { img: "assets/images/plant-prayer-plant.png", nameHe: "צמח תפילה", nameEn: "Prayer Plant", location: "inside", needsWater: false },
    "plant-philodendron.html": { img: "assets/images/plant-heartleaf-philodendron.png", nameHe: "פילודנדרון לבבי", nameEn: "Heartleaf Philodendron", location: "inside", needsWater: true },
    "plant-boston-fern.html": { img: "assets/images/plant-boston-fern.png", nameHe: "שרך בוסטון", nameEn: "Boston Fern", location: "inside", needsWater: false },
    "plant-aloe-vera.html": { img: "assets/images/plant-aloe-vera.png", nameHe: "אלוורה", nameEn: "Aloe Vera", location: "outside", needsWater: true },
    "plant-string-of-pearls.html": { img: "assets/images/plant-string-of-pearls.png", nameHe: "סביון הכדורים", nameEn: "String of Pearls", location: "outside", needsWater: true },
    "plant-yucca.html": { img: "assets/images/plant-yucca.png", nameHe: "יוקה", nameEn: "Yucca Plant", location: "outside", needsWater: false },
    "plant-areca-palm.html": { img: "assets/images/plant-areca-palm.png", nameHe: "דקל אריקה", nameEn: "Areca Palm", location: "inside", needsWater: false },
    "plant-rubber-plant.html": { img: "assets/images/plant-rubber-plant.png", nameHe: "פיקוס גומי", nameEn: "Rubber Plant", location: "inside", needsWater: false },
    "plant-jade-plant.html": { img: "assets/images/plant-jade-plant.png", nameHe: "עץ השפע", nameEn: "Jade Plant", location: "outside", needsWater: false },
    "plant-snake-plant.html": { img: "assets/images/plant-snake-plant.png", nameHe: "סנסיוריה", nameEn: "Snake Plant", location: "inside", needsWater: false },
    "plant-fiddle-leaf-fig.html": { img: "assets/images/plant-fiddle-leaf-fig.png", nameHe: "פיקוס כינורי", nameEn: "Fiddle Leaf Fig", location: "inside", needsWater: false },
    "plant-monstera-adansonii.html": { img: "assets/images/plant-monstera-adansonii.png", nameHe: "מונסטרה אדנסוני", nameEn: "Monstera Adansonii", location: "inside", needsWater: false },
    "plant-golden-pothos.html": { img: "assets/images/plant-golden-pothos.png", nameHe: "פוטוס", nameEn: "Golden Pothos", location: "inside", needsWater: false },
    "plant-zz-plant.html": { img: "assets/images/plant-zz-plant.png", nameHe: "זמיוקולקס", nameEn: "ZZ Plant", location: "inside", needsWater: false },
    "plant-peace-lily.html": { img: "assets/images/plant-peace-lily.png", nameHe: "שושן השלום", nameEn: "Peace Lily", location: "inside", needsWater: false },
    "plant-spider-plant.html": { img: "assets/images/plant-spider-plant.png", nameHe: "צמח העכביש", nameEn: "Spider Plant", location: "inside", needsWater: false },
    "plant-phalaenopsis-orchid.html": { img: "assets/images/plant-phalaenopsis-orchid.png", nameHe: "סחלב פלנופסיס", nameEn: "Phalaenopsis Orchid", location: "inside", needsWater: false },
    "plant-anthurium.html": { img: "assets/images/plant-anthurium.png", nameHe: "אנטוריום", nameEn: "Anthurium", location: "inside", needsWater: false },
    "plant-chinese-evergreen.html": { img: "assets/images/plant-chinese-evergreen.png", nameHe: "אגלאונמה", nameEn: "Chinese Evergreen", location: "inside", needsWater: false },
    "plant-dieffenbachia.html": { img: "assets/images/plant-dieffenbachia.png", nameHe: "דיפנבכיה", nameEn: "Dieffenbachia", location: "inside", needsWater: false },
    "plant-dragon-tree.html": { img: "assets/images/plant-dragon-tree.png", nameHe: "דרצנה מרגינטה", nameEn: "Dragon Tree", location: "inside", needsWater: false },
    "plant-kalanchoe.html": { img: "assets/images/plant-kalanchoe.png", nameHe: "קלנכואה", nameEn: "Kalanchoe", location: "outside", needsWater: false },
    "plant-monstera-deliciosa.html": { img: "assets/images/plant-monstera-deliciosa.png", nameHe: "מונסטרה דליסיוסה", nameEn: "Monstera Deliciosa", location: "inside", needsWater: false },
    "plant-ficus-benjamina.html": { img: "assets/images/plant-ficus-benjamina.png", nameHe: "פיקוס בנימינה", nameEn: "Ficus Benjamina", location: "outside", needsWater: false },
    "plant-peperomia.html": { img: "assets/images/plant-peperomia.png", nameHe: "פפרומיה", nameEn: "Peperomia", location: "inside", needsWater: false },
    "plant-pilea-peperomioides.html": { img: "assets/images/plant-pilea-peperomioides.png", nameHe: "פילאה פפרומיואידס", nameEn: "Pilea Peperomioides", location: "inside", needsWater: false },
    "plant-calathea.html": { img: "assets/images/plant-calathea.png", nameHe: "קלתאה", nameEn: "Calathea", location: "inside", needsWater: false },
    "plant-stromanthe.html": { img: "assets/images/plant-stromanthe.png", nameHe: "סטרומנטה", nameEn: "Stromanthe", location: "inside", needsWater: false },
    "plant-croton.html": { img: "assets/images/plant-croton.png", nameHe: "קרוטון", nameEn: "Croton", location: "outside", needsWater: false },
    "plant-hoya.html": { img: "assets/images/plant-hoya.png", nameHe: "הויה", nameEn: "Hoya", location: "inside", needsWater: false }
  };

  // Reused markup for the small water-drop badge shown on a shelf slot / grid
  // card when that plant currently needs water (same icon already used in
  // the static markup this replaces).
  var WATER_BADGE_HTML =
    '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round">' +
    '<path d="M9.55,21.36c1.3,0,2.55-.53,3.46-1.47.92-.94,1.43-2.22,1.43-3.55,0-1.43-.7-2.79-2.1-3.94-1.4-1.15-2.45-2.86-2.8-4.66-.35,1.79-1.4,3.51-2.8,4.66-1.4,1.15-2.1,2.51-2.1,3.94,0,1.33.52,2.6,1.43,3.55.92.94,2.16,1.47,3.46,1.47Z"/>' +
    '<path d="M16.9,9.45c.65,0,1.27-.26,1.73-.73.46-.47.72-1.11.72-1.77,0-.72-.35-1.4-1.05-1.97-.7-.57-1.22-1.43-1.4-2.33-.17.9-.7,1.75-1.4,2.33-.7.57-1.05,1.25-1.05,1.97,0,.66.26,1.3.72,1.77.46.47,1.08.73,1.73.73Z"/></svg>';

  // "My plants" - which plants (by their PLANT_DATA key) are currently on
  // the user's shelf. Stored in localStorage so it survives navigation and
  // reloads (this is a static site with no backend/database - the browser
  // itself is the only place this state can live). Seeded once, on first
  // ever visit, to exactly the 9 plants that used to be hardcoded on
  // home.html/my-plants.html, so nothing changes for anyone who already has
  // this site open. After that first seed, every add/remove is real and
  // persists per-browser.
  var MY_PLANTS_KEY = "plantieMyPlants";
  var DEFAULT_MY_PLANTS = [
    "plant-philodendron.html", "plant-boston-fern.html", "plant-jade-plant.html",
    "plant-rubber-plant.html", "plant-yucca.html", "plant-aloe-vera.html",
    "plant-string-of-pearls.html", "plant-snake-plant.html", "plant-areca-palm.html"
  ];
  var myPlantsCache = null;
  function readMyPlants() {
    try {
      var raw = window.localStorage.getItem(MY_PLANTS_KEY);
      if (raw === null) {
        window.localStorage.setItem(MY_PLANTS_KEY, JSON.stringify(DEFAULT_MY_PLANTS));
        return DEFAULT_MY_PLANTS.slice();
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : DEFAULT_MY_PLANTS.slice();
    } catch (e) {
      // localStorage unavailable (private browsing etc.) - fall back to an
      // in-memory list so the page still works, just without persistence.
      return DEFAULT_MY_PLANTS.slice();
    }
  }
  function getMyPlants() {
    if (myPlantsCache === null) myPlantsCache = readMyPlants();
    return myPlantsCache;
  }
  function saveMyPlants(list) {
    myPlantsCache = list;
    try { window.localStorage.setItem(MY_PLANTS_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function isMyPlant(target) {
    return getMyPlants().indexOf(target) !== -1;
  }
  function addMyPlant(target) {
    var list = getMyPlants().slice();
    if (list.indexOf(target) === -1) list.push(target);
    saveMyPlants(list);
  }
  function removeMyPlant(target) {
    saveMyPlants(getMyPlants().filter(function (t) { return t !== target; }));
  }
  // Manual reset back to the original 9 plants - wired to the "reset" item
  // in the side menu (data-reset-plants, see below), not automatic. The
  // whole point of "my plants" is that it stays put between visits, so this
  // only runs when the user chooses it on purpose.
  function resetMyPlants() {
    saveMyPlants(DEFAULT_MY_PLANTS.slice());
  }

  // ---------- Home: shelves, rendered from "my plants" (home.html) ----------
  // Replaces the old hardcoded 3 shelf-rows: builds exactly as many rows as
  // needed (3 slots per row, matching the shelf.png artwork) from whichever
  // plants are currently in the list, in the order they were added. Shows
  // the "עוד אין כאן צמחים" empty state (data-home-empty) instead when the
  // list is empty.
  function renderHomeShelves() {
    var content = document.querySelector("[data-home-content]");
    var empty = document.querySelector("[data-home-empty]");
    var shelves = document.querySelector(".shelves");
    if (!content || !shelves) return;
    var myPlants = getMyPlants().filter(function (t) { return PLANT_DATA[t]; });
    if (myPlants.length === 0) {
      content.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    content.hidden = false;
    if (empty) empty.hidden = true;
    shelves.innerHTML = "";
    for (var i = 0; i < myPlants.length; i += 3) {
      var row = document.createElement("div");
      row.className = "shelf-row";
      var shelfBg = document.createElement("img");
      shelfBg.className = "shelf-bg";
      shelfBg.src = "assets/images/shelf.png";
      shelfBg.alt = "";
      shelfBg.setAttribute("role", "presentation");
      row.appendChild(shelfBg);
      var plantsWrap = document.createElement("div");
      plantsWrap.className = "shelf-plants";
      myPlants.slice(i, i + 3).forEach(function (target) {
        var data = PLANT_DATA[target];
        var slot = document.createElement("a");
        slot.className = "plant-slot";
        slot.href = target;
        slot.setAttribute("aria-label", data.nameHe + " - לצפייה בפרטי הצמח");
        var img = document.createElement("img");
        img.src = data.img;
        img.alt = "";
        slot.appendChild(img);
        if (data.needsWater) {
          var badge = document.createElement("span");
          badge.className = "badge-water";
          badge.setAttribute("aria-hidden", "true");
          badge.innerHTML = WATER_BADGE_HTML;
          slot.appendChild(badge);
        }
        plantsWrap.appendChild(slot);
      });
      row.appendChild(plantsWrap);
      shelves.appendChild(row);
    }
  }

  // ---------- Home: today's-tasks card count (home.html) ----------
  // The card's plant count used to be a fixed "3" - now it always reflects
  // however many of the current "my plants" need water, and the whole card
  // hides itself when that number is zero (nothing to send someone to).
  function renderTodayCard() {
    var card = document.querySelector(".today-card");
    if (!card) return;
    var countText = card.querySelector("[data-today-count]");
    var count = getMyPlants().filter(function (t) { return PLANT_DATA[t] && PLANT_DATA[t].needsWater; }).length;
    if (count === 0) {
      card.hidden = true;
      return;
    }
    card.hidden = false;
    if (countText) {
      countText.textContent = count === 1
        ? "יש לך צמח אחד שצריך לשים לב אליו"
        : "יש לך " + count + " צמחים שצריך לשים לב אליהם";
    }
  }

  // ---------- My plants: grid, rendered from "my plants" (my-plants.html) ----------
  // Replaces the old hardcoded 9 plant-card anchors. Rebuilt from the same
  // "my plants" list + PLANT_DATA used on home.html, so a plant added or
  // removed via either page's button is reflected on both. The filter-chip
  // code right below queries this grid fresh on every click, so it keeps
  // working against whatever is currently rendered here. Shows the "עוד אין
  // כאן צמחים" empty state (data-myplants-empty) instead when the list is
  // empty.
  function renderPlantGrid() {
    var grid = document.querySelector(".plant-grid");
    var empty = document.querySelector("[data-myplants-empty]");
    if (!grid) return;
    var myPlants = getMyPlants().filter(function (t) { return PLANT_DATA[t]; });
    if (myPlants.length === 0) {
      grid.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    grid.hidden = false;
    if (empty) empty.hidden = true;
    grid.innerHTML = "";
    myPlants.forEach(function (target) {
      var data = PLANT_DATA[target];
      var card = document.createElement("a");
      card.className = "plant-card" + (data.needsWater ? " needs-water" : "");
      card.href = target;
      card.setAttribute("data-location", data.location);
      var img = document.createElement("img");
      img.src = data.img;
      img.alt = data.nameHe;
      card.appendChild(img);
      if (data.needsWater) {
        var badge = document.createElement("span");
        badge.className = "badge-water";
        badge.setAttribute("aria-hidden", "true");
        badge.innerHTML = WATER_BADGE_HTML;
        card.appendChild(badge);
      }
      var name = document.createElement("span");
      name.className = "plant-name";
      name.textContent = data.nameHe;
      card.appendChild(name);
      var meta = document.createElement("span");
      meta.className = "plant-meta";
      meta.textContent = data.needsWater ? "להשקות" : "בריא";
      card.appendChild(meta);
      grid.appendChild(card);
    });
  }

  // ---------- Profile: stat cards (profile.html) ----------
  // The two numbers ("09 צמחים על המדף שלי" / "03 צמחים זקוקים לטיפול") used
  // to be fixed text - now both read straight from the same "my plants"
  // list + PLANT_DATA as everywhere else, so they always match reality
  // instead of drifting the moment a plant is added/removed/reset.
  function renderProfileStats() {
    var shelfEl = document.querySelector("[data-stat-shelf-count]");
    var waterEl = document.querySelector("[data-stat-water-count]");
    if (!shelfEl && !waterEl) return;
    var myPlants = getMyPlants().filter(function (t) { return PLANT_DATA[t]; });
    var pad2 = function (n) { return n < 10 ? "0" + n : String(n); };
    if (shelfEl) shelfEl.textContent = pad2(myPlants.length);
    if (waterEl) {
      var waterCount = myPlants.filter(function (t) { return PLANT_DATA[t].needsWater; }).length;
      waterEl.textContent = pad2(waterCount);
    }
  }

  renderHomeShelves();
  renderTodayCard();
  renderPlantGrid();
  renderProfileStats();

  // ---------- Add/remove from "my plants" (every plant-<slug>.html page) ----------
  // The button already existed purely as a visual mockup (btn-lime "יאללה,
  // מכניסים למדף!" vs btn-primary "כבר על הדף! להוריד?") - this is what
  // actually makes it add/remove the current page's plant from "my plants",
  // and keeps the button's own text/style in sync with whether it is on the
  // shelf right now. Works the same on every plant page, including
  // plant.html itself - no per-page code needed, as long as the page's own
  // filename has a PLANT_DATA row above and its button carries
  // data-plant-toggle.
  var plantToggleBtn = document.querySelector("[data-plant-toggle]");
  if (plantToggleBtn) {
    var currentPlantFile = window.location.pathname.split("/").pop() || "plant.html";
    var updatePlantToggleBtn = function () {
      var added = isMyPlant(currentPlantFile);
      plantToggleBtn.textContent = added ? "כבר על הדף! להוריד?" : "יאללה, מכניסים למדף!";
      plantToggleBtn.classList.toggle("btn-primary", added);
      plantToggleBtn.classList.toggle("btn-lime", !added);
    };
    if (PLANT_DATA[currentPlantFile]) {
      updatePlantToggleBtn();
      plantToggleBtn.addEventListener("click", function () {
        if (isMyPlant(currentPlantFile)) {
          removeMyPlant(currentPlantFile);
        } else {
          addMyPlant(currentPlantFile);
        }
        updatePlantToggleBtn();
      });
    }
  }

  // ---------- Plant detail photo carousel (plant.html) ----------
  var track = document.getElementById("carousel-track");
  var dotsWrap = document.getElementById("carousel-dots");

  if (track && dotsWrap) {
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll("button"));
    var slides = Array.prototype.slice.call(track.children);
    var carouselTopBar = document.querySelector(".plant-carousel .top-bar");

    function setActiveDot(index) {
      dots.forEach(function (dot, i) {
        var isActive = i === index;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      // The top-bar icon has no background anymore, so it switches between
      // black and white to stay legible against whichever photo is showing.
      if (carouselTopBar && slides[index]) {
        var tone = slides[index].getAttribute("data-icon-tone") || "dark";
        carouselTopBar.setAttribute("data-icon-tone", tone);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var index = parseInt(dot.getAttribute("data-index"), 10);
        var target = slides[index];
        if (target) {
          track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
          setActiveDot(index);
        }
      });
    });

    // Keep dots in sync when the user swipes the carousel directly.
    var scrollTimeout;
    track.addEventListener("scroll", function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var closestIndex = 0;
        var closestDistance = Infinity;
        slides.forEach(function (slide, i) {
          var distance = Math.abs(slide.offsetLeft - track.scrollLeft);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        });
        setActiveDot(closestIndex);
      }, 100);
    });
  }

  // ---------- Difficulty slider live label (plant.html) ----------
  var difficulty = document.getElementById("difficulty");
  if (difficulty) {
    difficulty.addEventListener("input", function () {
      var value = difficulty.value;
      var word = value < 33 ? "קשה" : value < 66 ? "בינוני" : "קל";
      difficulty.setAttribute("aria-valuetext", value + " מתוך 100, " + word);
    });
  }

  // ---------- Watering-reminder toggle (profile.html) ----------
  var toggleSwitch = document.querySelector("[data-toggle-switch]");
  if (toggleSwitch) {
    toggleSwitch.addEventListener("click", function () {
      var isOn = toggleSwitch.classList.toggle("is-on");
      toggleSwitch.setAttribute("aria-checked", isOn ? "true" : "false");
    });
  }

  // ---------- "Today's tasks" card chevron (home.html) ----------
  var todayCard = document.querySelector(".today-card");
  if (todayCard) {
    var chevron = todayCard.querySelector(".chevron");
    if (chevron) {
      chevron.setAttribute("aria-hidden", "true");
    }
  }

  // ---------- Login button (login.html) ----------
  // No real backend in this static prototype: clicking "התחברות" just moves
  // the click-through flow forward to the home screen.
  var loginBtn = document.getElementById("login-submit");
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      window.location.href = "home.html";
    });
  }

  // ---------- Menu drawer (home / my-plants / plant) ----------
  // The hamburger link keeps href="menu.html" as a no-JS fallback; when JS
  // runs, it opens an in-page drawer that slides in from the right instead.
  var menuOpenBtn = document.querySelector("[data-menu-open]");
  var menuDrawer = document.querySelector("[data-menu-drawer]");
  var menuBackdrop = document.querySelector("[data-menu-backdrop]");
  var menuCloseBtn = document.querySelector("[data-menu-close]");

  if (menuOpenBtn && menuDrawer && menuBackdrop) {
    var closeMenuTimeout;

    var openMenu = function (event) {
      if (event) event.preventDefault();
      clearTimeout(closeMenuTimeout);
      menuBackdrop.hidden = false;
      requestAnimationFrame(function () {
        menuDrawer.classList.add("is-open");
        menuBackdrop.classList.add("is-open");
      });
      menuDrawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    var closeMenu = function () {
      menuDrawer.classList.remove("is-open");
      menuBackdrop.classList.remove("is-open");
      menuDrawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      closeMenuTimeout = setTimeout(function () {
        menuBackdrop.hidden = true;
      }, 300);
    };

    menuOpenBtn.addEventListener("click", openMenu);
    menuBackdrop.addEventListener("click", closeMenu);
    if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuDrawer.classList.contains("is-open")) closeMenu();
    });
  }

  // ---------- Reset "my plants" (side menu, below the settings item) ----------
  // Present both inside the in-page drawer (most pages) and on the standalone
  // menu.html screen, so query all matches rather than assuming just one.
  // Asks for confirmation first since it discards whatever the user added -
  // then sends them to home.html so they see the reset shelves right away.
  var resetPlantsBtns = document.querySelectorAll("[data-reset-plants]");
  if (resetPlantsBtns.length) {
    resetPlantsBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var confirmed = window.confirm("לאפס את \"הצמחים שלי\" למצב ההתחלתי? כל צמח שהוספת או הסרת בעצמך יאבד.");
        if (!confirmed) return;
        resetMyPlants();
        window.location.href = "home.html";
      });
    });
  }

  // ---------- Filter chips (my-plants.html) ----------
  // renderPlantGrid() above already ran and populated .plant-grid by the
  // time this section executes (script runs top to bottom, no async gap),
  // but applyFilter re-queries the cards fresh on every call rather than
  // caching them once, so it can never go stale if that ever changes.
  var chipRow = document.querySelector(".chip-row");
  var plantGrid = document.querySelector(".plant-grid");
  if (chipRow && plantGrid) {
    var chips = Array.prototype.slice.call(chipRow.querySelectorAll(".chip:not(.chip-add)"));
    var applyFilter = function (filter) {
      var plantCards = Array.prototype.slice.call(plantGrid.querySelectorAll(".plant-card"));
      plantCards.forEach(function (card) {
        var matches =
          filter === "all" ||
          (filter === "water" ? card.classList.contains("needs-water") : card.getAttribute("data-location") === filter);
        card.hidden = !matches;
      });
    };
    var activateChip = function (chip) {
      chips.forEach(function (c) {
        c.classList.remove("is-active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
      applyFilter(chip.getAttribute("data-filter") || "all");
    };
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activateChip(chip);
      });
    });

    // Deep-link support: my-plants.html?filter=water (used by the home-page
    // "today's tasks" card) pre-selects the matching chip on load.
    var requestedFilter = new URLSearchParams(window.location.search).get("filter");
    if (requestedFilter) {
      var requestedChip = chips.filter(function (c) {
        return c.getAttribute("data-filter") === requestedFilter;
      })[0];
      if (requestedChip) activateChip(requestedChip);
    }
  }

  // ---------- Symptom dropdown (plant.html - "אבחון הבעיה") ----------
  var symptomSelect = document.querySelector("[data-symptom-select]");
  if (symptomSelect) {
    var symptomToggle = symptomSelect.querySelector("[data-symptom-toggle]");
    var symptomValue = symptomSelect.querySelector("[data-symptom-value]");
    var symptomList = symptomSelect.querySelector("[data-symptom-list]");
    var symptomOptions = Array.prototype.slice.call(symptomList.querySelectorAll("li"));
    // Sits right below the dropdown; only shown once a symptom that actually
    // has an explanation (i.e. not "אחר", and not the unselected state) is picked.
    var symptomExplanation = document.querySelector("[data-symptom-explanation]");

    function closeSymptomList() {
      symptomSelect.classList.remove("is-open");
      symptomToggle.setAttribute("aria-expanded", "false");
      symptomList.hidden = true;
    }
    function openSymptomList() {
      symptomSelect.classList.add("is-open");
      symptomToggle.setAttribute("aria-expanded", "true");
      symptomList.hidden = false;
    }

    symptomToggle.addEventListener("click", function () {
      if (symptomSelect.classList.contains("is-open")) {
        closeSymptomList();
      } else {
        openSymptomList();
      }
    });

    symptomOptions.forEach(function (option) {
      option.addEventListener("click", function () {
        symptomOptions.forEach(function (o) {
          o.classList.remove("is-active");
          o.setAttribute("aria-selected", "false");
        });
        option.classList.add("is-active");
        option.setAttribute("aria-selected", "true");
        // The toggle's label always mirrors the current pick - including the
        // "בחר תסמין" placeholder option itself, which resets the state.
        symptomValue.textContent = option.textContent;
        symptomSelect.classList.add("has-value");
        if (symptomExplanation) {
          var explanation = option.getAttribute("data-explanation");
          if (explanation) {
            symptomExplanation.textContent = explanation;
            symptomExplanation.hidden = false;
          } else {
            symptomExplanation.textContent = "";
            symptomExplanation.hidden = true;
          }
        }
        closeSymptomList();
      });
    });

    document.addEventListener("click", function (event) {
      if (!symptomSelect.contains(event.target)) closeSymptomList();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && symptomSelect.classList.contains("is-open")) closeSymptomList();
    });
  }

  // ---------- Camera flow: camera.html → gallery.html → identify-loading.html
  // → identify-result.html → plant page. Photo/target travel between pages
  // as query params so a future per-photo plant mapping only needs the
  // data-target values in gallery.html to change, not this logic.
  // Exception: target="plant-not-found.html" is not a plant page at all -
  // identify-loading.html detects it and skips straight to the dead-end
  // plant-not-found.html screen instead of identify-result.html. ----------

  // identify-result.html's reveal card (illustration + name) is looked up
  // from the same PLANT_DATA table defined near the top of this file (it
  // used to be defined only here, with just img/nameHe/nameEn - it now also
  // carries location/needsWater for the shelf/my-plants renderers, so it
  // moved up so those renderers can use it too). Keyed by the same "target"
  // value used for navigation everywhere else in this flow (gallery.html
  // data-target, camera.html/script default). A future new plant-<slug>.html
  // page needs a row there before identify-result.html will show it instead
  // of falling back to the default (prayer plant, plant.html).

  // Shared navigation used by every photo-picking entry point into the flow
  // (camera shutter, gallery.html grid) - one place to keep the URL shape
  // consistent.
  function goToIdentify(photo, target) {
    window.location.href =
      "identify-loading.html?photo=" + encodeURIComponent(photo) +
      "&target=" + encodeURIComponent(target || "plant.html");
  }

  // camera.html - shutter button "takes a photo" (there's no real camera in
  // this static prototype) and starts the identify flow with the default photo.
  var shutter = document.querySelector("[data-camera-shutter]");
  if (shutter) {
    shutter.addEventListener("click", function () {
      goToIdentify("assets/images/gallery-prayer-plant.jpg", "plant.html");
    });
  }

  // gallery.html - picking any thumbnail starts the identify flow with that photo.
  var galleryGrid = document.querySelector("[data-gallery-grid]");
  if (galleryGrid) {
    galleryGrid.addEventListener("click", function (event) {
      var cell = event.target.closest("button[data-photo]");
      if (!cell) return;
      goToIdentify(cell.getAttribute("data-photo"), cell.getAttribute("data-target"));
    });
  }

  // identify-loading.html - shows the chosen photo, waits ~5s (no buttons,
  // no way to skip - matches the flow as specified), then moves on.
  // Special case: target="plant-not-found.html" is not a real plant page -
  // it is gallery.html's marker for a photo whose plant has no card yet, so
  // the spinner still plays as normal but this skips identify-result.html's
  // "found" reveal + auto-redirect entirely and goes straight to the
  // dead-end not-found screen instead.
  var identifyPhoto = document.querySelector("[data-identify-photo]");
  if (identifyPhoto) {
    var loadingParams = new URLSearchParams(window.location.search);
    var photoParam = loadingParams.get("photo");
    var targetParam = loadingParams.get("target") || "plant.html";
    if (photoParam) identifyPhoto.src = photoParam;
    setTimeout(function () {
      if (targetParam === "plant-not-found.html") {
        window.location.href = "plant-not-found.html";
      } else {
        window.location.href = "identify-result.html?target=" + encodeURIComponent(targetParam);
      }
    }, 5000);
  }

  // identify-result.html - shows the "found" reveal (illustration + name,
  // looked up from PLANT_DATA by the target param - falls back to the
  // static prayer-plant markup already in the HTML when there's no match),
  // waits ~5s (no buttons), then moves on automatically to the identified
  // plant's page.
  var revealCard = document.querySelector(".identify-reveal-card");
  if (revealCard) {
    var resultParams = new URLSearchParams(window.location.search);
    var resultTarget = resultParams.get("target") || "plant.html";
    var plantData = PLANT_DATA[resultTarget];
    if (plantData) {
      var revealImg = revealCard.querySelector("[data-identify-img]");
      var revealNameHe = revealCard.querySelector("[data-identify-name-he]");
      var revealNameEn = revealCard.querySelector("[data-identify-name-en]");
      if (revealImg) {
        revealImg.src = plantData.img;
        revealImg.alt = plantData.nameHe;
      }
      if (revealNameHe) revealNameHe.textContent = plantData.nameHe;
      if (revealNameEn) revealNameEn.textContent = plantData.nameEn;
    }
    setTimeout(function () {
      window.location.href = resultTarget;
    }, 5000);
  }

  // ---------- Splash screen logo animation (index.html) ----------
  // Plays the Plantie logo animation once on load, then moves on to the
  // login screen. The animation itself was exported from After Effects as
  // a .lottie file and unpacked into a plain Lottie JSON plus its image
  // frames under assets/lottie/ (see assets/lottie/plantie-logo.json and
  // assets/lottie/images/), played here with the lottie-web library
  // (assets/js/lottie.min.js, loaded before this script). A short safety
  // timer covers the rare case the animation asset fails to load (slow
  // connection, blocked request) so the splash never strands anyone - the
  // login screen stays reachable either way.
  var splashBox = document.querySelector("[data-splash-lottie]");
  if (splashBox) {
    var splashDone = false;
    var goToLogin = function () {
      if (splashDone) return;
      splashDone = true;
      window.location.href = "login.html";
    };
    if (typeof lottie !== "undefined") {
      var splashAnim = lottie.loadAnimation({
        container: splashBox,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "assets/lottie/plantie-logo.json"
      });
      splashAnim.addEventListener("complete", goToLogin);
      splashAnim.addEventListener("data_failed", goToLogin);
    }
    setTimeout(goToLogin, 4500);
  }
})();
