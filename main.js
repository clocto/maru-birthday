/* ============================================================
   MARU'S BIRTHDAY SCRAPBOOK — hiệu ứng & tương tác (bản iPad ngang)
   noa KHÔNG cần sửa file này — nội dung sửa ở config.js.
   ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. HÌNH CAPOO — nạp ảnh/clip từ thư mục capoo/
      Thiếu hình → hiện khung mây chờ, web vẫn chạy bình thường.
   ============================================================ */
const CapooSlots = {
  init() {
    $$('.capoo-slot').forEach(slot => {
      const key = slot.dataset.capoo;
      const src = (CONFIG.capoo || {})[key];
      if (!src) { this.placeholder(slot, key); return; }
      this.fill(slot, src);
    });
  },
  fill(slot, src) {
    if (/\.(mp4|webm|mov)$/i.test(src)) {
      // đoạn video ngắn → phát lặp không tiếng, như GIF nhưng nhẹ hơn
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.autoplay = true;
      v.playsInline = true; v.setAttribute('playsinline', '');
      v.addEventListener('loadeddata', () => { slot.innerHTML = ''; slot.appendChild(v); v.play().catch(() => {}); });
      v.addEventListener('error', () => this.placeholder(slot, src));
      v.src = src;
    } else {
      const img = new Image();
      img.alt = 'Capoo';
      img.onload = () => { slot.innerHTML = ''; slot.appendChild(img); };
      img.onerror = () => this.placeholder(slot, src);
      img.src = src;
    }
  },
  placeholder(slot, label) {
    slot.innerHTML =
      `<div class="capoo-missing"><span class="cm-face">☁️🐱</span>` +
      `<span>waiting for Capoo…</span><span>(${label})</span></div>`;
  },
};

/* ============================================================
   1b. HIỆU ỨNG 3D NỔI — clip Capoo nghiêng theo chuột/tay,
       nhân vật nổi lên khỏi khung + vệt sáng quét (ảo giác chiều sâu)
   ============================================================ */
const Tilt = {
  MAX: 14, // độ nghiêng tối đa
  init() {
    if (reducedMotion) return;
    $$('.capoo-slot').forEach(slot => {
      slot.classList.add('tilt');
      const glare = document.createElement('span');
      glare.className = 'glare';
      slot.appendChild(glare);

      const move = e => {
        const r = slot.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;   // 0..1
        const py = (e.clientY - r.top) / r.height;
        slot.style.setProperty('--ry', `${(px - .5) * 2 * this.MAX}deg`);
        slot.style.setProperty('--rx', `${(py - .5) * -2 * this.MAX}deg`);
        slot.style.setProperty('--gx', `${px * 100}%`);
        slot.style.setProperty('--gy', `${py * 100}%`);
        slot.classList.add('tilting');
      };
      const leave = () => {
        slot.classList.remove('tilting');
        slot.style.setProperty('--rx', '0deg');
        slot.style.setProperty('--ry', '0deg');
      };
      slot.addEventListener('pointermove', move);
      slot.addEventListener('pointerleave', leave);
    });
  },
};

/* ============================================================
   1c. CHỌC NHÂN VẬT — chạm là nhún + nổ tim + bong bóng thoại,
       vuốt-ve thì tim bay theo tay; cặp đang ngủ bị chọc sẽ tỉnh dậy
   ============================================================ */
const Poke = {
  PHRASES: ['(๑•̀д•́๑)?!', 'ヽ(｀Д´)ﾉ hey!', '(´-ω-`)…zzZ', '(￣^￣) hmph!', '(｡>﹏<｡) stop it~', '(⊙_⊙) again??', '(=^･ω･^=)', '(≧▽≦)'],
  phraseIdx: 0,
  init() {
    $$('.capoo-slot').forEach(slot => {
      slot.style.position = slot.style.position || 'relative';
      let lastPet = 0;
      slot.addEventListener('pointerdown', e => {
        slot.classList.remove('boing'); void slot.offsetWidth;
        slot.classList.add('boing');
        this.hearts(slot, e, 3);
        this.speak(slot);
        this.blip(380);
        // (trang khoá chỉ chạy 1 video cố định — không đổi clip khi bấm nữa)
      });
      slot.addEventListener('pointermove', e => { // vuốt-ve → tim bay theo tay
        if (e.buttons === 0) return;
        const now = performance.now();
        if (now - lastPet < 130) return;
        lastPet = now;
        this.hearts(slot, e, 1);
      });
    });
  },
  hearts(slot, e, n) {
    const r = slot.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const h = document.createElement('span');
      h.className = 'heartpop';
      h.textContent = ['💢', '✦', '💤', '⭐'][(i + this.phraseIdx) % 4];
      h.style.left = `${e.clientX - r.left + (i - n / 2) * 14}px`;
      h.style.top = `${e.clientY - r.top - 6}px`;
      h.style.setProperty('--dx', `${(i % 2 ? 1 : -1) * (8 + i * 7)}px`);
      slot.appendChild(h);
      h.addEventListener('animationend', () => h.remove());
    }
  },
  speak(slot) {
    if (slot.querySelector('.speech')) return; // đang nói thì thôi
    const b = document.createElement('div');
    b.className = 'speech';
    b.textContent = this.PHRASES[this.phraseIdx++ % this.PHRASES.length];
    slot.appendChild(b);
    setTimeout(() => b.remove(), 1400);
  },
  wake(slot) { // cặp ngủ bị chọc → tỉnh dậy đỏ mặt e thẹn rồi ngủ lại
    const img = slot.querySelector('img');
    const awake = (CONFIG.capoo || {}).shy || (CONFIG.capoo || {}).surprise;
    if (!img || !awake || slot.dataset.waking) return;
    slot.dataset.waking = '1';
    const asleep = img.src;
    img.src = awake;
    setTimeout(() => { img.src = asleep; delete slot.dataset.waking; }, 2200);
  },
  blip(freq) { // tiếng "pop" nhỏ xíu bằng WebAudio, không cần file
    try {
      const ac = (this.ac = this.ac || new (window.AudioContext || window.webkitAudioContext)());
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(freq * 1.6, ac.currentTime + 0.09);
      g.gain.setValueAtTime(0.06, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.14);
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + 0.15);
    } catch (err) { /* máy không cho kêu thì thôi */ }
  },
  crunch() { // tiếng nhai THẬT trích từ video con lợn noa gửi; hỏng thì synth
    try {
      this.crunchAudio = this.crunchAudio || new Audio('audio/cap-cap.m4a');
      const a = this.crunchAudio.cloneNode();
      a.volume = 0.4;
      const pr = a.play();
      if (pr) { pr.catch(() => this.crunchSynth()); return; }
      return;
    } catch (err) { /* rơi xuống synth */ }
    this.crunchSynth();
  },
  crunchSynth() { // dự phòng: noise burst qua bandpass
    try {
      const ac = (this.ac = this.ac || new (window.AudioContext || window.webkitAudioContext)());
      for (let k = 0; k < 2; k++) { // 2 tiếng: cạp - cạp
        const t = ac.currentTime + k * 0.16;
        const dur = 0.11;
        const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.2); // nổ đầu, tắt nhanh
        }
        const src = ac.createBufferSource();
        src.buffer = buf;
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1500 + k * 400;
        bp.Q.value = 0.7;
        const g = ac.createGain();
        g.gain.value = 0.3;
        src.connect(bp); bp.connect(g); g.connect(ac.destination);
        src.start(t);
      }
    } catch (err) { /* im lặng cũng không sao */ }
  },
};

