/*
  Lógica del juego (sin interfaz). Se puede probar en Node.
  Regla central: cada jugador tiene su propio historial de cartas respondidas.
*/
(function (root) {
  var STORAGE_KEY = 'entre-nosotros:v1';
  var ALL_LEVELS = [1, 2, 3];

  function emptyGame() {
    return {
      active: false,
      current: 0,                 // índice del jugador al que le toca
      answered: [{}, {}],         // por jugador: { idPregunta: timestamp }
      passed: [{}, {}],           // por jugador: { idPregunta: cantidad de pases }
      lastPassed: [null, null],   // para no repetir enseguida una carta pasada
      draw: null,                 // { p, id, status: 'revealed' | 'answered' }
      turns: 0,
      startedAt: null
    };
  }

  function createState() {
    return {
      version: 1,
      players: [
        { name: 'Jugador 1', gender: 'm' },
        { name: 'Jugador 2', gender: 'f' }
      ],
      filters: { cats: [], lvls: ALL_LEVELS.slice() },
      custom: [],     // preguntas propias: { id, cat, lvl, text, custom: true }
      disabled: {},   // { idPregunta: true } desactivadas (catálogo o propias)
      game: emptyGame()
    };
  }

  // Normaliza cualquier dato guardado para que la app nunca quede bloqueada.
  function migrate(raw) {
    var s = createState();
    if (!raw || typeof raw !== 'object') return s;
    try {
      if (Array.isArray(raw.players) && raw.players.length === 2) {
        s.players = raw.players.map(function (p, i) {
          var name = (p && typeof p.name === 'string' && p.name.trim()) ? p.name.trim().slice(0, 24) : ('Jugador ' + (i + 1));
          var g = (p && (p.gender === 'm' || p.gender === 'f')) ? p.gender : (i === 0 ? 'm' : 'f');
          return { name: name, gender: g };
        });
      }
      if (raw.filters) {
        s.filters.cats = Array.isArray(raw.filters.cats) ? raw.filters.cats.filter(isStr) : [];
        var l = Array.isArray(raw.filters.lvls) ? raw.filters.lvls.filter(function (x) { return ALL_LEVELS.indexOf(x) >= 0; }) : [];
        s.filters.lvls = l.length ? l : ALL_LEVELS.slice();
      }
      if (Array.isArray(raw.custom)) {
        s.custom = raw.custom.filter(function (q) {
          return q && isStr(q.id) && isStr(q.text) && isStr(q.cat) && ALL_LEVELS.indexOf(q.lvl) >= 0;
        }).map(function (q) { return { id: q.id, cat: q.cat, lvl: q.lvl, text: q.text, custom: true }; });
      }
      if (raw.disabled && typeof raw.disabled === 'object') {
        Object.keys(raw.disabled).forEach(function (k) { if (raw.disabled[k]) s.disabled[k] = true; });
      }
      var g = raw.game;
      if (g && typeof g === 'object') {
        s.game.active = !!g.active;
        s.game.current = g.current === 1 ? 1 : 0;
        s.game.answered = pair(g.answered);
        s.game.passed = pair(g.passed);
        s.game.lastPassed = Array.isArray(g.lastPassed) ? [g.lastPassed[0] || null, g.lastPassed[1] || null] : [null, null];
        s.game.turns = typeof g.turns === 'number' ? g.turns : 0;
        s.game.startedAt = g.startedAt || null;
        if (g.draw && isStr(g.draw.id) && (g.draw.p === 0 || g.draw.p === 1) &&
            (g.draw.status === 'revealed' || g.draw.status === 'answered')) {
          s.game.draw = { p: g.draw.p, id: g.draw.id, status: g.draw.status };
        }
      }
    } catch (e) { return createState(); }
    return s;
  }
  function pair(x) {
    if (!Array.isArray(x)) return [{}, {}];
    return [obj(x[0]), obj(x[1])];
  }
  function obj(o) { return (o && typeof o === 'object' && !Array.isArray(o)) ? o : {}; }
  function isStr(x) { return typeof x === 'string' && x.length > 0; }

  // ── Catálogo ─────────────────────────────────────────────────────────
  function allQuestions(state, catalog) {
    return catalog.questions.concat(state.custom);
  }
  function findQuestion(state, catalog, id) {
    var all = allQuestions(state, catalog);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function isEnabled(state, q) { return !state.disabled[q.id]; }
  function activeQuestions(state, catalog) {
    return allQuestions(state, catalog).filter(function (q) { return isEnabled(state, q); });
  }
  function matchesFilters(q, filters) {
    var cats = filters && filters.cats && filters.cats.length ? filters.cats : null;
    var lvls = filters && filters.lvls && filters.lvls.length ? filters.lvls : ALL_LEVELS;
    return (!cats || cats.indexOf(q.cat) >= 0) && lvls.indexOf(q.lvl) >= 0;
  }

  // Cartas que un jugador todavía puede sacar (respetando filtros).
  function available(state, catalog, p, filters) {
    var answered = state.game.answered[p];
    var f = filters === undefined ? state.filters : filters;
    return activeQuestions(state, catalog).filter(function (q) {
      return !answered[q.id] && (f === null || matchesFilters(q, f));
    });
  }

  // ── Partida ──────────────────────────────────────────────────────────
  function startGame(state, opts) {
    opts = opts || {};
    state.game = emptyGame();
    state.game.active = true;
    state.game.current = opts.first === 1 ? 1 : 0;
    state.game.startedAt = Date.now();
    return state;
  }

  // Nueva partida: borra el historial. Las preguntas propias se conservan salvo que se pida lo contrario.
  function newGame(state, opts) {
    opts = opts || {};
    if (opts.keepCustom === false) {
      state.custom.forEach(function (q) { delete state.disabled[q.id]; });
      state.custom = [];
    }
    state.game = emptyGame();
    return state;
  }

  function selectPlayer(state, p) {
    if (p !== 0 && p !== 1) return false;
    if (state.game.draw) return false; // no se cambia de jugador con una carta en la mesa
    state.game.current = p;
    return true;
  }

  function draw(state, catalog, rng) {
    rng = rng || Math.random;
    if (state.game.draw) return { ok: false, reason: 'card-on-table' };
    var p = state.game.current;
    var pool = available(state, catalog, p);
    if (!pool.length) return { ok: false, reason: 'no-cards' };
    var last = state.game.lastPassed[p];
    if (last && pool.length > 1) pool = pool.filter(function (q) { return q.id !== last; });
    var q = pool[Math.floor(rng() * pool.length)];
    state.game.draw = { p: p, id: q.id, status: 'revealed' };
    return { ok: true, id: q.id };
  }

  // Registra la respuesta. Ignora toques repetidos.
  function answer(state) {
    var d = state.game.draw;
    if (!d || d.status !== 'revealed') return false;
    if (!state.game.answered[d.p][d.id]) state.game.answered[d.p][d.id] = Date.now();
    d.status = 'answered';
    state.game.lastPassed[d.p] = null;
    return true;
  }

  // Pasar: la carta NO se marca como respondida y sigue disponible para ese jugador.
  function pass(state) {
    var d = state.game.draw;
    if (!d || d.status !== 'revealed') return false;
    var pp = state.game.passed[d.p];
    pp[d.id] = (pp[d.id] || 0) + 1;
    state.game.lastPassed[d.p] = d.id;
    state.game.draw = null;
    return true;
  }

  // Volver: devuelve la carta al mazo sin tocar el historial.
  function putBack(state) {
    var d = state.game.draw;
    if (!d || d.status !== 'revealed') return false;
    state.game.draw = null;
    return true;
  }

  // Pasa el turno al otro jugador si tiene cartas; si no, sigue el que tenga.
  function nextTurn(state, catalog) {
    var d = state.game.draw;
    if (d && d.status === 'revealed') return { ok: false, reason: 'not-answered' };
    var p = state.game.current;
    state.game.draw = null;
    state.game.turns++;
    var other = 1 - p;
    var aOther = available(state, catalog, other).length;
    var aSelf = available(state, catalog, p).length;
    if (aOther > 0) { state.game.current = other; return { ok: true, status: 'switched' }; }
    if (aSelf > 0) return { ok: true, status: 'other-empty', empty: other };
    return { ok: true, status: overallStatus(state, catalog) };
  }

  // 'finished' si ninguno tiene cartas activas; 'filters-empty' si quedan fuera de los filtros.
  function overallStatus(state, catalog) {
    var any0 = available(state, catalog, 0, null).length;
    var any1 = available(state, catalog, 1, null).length;
    if (!any0 && !any1) return 'finished';
    var f0 = available(state, catalog, 0).length;
    var f1 = available(state, catalog, 1).length;
    if (!f0 && !f1) return 'filters-empty';
    return 'playing';
  }

  // Cuando el jugador actual no tiene cartas pero el otro sí, cede el turno.
  function ensurePlayable(state, catalog) {
    if (state.game.draw) return 'playing';
    var p = state.game.current;
    if (available(state, catalog, p).length) return 'playing';
    if (available(state, catalog, 1 - p).length) { state.game.current = 1 - p; return 'switched-empty'; }
    return overallStatus(state, catalog);
  }

  // ── Estadísticas (calculadas del historial real) ─────────────────────
  function stats(state, catalog) {
    var active = activeQuestions(state, catalog);
    var activeIds = {};
    active.forEach(function (q) { activeIds[q.id] = q; });
    var per = [0, 1].map(function (p) {
      var ans = Object.keys(state.game.answered[p]).filter(function (id) { return activeIds[id]; });
      var passedIds = Object.keys(state.game.passed[p]).filter(function (id) { return activeIds[id]; });
      var passes = passedIds.reduce(function (s, id) { return s + state.game.passed[p][id]; }, 0);
      var byCat = {};
      ans.forEach(function (id) { var c = activeIds[id].cat; byCat[c] = (byCat[c] || 0) + 1; });
      return {
        answered: ans.length,
        pending: active.length - ans.length,
        pendingFiltered: available(state, catalog, p).length,
        passes: passes,
        passedPending: passedIds.filter(function (id) { return !state.game.answered[p][id]; }).length,
        byCat: byCat
      };
    });
    var both = active.filter(function (q) { return state.game.answered[0][q.id] && state.game.answered[1][q.id]; }).length;
    var catTotals = {};
    active.forEach(function (q) { catTotals[q.cat] = (catTotals[q.cat] || 0) + 1; });
    var explored = Object.keys(catTotals).filter(function (c) { return per[0].byCat[c] || per[1].byCat[c]; });
    var total = active.length;
    return {
      total: total,
      players: per,
      both: both,
      catTotals: catTotals,
      explored: explored,
      progress: total ? (per[0].answered + per[1].answered) / (2 * total) : 0
    };
  }

  // ── Preguntas propias ────────────────────────────────────────────────
  function cleanText(t) { return String(t || '').replace(/\s+/g, ' ').trim().slice(0, 280); }
  function addCustom(state, data, catalog) {
    var text = cleanText(data.text);
    if (!text) return { ok: false, reason: 'empty' };
    if (!validCat(data.cat, catalog)) return { ok: false, reason: 'cat' };
    var lvl = ALL_LEVELS.indexOf(+data.lvl) >= 0 ? +data.lvl : 1;
    var id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    var q = { id: id, cat: data.cat, lvl: lvl, text: text, custom: true };
    state.custom.push(q);
    return { ok: true, id: id };
  }
  function editCustom(state, id, data, catalog) {
    var q = state.custom.filter(function (x) { return x.id === id; })[0];
    if (!q) return { ok: false, reason: 'not-found' };
    var text = cleanText(data.text);
    if (!text) return { ok: false, reason: 'empty' };
    if (!validCat(data.cat, catalog)) return { ok: false, reason: 'cat' };
    q.text = text; q.cat = data.cat;
    q.lvl = ALL_LEVELS.indexOf(+data.lvl) >= 0 ? +data.lvl : q.lvl;
    return { ok: true };
  }
  function deleteCustom(state, id) {
    var n = state.custom.length;
    state.custom = state.custom.filter(function (x) { return x.id !== id; });
    delete state.disabled[id];
    if (state.game.draw && state.game.draw.id === id && state.game.draw.status === 'revealed') state.game.draw = null;
    return state.custom.length < n;
  }
  function toggleQuestion(state, id, on) {
    var enable = on === undefined ? !!state.disabled[id] : !!on;
    if (enable) delete state.disabled[id]; else state.disabled[id] = true;
    if (!enable && state.game.draw && state.game.draw.id === id && state.game.draw.status === 'revealed') state.game.draw = null;
    return enable;
  }
  function validCat(c, catalog) {
    return catalog.categories.some(function (x) { return x.id === c; });
  }

  // ── Texto con género ─────────────────────────────────────────────────
  // {masc|fem} → según quien responde; {o:masc|fem} → según la otra persona.
  function renderText(text, responder, other) {
    return String(text).replace(/\{(o:)?([^{}|]*)\|([^{}|]*)\}/g, function (_, o, m, f) {
      var g = o ? other : responder;
      return g === 'f' ? f : m;
    });
  }

  // ── Guardado local ───────────────────────────────────────────────────
  function load(storage) {
    try {
      var raw = storage.getItem(STORAGE_KEY);
      return migrate(raw ? JSON.parse(raw) : null);
    } catch (e) { return createState(); }
  }
  function save(storage, state) {
    try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
    catch (e) { return false; }
  }
  function wipe(storage) {
    try { storage.removeItem(STORAGE_KEY); return true; } catch (e) { return false; }
  }

  var api = {
    STORAGE_KEY: STORAGE_KEY, createState: createState, migrate: migrate,
    allQuestions: allQuestions, findQuestion: findQuestion, activeQuestions: activeQuestions,
    matchesFilters: matchesFilters, available: available,
    startGame: startGame, newGame: newGame, selectPlayer: selectPlayer,
    draw: draw, answer: answer, pass: pass, putBack: putBack, nextTurn: nextTurn,
    overallStatus: overallStatus, ensurePlayable: ensurePlayable, stats: stats,
    addCustom: addCustom, editCustom: editCustom, deleteCustom: deleteCustom, toggleQuestion: toggleQuestion,
    renderText: renderText, load: load, save: save, wipe: wipe
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GameLogic = api;
})(this);
