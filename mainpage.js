document.querySelectorAll('[data-link="../chatpage/chatpage.html"]').forEach((card, idx) => {
    card.addEventListener('click', () => {
        const goto = card.dataset.link || '#';
        if (idx === 0) {
        card.classList.add('slide-out');
        setTimeout(() => {
            window.location.href = goto;
        }, 350);
        } else {
        window.location.href = goto;
        }
    });
    });
    const track      = document.querySelector('.track');
    const cards      = Array.from(document.querySelectorAll('.card-lg'));
    const svgDots    = Array.from(document.querySelectorAll('.carousel-dots circle'));
    const arrowLeft  = document.getElementById('dotLeft');
    const arrowRight = document.getElementById('dotRight');
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    function getStep() {
    if (!track || !cards.length) return 0;
    const w   = cards[0].getBoundingClientRect().width;
    const css = getComputedStyle(track);
    const gap = parseFloat(css.columnGap || css.gap || '0') || 0;
    return w + gap; 
    }
    function maxIndex() {
    return Math.max(0, cards.length - 1);
    }
    function getMaxScrollLeft() {
    if (!track) return 0;
    return Math.max(0, track.scrollWidth - track.clientWidth);
    }
    function indexFromScroll() {
    const step = getStep();
    if (!step) return 0;
    return clamp(Math.round(track.scrollLeft / step), 0, maxIndex());
    }
    function setActiveDot(activeIdx) {
    svgDots.forEach((c, i) =>
        c.setAttribute('fill', i === activeIdx ? '#E8E4EB' : '#716F79')
    );
    }
    function updateDots() {
    setActiveDot(indexFromScroll());
    }
    function goToIndex(i) {
    const step = getStep();
    if (!step) return;
    const idx          = clamp(i, 0, maxIndex());
    const targetScroll = clamp(idx * step, 0, getMaxScrollLeft());
    track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveDot(idx);
    }
    track?.addEventListener('scroll', () => requestAnimationFrame(updateDots));
    updateDots();
    arrowLeft?.addEventListener('click',  () => goToIndex(indexFromScroll() - 1));
    arrowRight?.addEventListener('click', () => goToIndex(indexFromScroll() + 1));
    svgDots.forEach((c, i) => {
    c.style.cursor = 'pointer';
    c.addEventListener('click', () => goToIndex(i));
    });
    document.querySelector('.ask')?.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('검색/질의 버튼 클릭');
    });
    document.querySelector('.speech-bubble')?.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('마이크 버튼 클릭');
    });
    function switchTab(btn, type) {
    const tabs = Array.from(document.querySelectorAll('.tabs .tab'));
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    if (type === '전통시장') {
        window.location.href = 'mainpage.html';
    } else if (type === '재래시장') {
        window.location.href = 'mainpage2.html';
    }
    }