/* ============================================================
   2. STICKER TRANG TRÍ — rải Capoo khắp các trang
      Sửa vị trí/kích thước trong CONFIG.stickers (config.js).
   ============================================================ */
const Stickers = {
  init() {
    if (CONFIG.stickers && CONFIG.stickers.enabled === false) return;
    // sticker đính quanh mép ngoài khung iPad (nửa trong nửa ngoài viền)
    const frameHolder = $('#frame-stickers');
    ((CONFIG.stickers && CONFIG.stickers.frame) || []).forEach((st, i) => {
      const el = document.createElement('img');
      el.className = 'frame-sticker';
      el.src = st.src;
      el.alt = '';
      el.style.cssText =
        `left:${st.x}%; top:${st.y}%; width:${st.size}px;` +
        `--rot:${st.rot || 0}deg; --d:${.3 + (i % 7) * .13}s;`;
      el.onerror = () => el.remove();
      frameHolder.appendChild(el);
    });
    const list = (CONFIG.stickers && CONFIG.stickers.placements) || [];
    const dirs = ['pop-top', 'pop-bottom', 'pop-left', 'pop-right'];
    list.forEach((st, i) => {
      const slide = $('#' + st.slide);
      if (!slide) return;
      const el = document.createElement('img');
      el.className = `deco-sticker pop ${dirs[i % dirs.length]}`;
      el.src = st.src;
      el.alt = '';
      el.style.cssText =
        `left:${st.x}%; top:${st.y}%; width:${st.size}px;` +
        `--rot:${st.rot || 0}deg; --d:${.5 + (i % 5) * .14}s; --tw:${(i % 4) * -.7}s;`;
      el.onerror = () => el.remove(); // thiếu file thì lặng lẽ bỏ qua
      slide.appendChild(el);
    });
  },
};

/* ============================================================
   3. CHỮ CẮT DÁN — mỗi chữ cái một mảnh giấy màu nhảy vào
   ============================================================ */
const Cutout = {
  COLORS: ['c-blue', 'c-pink', 'c-yellow', 'c-green', 'c-coral', 'c-lav'],
  ROTS: [-4, 3, -2, 4, -3, 2, -5, 3],
  render(el, text, baseDelay = 0.1) {
    el.innerHTML = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      if (ch === ' ') { s.className = 'cut sp'; s.innerHTML = '&nbsp;'; }
      else {
        s.className = `cut ${this.COLORS[i % this.COLORS.length]}`;
        s.textContent = ch;
        s.style.setProperty('--rot', `${this.ROTS[i % this.ROTS.length]}deg`);
      }
      s.style.setProperty('--cd', `${baseDelay + i * 0.045}s`);
      el.appendChild(s);
    });
  },
};

/* ============================================================
   4. SLIDE — điều hướng mũi tên / vuốt / bàn phím
   ============================================================ */
