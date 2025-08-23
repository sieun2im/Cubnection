function goToPage() {
  window.location.href = "../index.html";
}

const API_BASE = "/api";

function qs(name) {
  const v = new URLSearchParams(location.search).get(name);
  return v ?? null;
}

async function api(url, opts) {
  const res = await fetch(url, { cache: "no-store", ...opts });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} - ${t || "요청 실패"}`);
  }
  return res.json();
}

const getMarketDetail = (id) => api(`${API_BASE}/markets/${encodeURIComponent(id)}`);
const getStoresByMarket = (id) => api(`${API_BASE}/stores?marketId=${encodeURIComponent(id)}`);
const getStoreDetail = (id) => api(`${API_BASE}/stores/${encodeURIComponent(id)}`);
const postRecommendation = (shopId, reason) =>
  api(`${API_BASE}/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shopId, reason: reason || undefined }),
  });

function renderMarket(desc, market, stores) {
  const list = Array.isArray(stores) ? stores : [];
  desc.innerHTML = `
    <div>
      <h2 style="margin:0 0 8px">${market.name}</h2>
      <div style="opacity:.8;margin-bottom:8px">${market.location || ""}</div>
      <p style="margin:0 0 16px">${market.description || ""}</p>
      <h3 style="margin:0 0 8px">가게 리스트</h3>
      ${
        list.length === 0
          ? `<div>등록된 가게가 없습니다.</div>`
          : `<ul style="list-style:none;padding:0;margin:0;display:grid;gap:10px">
              ${list.map(s => `
                <li style="border:1px solid #2a2a2a;border-radius:12px;padding:12px">
                  <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
                    <div>
                      <strong>${s.name}</strong> <small style="opacity:.8">${s.category || "-"}</small>
                      <div style="margin-top:4px">${s.description || ""}</div>
                    </div>
                    <button type="button" data-store-id="${s.id}">상세</button>
                  </div>
                </li>`).join("")}
            </ul>`
      }
    </div>
  `;
}

function renderStore(desc, data) {
  desc.innerHTML = `
    <div>
      <h2 style="margin:0 0 6px">${data.name}</h2>
      <div style="opacity:.8;margin-bottom:8px">${data.category || "-"}</div>
      <h3 style="margin:0 0 6px">가게 소개</h3>
      <p style="margin:0 0 16px">${data.description || "소개가 아직 없어요."}</p>
      <div style="display:flex;gap:8px">
        <button id="recoBtn" type="button">⭐ 추천하기(인기 +3)</button>
        <button id="backBtn" type="button">← 뒤로</button>
      </div>
      <div style="opacity:.7;margin-top:12px;font-size:12px">/api/stores/{id} 응답에는 주소/영업시간이 포함되지 않습니다.</div>
    </div>
  `;
}

function ensureReasonModalStyle() {
  if (document.getElementById('reco-modal-style')) return;
  const css = `
  .reco-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:9999}
  .reco-modal{position:relative;width:min(92vw,420px);background:#1f1f1f;color:#dedde0;border:1px solid #2f2f2f;border-radius:16px;padding:18px 16px 14px;box-shadow:0 12px 32px rgba(0,0,0,.35)}
  .reco-modal h3{margin:0 0 10px;font-size:16px;font-weight:700}
  .reco-modal textarea{width:100%;height:110px;background:#0f0f0f;border:1px solid #333;color:#fff;border-radius:12px;padding:12px;resize:none;outline:none}
  .reco-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}
  .reco-actions button{border:0;border-radius:999px;padding:10px 14px;cursor:pointer;font-family:inherit}
  .reco-actions [data-skip]{background:#2c2c2c;color:#ddd}
  .reco-actions [data-submit]{background:linear-gradient(135deg,#9b7bff 0%, #7c5cff 100%);color:#fff;box-shadow:0 6px 14px rgba(124,92,255,.35)}
  .reco-close{position:absolute;top:8px;right:10px;background:transparent;border:0;color:#aaa;font-size:20px;line-height:1;cursor:pointer}
  .reco-close:hover{color:#fff}
  `;
  const style = document.createElement('style');
  style.id = 'reco-modal-style';
  style.textContent = css;
  document.head.appendChild(style);
}

