/* =============================================================
   soham.site — theme, typed intro, page transitions, terminal
   ============================================================= */
(function () {
	'use strict';

	var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var $ = function (sel, root) { return (root || document).querySelector(sel); };

	/* ---------- theme ------------------------------------------------ */

	function currentTheme() {
		var set = document.documentElement.getAttribute('data-theme');
		if (set) return set;
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	function setTheme(next) {
		document.documentElement.setAttribute('data-theme', next);
		try { localStorage.setItem('soham-theme', next); } catch (e) {}
	}

	var themeBtn = $('#theme-btn');
	if (themeBtn) {
		themeBtn.addEventListener('click', function () {
			setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
			blip(660, 0.05);
		});
	}

	/* ---------- footer clock ------------------------------------------ */

	var clock = $('#clock');
	if (clock) {
		var tickClock = function () {
			clock.textContent = new Intl.DateTimeFormat('en-GB', {
				timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
			}).format(new Date()) + ' IST';
		};
		tickClock();
		setInterval(tickClock, 30000);
	}

	/* ---------- audio (Web Audio, no files) ----------------------------- */

	var audio = { ctx: null, master: null, on: false };

	function audioInit() {
		if (audio.ctx) return;
		var AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return;
		var ctx = new AC();
		var master = ctx.createGain();
		master.gain.value = 0;
		master.connect(ctx.destination);

		var hum = ctx.createGain();
		hum.gain.value = 0.05;
		var lp = ctx.createBiquadFilter();
		lp.type = 'lowpass';
		lp.frequency.value = 240;
		hum.connect(lp);
		lp.connect(master);
		[[48, 'sine', 0.6], [51.5, 'sine', 0.4], [96, 'triangle', 0.13]].forEach(function (o) {
			var osc = ctx.createOscillator();
			osc.type = o[1];
			osc.frequency.value = o[0];
			var g = ctx.createGain();
			g.gain.value = o[2];
			osc.connect(g);
			g.connect(hum);
			osc.start();
		});
		var lfo = ctx.createOscillator();
		lfo.frequency.value = 0.12;
		var lfoGain = ctx.createGain();
		lfoGain.gain.value = 0.018;
		lfo.connect(lfoGain);
		lfoGain.connect(hum.gain);
		lfo.start();

		audio.ctx = ctx;
		audio.master = master;
	}

	function setAudio(on) {
		audio.on = on;
		try { localStorage.setItem('soham-audio', on ? '1' : '0'); } catch (e) {}
		if (on) {
			audioInit();
			if (!audio.ctx) { audio.on = false; return false; }
			audio.ctx.resume();
			audio.master.gain.setTargetAtTime(0.45, audio.ctx.currentTime, 0.4);
		} else if (audio.ctx) {
			audio.master.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.15);
		}
		var btn = $('#audio-btn');
		if (btn) {
			btn.textContent = on ? 'audio on' : 'audio off';
			btn.classList.toggle('on', on);
		}
		return true;
	}

	function blip(freq, dur, type, vol) {
		if (!audio.on || !audio.ctx) return;
		var ctx = audio.ctx;
		var osc = ctx.createOscillator();
		osc.type = type || 'square';
		osc.frequency.value = freq;
		var g = ctx.createGain();
		g.gain.setValueAtTime(vol || 0.05, ctx.currentTime);
		g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (dur || 0.05));
		osc.connect(g);
		g.connect(audio.master);
		osc.start();
		osc.stop(ctx.currentTime + (dur || 0.05) + 0.02);
	}


	/* ---------- page transition ------------------------------------------ */

	function warpTo(url) {
		if (reduced) { window.location.href = url; return; }
		var c = document.createElement('canvas');
		c.className = 'warp';
		c.setAttribute('aria-hidden', 'true');
		var dpr = window.devicePixelRatio || 1;
		var W = window.innerWidth, H = window.innerHeight;
		c.width = W * dpr;
		c.height = H * dpr;
		document.body.appendChild(c);
		var x = c.getContext('2d');
		x.scale(dpr, dpr);
		var cs = getComputedStyle(document.documentElement);
		var bg = cs.getPropertyValue('--bg').trim() || '#0e131b';
		var accent = cs.getPropertyValue('--accent').trim() || '#5cb8ee';
		var warm = cs.getPropertyValue('--warm').trim() || '#ffb454';
		var cx = W / 2, cy = H / 2;
		var stars = [];
		for (var i = 0; i < 150; i++) {
			stars.push({ a: Math.random() * Math.PI * 2, d: 12 + Math.random() * Math.max(W, H) * 0.45 });
		}
		blip(180, 0.4, 'sawtooth', 0.07);
		var t0 = performance.now(), dur = 480, jumped = false;
		var go = function () { if (!jumped) { jumped = true; window.location.href = url; } };
		// if rAF stalls (tab hidden mid-click) navigate anyway rather than hang
		setTimeout(go, dur + 250);
		(function frame(now) {
			var t = Math.min((now - t0) / dur, 1);
			x.globalAlpha = 0.22 + t * 0.35;
			x.fillStyle = bg;
			x.fillRect(0, 0, W, H);
			x.globalAlpha = 1;
			x.lineWidth = 1.3;
			for (var k = 0; k < stars.length; k++) {
				var st = stars[k];
				var sp = (2 + st.d * 0.018) * (1 + t * 24);
				var d2 = st.d + sp;
				x.strokeStyle = (k % 7 === 0) ? warm : accent;
				x.globalAlpha = 0.28 + t * 0.6;
				x.beginPath();
				x.moveTo(cx + Math.cos(st.a) * st.d, cy + Math.sin(st.a) * st.d);
				x.lineTo(cx + Math.cos(st.a) * d2, cy + Math.sin(st.a) * d2);
				x.stroke();
				st.d = d2 > Math.max(W, H) ? Math.random() * 50 : d2;
			}
			x.globalAlpha = 1;
			if (t < 1) requestAnimationFrame(frame);
			else go();
		})(t0);
	}

	// Internal = a same-origin page route. Routes are extensionless now
	// (/research, /writing/some-post), so anything with a file extension
	// (a PDF, an image) is treated as a download, not a page to warp into.
	function isInternal(a) {
		var href = a.getAttribute('href');
		if (!href || a.target) return false;
		if (href.charAt(0) !== '/') return false;
		if (href.indexOf('#') !== -1 || href.indexOf('//') !== -1) return false;
		return !/\.[a-z0-9]{2,5}$/i.test(href);
	}

	document.querySelectorAll('.nav-links a, .ecard, .foot a, a.warp-link').forEach(function (a) {
		if (a.tagName !== 'A' || !isInternal(a)) return;
		a.addEventListener('click', function (e) {
			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
			e.preventDefault();
			warpTo(a.getAttribute('href'));
		});
	});

	/* ---------- hero: typed intro + explore cards -------------------------- */

	var hero = $('#hero-term');
	if (hero) {
		var typeEls = [].slice.call(hero.querySelectorAll('[data-type]'));
		var explore = $('#explore');
		var skipRow = $('#hero-skip');
		var caret = document.createElement('span');
		caret.className = 'caret';
		var originals = typeEls.map(function (el) { return el.textContent; });
		var finished = false;

		function finish() {
			if (finished) return;
			finished = true;
			typeEls.forEach(function (el, i) { el.textContent = originals[i]; });
			if (caret.parentNode) caret.parentNode.removeChild(caret);
			if (explore) explore.classList.remove('hidden');
			if (skipRow) skipRow.removeAttribute('hidden');
		}

		var seen = false;
		try { seen = sessionStorage.getItem('soham-intro') === '1'; } catch (e) {}

		if (reduced || seen) {
			finish();
		} else {
			typeEls.forEach(function (el) { el.textContent = ''; });
			if (explore) explore.classList.add('hidden');
			if (skipRow) skipRow.setAttribute('hidden', '');
			try { sessionStorage.setItem('soham-intro', '1'); } catch (e) {}

			var ei = 0;
			(function typeNext() {
				if (finished) return;
				if (ei >= typeEls.length) {
					finish();
					return;
				}
				var el = typeEls[ei];
				var text = originals[ei];
				var isCmd = el.hasAttribute('data-cmd');
				var ci = 0;
				el.parentNode.insertBefore(caret, el.nextSibling);
				(function step() {
					if (finished) return;
					if (ci <= text.length) {
						el.textContent = text.slice(0, ci++);
						if (isCmd && ci % 2 === 0) blip(1250 + Math.random() * 250, 0.012, 'square', 0.025);
						setTimeout(step, isCmd ? 34 + Math.random() * 30 : 6 + Math.random() * 12);
					} else {
						ei++;
						setTimeout(typeNext, isCmd ? 260 : 130);
					}
				})();
			})();

			var skipBtn = $('#skip-intro');
			if (skipBtn) skipBtn.addEventListener('click', finish);
			document.addEventListener('keydown', function onEsc(e) {
				if (e.key === 'Escape' && !finished) { finish(); document.removeEventListener('keydown', onEsc); }
			});
		}
	}


	/* ---------- terminal --------------------------------------------------------- */

	// The prompt reflects the page you are actually on, so the shell reads as
	// a real one rather than a prop sitting on top of the site.
	function cwd() {
		var p = location.pathname.replace(/\/+$/, '');
		return p === '' ? '~' : '~' + p;
	}
	function ps1() {
		return '<span class="ps1">visitor@soham<span class="path">:' + cwd() + '$</span></span>';
	}

	var term = document.createElement('div');
	term.className = 'term';
	term.innerHTML =
		'<div class="tw">' +
		'<div class="tw-bar"><span class="tw-dots"><span class="tw-dot r"></span><span class="tw-dot y"></span><span class="tw-dot g"></span></span>' +
		'<span>visitor@soham — bash</span><span class="spacer"></span>' +
		'<button type="button" id="audio-btn">audio off</button>' +
		'<button type="button" id="term-close" aria-label="close terminal">close</button></div>' +
		'<div class="tw-body" id="term-out" aria-live="polite"></div>' +
		'<div class="term-in">' + ps1() +
		'<input type="text" id="term-input" autocomplete="off" spellcheck="false" aria-label="terminal input"></div>' +
		'</div>';
	document.body.appendChild(term);

	var out = $('#term-out', term);
	var input = $('#term-input', term);
	$('#term-close', term).addEventListener('click', function () { toggleTerm(false); });
	$('#audio-btn', term).addEventListener('click', function () {
		var ok = setAudio(!audio.on);
		if (!ok) print('audio unavailable in this browser.', 't-red');
	});

	function print(html, cls) {
		var line = document.createElement('div');
		line.className = 'term-line' + (cls ? ' ' + cls : '');
		line.innerHTML = html;
		out.appendChild(line);
		out.scrollTop = out.scrollHeight;
		return line;
	}

	function toggleTerm(open) {
		term.classList.toggle('open', open);
		if (open) {
			if (!out.childElementCount) {
				print('type <span class="t-cmd">help</span> for the list of commands.', 't-dim');
			}
			input.focus();
			blip(1100, 0.05);
		}
	}

	var pages = {
		home: '/',
		research: '/research',
		writing: '/writing',
		notes: '/writing#notes',
		code: '/writing#code',
		beyond: '/beyond'
	};
	var links = {
		cern: ['https://home.cern', 'CERN'],
		iitb: ['https://www.iitb.ac.in', 'IIT Bombay'],
		mnp: ['https://mnp-club.github.io/', 'Maths and Physics Club, IITB'],
		krittika: ['https://krittikaiitb.github.io/', 'Krittika — Astronomy Club, IITB'],
		arxiv: ['https://arxiv.org/list/hep-ph/new', 'arXiv hep-ph'],
		github: ['https://github.com/soham10', 'GitHub'],
		linkedin: ['https://www.linkedin.com/in/soham-sahasrabuddhe-118901284', 'LinkedIn']
	};

	var commands = {
		help: function () {
			print('<span class="t-dim">about me</span>   <span class="t-cmd">whoami</span>  <span class="t-cmd">now</span>  <span class="t-cmd">cv</span>  <span class="t-cmd">contact</span>');
			print('<span class="t-dim">navigate</span>   <span class="t-cmd">open</span> home|research|writing|notes|code|beyond');
			print('<span class="t-dim">elsewhere</span>  <span class="t-cmd">cern</span>  <span class="t-cmd">iitb</span>  <span class="t-cmd">mnp</span>  <span class="t-cmd">krittika</span>  <span class="t-cmd">arxiv</span>  <span class="t-cmd">github</span>  <span class="t-cmd">linkedin</span>  <span class="t-cmd">links</span>');
			print('<span class="t-dim">for fun</span>    <span class="t-cmd">minesweeper</span>');
			print('<span class="t-dim">settings</span>   <span class="t-cmd">theme</span>  <span class="t-cmd">audio</span>  <span class="t-cmd">clear</span>  <span class="t-cmd">exit</span>');
		},
		whoami: function () {
			print('Soham Sahasrabuddhe — B.Tech (Hons) Engineering Physics, Minor in Mathematics, IIT Bombay.');
			print('Astroparticle physics: neutrino flavour evolution, dark matter, cosmology.', 't-dim');
		},
		now: function () {
			print('<span class="t-green">*</span> ultralight dark matter and dark matter phenomenology — Prof. Manibrata Sen, IITB');
			print('<span class="t-green">*</span> kaon condensation and EFT for QCD in dense matter — Prof. Rishi Sharma');
			print('<span class="t-green">*</span> teaching assistant, Quantum Mechanics II, Department of Physics');
			print('<span class="t-green">*</span> institute student mentor; web team lead, DAMP');
		},
		cv: function () {
			print('opening CV...', 't-dim');
			window.open('/Docs/Soham_cv.pdf', '_blank', 'noopener');
		},
		contact: function () {
			print('email      <a href="mailto:sahasrabuddhesoham2005@gmail.com">sahasrabuddhesoham2005@gmail.com</a>');
			print('academic   <a href="mailto:sohams@iitb.ac.in">sohams@iitb.ac.in</a>');
			print('github     <a href="https://github.com/soham10" target="_blank" rel="noopener">soham10</a>');
			print('linkedin   <a href="https://www.linkedin.com/in/soham-sahasrabuddhe-118901284" target="_blank" rel="noopener">soham-sahasrabuddhe</a>');
		},
		open: function (arg) {
			if (pages[arg]) {
				print('opening ' + arg + '...', 't-green');
				setTimeout(function () { warpTo(pages[arg]); }, 260);
			} else {
				print('usage: open ' + Object.keys(pages).join(' | '), 't-red');
			}
		},
		links: function () {
			Object.keys(links).forEach(function (k) {
				print('<span class="t-cmd">' + k + '</span>' + Array(12 - k.length).join(' ') +
					'<a href="' + links[k][0] + '" target="_blank" rel="noopener">' + links[k][1] + '</a>');
			});
		},
		theme: function (arg) {
			var next = (arg === 'dark' || arg === 'light') ? arg : (currentTheme() === 'dark' ? 'light' : 'dark');
			setTheme(next);
			print('theme -> ' + next, 't-green');
		},
		audio: function (arg) {
			var want = arg === 'off' ? false : (arg === 'on' ? true : !audio.on);
			var ok = setAudio(want);
			print(ok ? ('audio -> ' + (want ? 'on' : 'off')) : 'audio unavailable in this browser.', ok ? 't-green' : 't-red');
		},
		minesweeper: function () { minesweeper(); },
		ls: function () {
			print('research/  writing/  beyond/  cv.pdf', 't-green');
		},
		clear: function () { out.innerHTML = ''; },
		exit: function () { toggleTerm(false); }
	};

	Object.keys(links).forEach(function (k) {
		commands[k] = function () {
			print('opening ' + links[k][1] + '...', 't-dim');
			window.open(links[k][0], '_blank', 'noopener');
		};
	});
	commands.goto = commands.open;
	commands.about = commands.whoami;

	function minesweeper() {
		var W = 9, H = 9, M = 10;
		var grid = document.createElement('div');
		grid.className = 'ms-grid';
		var cells = [], mines = null, revealed = 0, over = false;
		for (var i = 0; i < W * H; i++) {
			var s = document.createElement('span');
			s.className = 'ms-cell';
			s.textContent = '#';
			s.dataset.i = i;
			cells.push(s);
			grid.appendChild(s);
			if (i % W === W - 1) grid.appendChild(document.createTextNode('\n'));
		}
		out.appendChild(grid);
		print('9x9 field, 10 mines. click to sweep, right-click to flag.', 't-dim');

		function neighbours(i) {
			var r = Math.floor(i / W), c = i % W, res = [];
			for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
				if (!dr && !dc) continue;
				var nr = r + dr, nc = c + dc;
				if (nr >= 0 && nr < H && nc >= 0 && nc < W) res.push(nr * W + nc);
			}
			return res;
		}
		function reveal(i) {
			var el = cells[i];
			if (over || el.dataset.r || el.dataset.f) return;
			if (!mines) {
				mines = {};
				var placed = 0;
				while (placed < M) {
					var r = Math.floor(Math.random() * W * H);
					if (r !== i && !mines[r]) { mines[r] = 1; placed++; }
				}
			}
			el.dataset.r = '1';
			if (mines[i]) {
				over = true;
				Object.keys(mines).forEach(function (m) {
					cells[m].textContent = '*';
					cells[m].style.color = 'var(--term-red)';
				});
				print('boom. run minesweeper again to redeploy.', 't-red');
				blip(90, 0.5, 'sawtooth', 0.1);
				return;
			}
			revealed++;
			var n = neighbours(i).filter(function (x) { return mines[x]; }).length;
			el.textContent = n ? String(n) : '.';
			el.style.color = n === 0 ? 'rgba(125,143,163,.45)' : n === 1 ? 'var(--term-green)' : n === 2 ? 'var(--term-warm)' : 'var(--term-red)';
			el.style.cursor = 'default';
			if (n === 0) neighbours(i).forEach(reveal);
			if (!over && revealed === W * H - M) {
				over = true;
				print('field cleared. nicely done.', 't-green');
				blip(880, 0.12, 'sine', 0.07);
				setTimeout(function () { blip(1320, 0.2, 'sine', 0.07); }, 140);
			}
		}
		grid.addEventListener('click', function (e) {
			var t = e.target.closest('.ms-cell');
			if (t) { reveal(+t.dataset.i); blip(1500, 0.02, 'square', 0.03); out.scrollTop = out.scrollHeight; }
		});
		grid.addEventListener('contextmenu', function (e) {
			var t = e.target.closest('.ms-cell');
			if (!t) return;
			e.preventDefault();
			if (over || t.dataset.r) return;
			if (t.dataset.f) { delete t.dataset.f; t.textContent = '#'; t.style.color = ''; }
			else { t.dataset.f = '1'; t.textContent = 'F'; t.style.color = 'var(--term-warm)'; }
		});
	}

	var history = [], hpos = -1;

	input.addEventListener('keydown', function (e) {
		if (e.key === 'Enter') {
			var raw = input.value.trim();
			input.value = '';
			if (!raw) return;
			history.unshift(raw);
			hpos = -1;
			print(ps1() + ' ' + raw.replace(/</g, '&lt;'));
			var parts = raw.toLowerCase().split(/\s+/);
			var fn = commands[parts[0]];
			if (fn) fn(parts[1]);
			else print(parts[0] + ': command not found. try help', 't-red');
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (hpos < history.length - 1) input.value = history[++hpos];
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (hpos > 0) input.value = history[--hpos];
			else { hpos = -1; input.value = ''; }
		} else if (e.key === 'Escape') {
			toggleTerm(false);
		} else {
			blip(1300 + Math.random() * 300, 0.012, 'square', 0.022);
		}
	});

	document.addEventListener('keydown', function (e) {
		var tag = e.target.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA') return;
		if (e.key === '`' || e.key === '~') {
			e.preventDefault();
			toggleTerm(!term.classList.contains('open'));
		} else if (e.key === 'Escape' && term.classList.contains('open')) {
			toggleTerm(false);
		}
	});

	var termBtn = $('#term-btn');
	if (termBtn) termBtn.addEventListener('click', function () { toggleTerm(!term.classList.contains('open')); });

	document.querySelectorAll('[data-open-term]').forEach(function (el) {
		el.addEventListener('click', function (e) { e.preventDefault(); toggleTerm(true); });
	});

	/* restore audio preference on first gesture (autoplay policy) */
	var stored = null;
	try { stored = localStorage.getItem('soham-audio'); } catch (e) {}
	if (stored === '1') {
		var restore = function () {
			setAudio(true);
			document.removeEventListener('pointerdown', restore);
			document.removeEventListener('keydown', restore);
		};
		document.addEventListener('pointerdown', restore);
		document.addEventListener('keydown', restore);
	}
})();