const Slides = {
  // thứ tự hành trình; 2 trang đầu phải qua "cửa" mới lướt tự do
  ORDER: ['slide-lock', 'slide-surprise', 'slide-happy', 'slide-catch', 'slide-memories',
          'slide-facts', 'slide-wishes', 'slide-quiz', 'slide-letter', 'slide-cake', 'slide-gift'],
  FREE_FROM: 2, // từ trang HAPPY trở đi mới hiện mũi tên + chấm
  locked: { 'slide-catch': true, 'slide-quiz': true, 'slide-cake': true }, // thử thách chưa xong = chưa cho qua
  idx: 0,
  unlock(id) {
    this.locked[id] = false;
    if (this.ORDER[this.idx] === id) $('#nav-next').disabled = false;
  },
  show(i, back = false) {
    this.idx = Math.max(0, Math.min(i, this.ORDER.length - 1));
    // lần đầu vào trang ramen → chạy intro Capoo nấu mì
    if (this.ORDER[this.idx] === 'slide-cake' && typeof CakeIntro !== 'undefined') CakeIntro.start();
    $$('.slide').forEach(s => {
      s.classList.toggle('go-back', back);
      s.classList.toggle('is-on', s.id === this.ORDER[this.idx]);
    });
    const free = this.idx >= this.FREE_FROM;
    $('#nav-prev').hidden = !free;
    $('#nav-next').hidden = !free;
    $('#nav-dots').hidden = !free;
    $('#nav-prev').disabled = this.idx <= this.FREE_FROM;
    $('#nav-next').disabled = this.idx >= this.ORDER.length - 1 ||
                              !!this.locked[this.ORDER[this.idx]];
    this.paintDots();
  },
  next() {
    if (this.locked[this.ORDER[this.idx]]) return; // thử thách chưa xong
    if (this.idx < this.ORDER.length - 1) this.show(this.idx + 1);
  },
  prev() { if (this.idx > this.FREE_FROM) this.show(this.idx - 1, true); },
  paintDots() {
    const dots = $('#nav-dots');
    if (!dots.childElementCount) {
      for (let i = this.FREE_FROM; i < this.ORDER.length; i++) dots.appendChild(document.createElement('span'));
    }
    [...dots.children].forEach((d, i) => d.classList.toggle('on', i === this.idx - this.FREE_FROM));
  },
  init() {
    $('#nav-next').addEventListener('click', () => this.next());
    $('#nav-prev').addEventListener('click', () => this.prev());
    addEventListener('keydown', e => {
      if (this.idx < this.FREE_FROM) return;
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });
    // vuốt trái/phải
    let x0 = null;
    addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    addEventListener('touchend', e => {
      if (x0 === null || this.idx < this.FREE_FROM) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (dx < -50) this.next();
      if (dx > 50) this.prev();
      x0 = null;
    }, { passive: true });
  },
};

/* ============================================================
   5. TRANG MẬT KHẨU
   ============================================================ */
const Lock = {
  entered: '',
  wrongCount: 0,
  init() {
    $('#lock-caption').textContent = CONFIG.lock.caption;
    $('#pad-hint').textContent = CONFIG.lock.hint;
    const keys = ['1','2','3','4','5','6','7','8','9','','0','del'];
    const pad = $('#pad-keys');
    keys.forEach(k => {
      const b = document.createElement('button');
      if (k === '')         b.className = 'pad-empty';
      else if (k === 'del') b.textContent = '⌫';
      else                  b.textContent = k;
      b.addEventListener('click', () => this.press(k));
      pad.appendChild(b);
    });
    $('#btn-unlock').addEventListener('click', () => this.check());
  },
  press(k) {
    if (k === '') return;
    if (k === 'del') { this.entered = this.entered.slice(0, -1); }
    else if (this.entered.length < 4) { this.entered += k; }
    this.paint();
  },
  paint() {
    $$('#pad-dots span').forEach((d, i) =>
      d.classList.toggle('filled', i < this.entered.length));
  },
  check() {
    if (this.entered === String(CONFIG.lock.password)) {
      Music.start(); // cử chỉ bấm UNLOCK → được phép phát nhạc
      Slides.show(1);
      return;
    }
    const msgs = CONFIG.lock.wrongMessages;
    $('#pad-wrong').textContent = msgs[this.wrongCount % msgs.length];
    this.wrongCount++;
    this.entered = '';
    const dots = $('#pad-dots');
    dots.classList.remove('shake'); void dots.offsetWidth;
    dots.classList.add('shake');
    setTimeout(() => this.paint(), 300);
  },
};

/* ============================================================
   6. TRANG YES / NO — nút NO biết né tay
   ============================================================ */
const Surprise = {
  dodges: 0,
  init() {
    Cutout.render($('#surprise-line1'), CONFIG.surprise.line1, 0.15);
    $('#surprise-line2').textContent = CONFIG.surprise.line2;
    $('#btn-yes').textContent = CONFIG.surprise.yes;
    $('#btn-no').textContent = CONFIG.surprise.no;
    $('#btn-yes').addEventListener('click', () => {
      Confetti.burst(120);
      Slides.show(2);
    });
    const no = $('#btn-no');
    const dodge = () => this.dodge(no);
    no.addEventListener('mouseenter', dodge);
    no.addEventListener('touchstart', e => { e.preventDefault(); dodge(); }, { passive: false });
    no.addEventListener('click', dodge);
  },
  dodge(no) {
    const msgs = CONFIG.surprise.noMessages;
    $('#no-msg').textContent = msgs[this.dodges % msgs.length];
    // né sang vị trí giả-ngẫu-nhiên quanh chỗ cũ
    const seq = [[130, -40], [-150, 30], [90, 60], [-110, -55], [150, 10], [-80, 70]];
    const [dx, dy] = seq[this.dodges % seq.length];
    no.style.transform = `translate(${dx}px, ${dy}px) rotate(${(this.dodges % 2 ? -1 : 1) * 8}deg)`;
    this.dodges++;
  },
};

/* ============================================================
   7. TRANG HAPPY BIRTHDAY
   ============================================================ */
