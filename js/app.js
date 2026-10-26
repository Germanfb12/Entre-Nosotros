/* Entre Nosotros — interfaz */
(function () {
  'use strict';
  var L = window.GameLogic;
  var C = window.CATALOG;
  var view = document.getElementById('view');
  var modalRoot = document.getElementById('modal-root');
  var toastEl = document.getElementById('toast');
  var SCREEN_KEY = 'entre-nosotros:screen';

  var state = L.load(safeStorage());
  var ui = {
    screen: 'home', prev: 'home', busy: false, anim: null,
    tab: 'mine', setup: null, tmpFilters: null, modal: null
  };

  var CAT = {};
  C.categories.forEach(function (c) { CAT[c.id] = c; });
  var LVL = {};
  C.levels.forEach(function (l) { LVL[l.id] = l; });

  // ── Íconos (trazos simples) ─────────────────────────────────────────
  var P = {
    hourglass: '<path d="M7 3h10M7 21h10M8 3c0 5 8 6 8 9s-8 4-8 9M16 3c0 5-8 6-8 9s8 4 8 9"/>',
    wave: '<path d="M3 10c2-3 4-3 6 0s4 3 6 0 4-3 6 0M3 15c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/>',
    rings: '<circle cx="9" cy="12" r="5.2"/><circle cx="15" cy="12" r="5.2"/>',
    flame: '<path d="M12 3c.8 3.6 5 5.8 5 10.6A5 5 0 0 1 7 13.6c0-2.6 1.6-3.8 2-6.1 1.8 1 2.9 2.9 3 4.8"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    bubbles: '<path d="M4 4h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2v3l-3-3h-4a2 2 0 0 1-2-2"/>',
    anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0 0 14 0M8.5 10.5h7"/>',
    dice: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><circle cx="9" cy="9" r=".9" fill="currentColor"/><circle cx="15" cy="15" r=".9" fill="currentColor"/><circle cx="15" cy="9" r=".9" fill="currentColor"/><circle cx="9" cy="15" r=".9" fill="currentColor"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16.5 6.5l3 3M14 9l2 2"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    home: '<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5"/>',
    stats: '<path d="M5 20V11M12 20V5M19 20v-6"/>',
    filter: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    skip: '<path d="M6 6l7 6-7 6M17 6v12"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
  };
  function icon(name, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + (P[name] || '') + '</svg>';
  }
  function markSVG(size) {
    return '<svg class="mark" viewBox="0 0 120 120" aria-hidden="true"' + (size ? ' style="width:' + size + 'px;height:' + size + 'px"' : '') + '>' +
      '<rect x="22" y="24" width="50" height="70" rx="9" transform="rotate(-10 47 59)" fill="none" stroke="#c2495a" stroke-width="2.5"/>' +
      '<rect x="48" y="26" width="50" height="70" rx="9" transform="rotate(10 73 61)" fill="rgba(124,31,44,.25)" stroke="#ede3d3" stroke-width="2.5"/>' +
      '<path d="M60 52 l5 8 -5 8 -5 -8z" fill="#ede3d3"/></svg>';
  }

  // ── Utilidades ──────────────────────────────────────────────────────
  function safeStorage() {
    try { var k = '__t'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return localStorage; }
    catch (e) {
      var mem = {};
      return { getItem: function (k) { return k in mem ? mem[k] : null; }, setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; } };
    }
  }
  var storage = safeStorage();
  function persist() {
    if (!L.save(storage, state)) toast('No se pudo guardar el progreso en este dispositivo.');
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function initial(name) { return esc((name || '?').trim().charAt(0).toUpperCase() || '?'); }
  function pname(i) { return esc(state.players[i].name); }
  var toastTimer;
  function toast(msg, ms) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 3200);
  }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function go(screen) {
    ui.prev = ui.screen === screen ? ui.prev : ui.screen;
    ui.screen = screen;
    try { storage.setItem(SCREEN_KEY, screen); } catch (e) {}
    if (screen === 'play') enterPlay();
    render();
    window.scrollTo(0, 0);
  }
  function lock(ms) { ui.busy = true; setTimeout(function () { ui.busy = false; }, ms); }
  function filterSummary(f) {
    var cats = f.cats.length ? (f.cats.length === 1 ? CAT[f.cats[0]].short : f.cats.length + ' categorías') : 'Todas las categorías';
    var lv = f.lvls.length === 3 ? 'todas las intensidades' : f.lvls.slice().sort().map(function (l) { return LVL[l].name; }).join(' + ');
    return cats + ' · ' + lv;
  }
  function countFor(filters) {
    return L.activeQuestions(state, C).filter(function (q) { return L.matchesFilters(q, filters); }).length;
  }

  // ── Render ──────────────────────────────────────────────────────────
  function render() {
    var fn = screens[ui.screen] || screens.home;
    try {
      view.innerHTML = fn();
    } catch (err) {
      console.error(err);
      view.innerHTML = '<section class="screen"><div class="table"><div class="empty-state"><h3>Algo salió mal</h3><p>Tu progreso está guardado. Volvé al inicio para seguir.</p><button class="btn btn-primary" data-action="go-home">Ir al inicio</button></div></div></section>';
    }
    afterRender();
  }
  function afterRender() {
    if (ui.anim === 'flip') {
      var c = view.querySelector('.card3d');
      ui.anim = null;
      if (c) {
        void c.offsetWidth; // fuerza el estado inicial antes de girar
        requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.add('flipped'); }); });
      }
    }
  }

  var screens = {};

  // Inicio
  screens.home = function () {
    var g = state.game;
    var cont = '';
    if (g.active) {
      var s = L.stats(state, C);
      cont = '<button class="continue-card" data-action="continue">' +
        '<div class="grow"><span class="eyebrow">Partida guardada</span>' +
        '<strong>' + pname(0) + ' y ' + pname(1) + '</strong>' +
        '<span class="small muted">Le toca a ' + pname(g.current) + ' · ' + Math.round(s.progress * 100) + '% recorrido</span>' +
        '<div class="bar"><i style="width:' + (s.progress * 100).toFixed(1) + '%"></i></div></div>' +
        '<span class="icon-btn" aria-hidden="true">' + icon('arrow') + '</span></button>';
    }
    return '<section class="screen home">' +
      '<div class="home-hero">' + markSVG() +
        '<div><span class="eyebrow">Un juego para dos</span><h1 style="margin-top:10px">Entre Nosotros</h1></div>' +
        '<p>Cartas para conversar sin apuro, conocerse más y animarse a preguntar lo que nunca preguntaron.</p>' +
      '</div>' +
      '<div class="stack">' + cont +
        '<button class="btn ' + (g.active ? 'btn-secondary' : 'btn-primary') + '" data-action="start">' + (g.active ? 'Empezar a jugar de nuevo' : 'Empezar a jugar') + '</button>' +
        '<div class="btn-row">' +
          '<button class="btn btn-secondary" data-action="help">' + icon('help') + 'Cómo se juega</button>' +
        '</div>' +
        '<button class="btn btn-secondary" data-action="custom">Personalizar preguntas</button>' +
        '<div class="home-links">' +
          (g.active ? '<button class="link-btn" data-action="stats">Estadísticas</button>' : '') +
          '<button class="link-btn" data-action="privacy">Privacidad y datos</button>' +
        '</div>' +
      '</div></section>';
  };

  // Preparación de la partida
  function initSetup() {
    ui.setup = {
      names: state.players.map(function (p) { return p.name; }),
      genders: state.players.map(function (p) { return p.gender; }),
      first: 0,
      cats: state.filters.cats.slice(),
      lvls: state.filters.lvls.slice()
    };
  }
  screens.setup = function () {
    var s = ui.setup;
    var f = { cats: s.cats, lvls: s.lvls };
    var n = countFor(f);
    var players = [0, 1].map(function (i) {
      return '<div class="field">' +
        '<label class="eyebrow" for="name' + i + '">Jugador ' + (i + 1) + '</label>' +
        '<input class="input" id="name' + i + '" data-input="name" data-i="' + i + '" maxlength="24" autocomplete="off" autocapitalize="words" value="' + esc(s.names[i]) + '" placeholder="Jugador ' + (i + 1) + '">' +
        '<div class="seg" role="group" aria-label="Adaptar el texto">' +
          '<button data-action="gender" data-i="' + i + '" data-g="m" aria-pressed="' + (s.genders[i] === 'm') + '">Él</button>' +
          '<button data-action="gender" data-i="' + i + '" data-g="f" aria-pressed="' + (s.genders[i] === 'f') + '">Ella</button>' +
        '</div></div>';
    }).join('');
    return '<section class="screen">' +
      '<div class="topbar"><button class="icon-btn" data-action="go-home" aria-label="Volver">' + icon('back') + '</button><div class="title">Nueva partida</div><span style="width:44px"></span></div>' +
      '<div class="screen-body">' +
        '<div class="section"><span class="eyebrow">Jugadores</span>' + players +
          '<p class="hint" style="margin-top:8px">Él / Ella adapta las palabras de cada carta a quien la responde.</p></div>' +
        '<div class="section"><span class="eyebrow">¿Quién empieza?</span>' +
          '<div class="seg" role="group">' +
            [0, 1].map(function (i) { return '<button data-action="first" data-i="' + i + '" aria-pressed="' + (s.first === i) + '" id="first' + i + '">' + esc(s.names[i] || ('Jugador ' + (i + 1))) + '</button>'; }).join('') +
          '</div></div>' +
        filtersBlock(f, 'setup') +
        '<p class="count-line" id="count-line">' + countText(n) + '</p>' +
      '</div>' +
      '<div class="bottom-bar"><button class="btn btn-primary" data-action="begin" id="begin-btn"' + (n ? '' : ' disabled') + '>Comenzar partida</button></div>' +
      '</section>';
  };
  function countText(n) {
    return n ? '<strong>' + n + '</strong> ' + (n === 1 ? 'carta' : 'cartas') + ' con esta selección.' :
      '<span class="warn">No hay cartas con esta combinación. Sumá categorías o intensidades.</span>';
  }
  function filtersBlock(f, scope) {
    var allOn = !f.cats.length;
    var cats = '<button class="chip" data-action="cat" data-scope="' + scope + '" data-cat="" aria-pressed="' + allOn + '">Todas</button>' +
      C.categories.map(function (c) {
        var on = f.cats.indexOf(c.id) >= 0;
        return '<button class="chip" style="--c:' + c.color + '" data-action="cat" data-scope="' + scope + '" data-cat="' + c.id + '" aria-pressed="' + on + '">' + icon(c.icon) + esc(c.short) + '</button>';
      }).join('');
    var lv = C.levels.map(function (l) {
      return '<button class="chip" data-action="lvl" data-scope="' + scope + '" data-lvl="' + l.id + '" aria-pressed="' + (f.lvls.indexOf(l.id) >= 0) + '">' + levelDots(l.id) + esc(l.name) + '</button>';
    }).join('');
    return '<div class="section"><span class="eyebrow">Categorías</span><div class="chips">' + cats + '</div></div>' +
      '<div class="section"><span class="eyebrow">Intensidad</span><div class="chips">' + lv + '</div>' +
      '<p class="hint" style="margin-top:8px">Suave: para entrar en confianza · Profundo: personal y emocional · Sin filtros: directo e íntimo, siempre sin presión.</p></div>';
  }
  function levelDots(l) {
    return '<span class="level" aria-hidden="true" style="gap:3px">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= l ? 'on' : '') + '" style="width:6px;height:6px;' + (i <= l ? 'background:var(--bordo-3)' : 'background:rgba(237,227,211,.18)') + '"></i>'; }).join('') + '</span>';
  }

  // Juego
  var playNotice = null;
  function enterPlay() {
    var d = state.game.draw;
    if (d && !L.findQuestion(state, C, d.id)) { state.game.draw = null; persist(); }
    var before = state.game.current;
    var st = L.ensurePlayable(state, C);
    if (st === 'switched-empty') {
      persist();
      toast(state.players[1 - state.game.current].name + ' no tiene más cartas con estos filtros. Sigue ' + state.players[state.game.current].name + '.');
    } else if (st === 'finished') {
      ui.screen = 'finish';
    }
    return before;
  }
  function currentQuestion() {
    var d = state.game.draw;
    return d ? L.findQuestion(state, C, d.id) : null;
  }
  function qSizeClass(t) { return t.length > 140 ? ' xlong' : t.length > 92 ? ' long' : ''; }

  screens.play = function () {
    var g = state.game;
    var p = g.current;
    var d = g.draw;
    var top = '<div class="topbar">' +
      '<button class="icon-btn" data-action="go-home" aria-label="Inicio">' + icon('home') + '</button>' +
      '<div class="players">' + [0, 1].map(function (i) {
        return '<button class="player-chip' + (i === p ? ' is-current' : '') + '" data-action="select-player" data-i="' + i + '" aria-pressed="' + (i === p) + '" aria-label="Turno de ' + pname(i) + '"><span class="avatar">' + initial(state.players[i].name) + '</span><span class="name">' + pname(i) + '</span></button>';
      }).join('') + '</div>' +
      '<button class="icon-btn" data-action="stats" aria-label="Estadísticas">' + icon('stats') + '</button></div>';

    var status = d ? 'playing' : L.overallStatus(state, C);
    if (!d && status === 'filters-empty') {
      return '<section class="screen">' + top +
        '<div class="table"><div class="empty-state"><h3>No quedan cartas con estos filtros</h3>' +
        '<p>Ninguno de los dos tiene cartas pendientes en <b>' + esc(filterSummary(state.filters)) + '</b>. Todavía quedan otras categorías o intensidades por explorar.</p>' +
        '<button class="btn btn-primary" data-action="filters">Cambiar filtros</button>' +
        '<button class="btn btn-ghost" data-action="stats">Ver estadísticas</button></div></div></section>';
    }

    var other = 1 - p;
    var avSelf = L.available(state, C, p).length;
    var avOther = L.available(state, C, other).length;
    var q = currentQuestion();
    var cardInner, under, actions;

    var back = '<div class="face back"><div class="back-mono">' + markSVG(70) + '<span class="eyebrow">Entre nosotros</span></div></div>';

    if (q) {
      var cat = CAT[q.cat] || { name: 'Propia', short: 'Propia', color: '#c9a77a', icon: 'key' };
      var text = L.renderText(q.text, state.players[p].gender, state.players[other].gender);
      var flippedNow = ui.anim === 'flip' ? '' : ' flipped instant';
      cardInner = '<div class="card3d' + flippedNow + '" id="card">' + back +
        '<div class="face front">' +
          '<div class="card-top"><span class="card-cat" style="--cc:' + cat.color + '">' + icon(cat.icon) + '<span class="cat-name">' + esc(cat.name) + '</span></span></div>' +
          '<div class="card-q' + qSizeClass(text) + '">' + esc(text) + '</div>' +
          '<div class="card-bottom"><span class="level">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= q.lvl ? 'on' : '') + '"></i>'; }).join('') + '<span style="margin-left:4px">' + esc(LVL[q.lvl].name) + '</span></span>' +
          '<span class="card-tag' + (q.custom ? ' custom' : '') + '">' + (q.custom ? 'Propia' : 'Para ' + pname(p)) + '</span></div>' +
        '</div></div>';
      if (d.status === 'answered') {
        under = '<span class="answered-badge">' + icon('check') + 'Respondida por ' + pname(p) + '</span>';
        actions = '<button class="btn btn-primary" data-action="next">Siguiente turno' + icon('arrow') + '</button>';
      } else {
        under = '<p class="small muted">Le toca responder a</p><h3>' + pname(p) + '</h3>';
        actions = '<button class="btn btn-primary" data-action="answer">' + icon('check') + 'Responder</button>' +
          '<div class="btn-row"><button class="btn btn-secondary" data-action="pass">' + icon('skip') + 'Pasar</button>' +
          '<button class="btn btn-secondary" data-action="putback">' + icon('undo') + 'Volver</button></div>';
      }
    } else {
      cardInner = '<div class="card3d' + (ui.anim === 'arrive' ? ' arriving' : '') + '" id="card">' + back + '</div>';
      ui.anim = null;
      var note = (!avOther && avSelf) ? '<p class="small warn" style="margin-top:6px">' + pname(other) + ' ya no tiene cartas con estos filtros.</p>' : '';
      under = '<p class="small muted">' + plural(avSelf, 'carta por descubrir', 'cartas por descubrir') + ' para ' + pname(p) + '</p>' + note;
      actions = '<button class="btn btn-primary" data-action="draw"' + (avSelf ? '' : ' disabled') + '>Sacar una carta</button>' +
        '<button class="filter-pill" data-action="filters">' + icon('filter') + '<span>' + esc(filterSummary(state.filters)) + '</span></button>';
    }

    return '<section class="screen">' + top +
      '<div class="table">' +
        (q ? '' : '<div class="turn-label"><span class="eyebrow">Turno de</span><h2>' + pname(p) + '</h2></div>') +
        '<div class="card-wrap deck' + (q ? '' : ' on-deck') + '">' + cardInner + '</div>' +
        '<div class="under-card">' + under + '</div>' +
      '</div>' +
      '<div class="play-actions">' + actions + '</div></section>';
  };

  // Final
  screens.finish = function () {
    var s = L.stats(state, C);
    return '<section class="screen">' +
      '<div class="table" style="text-align:center">' + markSVG(96) +
        '<span class="eyebrow" style="margin-top:18px">Partida completa</span>' +
        '<h1 style="font-size:34px;margin-top:8px">Recorrieron todas las cartas</h1>' +
        '<p class="muted" style="margin-top:12px;max-width:320px">Respondieron ' + s.both + ' de ' + s.total + ' cartas entre los dos, en ' + plural(s.explored.length, 'categoría', 'categorías') + '.</p>' +
        '<div class="stat-grid" style="width:100%">' + [0, 1].map(function (i) {
          return '<div class="stat-card"><h3>' + pname(i) + '</h3><div class="row"><span>Respondidas</span><b>' + s.players[i].answered + '</b></div><div class="row"><span>Pases</span><b>' + s.players[i].passes + '</b></div></div>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="stack"><button class="btn btn-primary" data-action="new-game">Nueva partida</button>' +
      '<button class="btn btn-secondary" data-action="stats">Ver el progreso</button>' +
      '<button class="btn btn-ghost" data-action="custom">Agregar más preguntas</button></div></section>';
  };

  // Estadísticas
  screens.stats = function () {
    var s = L.stats(state, C);
    var g = state.game;
    var pct = Math.round(s.progress * 100);
    var cats = C.categories.filter(function (c) { return s.catTotals[c.id]; }).map(function (c) {
      var t = s.catTotals[c.id];
      var a = s.players[0].byCat[c.id] || 0, b = s.players[1].byCat[c.id] || 0;
      return '<div class="cat-stat" style="--c:' + c.color + '"><div class="head">' + icon(c.icon) + esc(c.name) + '<span class="n">' + a + ' · ' + b + ' / ' + t + '</span></div>' +
        '<div class="bar two"><i style="width:' + (a / t * 50).toFixed(1) + '%"></i><i style="width:' + (b / t * 50).toFixed(1) + '%"></i></div></div>';
    }).join('');
    return '<section class="screen">' +
      '<div class="topbar"><button class="icon-btn" data-action="back" aria-label="Volver">' + icon('back') + '</button><div class="title">Estadísticas</div><span style="width:44px"></span></div>' +
      '<div class="screen-body">' +
      (g.active ? '' : '<p class="muted small" style="text-align:center;margin-top:8px">Todavía no hay una partida en curso.</p>') +
      '<div class="stat-hero"><div class="big">' + pct + '%</div><p class="muted small" style="margin-top:6px">de la partida recorrida</p><div class="bar"><i style="width:' + pct + '%"></i></div></div>' +
      '<div class="stat-grid">' + [0, 1].map(function (i) {
        var x = s.players[i];
        return '<div class="stat-card"><h3>' + pname(i) + '</h3>' +
          '<div class="row"><span>Respondidas</span><b>' + x.answered + '</b></div>' +
          '<div class="row"><span>Pendientes</span><b>' + x.pending + '</b></div>' +
          '<div class="row"><span>Pases</span><b>' + x.passes + '</b></div></div>';
      }).join('') +
        '<div class="stat-card stat-wide"><div class="row"><span>Cartas que respondieron los dos</span><b>' + s.both + '</b></div>' +
        '<div class="row"><span>Cartas activas en el juego</span><b>' + s.total + '</b></div>' +
        '<div class="row"><span>Categorías exploradas</span><b>' + s.explored.length + ' de ' + Object.keys(s.catTotals).length + '</b></div>' +
        '<div class="row"><span>Turnos jugados</span><b>' + g.turns + '</b></div></div>' +
        '<div class="stat-card stat-wide"><h3>Por categoría</h3>' +
          '<div class="legend"><span><i></i>' + pname(0) + '</span><span><i class="g"></i>' + pname(1) + '</span></div>' + cats + '</div>' +
      '</div>' +
      '<p class="hint" style="margin-top:14px">Los pases no cuentan como respuestas: esas cartas siguen disponibles. Las respuestas en sí nunca se guardan, solo qué carta respondió cada uno.</p>' +
      '</div>' +
      '<div class="bottom-bar stack">' + (g.active ? '<button class="btn btn-secondary" data-action="continue">Seguir jugando</button>' : '') +
      '<button class="btn btn-danger" data-action="new-game">Nueva partida</button></div></section>';
  };

  // Personalizar
  screens.custom = function () {
    var mine = state.custom;
    var tabs = '<div class="tabs" role="tablist">' +
      '<button role="tab" data-action="tab" data-tab="mine" aria-selected="' + (ui.tab === 'mine') + '">Mis preguntas (' + mine.length + ')</button>' +
      '<button role="tab" data-action="tab" data-tab="catalog" aria-selected="' + (ui.tab === 'catalog') + '">Catálogo (' + C.questions.length + ')</button></div>';
    var body;
    if (ui.tab === 'mine') {
      body = '<button class="btn btn-primary" data-action="add-q" style="margin-bottom:14px">' + icon('plus') + 'Agregar pregunta</button>' +
        (mine.length ? '<div class="q-list">' + mine.slice().reverse().map(qItem).join('') + '</div>' :
          '<div class="empty-list">Todavía no agregaste preguntas propias.<br>Se guardan en este iPhone y se conservan entre partidas.</div>');
    } else {
      var activeN = C.questions.filter(function (q) { return !state.disabled[q.id]; }).length;
      body = '<div class="toolbar"><input class="input" type="search" placeholder="Buscar…" data-input="search" aria-label="Buscar pregunta">' +
        '<select class="select" data-input="catsel" aria-label="Categoría"><option value="">Todas</option>' +
        C.categories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.short) + '</option>'; }).join('') + '</select></div>' +
        '<div class="list-head"><span id="active-count">' + activeN + ' de ' + C.questions.length + ' activas</span>' +
        '<span><button data-action="bulk" data-on="1">Activar todas</button></span></div>' +
        '<div class="q-list" id="catalog-list">' + C.questions.map(qItem).join('') + '</div>';
    }
    return '<section class="screen">' +
      '<div class="topbar"><button class="icon-btn" data-action="back" aria-label="Volver">' + icon('back') + '</button><div class="title">Personalizar preguntas</div><span style="width:44px"></span></div>' +
      tabs + '<div class="screen-body">' + body + '</div></section>';
  };
  function qItem(q) {
    var c = CAT[q.cat] || { short: q.cat, color: '#999' };
    var on = !state.disabled[q.id];
    var actions = q.custom ? '<div class="q-actions"><button data-action="edit-q" data-id="' + q.id + '">Editar</button><button class="del" data-action="del-q" data-id="' + q.id + '">Eliminar</button></div>' : '';
    return '<div class="q-item' + (on ? '' : ' off') + '" data-qid="' + q.id + '" data-cat="' + q.cat + '" data-text="' + esc(q.text.toLowerCase()) + '" style="--c:' + c.color + '">' +
      '<div class="grow"><div class="q-text">' + esc(q.text.replace(/\{(o:)?([^{}|]*)\|([^{}|]*)\}/g, '$2/$3')) + '</div>' +
      '<div class="q-meta"><span class="dot"></span>' + esc(c.short) + ' · ' + esc(LVL[q.lvl].name) + '</div>' + actions + '</div>' +
      '<label class="switch" aria-label="Activar o desactivar"><input type="checkbox" data-toggle="' + q.id + '"' + (on ? ' checked' : '') + '><span></span></label></div>';
  }

  // ── Modales ─────────────────────────────────────────────────────────
  function openModal(html, handlers) {
    ui.modal = handlers || {};
    modalRoot.innerHTML = '<div class="modal-backdrop" data-backdrop="1"><div class="modal" role="dialog" aria-modal="true"><div class="grabber"></div>' + html + '</div></div>';
    var first = modalRoot.querySelector('[autofocus]');
    if (first) setTimeout(function () { try { first.focus(); } catch (e) {} }, 60);
  }
  function closeModal() { modalRoot.innerHTML = ''; ui.modal = null; }

  function confirmModal(o) {
    openModal('<h2>' + esc(o.title) + '</h2><div class="body">' + o.body + '</div>' +
      (o.checkbox ? '<label class="check"><input type="checkbox" id="confirm-check"' + (o.checkbox.checked ? ' checked' : '') + '>' + esc(o.checkbox.label) + '</label>' : '') +
      '<div class="actions"><button class="btn ' + (o.danger ? 'btn-danger' : 'btn-primary') + '" data-action="modal-confirm">' + esc(o.confirm) + '</button>' +
      '<button class="btn btn-ghost" data-action="modal-close">Cancelar</button></div>',
      { confirm: function () {
        var cb = document.getElementById('confirm-check');
        var checked = cb ? cb.checked : undefined;
        closeModal();
        o.onConfirm(checked);
      } });
  }

  function helpModal() {
    openModal('<h2>Cómo se juega</h2><div class="body">' +
      '<ol><li>Carguen sus nombres y elijan con qué categorías e intensidad quieren jugar.</li>' +
      '<li>En cada turno, quien juega toca <b>Sacar una carta</b> y responde en voz alta. No hace falta escribir nada.</li>' +
      '<li>Al terminar, toca <b>Responder</b> para marcarla y después <b>Siguiente turno</b> para pasarle el teléfono al otro.</li>' +
      '<li>Una carta respondida no le vuelve a salir a esa persona, pero sí le puede salir al otro: así los dos contestan la misma pregunta.</li>' +
      '<li><b>Pasar</b> deja la carta para más adelante, sin explicaciones. <b>Volver</b> la devuelve al mazo si la sacaron por error.</li></ol>' +
      '<p>Para quien escucha: no hay respuestas correctas. La idea es escuchar con curiosidad, sin juzgar ni discutir lo que el otro cuenta.</p>' +
      '<p>El progreso se guarda solo. Pueden cerrar la app y seguir otro día.</p></div>' +
      '<div class="actions"><button class="btn btn-primary" data-action="modal-close">Entendido</button></div>');
  }

  function privacyModal() {
    openModal('<h2>Privacidad y datos</h2><div class="body">' +
      '<p>Todo queda en este iPhone. El juego no tiene cuentas, publicidad, analíticas ni servidores propios, y no usa el micrófono.</p>' +
      '<p><b>Qué se guarda:</b> los nombres, qué cartas respondió o pasó cada uno, los filtros, tus preguntas propias y las que desactivaste. <b>Nunca</b> se guarda lo que se conversa.</p>' +
      '<p><b>Si borrás los datos de Safari</b> (Ajustes › Apps › Safari › Borrar historial y datos), o desinstalás el ícono de la pantalla de inicio, se pierde el progreso y tus preguntas propias. El catálogo original siempre vuelve a estar.</p>' +
      '</div><div class="actions"><button class="btn btn-danger" data-action="wipe">Borrar todos los datos</button>' +
      '<button class="btn btn-ghost" data-action="modal-close">Cerrar</button></div>');
  }

  function filtersModal() {
    ui.tmpFilters = { cats: state.filters.cats.slice(), lvls: state.filters.lvls.slice() };
    renderFiltersModal();
  }
  function renderFiltersModal() {
    var f = ui.tmpFilters;
    var a = L.available(state, C, 0, f).length, b = L.available(state, C, 1, f).length;
    var ok = a + b > 0;
    openModal('<h2>Filtros</h2>' + filtersBlock(f, 'modal') +
      '<p class="count-line">' + (ok ? 'Por descubrir: <strong>' + a + '</strong> para ' + pname(0) + ' · <strong>' + b + '</strong> para ' + pname(1) :
        '<span class="warn">Ninguno tiene cartas pendientes con esta combinación.</span>') + '</p>' +
      '<p class="hint" style="margin-top:6px">Cambiar los filtros no borra nada del historial.</p>' +
      '<div class="actions"><button class="btn btn-primary" data-action="apply-filters"' + (ok ? '' : ' disabled') + '>Aplicar</button>' +
      '<button class="btn btn-ghost" data-action="modal-close">Cancelar</button></div>');
  }

  function editorModal(q) {
    var isEdit = !!q;
    q = q || { text: '', cat: C.categories[0].id, lvl: 1 };
    openModal('<h2>' + (isEdit ? 'Editar pregunta' : 'Nueva pregunta') + '</h2>' +
      '<div class="stack">' +
        '<textarea class="textarea" id="q-text" maxlength="280" placeholder="Escribí tu pregunta…" autofocus>' + esc(q.text) + '</textarea>' +
        '<p class="hint">Opcional: escribí <code>{querido|querida}</code> y la carta usará la palabra que corresponda a quien responde.</p>' +
        '<label class="eyebrow" for="q-cat">Categoría</label>' +
        '<select class="select" id="q-cat">' + C.categories.map(function (c) { return '<option value="' + c.id + '"' + (c.id === q.cat ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select>' +
        '<span class="eyebrow">Intensidad</span>' +
        '<div class="seg" id="q-lvl">' + C.levels.map(function (l) { return '<button type="button" data-action="q-lvl" data-lvl="' + l.id + '" aria-pressed="' + (q.lvl === l.id) + '">' + esc(l.name) + '</button>'; }).join('') + '</div>' +
        '<p class="warn small" id="q-err" hidden>Escribí la pregunta antes de guardar.</p>' +
      '</div>' +
      '<div class="actions"><button class="btn btn-primary" data-action="save-q" data-id="' + (isEdit ? q.id : '') + '">' + (isEdit ? 'Guardar cambios' : 'Agregar pregunta') + '</button>' +
      '<button class="btn btn-ghost" data-action="modal-close">Cancelar</button></div>');
  }

  // ── Acciones ────────────────────────────────────────────────────────
  var actions = {
    'go-home': function () { go('home'); },
    'back': function () { go(ui.prev && ui.prev !== ui.screen && ui.prev !== 'setup' ? ui.prev : (state.game.active ? 'play' : 'home')); },
    'continue': function () { go('play'); },
    'help': helpModal,
    'privacy': privacyModal,
    'custom': function () { go('custom'); },
    'stats': function () { go('stats'); },
    'start': function () {
      if (state.game.active) return actions['new-game']();
      initSetup(); go('setup');
    },
    'new-game': function () {
      var n = state.custom.length;
      confirmModal({
        title: '¿Empezar una nueva partida?',
        body: '<p>Se borra el historial de cartas respondidas y pasadas de los dos. El catálogo de preguntas no se toca.</p>',
        checkbox: n ? { label: 'Conservar mis preguntas propias (' + n + ')', checked: true } : null,
        confirm: 'Sí, empezar de nuevo', danger: true,
        onConfirm: function (keep) {
          L.newGame(state, { keepCustom: keep !== false });
          persist();
          initSetup(); go('setup');
          toast(keep === false ? 'Partida reiniciada. Tus preguntas propias se eliminaron.' : 'Partida reiniciada.');
        }
      });
    },
    'gender': function (el) {
      ui.setup.genders[+el.dataset.i] = el.dataset.g;
      el.parentNode.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === el)); });
    },
    'first': function (el) {
      ui.setup.first = +el.dataset.i;
      el.parentNode.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === el)); });
    },
    'cat': function (el) {
      var f = el.dataset.scope === 'setup' ? ui.setup : ui.tmpFilters;
      var c = el.dataset.cat;
      if (!c) f.cats = [];
      else {
        var i = f.cats.indexOf(c);
        if (i >= 0) f.cats.splice(i, 1); else f.cats.push(c);
        if (f.cats.length === C.categories.length) f.cats = [];
      }
      refreshFilters(el.dataset.scope);
    },
    'lvl': function (el) {
      var f = el.dataset.scope === 'setup' ? ui.setup : ui.tmpFilters;
      var l = +el.dataset.lvl;
      var i = f.lvls.indexOf(l);
      if (i >= 0) f.lvls.splice(i, 1); else f.lvls.push(l);
      refreshFilters(el.dataset.scope);
    },
    'begin': function () {
      var s = ui.setup;
      if (!countFor({ cats: s.cats, lvls: s.lvls })) return;
      state.players = [0, 1].map(function (i) {
        return { name: (s.names[i] || '').trim().slice(0, 24) || ('Jugador ' + (i + 1)), gender: s.genders[i] };
      });
      state.filters = { cats: s.cats.slice(), lvls: s.lvls.length ? s.lvls.slice() : [1, 2, 3] };
      L.startGame(state, { first: s.first });
      persist();
      ui.anim = 'arrive';
      go('play');
    },
    'select-player': function (el) {
      var i = +el.dataset.i;
      if (i === state.game.current) return;
      if (state.game.draw) { toast('Primero terminen la carta que está en la mesa.'); return; }
      if (!L.available(state, C, i).length) { toast(state.players[i].name + ' no tiene cartas con estos filtros.'); return; }
      L.selectPlayer(state, i); persist(); render();
    },
    'draw': function () {
      if (ui.busy) return;
      var r = L.draw(state, C);
      if (!r.ok) { enterPlay(); render(); return; }
      persist();
      ui.anim = 'flip';
      lock(800);
      render();
    },
    'answer': function () {
      if (ui.busy) return;
      if (!L.answer(state)) return; // doble toque: no registra dos veces
      persist();
      lock(350);
      render();
    },
    'pass': function () { returnCard('pass'); },
    'putback': function () { returnCard('putback'); },
    'next': function () {
      if (ui.busy) return;
      lock(500);
      var card = document.getElementById('card');
      var r = L.nextTurn(state, C);
      if (!r.ok) { ui.busy = false; return; }
      persist();
      if (card) card.classList.add('leaving');
      setTimeout(function () {
        if (r.status === 'finished') { go('finish'); return; }
        ui.anim = 'arrive';
        render();
        if (r.status === 'other-empty') toast(state.players[r.empty].name + ' ya respondió todas las cartas de estos filtros. Sigue ' + state.players[state.game.current].name + '.', 4200);
      }, 430);
    },
    'filters': filtersModal,
    'apply-filters': function () {
      var f = ui.tmpFilters;
      if (!f.lvls.length) f.lvls = [1, 2, 3];
      state.filters = { cats: f.cats.slice(), lvls: f.lvls.slice() };
      persist(); closeModal();
      enterPlay(); render();
      toast('Filtros aplicados.');
    },
    'tab': function (el) { ui.tab = el.dataset.tab; render(); },
    'add-q': function () { editorModal(null); },
    'edit-q': function (el) {
      var q = state.custom.filter(function (x) { return x.id === el.dataset.id; })[0];
      if (q) editorModal(q);
    },
    'q-lvl': function (el) {
      el.parentNode.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === el)); });
    },
    'save-q': function (el) {
      var text = document.getElementById('q-text').value;
      var cat = document.getElementById('q-cat').value;
      var sel = document.querySelector('#q-lvl [aria-pressed="true"]');
      var lvl = sel ? +sel.dataset.lvl : 1;
      var id = el.dataset.id;
      var r = id ? L.editCustom(state, id, { text: text, cat: cat, lvl: lvl }, C) : L.addCustom(state, { text: text, cat: cat, lvl: lvl }, C);
      if (!r.ok) { document.getElementById('q-err').hidden = false; return; }
      persist(); closeModal(); ui.tab = 'mine'; render();
      toast(id ? 'Pregunta actualizada.' : 'Pregunta agregada.');
    },
    'del-q': function (el) {
      var id = el.dataset.id;
      confirmModal({
        title: '¿Eliminar esta pregunta?', body: '<p>Se borra de tus preguntas propias. Esta acción no se puede deshacer.</p>',
        confirm: 'Eliminar', danger: true,
        onConfirm: function () { L.deleteCustom(state, id); persist(); render(); toast('Pregunta eliminada.'); }
      });
    },
    'bulk': function () {
      C.questions.forEach(function (q) { delete state.disabled[q.id]; });
      persist(); render(); toast('Todo el catálogo está activo.');
    },
    'wipe': function () {
      confirmModal({
        title: '¿Borrar todos los datos?',
        body: '<p>Se eliminan los nombres, el progreso, los filtros y tus preguntas propias de este iPhone. El catálogo original vuelve a quedar completo.</p>',
        confirm: 'Sí, borrar todo', danger: true,
        onConfirm: function () {
          L.wipe(storage); try { storage.removeItem(SCREEN_KEY); } catch (e) {}
          state = L.createState(); go('home'); toast('Datos borrados.');
        }
      });
    },
    'modal-close': closeModal,
    'modal-confirm': function () { if (ui.modal && ui.modal.confirm) ui.modal.confirm(); }
  };

  function returnCard(kind) {
    if (ui.busy) return;
    var ok = kind === 'pass' ? L.pass(state) : L.putBack(state);
    if (!ok) return;
    persist();
    lock(600);
    var card = document.getElementById('card');
    if (card) { card.classList.remove('instant'); card.classList.remove('flipped'); }
    setTimeout(function () {
      render();
      toast(kind === 'pass' ? 'Carta pasada. Puede volver a salirte más adelante.' : 'La carta volvió al mazo.');
    }, 560);
  }

  function refreshFilters(scope) {
    if (scope === 'modal') { renderFiltersModal(); return; }
    var s = ui.setup;
    // Actualiza solo los chips y el contador para no perder lo escrito.
    view.querySelectorAll('[data-action="cat"]').forEach(function (b) {
      var c = b.dataset.cat;
      b.setAttribute('aria-pressed', String(c ? s.cats.indexOf(c) >= 0 : !s.cats.length));
    });
    view.querySelectorAll('[data-action="lvl"]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(s.lvls.indexOf(+b.dataset.lvl) >= 0));
    });
    var n = countFor({ cats: s.cats, lvls: s.lvls });
    document.getElementById('count-line').innerHTML = countText(n);
    document.getElementById('begin-btn').disabled = !n;
  }

  // ── Eventos ─────────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    if (e.target.matches && e.target.matches('[data-backdrop]')) { closeModal(); return; }
    var el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    var fn = actions[el.dataset.action];
    if (!fn) return;
    e.preventDefault();
    try { fn(el, e); } catch (err) { console.error(err); ui.busy = false; toast('Algo falló, pero tu progreso está a salvo.'); render(); }
  });

  document.addEventListener('input', function (e) {
    var t = e.target;
    var kind = t.dataset && t.dataset.input;
    if (kind === 'name') {
      var i = +t.dataset.i;
      ui.setup.names[i] = t.value;
      var fb = document.getElementById('first' + i);
      if (fb) fb.textContent = t.value.trim() || ('Jugador ' + (i + 1));
    } else if (kind === 'search' || kind === 'catsel') {
      filterCatalogList();
    }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.toggle) {
      var id = t.dataset.toggle;
      L.toggleQuestion(state, id, t.checked);
      persist();
      var item = t.closest('.q-item');
      if (item) item.classList.toggle('off', !t.checked);
      var ac = document.getElementById('active-count');
      if (ac) ac.textContent = C.questions.filter(function (q) { return !state.disabled[q.id]; }).length + ' de ' + C.questions.length + ' activas';
    } else if (t.dataset && t.dataset.input === 'catsel') {
      filterCatalogList();
    }
  });
  function filterCatalogList() {
    var qEl = view.querySelector('[data-input="search"]');
    var cEl = view.querySelector('[data-input="catsel"]');
    var term = (qEl ? qEl.value : '').trim().toLowerCase();
    var cat = cEl ? cEl.value : '';
    view.querySelectorAll('#catalog-list .q-item').forEach(function (it) {
      var show = (!cat || it.dataset.cat === cat) && (!term || it.dataset.text.indexOf(term) >= 0);
      it.style.display = show ? '' : 'none';
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ui.modal) closeModal();
  });

  // ── Arranque ────────────────────────────────────────────────────────
  (function boot() {
    var last = null;
    try { last = storage.getItem(SCREEN_KEY); } catch (e) {}
    if (state.game.active && (last === 'play' || last === 'stats')) go(last);
    else { ui.screen = 'home'; render(); }
  })();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  // Exponer para pruebas manuales en la consola
  window.__EN = { get state() { return state; }, ui: ui };
})();
