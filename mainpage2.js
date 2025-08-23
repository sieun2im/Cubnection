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
const track = document.querySelector('.track');
const cards = Array.from(document.querySelectorAll('.card-lg'));
const svgDots = Array.from(document.querySelectorAll('.carousel-dots circle'));
const arrowLeft = document.getElementById('dotLeft');
const arrowRight = document.getElementById('dotRight');
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
function getStep() {
    if (!track || !cards.length) return 0;
    const w = cards[0].getBoundingClientRect().width;
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
    const idx = clamp(i, 0, maxIndex());
    const targetScroll = clamp(idx * step, 0, getMaxScrollLeft());
    track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveDot(idx);
}
track?.addEventListener('scroll', () => requestAnimationFrame(updateDots));
updateDots();
arrowLeft?.addEventListener('click', () => goToIndex(indexFromScroll() - 1));
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

(() => {
    const API_BASE = '/api';
    async function api(url, opts) {
        const res = await fetch(url, opts);
        if (!res.ok) {
            const t = await res.text().catch(()=> '');
            throw new Error(`${res.status} ${res.statusText} - ${t || '요청 실패'}`);
        }
        return res.json();
    }
    const fetchMarkets = () => api(`${API_BASE}/markets`);
    const fetchPopular = () => api(`${API_BASE}/stores/popular`);
    const getStoreDetail = (id) => api(`${API_BASE}/stores/${id}`);

    function hydrateMarketsIntoCarousel(markets) {
        const track = document.querySelector('.track');
        if (!track) return;
        const cards = Array.from(track.querySelectorAll('.card-lg'));
        const list = Array.isArray(markets) ? markets.slice(3, 6) : [];
        const attachCardClick = (card) => {
            card.addEventListener('click', () => {
                const goto = card.dataset.link || '#';
                window.location.href = goto;
            });
        };
        let i = 0;
        for (; i < cards.length && i < list.length; i++) {
            const m = list[i];
            const card = cards[i];
            card.dataset.type = 'market';
            card.dataset.id = String(m.id);
            card.dataset.link = `../chatpage/chatpage.html?marketId=${encodeURIComponent(m.id)}`;
            const img = card.querySelector('img') || document.createElement('img');
            if (!img.parentNode) card.prepend(img);
            if (!img.getAttribute('src')) img.setAttribute('src', 'Rectangle1.png');
            let overlay = card.querySelector('.overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'overlay';
                card.appendChild(overlay);
            }
            overlay.innerHTML = `${m.name}${m.location ? `<br/><span style="font-size:12px;opacity:.9">${m.location}</span>` : ''}`;
            if (!card.dataset.addonBound) {
                attachCardClick(card);
                card.dataset.addonBound = '1';
            }
        }
        for (; i < list.length; i++) {
            const m = list[i];
            const card = document.createElement('article');
            card.className = 'card-lg';
            card.dataset.type = 'market';
            card.dataset.id = String(m.id);
            card.dataset.link = `../chatpage/chatpage.html?marketId=${encodeURIComponent(m.id)}`;
            card.innerHTML = `
                <img src="Rectangle1.png" alt="" />
                <div class="overlay">${m.name}${m.location ? `<br/><span style="font-size:12px;opacity:.9">${m.location}</span>` : ''}</div>
            `;
            attachCardClick(card);
            track.appendChild(card);
        }
    }

    function renderPopularIntoBenefits(popular) {
        const ul = document.querySelector('.benefits');
        if (!ul) return;
        ul.removeAttribute('data-link');
        ul.innerHTML = '';
        const list = Array.isArray(popular) ? popular.slice(0, 2) : [];
        if (list.length === 0) {
            ul.innerHTML = `
                <li class="benefit">
                    <div class="b-text">
                        <strong>실시간 인기 매장 없음</strong>
                        <p>검색/추천이 쌓이면 여기에서 Top10을 볼 수 있어요.</p>
                    </div>
                </li>`;
            return;
        }
        list.forEach((p, idx) => {
            const li = document.createElement('li');
            li.className = 'benefit';
            li.dataset.storeId = String(p.id);
            li.innerHTML = `
                <img src="Rectangle${(idx % 8) + 1}.png" alt="" />
                <div class="b-text">
                    <strong>${p.name}</strong><br/>
                    <span class="sub">${p.category || '-'} · <b>${p.searchCount}</b>회 검색</span>
                    <p>지금 가장 주목받는 상점이에요. 눌러서 상세 보러 가기!</p>
                </div>
            `;
            li.addEventListener('click', () => {
                localStorage.setItem('selectedStoreId', String(p.id));
                window.location.href = `../chatpage/chatpage.html?storeId=${encodeURIComponent(p.id)}`;
            });
            ul.appendChild(li);
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const [markets, popular] = await Promise.all([
                fetchMarkets().catch(e => { console.warn('시장 리스트 실패:', e.message); return []; }),
                fetchPopular().catch(e => { console.warn('인기 Top10 실패:', e.message); return []; }),
            ]);
            hydrateMarketsIntoCarousel(markets);
            renderPopularIntoBenefits(popular);
        } catch (e) {
            console.error('[ADD-ON init error]', e);
        }
    });
})();