const Happy = {
  init() {
    $('#happy-jp').textContent = CONFIG.japanese.happyBirthday;
    Cutout.render($('#happy-title'), CONFIG.happy.title, 0.15);
    Cutout.render($('#happy-name'), `${CONFIG.nickname}!`.toUpperCase(), 0.6);
    $('#happy-sub').textContent =
      `${CONFIG.fullName} · ${CONFIG.birthdayDate} · turning ${CONFIG.age} · ${CONFIG.happy.subtitle} 💙`;
  },
};

/* ============================================================
   8. TRANG MEMORIES (kiểu trang tìm kiếm) + XEM ẢNH TO
   ============================================================ */
const Memories = {
  init() {
    const logo = $('#mem-logo');
    [...'Memories'].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'lg'; s.textContent = ch;
      logo.appendChild(s);
    });
    $('#mem-query').textContent = CONFIG.memoriesSearch;
    const grid = $('#photo-grid');
    const dirs = ['pop-top', 'pop-bottom', 'pop-left', 'pop-right'];
    CONFIG.photos.forEach((p, i) => {
      const card = document.createElement('button');
      card.className = `polaroid pop ${dirs[i % dirs.length]}`;
      card.style.setProperty('--tilt', `${[-2, 1.5, -1, 2, -1.5][i % 5]}deg`);
      card.style.setProperty('--d', `${.35 + i * .07}s`);
      const hasImg = !!p.src;
      card.innerHTML =
        `<span class="ph">${hasImg
          ? `<img src="${p.src}" alt="" loading="lazy"${p.focus ? ` style="object-position:${p.focus}"` : ''}>`
          : `<span class="ph-wait">📷💤</span>`}</span>` +
        `<span class="ph-date">${p.date || ''}</span>`;
      card.addEventListener('click', () => this.open(p));
      grid.appendChild(card);
    });
    $('#lb-close').addEventListener('click', () => { $('#lightbox').hidden = true; });
    $('#lightbox').addEventListener('click', e => {
      if (e.target === e.currentTarget) $('#lightbox').hidden = true;
    });
  },
  open(p) {
    if (!p.src) return; // chưa có ảnh thì thôi
    $('#lb-img').src = p.src;
    $('#lb-date').textContent = p.date || '';
    $('#lb-caption').textContent = p.caption || '';
    $('#lightbox').hidden = false;
  },
};

/* ============================================================
   8b. THỬ THÁCH 1 — BẮT CAPOO (bắt đủ 3 lần mới mở trang tiếp)
   ============================================================ */
const Catch = {
  caught: 0,
  SPOTS: [[15, 20], [70, 15], [40, 60], [78, 65], [10, 62], [55, 8], [30, 30], [65, 45]],
  spotIdx: 0,
  init() {
    $('#catch-title') && Cutout.render($('#catch-title'), CONFIG.catch.title, 0.15);
    $('#catch-hint').textContent = CONFIG.catch.hint;
    this.paint();
    const capoo = $('#catch-capoo');
    capoo.addEventListener('pointerdown', e => {
      e.preventDefault();
      this.caught++;
      Poke.blip(300 + this.caught * 120);
      const msg = CONFIG.catch.caught[Math.min(this.caught - 1, CONFIG.catch.caught.length - 1)];
      $('#catch-hint').textContent = msg;
      this.paint();
      if (this.caught >= CONFIG.catch.count) {
        capoo.classList.add('caught');
        Confetti.burst(90);
        Slides.unlock('slide-catch');
        setTimeout(() => Slides.next(), 900);
      } else {
        this.hop(capoo);
      }
    });
    // rê chuột tới gần là né (máy tính); trên điện thoại chạm thẳng
    capoo.addEventListener('pointerenter', () => {
      if (this.caught < CONFIG.catch.count && ((this.spotIdx + this.caught) % 3) !== 0) this.hop(capoo);
    });
  },
  hop(capoo) {
    const [x, y] = this.SPOTS[this.spotIdx++ % this.SPOTS.length];
    capoo.style.left = `${x}%`;
    capoo.style.top = `${y}%`;
  },
  paint() {
    $('#catch-count').textContent = `${Math.min(this.caught, CONFIG.catch.count)} / ${CONFIG.catch.count}`;
  },
};

/* ============================================================
   8c. THỬ THÁCH 2 — CÂU ĐỐ NHỎ (trả lời đúng mới mở trang thư)
   ============================================================ */
const Quiz = {
  wrongCount: 0,
  init() {
    Cutout.render($('#quiz-title'), CONFIG.quiz.title, 0.15);
    $('#quiz-question').textContent = CONFIG.quiz.question;
    const holder = $('#quiz-options');
    CONFIG.quiz.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'quiz-opt';
      b.textContent = opt;
      b.addEventListener('click', () => this.answer(i, b));
      holder.appendChild(b);
    });
  },
  answer(i, btn) {
    if (i === CONFIG.quiz.correct) {
      btn.classList.add('right');
      $('#quiz-wrong').textContent = '';
      Confetti.burst(90);
      Poke.blip(620);
      Slides.unlock('slide-quiz');
      setTimeout(() => Slides.next(), 900);
    } else {
      btn.classList.remove('nope'); void btn.offsetWidth;
      btn.classList.add('nope');
      const msgs = CONFIG.quiz.wrongMessages;
      $('#quiz-wrong').textContent = msgs[this.wrongCount++ % msgs.length];
      Poke.blip(180);
    }
  },
};

/* ============================================================
   9. TRANG FUN FACTS
   ============================================================ */
