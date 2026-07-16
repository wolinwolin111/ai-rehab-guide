/**
 * AI运动康复思路助手 — 前端交互逻辑
 */
let currentResult = null;
let principleExpanded = false;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initJointNav();
  initSearchInput();
});

// 部位导航
function initJointNav() {
  const joints = getSymptomsByJoint();
  const grid = document.getElementById('jointGrid');
  const emojis = { '膝关节':'🦵', '肩关节':'💪', '腰椎':'🔙', '颈椎':'🧣', '髋关节':'🦿', '踝关节':'🦶', '肘关节':'💪', '腕关节':'🤲', '其他':'📋' };
  for (const [joint, symptoms] of Object.entries(joints)) {
    const div = document.createElement('div');
    div.className = 'joint-item';
    div.innerHTML = `<span class="emoji">${emojis[joint]||'📋'}</span>${joint}`;
    div.onclick = () => {
      const symp = symptoms[0];
      document.getElementById('searchInput').value = symp;
      doSearch();
    };
    grid.appendChild(div);
  }
}

// 搜索输入
function initSearchInput() {
  const input = document.getElementById('searchInput');
  const sug = document.getElementById('suggestions');
  let activeIdx = -1;

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (q.length < 1) { sug.classList.remove('show'); return; }
    const results = searchSymptoms(q);
    if (results.length === 0) { sug.classList.remove('show'); return; }
    activeIdx = -1;
    sug.innerHTML = results.map((r,i) =>
      `<div class="item" data-idx="${i}" onmousedown="event.preventDefault();selectSuggestion('${r.name}')">${r.name}</div>`
    ).join('');
    sug.classList.add('show');
  });

  input.addEventListener('keydown', (e) => {
    const items = sug.querySelectorAll('.item');
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx+1, items.length-1); updateActive(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx-1, -1); updateActive(items); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && items[activeIdx]) {
        items[activeIdx].click();
      } else {
        doSearch();
      }
    }
    else if (e.key === 'Escape') { sug.classList.remove('show'); }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-section')) sug.classList.remove('show');
  });
}

function updateActive(items) {
  items.forEach((el,i) => el.classList.toggle('active', i === activeIdx));
}

function selectSuggestion(name) {
  document.getElementById('searchInput').value = name;
  document.getElementById('suggestions').classList.remove('show');
  doSearch();
}

function quickSearch(text) {
  document.getElementById('searchInput').value = text;
  doSearch();
}

// 主搜索
function doSearch() {
  const input = document.getElementById('searchInput').value.trim();
  if (!input) return;

  document.getElementById('suggestions').classList.remove('show');
  showLoading(true);

  // 模拟微小延迟让用户感知
  setTimeout(() => {
    const result = matchSymptom(input);
    showLoading(false);

    if (!result.found) {
      showEmpty(result.message);
      return;
    }

    currentResult = result;
    principleExpanded = false;
    renderResult();
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('resultSection').classList.add('show');
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

// 渲染结果
function renderResult() {
  const r = currentResult;
  const data = r.symptomData;
  const approach = getApproach(data, r.currentCauseIndex);
  if (!approach) return;

  document.getElementById('resultTitle').textContent = r.symptomName;
  document.getElementById('resultRelated').textContent = '关联关节：' + (r.related_joints||[]).join(' · ');

  // 问题区域
  document.getElementById('issueDesc').textContent = approach.explain;
  const lh = document.getElementById('likelihood');
  if (approach.likelihood === 'high') {
    lh.textContent = '🔴 高可能性';
    lh.className = 'likelihood-high';
  } else {
    lh.textContent = '🟡 中可能性';
    lh.className = 'likelihood-medium';
  }

  // 提示还有几种思路可切换
  const altInfo = document.getElementById('altInfo');
  if (r.totalCauses > 1) {
    altInfo.style.display = 'block';
    altInfo.textContent = `当前第 ${r.currentCauseIndex+1} 种思路，共 ${r.totalCauses} 种可能根源（点击"换一种思路"切换）`;
  } else {
    altInfo.style.display = 'none';
  }

  // 手法
  const manualList = document.getElementById('manualList');
  manualList.innerHTML = approach.manual_techniques.length === 0
    ? '<li style="color:var(--text-secondary)">暂无特定手法建议</li>'
    : approach.manual_techniques.map(m =>
      `<li><div class="m-name">${m.name}</div><div class="m-desc">${m.desc}</div></li>`
    ).join('');

  // 训练
  const trainingList = document.getElementById('trainingList');
  trainingList.innerHTML = approach.training.map((t,i) => `
    <div class="training-item">
      <div class="t-name">${i+1}. ${t.name}</div>
      <div class="t-meta">
        <span>📊 ${t.sets}</span>
        <span class="t-focus">🎯 ${t.focus}</span>
      </div>
      <div class="t-detail">${highlightKeyPoints(t.key_points)}</div>
      ${t.common_errors ? `<div class="t-errors">⚠️ 常见错误：${t.common_errors}</div>` : ''}
      <div class="t-progress">
        ${t.regression ? `<span class="t-regression">⬇️ 退阶：${t.regression}</span>` : ''}
        ${t.progression ? `<span class="t-progression">⬆️ 进阶：${t.progression}</span>` : ''}
      </div>
    </div>
  `).join('');

  // 禁忌
  const contraList = document.getElementById('contraList');
  contraList.innerHTML = approach.contraindications.map(c =>
    `<span class="contra-tag">🚫 ${c}</span>`
  ).join('');

  // 原理
  document.getElementById('principleDetail').textContent = approach.explain;
  document.getElementById('principleDetail').classList.remove('show');
  principleExpanded = false;
  document.getElementById('principleToggle').textContent = '展开 ▼';

  // 换思路按钮
  const btnSwitch = document.getElementById('btnSwitch');
  if (r.totalCauses > 1) {
    btnSwitch.style.display = '';
    btnSwitch.textContent = `🔄 换一种思路 (${r.currentCauseIndex+1}/${r.totalCauses})`;
  } else {
    btnSwitch.style.display = 'none';
  }
}

// 高亮【】内容
function highlightKeyPoints(text) {
  if (!text) return '';
  return text.replace(/【([^】]+)】/g, '<span class="highlight">【$1】</span>');
}

// 切换思路
function switchApproach() {
  if (!currentResult || currentResult.totalCauses <= 1) return;
  currentResult.currentCauseIndex = (currentResult.currentCauseIndex + 1) % currentResult.totalCauses;
  renderResult();
  document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`已切换到第 ${currentResult.currentCauseIndex+1} 种思路`);
}

// 展开原理
function togglePrinciple() {
  principleExpanded = !principleExpanded;
  const el = document.getElementById('principleDetail');
  const toggle = document.getElementById('principleToggle');
  if (principleExpanded) {
    el.classList.add('show');
    toggle.textContent = '收起 ▲';
  } else {
    el.classList.remove('show');
    toggle.textContent = '展开 ▼';
  }
}

// 回到顶部
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 显示加载
function showLoading(show) {
  document.getElementById('loading').classList.toggle('show', show);
}

// 显示空状态
function showEmpty(message) {
  const emptyState = document.getElementById('emptyState');
  emptyState.innerHTML = `
    <div class="emoji">🤔</div>
    <h3>未找到匹配的康复思路</h3>
    <p style="white-space:pre-line">${message}</p>
  `;
  emptyState.style.display = 'block';
  document.getElementById('resultSection').classList.remove('show');
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}
