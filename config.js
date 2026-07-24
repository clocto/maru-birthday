/* ============================================================
   ✏️ FILE NỘI DUNG — noa chỉ cần sửa file này!
   Toàn bộ chữ, tên, ảnh, mật khẩu, lời chúc của web đều nằm ở đây.
   Mở bằng TextEdit, sửa xong Save, mở lại index.html là thấy ngay.
   Lưu ý: chữ phải nằm trong dấu nháy 'như thế này'.
   (Web chính dùng tiếng Anh vì Maru là người Nhật;
    tiếng Nhật xuất hiện làm điểm nhấn trang trí nhỏ.)
   ============================================================ */

const CONFIG = {

  // ------ Thông tin chính ------
  fullName: 'Minori Marukawa',   // sinh 26/07/1995
  nickname: 'Maru',
  birthdayDate: 'July 26',
  age: 31,                       // 2026 − 1995 = tròn 31
  senderName: 'Noa',

  // ------ Trang 1: nhập mật khẩu ------
  lock: {
    password: '2607',                  // mật khẩu (4 số)
    hint: 'hint: Today is the day~',  // gợi ý dưới bàn phím số
    caption: "a little things i made for you, Maru chan :3",
    wrongMessages: [                   // Capoo càu nhàu khi sai mật khẩu
      'Nope!! (｡•́︿•̀｡) try again 💙',
      'Hmm… a very special day? (・_・?) 🎂',
      'So close!! ヾ(≧▽≦*)o maybe…',
    ],
  },

  // ------ Trang 2: bất ngờ YES / NO ------
  surprise: {
    line1: 'I MADE SOMETHING FOR YOU',
    line2: 'do you wanna see it?',
    yes: 'YES',
    no:  'NO',
    // chữ hiện ra khi cố bấm NO (nút sẽ né tay 😹)
    noMessages: [
      '(⊙_⊙) hey! the NO button is shy…',
      'Capoo hid the NO button (≧▽≦)',
      'there is only one answer today! (￣^￣)',
    ],
  },

  // ------ Trang 3: HAPPY BIRTHDAY ------
  happy: {
    title: 'HAPPY BIRTHDAY',
    subtitle: 'to my babi tan',
  },

  // ------ Thử thách 1: bắt Capoo (chặn giữa HAPPY → Memories) ------
  catch: {
    title: 'CATCH CAPOO!',
    hint: 'he stole the next page… tap him 3 times! (=｀ω´=)',
    caught: ['gotcha once! (๑•̀ㅂ•́)و', 'twice!! (≧▽≦) he is getting tired…', 'CAUGHT!! ヾ(≧▽≦*)o opening the page…'],
    count: 3, // số lần phải bắt được
  },

  // ------ Thử thách 2: câu đố nhỏ (chặn giữa Wishes → With Love) ------
  quiz: {
    title: 'TINY QUIZ',
    question: 'One more gate! Whose special day is it today? 🎂',
    options: ["Capoo's, obviously", "Maru's! 💙", "Tutu's… maybe?"],
    correct: 1, // đáp án đúng: vị trí thứ mấy (đếm từ 0)
    wrongMessages: ['Capoo says NOPE (｀Д´)', 'really?? (⊙_⊙;) try again!!'],
  },

  // ------ Trang 4: Memories (kiểu trang tìm kiếm) — 18 ảnh ------
  memoriesSearch: 'Lovely moments 💙',
  // Bỏ ảnh vào thư mục images/ rồi điền tên file vào src, ví dụ src: 'images/anh1.jpg'.
  // Ảnh nào chưa có cứ để src: '' — web sẽ hiện khung "đang chờ ảnh".
  photos: [
    { src: 'images/IMG_0728.JPG', date: '', caption: 'A small moment that became a beautiful memory.' },
    { src: 'images/IMG_0729.JPG', date: '', caption: 'Some memories only need one glance to come back.', focus: '50% 26%' },
    { src: 'images/IMG_0730.JPG', date: '', caption: 'Thank you for being part of these days.' },
    { src: 'images/IMG_0731.JPG', date: '', caption: 'A chapter worth keeping.' },
    { src: 'images/IMG_0732.JPG', date: '', caption: 'A quiet moment, remembered forever.' },
    { src: 'images/IMG_0733.JPG', date: '', caption: 'The kind of day I never want to forget.' },
    { src: 'images/IMG_0734.JPG', date: '', caption: 'Little things, kept like treasures.' },
    { src: 'images/IMG_0735.JPG', date: '', caption: 'One page of our story.' },
    { src: 'images/IMG_0736.JPG', date: '', caption: 'Written in gold, kept in the heart.' },
    { src: 'images/IMG_0737.JPG', date: '', caption: 'And every road still leads to you.' },
    { src: 'images/IMG_0738.JPG', date: '', caption: 'Every smile with you is worth remembering.' },
    { src: 'images/IMG_0739.JPG', date: '', caption: 'Some days just feel like home.' },
    { src: 'images/IMG_0740.JPG', date: '', caption: 'A memory I keep coming back to.' },
    { src: 'images/IMG_0741.JPG', date: '', caption: 'You make the ordinary feel special.' },
    { src: 'images/IMG_0742.JPG', date: '', caption: 'Moments like this, kept forever.' },
    { src: 'images/IMG_0743.JPG', date: '', caption: 'Another page I never want to close.' },
    { src: 'images/IMG_0744.JPG', date: '', caption: 'Happiness looks a lot like this.' },
    { src: 'images/IMG_0745.JPG', date: '', caption: 'And still, my favorite memory is you.' },
  ],

  // ------ Trang 5: FUN FACTS ABOUT YOU ------
  // ⚠️ noa sửa lại theo Maru thật nha — đây là ví dụ đặt chỗ!
  funFacts: [
    'You can\'t eat durian because it\'s too "delicious"',
    'You have many shade of snoring sound when you sleeping',
    'You do a lot of aho things like a child',
    'You can talk about your waifu lists all days',
  ],

  // ------ Trang 6: 7 lời chúc ------
  wishes: [
    'May time be kind to you and leave space for everything you love.',
    'May every good message find its way to you.',
    'May this new chapter be filled with memories worth keeping.',
    'May your inner light stay warm, even on difficult days.',
    'May every journey lead you closer to where you truly belong.',
    'May every plan, dream, and little hope come together beautifully.',
    'May the promises you make to yourself stay protected and true.',
  ],

  // ------ Trang 7: lá thư WITH LOVE ------
  letter: {
    text:
      'Dear Maru bbi,\n\n' +
      'Today, the stars have gathered to mark a day that belongs only to you.\n\n' +
      'Welcome to a birthday journey created especially for your new chapter.\n\n' +
      'Wishing you have a smooth start to your career, many new experiences, and a truly happy life with me!\n\n' +
      'Happy birthday to you my sweetheart',
    signature: '— with love, Noa',
  },

  // ------ Trang 8: ramen sinh nhật — intro Capoo nấu mì + thổi nến + tiệc ramen ------
  cake: {
    introSkip: 'skip ›',
    prompt: 'Chef Capoo made you a birthday ramen! Blow out the candle 🎂🍜',
    eatLine: 'Itadakimasu!! Capoo is slurping it… 🍜',
    ramenLine: "Wait — Maru's favorite is RAMEN! Feed Capoo ALL 40 kinds of ramen! 🍜",
    ramenCount: 40,     // đủ bộ 40 sticker ramen (capoo/ramen-set/)
    // Thổi tắt nến → bát biến mất, hiện ảnh cmsn + Bugcat King (nhạc Happy Birthday chạy).
    // Hết nhạc → bát ramen hiện lại kèm dòng mời dưới đây, rồi bấm-để-cắn.
    celebrateNote: "Oh, Capoo chan also want to try some Ramen with Maru! Let's eat!",
    birthdayImage: 'images/anh-cmsn.png',        // ẢNH CMSN — bánh Happy Birthday Capoo (đã tách nền)
    bugcatKing: 'capoo/bugcat-king-clean.gif',   // gif BUGCAT KING (đã cắt bỏ dòng chữ Trung)
    bugcatCheer: 'capoo/bugcat-covu.gif',        // gif BUGCAT cổ vũ (vẫy que phát sáng)
    fullLine: 'So full… (￣﹃￣) but so happy 🍜💤',
    doneTitle: 'Happy Birthday, Maru!',
    doneLine: 'May your new chapter shine brighter than ever. 💙',
  },

  // ------ Trang 9: quà cuối ------
  // Bỏ file PDF vào thư mục qua-tang/ đúng tên bên dưới (hoặc sửa tên ở đây).
  // Để file: '' nếu chưa muốn hiện trang quà.
  gift: {
    file: 'qua-tang/sach-cho-maru.pdf',
    title: 'One last gift — a book made only for you',
    desc: 'Download it, print it, and hold a story that exists nowhere else in the world.',
    button: 'Receive the Gift',
  },

  // ------ Hình Capoo ------
  // Clip Capoo × Tutu (thỏ trắng) — WebP động ĐÃ CẮT VIỀN trong suốt, loop như GIF.
  // Muốn thay hình nào: bỏ file mới (webp/gif/png/mp4) vào thư mục capoo/ rồi sửa tên ở đây.
  // Thiếu hình nào web vẫn chạy — chỗ đó hiện khung mây "đang chờ Capoo".
  // (Bộ clip mp4 cũ vẫn còn trong capoo/ nếu muốn quay lại.)
  capoo: {
    lock:      'capoo/capoo-intro3.webp',   // intro3 noa gửi: bảng hiệu DOGDOG NOODLE, cả hội trong tô mì — trang mật khẩu
    surprise:  'capoo/tutu-surprise.webp',  // Tutu lấy đuôi cù Capoo + tim — trang "wanna see it?"
    happy:     'capoo/tutu-happy.webp',     // Capoo gặm tay Tutu tim bay — trang HAPPY
    memories:  'capoo/tutu-memories.webp',  // Capoo & Tutu ôm nhau tim bay — trang Memories
    wishes:    'capoo/tutu-wishes.webp',    // Capoo & Tutu nhảy má kề má — trang lời chúc
    letter:    'capoo/capoo-withlove.webp', // Pinterest noa gửi: ôm má tim bay rồi cháy khét — trang thư
    gift:      'capoo/tutu-gift.webp',      // Tutu tắm nồi + Capoo đun lửa — trang quà
    celebrate: 'capoo/tutu-celebrate.webp', // Tutu phi thân ôm Capoo lăn vòng — thổi hết nến
    shy:       'capoo/tutu-shy.webp',       // Tutu má hồng ôm hoa, cánh hoa bay — quiz + bị chọc lúc ngủ
    // 2 vai trong trang ramen — noa gửi file "Capoo bông hoa" và "Capoo vui vẻ" thì thay vào đây:
    eating:    'capoo/capoo-bonghoa.webp',      // Capoo bông hoa (noa gửi) — lúc ăn tô ramen
    excited:   'capoo/capoo-sangmat.webp',      // Capoo vui vẻ (noa gửi, đã bỏ hamburger) — SÁNG MẮT khi ramen lại gần
    afterBowl:  'capoo/capoo-afterramen.webp',  // "ăn mì ramen" (noa gửi) — sau khi ăn xong tô sinh nhật
    afterRamen: 'capoo/capoo-lientuc.webp',     // "ăn mì liên tục" (noa gửi) — sau khi xong 40 bát
  },

  // ------ Sticker Capoo rải khắp các trang ------
  // slide: trang nào; x,y: vị trí % (x: 0 trái→100 phải, y: 0 trên→100 dưới)
  // size: to cỡ nào (px); rot: nghiêng bao nhiêu độ. Thêm/bớt dòng thoải mái.
  // Kho sticker có sẵn trong capoo/stickers/: st-face, st-sparkle, st-drink,
  // st-scared, st-bunny, st-duckhat, st-shy, st-redcat, st-heartduo, st-cart,
  // st-happyroll, st-dogpair
  stickers: {
    enabled: true,
    // Sticker đính quanh MÉP NGOÀI khung iPad (nửa trong nửa ngoài viền).
    // x,y tính theo % khung: x:0 = giữa cạnh trái, x:100 = giữa cạnh phải,
    // y:0 = giữa cạnh trên, y:100 = giữa cạnh dưới.
    frame: [
      { src: 'capoo/stickers/st-face.png',     x: 10,  y: 0,   size: 110, rot: -10 },
      { src: 'capoo/stickers/st-heartduo.png', x: 32,  y: 0,   size: 125, rot: 6 },
      { src: 'capoo/stickers/st-duckhat.png',  x: 56,  y: 0,   size: 105, rot: -7 },
      { src: 'capoo/stickers/st-sparkle.png',  x: 79,  y: 0,   size: 130, rot: 9 },
      { src: 'capoo/stickers/st-redcat.png',   x: 100, y: 22,  size: 115, rot: 12 },
      { src: 'capoo/stickers/st-drink.png',    x: 100, y: 58,  size: 110, rot: -8 },
      { src: 'capoo/stickers/st-cart.png',     x: 90,  y: 100, size: 140, rot: 7 },
      { src: 'capoo/stickers/st-shy.png',      x: 64,  y: 100, size: 120, rot: -6 },
      { src: 'capoo/stickers/st-bunny.png',    x: 38,  y: 100, size: 115, rot: 8 },
      { src: 'capoo/stickers/st-scared.png',   x: 13,  y: 100, size: 130, rot: -9 },
      { src: 'capoo/stickers/st-happyroll.png',     x: 0,   y: 62,  size: 110, rot: 10 },
      { src: 'capoo/stickers/st-dogpair.png',    x: 0,   y: 24,  size: 115, rot: -12 },
    ],
    placements: [
      { slide: 'slide-lock',     src: 'capoo/stickers/st-drink.png',    x: 42, y: 72, size: 115,  rot: 6 },
      { slide: 'slide-surprise', src: 'capoo/stickers/st-sparkle.png',  x: 87, y: 38, size: 128,  rot: 8 },
      { slide: 'slide-surprise', src: 'capoo/stickers/st-shy.png',      x: 5,  y: 68, size: 128,  rot: -6 },
      { slide: 'slide-happy',    src: 'capoo/stickers/st-heartduo.png', x: 6,  y: 36, size: 135, rot: -7 },
      { slide: 'slide-happy',    src: 'capoo/stickers/st-drink.png',    x: 85, y: 64, size: 115,  rot: 7 },
      { slide: 'slide-happy',    src: 'capoo/stickers/st-bunny.png',    x: 5,  y: 64, size: 108,  rot: 5 },
      { slide: 'slide-memories', src: 'capoo/stickers/st-duckhat.png',  x: 4,  y: 8,  size: 101,  rot: -8 },
      { slide: 'slide-memories', src: 'capoo/stickers/st-redcat.png',   x: 89, y: 9,  size: 108,  rot: 7 },
      { slide: 'slide-facts',    src: 'capoo/stickers/st-scared.png',   x: 80, y: 66, size: 142, rot: 6 },
      { slide: 'slide-facts',    src: 'capoo/stickers/st-face.png',     x: 6,  y: 62, size: 115,  rot: -6 },
      { slide: 'slide-facts',    src: 'capoo/stickers/st-sparkle.png',  x: 84, y: 10, size: 115,  rot: -5 },
      { slide: 'slide-wishes',   src: 'capoo/stickers/st-cart.png',     x: 83, y: 70, size: 135, rot: 5 },
      { slide: 'slide-wishes',   src: 'capoo/stickers/st-bunny.png',    x: 89, y: 8,  size: 101,  rot: -6 },
      { slide: 'slide-letter',   src: 'capoo/stickers/st-redcat.png',   x: 87, y: 10, size: 115,  rot: 8 },
      { slide: 'slide-letter',   src: 'capoo/stickers/st-duckhat.png',  x: 5,  y: 10, size: 101,  rot: -7 },
      { slide: 'slide-cake',     src: 'capoo/stickers/st-heartduo.png', x: 7,  y: 16, size: 128,  rot: -6 },
      { slide: 'slide-cake',     src: 'capoo/stickers/st-shy.png',      x: 83, y: 18, size: 122,  rot: 6 },
      { slide: 'slide-gift',     src: 'capoo/stickers/st-cart.png',     x: 7,  y: 20, size: 128,  rot: -7 },
      { slide: 'slide-gift',     src: 'capoo/stickers/st-sparkle.png',  x: 86, y: 14, size: 115,  rot: 6 },
    ],
  },

  // ------ Điểm nhấn tiếng Nhật ------
  japanese: {
    happyBirthday: 'お誕生日おめでとう',            // chúc mừng sinh nhật
    toMaru:        'まるへ',                        // gửi Maru
    memory:        '思い出',                        // kỷ niệm
    wish:          '願い',                          // điều ước
    happiness:     '幸せ',                          // hạnh phúc
  },

  // ------ Nhạc nền (tuỳ chọn) ------
  // Bỏ file nhạc vào thư mục audio/ rồi điền tên vào đây. Để '' thì web im lặng.
  audio: {
    ambience: 'audio/nhac-nen.m4a',
    birthdaySong: 'audio/happy-birthday-song.mp3', // bật 1 lần đúng lúc thổi tắt nến
  },

  // ------ Tuỳ chỉnh hiệu ứng ------
  options: {
    enableMicrophone: true, // cho phép thổi nến bằng micro (luôn có nút bấm thay thế)
  },
};