const Facts = {
  init() {
    Cutout.render($('#facts-title'), 'FUN FACTS ABOUT YOU', 0.15);
    const list = $('#fact-list');
    const dirs = ['pop-left', 'pop-right'];
    CONFIG.funFacts.forEach((f, i) => {
      const d = document.createElement('div');
      d.className = `fact-item pop ${dirs[i % 2]}`;
      d.style.setProperty('--tilt', `${[-1, .8, -0.6, 1.2][i % 4]}deg`);
      d.style.setProperty('--d', `${.55 + i * .16}s`);
      d.textContent = f;
      list.appendChild(d);
    });
  },
};

/* ============================================================
   10. TRANG LỜI CHÚC
   ============================================================ */
const Wishes = {
  init() {
    $('#wishes-jp').textContent = CONFIG.japanese.wish;
    Cutout.render($('#wishes-title'), 'SEVEN LITTLE WISHES', 0.15);
    const board = $('#wish-board');
    const dirs = ['pop-top', 'pop-bottom'];
    CONFIG.wishes.forEach((w, i) => {
      const note = document.createElement('div');
      note.className = `wish-note pop ${dirs[i % 2]}`;
      note.style.setProperty('--tilt', `${[-1.6, 1.2, -0.8, 1.8][i % 4]}deg`);
      note.style.setProperty('--d', `${.5 + i * .1}s`);
      note.textContent = w;
      board.appendChild(note);
    });
  },
};

/* ============================================================
   11. TRANG LÁ THƯ
   ============================================================ */
const Letter = {
  init() {
    Cutout.render($('#letter-title'), 'WITH LOVE', 0.15);
    $('#letter-jp').textContent = CONFIG.japanese.toMaru;
    $('#letter-text').textContent = CONFIG.letter.text;
    $('#letter-sign').textContent = CONFIG.letter.signature;
  },
};

/* ============================================================
   12. TRANG BÁNH & THỔI NẾN (micro hoặc bấm nút)
   ============================================================ */
