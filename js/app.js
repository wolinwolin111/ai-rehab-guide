/**
 * AI运动康复思路助手 — 前端交互逻辑 v2
 * 新增：分步筛选面板 + 多维加权匹配
 */
let currentResult = null;
let principleExpanded = false;
let filterState = { region: null, subRegion: null, painType: null, trigger: null };

// 子区域数据
const SUB_REGIONS = {
  '膝关节': ['前侧（髌骨周围）','内侧','外侧','后侧（腘窝）','全膝'],
  '肩关节': ['前侧','外侧','后侧','上方（肩锁关节）','深层'],
  '腰椎': ['正中','左侧','右侧','骶髂区'],
  '颈椎': ['后侧','左侧','右侧','前侧','肩胛间区'],
  '髋关节': ['前侧（腹股沟）','外侧（大转子）','后侧（臀部深层）','内侧'],
  '踝关节': ['外侧','内侧','前侧','后侧（跟腱）','足底'],
  '肘关节': ['外侧（网球肘）','内侧（高尔夫球肘）','后侧','前侧'],
  '腕关节': ['掌侧','背侧','桡侧（拇指侧）','尺侧（小指侧）'],
  '其他': ['足底','小腿','大腿后侧','大腿前侧']
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initJointNav();
  initSearchInput();
});

// ========== 搜索相关 ==========
function initJointNav() {
  const joints = getSymptomsByJoint();
  const grid = document.getElementById('jointGrid');
  const emojis = { '膝关节':'🦵', '肩关节':'💪', '腰椎':'🔙', '颈椎':'🧣', '髋关节':'🦿', '踝关节':'🦶', '肘关节':'💪', '腕关节':'🤲', '其他':'📋' };
  grid.innerHTML = '';
  for (const [joint, symptoms] of Object.entries(joints)) {
    const div = document.createElement('div');
    div.className = 'joint-item';
    div.innerHTML = `<span class="emoji">${emojis[joint]||'📋'}</span>${joint}`;
    div.onclick = () => {
      document.getElementById('searchInput').value = symptoms[0];
      doSearch();
    };
    grid.appendChild(div);
  }
}

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
      if (activeIdx >= 0 && items[activeIdx]) items[activeIdx].click();
      else doSearch();
    }
    else if (e.key === 'Escape') sug.classList.remove('show');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-section')) sug.classList.remove('show');
  });
}

function updateActive(items) { items.forEach((el,i) => el.classList.toggle('active', i === activeIdx)); }
function selectSuggestion(name) { document.getElementById('searchInput').value = name; document.getElementById('suggestions').classList.remove('show'); doSearch(); }
function quickSearch(text) { document.getElementById('searchInput').value = text; doSearch(); }

// ========== 精准筛选面板 ==========
function togglePrecisionPanel() {
  const panel = document.getElementById('precisionPanel');
  const btn = document.getElementById('btnPrecision');
  panel.classList.toggle('show');
  btn.textContent = panel.classList.contains('show') ? '🎯 收起精准分析' : '🎯 精准分析：分步问诊（30秒）';
  if (panel.classList.contains('show')) {
    // 如果有文字输入，自动填充区域
    const inputText = document.getElementById('searchInput').value.trim();
    if (inputText && !filterState.region) {
      const r = matchSymptom(inputText);
      if (r.found && r.related_joints) {
        // 自动高亮相关区域
        highlightRelatedRegions(r.related_joints[0]);
      }
    }
  }
}

function highlightRelatedRegions(joint) {
  const items = document.querySelectorAll('.region-item');
  items.forEach(item => {
    if (item.dataset.region === joint) {
      item.style.borderColor = 'var(--warning)';
      item.style.background = 'var(--warning-light)';
    }
  });
}