function showReasonModal() {
  ensureReasonModalStyle();
  return new Promise((resolve) => {
    const backdrop = document.createElement('div');
    backdrop.className = 'reco-backdrop';
    backdrop.innerHTML = `
      <div class="reco-modal" role="dialog" aria-modal="true" aria-label="추천 사유 입력">
        <button class="reco-close" aria-label="닫기">×</button>
        <h3>추천 사유(선택)</h3>
        <textarea placeholder="예) 사장님이 친절해요 · 고기가 신선해요" maxlength="200"></textarea>
        <div class="reco-actions">
          <button type="button" data-skip>건너뛰기</button>
          <button type="button" data-submit>추천하기</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    const input = backdrop.querySelector('textarea');
    input.focus();
    function done(v){ backdrop.remove(); resolve(v); }
    backdrop.addEventListener('click', e => { if (e.target === backdrop) done(""); });
    backdrop.querySelector('.reco-close').addEventListener('click', () => done(""));
    backdrop.querySelector('[data-skip]').addEventListener('click', () => done(""));
    backdrop.querySelector('[data-submit]').addEventListener('click', () => done(input.value.trim()));
    input.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') done(input.value.trim());
      if (e.key === 'Escape') done("");
    });
    function onEsc(e){ if (e.key === 'Escape') { window.removeEventListener('keydown', onEsc); done(""); } }
    window.addEventListener('keydown', onEsc);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector(".close-icon")?.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = "../index.html";
  });

  const desc = document.querySelector(".desc-section");
  if (!desc) return;

  const urlMarketId = qs("marketId");
  const urlStoreId = qs("storeId");
  let marketId = null;
  let storeId = null;

  if (urlStoreId) {
    storeId = urlStoreId;
  } else if (urlMarketId) {
    marketId = urlMarketId;
  } else {
    storeId = localStorage.getItem("selectedStoreId");
    marketId = storeId ? null : localStorage.getItem("selectedMarketId");
  }

  try {
    if (storeId) {
      const data = await getStoreDetail(storeId);
      renderStore(desc, data);
      desc.addEventListener("click", async (e) => {
        const t = e.target;
        if (!(t instanceof HTMLElement)) return;
        if (t.id === "recoBtn") {
          try {
            const reason = (await showReasonModal()) ?? "";
            await postRecommendation(Number(data.id), reason);
            alert("추천 완료! (인기 +3 반영)");
          } catch (err) {
            alert("추천 실패: " + err.message);
          }
        }
        if (t.id === "backBtn") {
          history.length > 1 ? history.back() : (location.href = "../index.html");
        }
      });
      return;
    }

    if (marketId) {
      const market = await getMarketDetail(marketId);
      const stores = await getStoresByMarket(marketId);
      renderMarket(desc, market, stores);
      desc.addEventListener("click", (e) => {
        const t = e.target;
        if (!(t instanceof HTMLElement)) return;
        const sid = t.getAttribute('data-store-id');
        if (sid) location.href = `./chatpage.html?storeId=${encodeURIComponent(sid)}`;
      });
      return;
    }

    desc.innerHTML = `
      <div>
        <h3 style="margin:0 0 8px">무엇을 보고 싶나요?</h3>
        <p style="margin:0">메인에서 시장 또는 인기 매장을 클릭해 들어오면 여기에 표시됩니다.</p>
      </div>
    `;
  } catch (e) {
    desc.innerHTML = `
      <div style="color:#ffb4b4">
        <h3 style="margin:0 0 8px">로드 실패</h3>
        <p style="margin:0">${e.message}</p>
      </div>
    `;
  }
});