const Cake = {
  CANDLES: 1, // như tô ramen sinh nhật thật: 1 cây nến sọc cắm giữa
  out: 0,
  done: false,
  micStream: null,
  init() {
    $('#cake-prompt').textContent = CONFIG.cake.prompt;
    const holder = $('#cake-candles');
    for (let i = 0; i < this.CANDLES; i++) {
      const c = document.createElement('div');
      c.className = 'candle-stick';
      c.innerHTML = '<span class="fl"></span>';
      c.style.height = '95px';
      holder.appendChild(c);
    }
    $('#btn-tap-blow').addEventListener('click', () => this.blowAll(200));
    const micBtn = $('#btn-mic');
    if (!CONFIG.options.enableMicrophone || !navigator.mediaDevices) {
      micBtn.hidden = true;
    } else {
      micBtn.addEventListener('click', () => this.startMic());
    }
  },
  blowOne() {
    if (this.done) return;
    const lit = $$('.candle-stick:not(.out)');
    if (!lit.length) return;
    lit[0].classList.add('out');
    this.out++;
    if (this.out >= this.CANDLES) this.celebrate();
  },
  blowAll(gap) {
    if (this.done) return;
    $$('.candle-stick:not(.out)').forEach((c, i) => {
      setTimeout(() => {
        c.classList.add('out'); this.out++;
        if (this.out >= this.CANDLES) this.celebrate();
      }, reducedMotion ? 0 : i * gap);
    });
  },
  async startMic() {
    const status = $('#mic-status');
    try {
      status.textContent = 'Listening… blow gently toward your screen 🌬';
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const src = ac.createMediaStreamSource(this.micStream);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let overCount = 0;
      const listen = () => {
        if (this.done) { this.stopMic(ac); return; }
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < 24; i++) sum += data[i]; // tiếng thổi = âm trầm mạnh
        const level = sum / 24;
        if (level > 118) {
          overCount++;
          if (overCount > 4) { this.blowOne(); overCount = 0; }
        } else if (overCount > 0) overCount--;
        requestAnimationFrame(listen);
      };
      listen();
    } catch (err) {
      status.textContent = 'Microphone is shy today — use "Tap to blow" instead ✨';
    }
  },
  stopMic(ac) {
    if (this.micStream) this.micStream.getTracks().forEach(t => t.stop());
    if (ac && ac.state !== 'closed') ac.close();
    this.micStream = null;
  },
  // thổi hết nến → Capoo húp cạn cup ramen sinh nhật
  celebrate() {
    if (this.done) return;
    this.done = true;
    $('#mic-status').textContent = '';
    $('#cake-actions').hidden = true;
    Confetti.burst(70);
    // thổi tắt nến → bát ramen biến mất, hiện màn chúc mừng (ảnh cmsn + Bugcat King cổ vũ)
    $('#cake-prompt').textContent = '';
    $('#cake').classList.add('blown-hidden');
    const scene = $('#cake-celebrate-scene');
    const photo = $('#ccs-photo'), king = $('#ccs-king'), cheer = $('#ccs-cheer');
    if (CONFIG.cake.birthdayImage) { photo.src = CONFIG.cake.birthdayImage; photo.style.display = ''; }
    if (CONFIG.cake.bugcatKing)    { king.src  = CONFIG.cake.bugcatKing;    king.style.display  = ''; }
    if (CONFIG.cake.bugcatCheer)   { cheer.src = CONFIG.cake.bugcatCheer;   cheer.style.display = ''; }
    scene.hidden = false;
    Confetti.burst(50);
    // phát bài Happy Birthday 1 lần, hạ nhỏ nhạc nền; hát xong → quay lại bát ramen
    this._afterSongDone = false;
    let song = null;
    if (CONFIG.audio.birthdaySong) {
      try {
        song = new Audio(CONFIG.audio.birthdaySong);
        song.volume = 0.9;
        const prevVol = Music.audio ? Music.audio.volume : 0.35;
        if (Music.audio) Music.audio.volume = 0.08;
        song.play().catch(() => {});
        song.addEventListener('ended', () => { if (Music.audio) Music.audio.volume = prevVol; this.afterSong(); });
      } catch (err) { song = null; }
    }
    if (song) this._pulseToBeat(song); // ảnh cmsn nhún theo nhịp bài hát
    // dự phòng: máy chặn nhạc hoặc không có bài → vẫn tự chuyển tiếp
    this._songFallback = setTimeout(() => this.afterSong(), song ? 32000 : 6000);
  },
  // phân tích âm lượng bài hát (nhấn dải bass) → phình/co ảnh cmsn theo từng nhịp
  _pulseToBeat(songEl) {
    const photo = $('#ccs-photo');
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) throw new Error('no webaudio');
      const ctx = new AC();
      const src = ctx.createMediaElementSource(songEl);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.72;
      src.connect(analyser);
      analyser.connect(ctx.destination); // vẫn nghe được tiếng
      ctx.resume().catch(() => {});
      const data = new Uint8Array(analyser.frequencyBinCount);
      const bass = Math.max(1, analyser.frequencyBinCount >> 1); // nửa tần số thấp = nhịp trống
      const tick = () => {
        if (this._afterSongDone || songEl.ended || songEl.paused) {
          photo.style.transform = '';
          try { ctx.close(); } catch (e) { /* đóng rồi thì thôi */ }
          return;
        }
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < bass; i++) sum += data[i];
        const level = sum / bass / 255;                 // 0..1
        const scale = 1 + Math.min(0.22, level * 0.4);  // nhịp mạnh → phình tối đa ~1.22
        photo.style.transform = `scale(${scale.toFixed(3)})`;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } catch (err) {
      photo.classList.add('beat-fallback'); // không phân tích được → nhún nhịp cố định
    }
  },
  // hết nhạc → bát ramen hiện lại kèm lời mời, mở trò BẤM-ĐỂ-CẮN
  afterSong() {
    if (this._afterSongDone) return;
    this._afterSongDone = true;
    clearTimeout(this._songFallback);
    $('#cake-celebrate-scene').hidden = true;
    $('#cake').classList.remove('blown-hidden');
    $('#cake-prompt').textContent = CONFIG.cake.celebrateNote;
    this.bites = 0;
    const photo = $('#ramen-photo');
    photo.classList.add('clickable');
    this._biteHandler = () => this.biteOnce();
    photo.addEventListener('click', this._biteHandler);
  },
  // mỗi cú click = 1 vết cắn + tiếng nhai + Capoo nhai; đủ 3 miếng → húp tô rồi vào trò 40 bát
  BITES: ['capoo/ramen-bite1.webp', 'capoo/ramen-bite2.webp', 'capoo/ramen-bite3.webp'],
  biteOnce() {
    if (this.bites >= this.BITES.length) return;
    const eater = $('#cake-eater');
    if (this.bites === 0) { // miếng đầu → Capoo há mồm gặm
      eater.src = CONFIG.capoo.eating;
      eater.hidden = false;
      eater.classList.add('munch');
      setTimeout(() => { eater.style.right = '24%'; eater.style.bottom = '30%'; }, 60);
    }
    const photo = $('#ramen-photo');
    photo.src = this.BITES[this.bites];
    photo.classList.remove('chomp'); void photo.offsetWidth; photo.classList.add('chomp');
    Poke.crunch();
    this.bites++;
    if (this.bites >= this.BITES.length) { // ăn sạch tô → húp + phóng tên lửa rồi vào trò 40 bát
      photo.classList.remove('clickable');
      photo.removeEventListener('click', this._biteHandler);
      setTimeout(() => {
        $('#cake').classList.add('eaten');
        $('#cake-crumbs').hidden = false;
        eater.classList.remove('munch');
        eater.src = CONFIG.capoo.afterBowl;
        eater.classList.add('finale');
        eater.style.right = '34%'; eater.style.bottom = '24%';
        setTimeout(() => { eater.classList.remove('finale'); this.startRamen(); }, 9700);
      }, 700);
    }
  },
  // chợt nhớ: Maru thích RAMEN → 10 bát mì bay, KÉO từng bát tới Capoo
  ramenEaten: 0,
  startRamen() {
    $('#cake-prompt').textContent = CONFIG.cake.ramenLine;
    $('#ramen-count').hidden = false;
    const layer = $('#ramen-layer');
    const eater = $('#cake-eater');
    eater.src = 'capoo/stickers/st-face.png'; // đứng giữa chờ, mặt bình thường
    eater.style.right = '42%'; eater.style.bottom = '28%';
    // 40 vị trí quanh rìa trang (chừa giữa cho Capoo đứng)
    const SPOTS = [];
    for (let k = 0; k < 12; k++) SPOTS.push([3 + k * 7.9, 5 + (k % 3) * 4]);        // dải trên
    for (let k = 0; k < 12; k++) SPOTS.push([3 + k * 7.9, 68 + (k % 3) * 4]);       // dải dưới
    for (let k = 0; k < 8; k++)  SPOTS.push([2 + (k % 2) * 7, 20 + k * 5.5]);       // mép trái
    for (let k = 0; k < 8; k++)  SPOTS.push([85 + (k % 2) * 7, 20 + k * 5.5]);      // mép phải
    const total = CONFIG.cake.ramenCount;
    for (let i = 0; i < total; i++) {
      const bowl = document.createElement('img');
      bowl.className = 'ramen';
      bowl.src = `capoo/ramen-set/r-${String(i % 40 + 1).padStart(3, '0')}.png`; // mỗi bát 1 vị
      bowl.draggable = false;
      const [x, y] = SPOTS[i % SPOTS.length];
      bowl.dataset.hx = x; bowl.dataset.hy = y; // nhà của bát (để thả trượt thì bay về)
      bowl.style.left = `${x}%`;
      bowl.style.top = `${y}%`;
      bowl.style.setProperty('--fd', `${(i % 5) * -.6}s`);
      this.makeDraggable(bowl, eater, layer);
      layer.appendChild(bowl);
    }
    this.paintRamen();
  },
  // kéo bát ramen: lại gần Capoo → SÁNG MẮT; thả trúng → ăn, thả trượt → bát bay về chỗ
  makeDraggable(bowl, eater, layer) {
    const near = () => {
      const b = bowl.getBoundingClientRect(), e = eater.getBoundingClientRect();
      const dx = (b.left + b.width / 2) - (e.left + e.width / 2);
      const dy = (b.top + b.height / 2) - (e.top + e.height / 2);
      return Math.hypot(dx, dy) < e.width * 0.75;
    };
    bowl.addEventListener('pointerdown', ev => {
      ev.preventDefault();
      bowl.setPointerCapture(ev.pointerId);
      bowl.classList.add('dragging');
      const move = e => {
        const lr = layer.getBoundingClientRect();
        bowl.style.left = `${((e.clientX - lr.left) / lr.width) * 100}%`;
        bowl.style.top = `${((e.clientY - lr.top) / lr.height) * 100}%`;
        this.setExcited(eater, near()); // lại gần là mắt sáng rực
      };
      const up = () => {
        bowl.removeEventListener('pointermove', move);
        bowl.removeEventListener('pointerup', up);
        bowl.classList.remove('dragging');
        if (near()) {
          this.feed(bowl, eater);
        } else { // thả trượt → bát bay về nhà
          bowl.style.left = `${bowl.dataset.hx}%`;
          bowl.style.top = `${bowl.dataset.hy}%`;
          this.setExcited(eater, false);
        }
      };
      bowl.addEventListener('pointermove', move);
      bowl.addEventListener('pointerup', up);
    });
  },
  setExcited(eater, on) {
    if (eater.classList.contains('finale')) return; // đang chiếu clip kết thì không đụng vào
    if (eater.dataset.excited === String(on)) return;
    eater.dataset.excited = String(on);
    eater.src = on ? CONFIG.capoo.excited : 'capoo/stickers/st-face.png';
    eater.classList.toggle('excited', on);
  },
  feed(bowl, eater) {
    // bát mì bay vào mồm Capoo
    const er = eater.getBoundingClientRect();
    const lr = $('#ramen-layer').getBoundingClientRect();
    bowl.style.left = `${((er.left + er.width / 2 - lr.left) / lr.width) * 100}%`;
    bowl.style.top = `${((er.top + er.height / 2 - lr.top) / lr.height) * 100}%`;
    bowl.classList.add('slurp');
    bowl.style.pointerEvents = 'none';
    Poke.crunch(); // cạp cạp
    eater.classList.remove('boing'); void eater.offsetWidth;
    eater.classList.add('boing');
    setTimeout(() => bowl.remove(), 500);
    setTimeout(() => this.setExcited(eater, false), 600);
    this.ramenEaten++;
    this.paintRamen();
    if (this.ramenEaten >= CONFIG.cake.ramenCount) this.finishRamen(eater);
  },
  paintRamen() {
    $('#ramen-count').textContent = `🍜 ${this.ramenEaten} / ${CONFIG.cake.ramenCount}`;
  },
  finishRamen(eater) {
    $('#cake-prompt').textContent = CONFIG.cake.fullLine;
    // màn kết: cả hội ăn lẩu, Capoo ăn không phanh (clip noa gửi)
    eater.classList.add('finale');
    eater.dataset.excited = '';
    eater.src = CONFIG.capoo.afterRamen;
    eater.style.right = '34%'; eater.style.bottom = '24%';
    setTimeout(() => {
      $('#done-title').textContent = CONFIG.cake.doneTitle;
      $('#done-line').textContent = CONFIG.cake.doneLine;
      $('#done-jp').textContent = CONFIG.japanese.happyBirthday;
      eater.hidden = true; // giấu sticker to để chữ Happy Birthday hiện rõ
      $('#cake-done').hidden = false;
      Confetti.burst(170);
      Slides.unlock('slide-cake');
    }, 10400); // chờ clip ăn lẩu liên tục chạy trọn (~10.2s) rồi mới hiện màn chúc
  },
};