// Step1: 区域选择
function selectRegion(region, el) {
  document.querySelectorAll('.region-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  filterState.region = region;
  filterState.subRegion = null;

  // 显示子区域
  const subGrid = document.getElementById('subRegionGrid');
  const subs = SUB_REGIONS[region] || [];
  if (subs.length > 0) {
    subGrid.innerHTML = subs.map(s =>
      `<div class="sub-region-item" data-sub="${s}" onclick="selectSubRegion('${s}',this)">${s}</div>`
    ).join('');
    subGrid.style.display = 'grid';
  } else {
    subGrid.style.display = 'none';
  }
  updateFilterSummary();
}

function selectSubRegion(sub, el) {
  document.querySelectorAll('.sub-region-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  filterState.subRegion = sub;
  updateFilterSummary();
}

// Step2: 疼痛性质
function selectPainType(pain, el) {
  document.querySelectorAll('.pain-card').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  filterState.painType = pain;
  updateFilterSummary();
}

// Step3: 诱发条件
function selectTrigger(trigger, el) {
  el.classList.toggle('selected');
  filterState.trigger = el.classList.contains('selected') ? trigger : null;
  updateFilterSummary();
}

function clearFilters() {
  filterState = { region: null, subRegion: null, painType: null, trigger: null };
  document.querySelectorAll('.region-item,.sub-region-item,.pain-card,.trigger-item,.p-step')
    .forEach(i => i.classList.remove('selected','active'));
  document.getElementById('subRegionGrid').style.display = 'none';
  document.getElementById('filterSummary').textContent = '';
  // 重置步骤指示器
  document.querySelectorAll('.p-step').forEach((s,i) => s.classList.toggle('active', i===0));
  document.querySelectorAll('.p-step-body').forEach((s,i) => s.classList.toggle('active', i===0));
}

function updateFilterSummary() {
  const parts = [];
  if (filterState.region) parts.push('📍' + filterState.region + (filterState.subRegion ? '·' + filterState.subRegion : ''));
  if (filterState.painType) parts.push('🔵' + filterState.painType);
  if (filterState.trigger) parts.push('🎯' + filterState.trigger);
  document.getElementById('filterSummary').textContent = parts.join('  ');
}

// ========== 搜索执行 ==========
function doSearch() {
  const input = document.getElementById('searchInput').value.trim();
  if (!input && !filterState.region) return;
  document.getElementById('suggestions').classList.remove('show');
  showLoading(true);

  // 构建筛选文本
  let query = input;
  let filters = { ...filterState };

  // 如果有筛选条件但无文本输入，用筛选条件构建查询
  if (!query && filters.region) {
    query = filters.region + (filters.subRegion ? filters.subRegion : '') + '痛';
    if (filters.trigger) query = filters.trigger + '时' + query;
  }

  setTimeout(() => {
    let result = matchSymptom(query);

    // 多维筛选加持：如果匹配到了，用筛选条件再精调
    if (result.found && (filters.region || filters.painType || filters.trigger)) {
      result = applyPrecisionFilter(result, filters);
    }

    showLoading(false);
    if (!result || !result.found) {
      showEmpty('未找到匹配的康复思路。请尝试调整筛选条件或输入更详细的描述。');
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

function doSearchWithFilters() {
  document.getElementById('searchInput').value = '';
  doSearch();
}

// 应用筛选条件进一步精调匹配结果
function applyPrecisionFilter(result, filters) {
  if (!result || !result.found) return result;

  // 如果指定了区域，确保结果中的关联关节匹配
  if (filters.region && result.symptomData) {
    const joints = result.symptomData.related_joints || [];
    // 尝试在区域内找到更精确的症状
    const allSymptoms = getSymptomsByJoint();
    const regionSymptoms = allSymptoms[filters.region] || [];
    if (regionSymptoms.length > 0) {
      // 在区域症状中找到与当前结果最匹配的
      let bestName = result.symptomName;
      let bestData = result.symptomData;
      let inRegion = regionSymptoms.includes(bestName);

      if (!inRegion) {
        // 找区域中最相关的
        for (const sname of regionSymptoms) {
          if (SYMPTOM_DB[sname]) {
            // 根据疼痛性质和诱发条件进一步筛选
            if (filters.painType) {
              const issue = SYMPTOM_DB[sname].root_causes[0].explain || '';
              if (filters.painType === '刺痛/锐痛' && !issue.includes('神经')) continue;
              if (filters.painType === '钝痛/酸痛' && (issue.includes('神经') || issue.includes('麻'))) continue;
            }
            bestName = sname;
            bestData = SYMPTOM_DB[sname];
            break;
          }
        }
        result.symptomName = bestName;
        result.symptomData = bestData;
        result.related_joints = bestData.related_joints;
        result.totalCauses = bestData.root_causes.length;
        result.currentCauseIndex = 0;
      } else {
        // 在区域内，但可能根据疼痛性质重排根源
        if (filters.painType && result.symptomData.root_causes.length > 1) {
          const causes = result.symptomData.root_causes;
          if (filters.painType === '刺痛/锐痛' || filters.painType === '麻木感') {
            // 优先神经相关根源
            const neuroIdx = causes.findIndex(c => c.explain.includes('神经'));
            if (neuroIdx >= 0) result.currentCauseIndex = neuroIdx;
          }
        }
      }
    }
  }
  return result;
}

// ========== 结果渲染 ==========
function renderResult() {
  const r = currentResult;
  const data = r.symptomData;
  const approach = getApproach(data, r.currentCauseIndex);
  if (!approach) return;

  document.getElementById('resultTitle').textContent = r.symptomName
    + (filterState.region ? ' [' + filterState.region + (filterState.subRegion?'·'+filterState.subRegion:'') + ']' : '');
  document.getElementById('resultRelated').textContent = '关联关节：' + (r.related_joints||[]).join(' · ');

  document.getElementById('issueDesc').textContent = approach.explain;
  const lh = document.getElementById('likelihood');
  if (approach.likelihood === 'high') { lh.textContent = '🔴 高可能性'; lh.className = 'likelihood-high'; }
  else { lh.textContent = '🟡 中可能性'; lh.className = 'likelihood-medium'; }

  const altInfo = document.getElementById('altInfo');
  if (r.totalCauses > 1) {
    altInfo.style.display = 'block';
    altInfo.textContent = `当前第 ${r.currentCauseIndex+1} 种思路，共 ${r.totalCauses} 种可能根源（点击"换一种思路"切换）`;
  } else { altInfo.style.display = 'none'; }

  document.getElementById('manualList').innerHTML = approach.manual_techniques.length === 0
    ? '<li style="color:var(--text-secondary)">暂无特定手法建议</li>'
    : approach.manual_techniques.map(m =>
      `<li><div class="m-name">${m.name}</div><div class="m-desc">${m.desc}</div></li>`).join('');

  document.getElementById('trainingList').innerHTML = approach.training.map((t,i) => `
    <div class="training-item">
      <div class="t-name">${i+1}. ${t.name}</div>
      <div class="t-meta"><span>📊 ${t.sets}</span><span class="t-focus">🎯 ${t.focus}</span></div>
      <div class="t-detail">${highlightKeyPoints(t.key_points)}</div>
      ${t.common_errors ? `<div class="t-errors">⚠️ 常见错误：${t.common_errors}</div>` : ''}
      <div class="t-progress">
        ${t.regression ? `<span class="t-regression">⬇️ 退阶：${t.regression}</span>` : ''}
        ${t.progression ? `<span class="t-progression">⬆️ 进阶：${t.progression}</span>` : ''}
      </div>
    </div>`).join('');

  document.getElementById('contraList').innerHTML = approach.contraindications.map(c =>
    `<span class="contra-tag">🚫 ${c}</span>`).join('');

  document.getElementById('principleDetail').textContent = approach.explain;
  document.getElementById('principleDetail').classList.remove('show');
  principleExpanded = false;
  document.getElementById('principleToggle').textContent = '展开 ▼';

  const btnSwitch = document.getElementById('btnSwitch');
  if (r.totalCauses > 1) {
    btnSwitch.style.display = '';
    btnSwitch.textContent = `🔄 换一种思路 (${r.currentCauseIndex+1}/${r.totalCauses})`;
  } else { btnSwitch.style.display = 'none'; }
}

function highlightKeyPoints(text) {
  if (!text) return '';
  return text.replace(/【([^】]+)】/g, '<span class="highlight">【$1】</span>');
}

function switchApproach() {
  if (!currentResult || currentResult.totalCauses <= 1) return;
  currentResult.currentCauseIndex = (currentResult.currentCauseIndex + 1) % currentResult.totalCauses;
  renderResult();
  document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`已切换到第 ${currentResult.currentCauseIndex+1} 种思路`);
}

function togglePrinciple() {
  principleExpanded = !principleExpanded;
  const el = document.getElementById('principleDetail');
  const toggle = document.getElementById('principleToggle');
  el.classList.toggle('show', principleExpanded);
  toggle.textContent = principleExpanded ? '收起 ▲' : '展开 ▼';
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function showLoading(show) { document.getElementById('loading').classList.toggle('show', show); }

function showEmpty(message) {
  const es = document.getElementById('emptyState');
  es.innerHTML = `<div class="emoji">🤔</div><h3>未找到匹配的康复思路</h3><p style="white-space:pre-line">${message}</p>`;
  es.style.display = 'block';
  document.getElementById('resultSection').classList.remove('show');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}
