(function(){
  window.addEventListener('error', e => { e.preventDefault(); });
  window.addEventListener('unhandledrejection', e => { e.preventDefault(); });
  window.onerror = function(){ return true; };
})();

function goToPage() {
  window.location.href = "../index.html";
}

const API_BASE = "/api";

function qs(name) {
  const v = new URLSearchParams(location.search).get(name);
  return v ?? null;
}

async function api(url, opts) {
  const res = await fetch(url, { cache: "no-store", ...opts }).catch(() => ({ ok:false, status:0, text:async()=>"" }));
  const ct = (res && res.headers && res.headers.get && res.headers.get("content-type")) || "";
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`${res.status} ${t ? " - " + t : ""}`);
  }
  if (res.status === 204) return null;
  if (ct.includes("application/json")) return res.json().catch(() => ({}));
  const text = await res.text().catch(() => "");
  return text || null;
}

const getMarketDetail = (id) => api(`${API_BASE}/markets/${encodeURIComponent(id)}`);
const getStoresByMarket = (id) => api(`${API_BASE}/stores?marketId=${encodeURIComponent(id)}`);
const getStoreDetail = (id) => api(`${API_BASE}/stores/${encodeURIComponent(id)}`);

async function recommendBestEffort(store) {
  const shopId = Number(store.id);
  const reason = window.__lastRecoReason || "";
  try {
    const r = await fetch(`${API_BASE}/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopId, reason })
    }).catch(()=>null);
    if (r && r.ok) return;
  } catch(_) {}
  try {
    const kw = encodeURIComponent(String(store.name || "").trim());
    if (kw) {
      await fetch(`${API_BASE}/stores/search?keyword=${kw}`).catch(()=>{});
      await fetch(`${API_BASE}/stores/search?keyword=${kw}`).catch(()=>{});
      await fetch(`${API_BASE}/stores/search?keyword=${kw}`).catch(()=>{});
    }
  } catch(_) {}
}

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
                <li style="border:1px solid #2a2a2a;border-radius:12px;padding:12px;cursor:default">
                  <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
                    <div>
                      <strong>${s.name}</strong> <small style="opacity:.8">${s.category || "-"}</small>
                      <div style="margin-top:4px">${s.description || ""}</div>
                    </div>
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

function showReasonModal() {
  return new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.className = "reco-backdrop";
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
    const input = backdrop.querySelector("textarea");
    input.focus();
    function close(action, payload) {
      try { window.__lastRecoReason = payload || ""; } catch(_){}
      backdrop.remove();
      resolve({ action, reason: payload || "" });
    }
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close("close"); });
    backdrop.querySelector(".reco-close").addEventListener("click", () => close("close"));
    backdrop.querySelector("[data-skip]").addEventListener("click", () => close("close"));
    backdrop.querySelector("[data-submit]").addEventListener("click", () => close("submit", input.value.trim()));
    input.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") close("submit", input.value.trim());
      if (e.key === "Escape") close("close");
    });
    function onEsc(e){ if (e.key === "Escape") { window.removeEventListener("keydown", onEsc); close("close"); } }
    window.addEventListener("keydown", onEsc);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const closeEl = document.querySelector(".close-icon");
  if (closeEl) {
    closeEl.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = "../index.html";
    });
  }

  const desc = document.querySelector(".desc-section");
  if (!desc) return;

  const urlMarketId = qs("marketId");
  const urlStoreId = qs("storeId");
  let marketId = null;
  let storeId = null;

  if (urlStoreId) storeId = urlStoreId;
  else if (urlMarketId) marketId = urlMarketId;
  else {
    try {
      storeId = localStorage.getItem("selectedStoreId");
      marketId = storeId ? null : localStorage.getItem("selectedMarketId");
    } catch(_) {}
  }

  try {
    if (storeId) {
      const data = await getStoreDetail(storeId);
      renderStore(desc, data);
      desc.addEventListener("click", async (e) => {
        const t = e.target;
        if (!(t instanceof HTMLElement)) return;
        if (t.id === "recoBtn") {
          e.preventDefault(); e.stopPropagation();
          const { action, reason } = await showReasonModal();
          if (action === "submit") {
            await recommendBestEffort(data);
          }
        }
        if (t.id === "backBtn") {
          e.preventDefault(); e.stopPropagation();
          history.length > 1 ? history.back() : (location.href = "../index.html");
        }
      });
      return;
    }

    if (marketId) {
      const market = await getMarketDetail(marketId);
      const stores = await getStoresByMarket(marketId);
      renderMarket(desc, market, stores);
      return;
    }

    desc.innerHTML = `
      <div>
        <h3 style="margin:0 0 8px">무엇을 보고 싶나요?</h3>
        <p style="margin:0">메인에서 시장 또는 인기 매장을 클릭해 들어오면 여기에 표시됩니다.</p>
      </div>
    `;
  } catch (_) {
    desc.innerHTML = `
      <div style="color:#ffb4b4">
        <h3 style="margin:0 0 8px">로드 실패</h3>
        <p style="margin:0">잠시 후 다시 시도해 주세요.</p>
      </div>
    `;
  }
});