/* ============================================================
   12b. INTRO TRANG RAMEN — video Capoo đầu bếp nấu mì
   ============================================================ */
const CakeIntro = {
  played: false,
  init() {
    $('#intro-skip').textContent = CONFIG.cake.introSkip;
    $('#intro-skip').addEventListener('click', () => this.end());
    $('#intro-video').addEventListener('ended', () => this.end());
  },
  start() {
    if (this.played || /nointro|debug/.test(location.search)) return; // ?nointro hoặc ?debug: bỏ intro khi kiểm tra
    this.played = true;
    const box = $('#cake-intro');
    box.hidden = false;
    $('#intro-video').play().catch(() => this.end()); // máy không cho phát thì bỏ qua luôn
  },
  end() {
    const box = $('#cake-intro');
    if (box.hidden) return;
    box.style.opacity = '0';
    box.style.transition = 'opacity .5s ease';
    setTimeout(() => { box.hidden = true; $('#intro-video').pause(); }, 500);
  },
};

/* ============================================================
   13. TRANG QUÀ CUỐI
   ============================================================ */
const Gift = {
  init() {
    if (!CONFIG.gift.file) {
      // không có quà → bỏ trang gift khỏi hành trình
      Slides.ORDER = Slides.ORDER.filter(id => id !== 'slide-gift');
      return;
    }
    Cutout.render($('#gift-heading'), 'ONE LAST GIFT', 0.15);
    $('#gift-title').textContent = CONFIG.gift.title;
    $('#gift-desc').textContent = CONFIG.gift.desc;
    $('#gift-jp').textContent = CONFIG.japanese.happyBirthday;
    const btn = $('#gift-btn');
    btn.textContent = CONFIG.gift.button;
    btn.href = CONFIG.gift.file;
  },
};

