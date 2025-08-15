    // === 큰 카드 클릭: 첫 카드만 슬라이드 후 이동 ===
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

    // === 캐러셀 + SVG 도트/화살표 ===
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
    return w + gap; // 카드 한 칸 이동량
    }

    function maxIndex() {
    return Math.max(0, cards.length - 1);
    }

    // 네이티브 계산 사용: padding-right(끝 여백 87px)까지 포함해 정확
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

    // 화살표
    arrowLeft?.addEventListener('click',  () => goToIndex(indexFromScroll() - 1));
    arrowRight?.addEventListener('click', () => goToIndex(indexFromScroll() + 1));

    // 도트 클릭 점프
    svgDots.forEach((c, i) => {
    c.style.cursor = 'pointer';
    c.addEventListener('click', () => goToIndex(i));
    });

    // === 상단 검색/질의 버튼 ===
    document.querySelector('.ask')?.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('검색/질의 버튼 클릭');
    });

    // === 하단 동그라미 버튼(말풍선) ===
    document.querySelector('.speech-bubble')?.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('마이크 버튼 클릭');
    });

    // === 탭 전환 + 페이지 이동 (이미지 밑줄 사용) ===
    // HTML에서: onclick="switchTab(this, '전통시장')" / "재래시장" 사용 중
    function switchTab(btn, type) {
    // 비주얼 상태 업데이트 (이미지 밑줄은 CSS가 .active 기준으로 표시)
    const tabs = Array.from(document.querySelectorAll('.tabs .tab'));
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // 페이지 이동
    if (type === '전통시장') {
        window.location.href = 'mainpage.html';
    } else if (type === '재래시장') {
        window.location.href = 'mainpage2.html';
    }
    }

    // ✅ 주의: 이전 setActiveTab / tabButtons 이벤트 바인딩은 제거!
    // (HTML의 onclick="switchTab(...)"만 사용)