/* ============================================================
   14. NHẠC NỀN — vào êm dần từ lúc mở khóa, nút 🎵 bật/tắt
   ============================================================ */
const Music = {
  audio: null,
  playing: false,
  init() {
    if (!CONFIG.audio.ambience) return;
    this.audio = new Audio(CONFIG.audio.ambience);
    this.audio.loop = true;
    this.audio.volume = 0.35;
    const fab = $('#btn-music');
    fab.hidden = false;
    fab.addEventListener('click', () => this.toggle());
  },
  start() {
    if (!this.audio || this.playing) return;
    clearInterval(this.fadeTimer);
    this.audio.volume = 0;
    this.audio.play().then(() => {
      this.playing = true;
      this.paint();
      this.fadeTimer = setInterval(() => { // nhạc vào êm dần trong ~2s
        this.audio.volume = Math.min(0.35, this.audio.volume + 0.035);
        if (this.audio.volume >= 0.35) clearInterval(this.fadeTimer);
      }, 200);
    }).catch(() => {});
  },
  toggle() {
    if (!this.audio) return;
    if (this.playing) {
      clearInterval(this.fadeTimer);
      this.audio.pause();
      this.playing = false;
      this.paint();
    } else {
      this.start();
    }
  },
  paint() {
    $('#btn-music').classList.toggle('music-on', this.playing);
  },
};

/* ============================================================
   15. PHÁO GIẤY
   ============================================================ */
const Confetti = {
  bits: [],
  running: false,
  COLORS: ['#5bc8ea', '#ffb7c5', '#ffdf7e', '#9adfb8', '#ffffff', '#c5b3f0'],
  burst(n) {
    if (reducedMotion) return;
    const cv = $('#confetti');
    cv.width = innerWidth; cv.height = innerHeight;
    for (let i = 0; i < n; i++) {
      this.bits.push({
        x: innerWidth / 2 + (Math.random() - .5) * innerWidth * .6,
        y: innerHeight * .22 + Math.random() * 40,
        vx: (Math.random() - .5) * 7,
        vy: -(2 + Math.random() * 6),
        rot: Math.random() * Math.PI,
        vr: (Math.random() - .5) * .25,
        size: 6 + Math.random() * 7,
        color: this.COLORS[(Math.random() * this.COLORS.length) | 0],
        life: 140 + Math.random() * 60,
      });
    }
    if (!this.running) { this.running = true; this.loop(); }
  },
  loop() {
    const cv = $('#confetti');
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    this.bits = this.bits.filter(b => b.life > 0 && b.y < cv.height + 30);
    this.bits.forEach(b => {
      b.x += b.vx; b.y += b.vy; b.vy += 0.14;
      b.rot += b.vr; b.life--;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.globalAlpha = Math.min(1, b.life / 40);
      ctx.fillStyle = b.color;
      ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size * .62);
      ctx.restore();
    });
    if (this.bits.length) requestAnimationFrame(() => this.loop());
    else { this.running = false; ctx.clearRect(0, 0, cv.width, cv.height); }
  },
};

/* ============================================================
   KHỞI ĐỘNG
   ============================================================ */
document.title = `${CONFIG.nickname}'s Birthday 💙`;
CapooSlots.init();
Tilt.init();
Poke.init();
Slides.init();
Lock.init();
Surprise.init();
Happy.init();
Catch.init();
Quiz.init();
Memories.init();
Facts.init();
Wishes.init();
Letter.init();
Cake.init();
CakeIntro.init();
Gift.init();
Music.init();
Stickers.init();
// chế độ KIỂM TRA: thêm ?debug vào URL → hiện nút skip trò (Maru không thấy)
if (location.search.includes('debug')) {
  const b = document.createElement('button');
  b.className = 'debug-skip';
  b.textContent = '⏭ skip trò';
  b.addEventListener('click', () => {
    Slides.unlock(Slides.ORDER[Slides.idx]);
    if (Slides.idx < Slides.ORDER.length - 1) Slides.show(Slides.idx + 1);
  });
  $('.tablet').appendChild(b);
}
// mở thẳng 1 trang bằng #hash (vd index.html#slide-happy) — tiện xem thử
if (location.hash) {
  const i = Slides.ORDER.indexOf(location.hash.slice(1));
  if (i >= 0) Slides.show(i);
}
