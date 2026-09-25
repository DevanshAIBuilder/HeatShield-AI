/**
 * HeatShield AI — App State, Router & Controller
 * Manages all page transitions, state and cross-module coordination.
 */

// ── Global App State ─────────────────────────────────────────────────────────
const AppState = {
  currentPage: 'home',
  profile: null,
  vulnerabilityResult: null,
  heatwaveContext: null,
  aiPlan: null,
  safetyCardDataUrl: null,
  apiKey: localStorage.getItem('heatshield_api_key') || '',
  checklist: {}, // { checklistItemId: boolean }
};

const PAGES = ['home', 'profile', 'vulnerability', 'heatwave', 'ai-analysis', 'plan', 'card'];
const PAGE_LABELS = {
  home: 'Home',
  profile: 'Profile',
  vulnerability: 'Analysis',
  heatwave: 'Context',
  'ai-analysis': 'AI Plan',
  plan: 'Action Plan',
  card: 'Safety Card',
};

// ── Navigation ────────────────────────────────────────────────────────────────
function navigateTo(pageId) {
  PAGES.forEach((p) => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.classList.toggle('active', p === pageId);
  });
  AppState.currentPage = pageId;
  updateStepIndicator();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepIndicator() {
  const container = document.getElementById('step-indicator');
  if (!container) return;
  const currentIdx = PAGES.indexOf(AppState.currentPage);
  container.innerHTML = PAGES.map((p, i) => {
    let cls = 'step-dot';
    if (i < currentIdx) cls += ' done';
    else if (i === currentIdx) cls += ' active';
    return `<div class="${cls}" title="${PAGE_LABELS[p]}"><span class="step-num">${i + 1}</span><span class="step-label">${PAGE_LABELS[p]}</span></div>${i < PAGES.length - 1 ? '<div class="step-line' + (i < currentIdx ? ' done' : '') + '"></div>' : ''}`;
  }).join('');
}

// ── API Key Management ────────────────────────────────────────────────────────
function openSettings() {
  const modal = document.getElementById('settings-modal');
  if (modal) {
    modal.classList.add('open');
    const input = document.getElementById('api-key-input');
    if (input) input.value = AppState.apiKey;
  }
}

function closeSettings() {
  const modal = document.getElementById('settings-modal');
  if (modal) modal.classList.remove('open');
}

function saveSettings() {
  const input = document.getElementById('api-key-input');
  if (input) {
    AppState.apiKey = input.value.trim();
    localStorage.setItem('heatshield_api_key', AppState.apiKey);
    showToast(AppState.apiKey ? '✅ API key saved' : '⚠️ API key cleared — rule-based fallback will be used', AppState.apiKey ? 'success' : 'warning');
    closeSettings();
  }
}

// ── Vulnerability Analysis Page ───────────────────────────────────────────────
function renderVulnerabilityPage() {
  const result = AppState.vulnerabilityResult;
  const profile = AppState.profile;
  if (!result || !profile) return;

  const container = document.getElementById('vulnerability-content');
  if (!container) return;

  const factorRows = result.sortedFactors.map((f) => `
    <div class="factor-row severity-${f.severity}">
      <span class="factor-icon">${f.icon}</span>
      <div class="factor-info">
        <div class="factor-label">${f.label}</div>
        <div class="factor-desc">${f.description}</div>
      </div>
      <span class="factor-badge severity-badge-${f.severity}">+${f.points}</span>
    </div>
  `).join('');

  const notDetectedCount = result.allFactors.filter((f) => !f.detected).length;

  container.innerHTML = `
    <div class="vuln-header">
      <div class="risk-gauge-container">
        <div class="risk-gauge" style="--risk-color: ${result.riskColor}; --pct: ${result.percentage}">
          <svg viewBox="0 0 120 120" class="gauge-svg">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="${result.riskColor}" stroke-width="12"
              stroke-dasharray="${Math.round(314 * result.percentage / 100)} 314"
              stroke-dashoffset="78" stroke-linecap="round" class="gauge-arc"/>
          </svg>
          <div class="gauge-center">
            <div class="gauge-score">${result.score}</div>
            <div class="gauge-max">/ ${result.maxScore}</div>
          </div>
        </div>
        <div class="risk-level-badge" style="background:${result.riskBgColor}; border-color:${result.riskColor}; color:${result.riskColor}">
          ${result.riskEmoji} ${result.riskLevel} Risk
        </div>
        <p class="risk-description">${result.riskDescription}</p>
      </div>
    </div>

    ${result.detectedFactors.length > 0 ? `
    <div class="glass-card">
      <h3 class="section-title">⚠️ ${result.detectedFactors.length} Vulnerability Factor${result.detectedFactors.length > 1 ? 's' : ''} Detected</h3>
      <div class="factors-list">${factorRows}</div>
    </div>` : `
    <div class="glass-card success-card">
      <h3 class="section-title">✅ No Major Vulnerability Factors Detected</h3>
      <p class="text-muted">Your household profile shows low specific risk factors. Standard heatwave preparedness is recommended.</p>
    </div>`}

    <div class="vuln-summary-grid">
      <div class="summary-stat">
        <div class="stat-value text-critical">${result.criticalFactors.length}</div>
        <div class="stat-label">Critical Factors</div>
      </div>
      <div class="summary-stat">
        <div class="stat-value text-warning">${result.highFactors.length}</div>
        <div class="stat-label">High Factors</div>
      </div>
      <div class="summary-stat">
        <div class="stat-value text-success">${notDetectedCount}</div>
        <div class="stat-label">Factors Not Present</div>
      </div>
    </div>

    <div class="guidance-source-note">
      <span>📋</span>
      <div>
        <strong>Scoring methodology</strong> based on NDMA India and WHO heat vulnerability frameworks.
        <a href="https://ndma.gov.in/Natural-Hazard/Heat-Wave" target="_blank" rel="noopener">NDMA Heat Wave Guidelines ↗</a>
      </div>
    </div>

    <div class="page-actions">
      <button class="btn btn-secondary" onclick="navigateTo('profile')">← Edit Profile</button>
      <button class="btn btn-primary" onclick="goToHeatwave()">View Heatwave Context →</button>
    </div>
  `;
}

// ── Heatwave Context Page ─────────────────────────────────────────────────────
function renderHeatwavePage() {
  const ctx = AppState.heatwaveContext;
  if (!ctx) return;
  const container = document.getElementById('heatwave-content');
  if (!container) return;

  const heatIndexInfo = getHeatIndexLabel(ctx.heatIndex);
  const cities = getAvailableCities();

  container.innerHTML = `
    <div class="demo-badge">
      🧪 Demo Data &nbsp;—&nbsp; Seeded for hackathon demonstration.
      In production this connects to live IMD / OpenMeteo API.
    </div>

    <div class="alert-banner" style="background:${ctx.alertMeta.bgColor}; border-color:${ctx.alertMeta.color}">
      <div class="alert-icon">${ctx.alertMeta.icon}</div>
      <div class="alert-body">
        <div class="alert-level" style="color:${ctx.alertMeta.color}">${ctx.alertMeta.label}</div>
        <div class="alert-city">${ctx.city}, ${ctx.state}</div>
        <p class="alert-advisory">${ctx.advisoryText}</p>
      </div>
    </div>

    <div class="weather-stats-grid">
      <div class="weather-stat glass-card">
        <div class="weather-icon">🌡️</div>
        <div class="weather-val">${ctx.maxTempC}°C</div>
        <div class="weather-lbl">Max Temperature</div>
      </div>
      <div class="weather-stat glass-card">
        <div class="weather-icon">🔥</div>
        <div class="weather-val" style="color:${heatIndexInfo.color}">${ctx.heatIndex}°C</div>
        <div class="weather-lbl">Heat Index<br><small>${heatIndexInfo.label}</small></div>
      </div>
      <div class="weather-stat glass-card">
        <div class="weather-icon">💧</div>
        <div class="weather-val">${ctx.humidity}%</div>
        <div class="weather-lbl">Humidity</div>
      </div>
      <div class="weather-stat glass-card">
        <div class="weather-icon">🌙</div>
        <div class="weather-val">${ctx.minTempC}°C</div>
        <div class="weather-lbl">Min Temperature</div>
      </div>
    </div>

    <div class="glass-card city-switch-card">
      <h3 class="section-title">🗺️ Available Demo Cities</h3>
      <p class="text-muted" style="margin-bottom:12px">Click a city to load its seeded heatwave data.</p>
      <div class="city-chips">
        ${cities.map((c) => `
          <button class="city-chip ${c === ctx.city ? 'active' : ''}" onclick="switchCity('${c}')">${c}</button>
        `).join('')}
      </div>
    </div>

    <div class="glass-card">
      <h3 class="section-title">📡 Data Sources</h3>
      <div class="source-links">
        <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener" class="source-link">
          🌐 IMD — India Meteorological Department ↗
        </a>
        <a href="https://ndma.gov.in/Natural-Hazard/Heat-Wave" target="_blank" rel="noopener" class="source-link">
          🛡️ NDMA — Heat Wave Guidelines ↗
        </a>
        <a href="https://open-meteo.com" target="_blank" rel="noopener" class="source-link">
          📊 OpenMeteo (Production API hook) ↗
        </a>
      </div>
      <p class="text-muted" style="margin-top:12px; font-size:0.8rem">${ctx.demoNote} • Station: ${ctx.imdStation}</p>
    </div>

    <div class="page-actions">
      <button class="btn btn-secondary" onclick="navigateTo('vulnerability')">← Risk Analysis</button>
      <button class="btn btn-primary" onclick="startAIAnalysis()">Generate AI Plan →</button>
    </div>
  `;
}

function switchCity(city) {
  if (!AppState.profile) return;
  AppState.profile.city = city;
  AppState.heatwaveContext = getHeatwaveContext(city);
  renderHeatwavePage();
}

// ── AI Analysis Page ──────────────────────────────────────────────────────────
async function startAIAnalysis() {
  navigateTo('ai-analysis');
  const container = document.getElementById('ai-content');
  if (!container) return;

  const hasKey = !!AppState.apiKey;
  container.innerHTML = `
    <div class="ai-loading">
      <div class="ai-spinner"></div>
      <h3>${hasKey ? '🤖 Calling Google Gemini AI…' : '⚙️ Generating Rule-Based Plan…'}</h3>
      <p class="text-muted">${hasKey
        ? 'Gemini is analysing your household vulnerability profile and heatwave context to generate a personalised preparedness plan.'
        : 'No API key provided — generating a comprehensive rule-based preparedness plan using NDMA guidelines.'}</p>
      ${!hasKey ? `<div class="api-hint">
        <span>💡</span>
        <span>Add a free Gemini API key in <strong>Settings</strong> (⚙️ top-right) for AI-powered personalisation.</span>
      </div>` : ''}
    </div>
  `;

  const result = await generateAIPlan(
    AppState.apiKey,
    AppState.profile,
    AppState.vulnerabilityResult,
    AppState.heatwaveContext
  );

  AppState.aiPlan = result.plan;

  if (!result.success && result.error) {
    showToast(`⚠️ Gemini API error: ${result.error} — rule-based plan used instead.`, 'warning');
  }

  renderAIResultPage(result);
}

function renderAIResultPage(result) {
  const plan = result.plan;
  const container = document.getElementById('ai-content');
  if (!container) return;

  const riskRows = (plan.priorityRisks || []).map((r, i) => {
    const urgColors = { critical: '#ef4444', high: '#f97316', medium: '#eab308', default: '#94a3b8' };
    const color = urgColors[r.urgency] || urgColors.default;
    return `
      <div class="risk-row glass-card" style="border-left: 3px solid ${color}">
        <div class="risk-rank" style="color:${color}">#${r.rank || i+1}</div>
        <div class="risk-body">
          <div class="risk-title">${r.risk}</div>
          <div class="risk-reason text-muted">${r.reason}</div>
        </div>
        <span class="urgency-badge" style="background:${color}20; color:${color}">${r.urgency || 'high'}</span>
      </div>`;
  }).join('');

  const aiLabel = result.usedFallback
    ? `<div class="ai-badge fallback-badge">⚙️ Rule-Based Engine — ${plan.generatedBy}</div>`
    : `<div class="ai-badge gemini-badge">🤖 Powered by Google Gemini</div>`;

  container.innerHTML = `
    ${aiLabel}
    <div class="ai-disclaimer glass-card">
      <span>ℹ️</span>
      <p>${plan.aiDisclaimer || 'All recommendations are AI-generated preparedness guidance. Not medical advice.'}</p>
    </div>

    <div class="glass-card">
      <h3 class="section-title">🎯 Top Priority Risks for Your Household</h3>
      <div class="risk-list">${riskRows}</div>
    </div>

    <div class="page-actions">
      <button class="btn btn-secondary" onclick="navigateTo('heatwave')">← Heatwave Context</button>
      <button class="btn btn-primary" onclick="renderAndGoToPlan()">View Full Action Plan →</button>
    </div>
  `;
}

// ── Preparedness Plan Page ────────────────────────────────────────────────────
function renderAndGoToPlan() {
  navigateTo('plan');
  renderPlanPage();
}

function renderPlanPage() {
  const plan = AppState.aiPlan;
  const profile = AppState.profile;
  const result = AppState.vulnerabilityResult;
  if (!plan || !profile) return;

  const container = document.getElementById('plan-content');
  if (!container) return;

  function actionList(actions, phase) {
    return (actions || []).map((a, i) => `
      <div class="action-item">
        <span class="action-num">${i + 1}</span>
        <span class="action-text">${a}</span>
      </div>
    `).join('');
  }

  function checklistSection(title, items, phaseKey) {
    return `
      <div class="checklist-group glass-card">
        <h4 class="checklist-title">${title}</h4>
        ${(items || []).map((item) => `
          <label class="checklist-item" for="${item.id}">
            <input type="checkbox" id="${item.id}" class="chk-input"
              ${AppState.checklist[item.id] ? 'checked' : ''}
              onchange="toggleCheck('${item.id}', this.checked)">
            <span class="chk-box"></span>
            <span class="chk-text">${item.text}</span>
          </label>
        `).join('')}
      </div>`;
  }

  const specialGuidance = plan.specialGuidance || {};
  const specialCards = Object.entries(specialGuidance)
    .filter(([k, v]) => v)
    .map(([k, v]) => {
      const icons = { elderly:'👴', children:'👧', pregnant:'🤰', outdoorWorkers:'👷', chronicIllness:'🏥' };
      const labels = { elderly:'Elderly Members', children:'Children', pregnant:'Pregnant Members', outdoorWorkers:'Outdoor Workers', chronicIllness:'Chronic Illness' };
      return `
        <div class="special-card glass-card">
          <div class="special-header">${icons[k] || '⚡'} ${labels[k] || k}</div>
          <p class="special-text">${v}</p>
        </div>`;
    }).join('');

  const totalItems = Object.keys(CHECKLIST_ITEMS.immediate).length +
    Object.keys(CHECKLIST_ITEMS.beforeHeatwave).length +
    Object.keys(CHECKLIST_ITEMS.duringHeatwave).length;
  const checkedCount = Object.values(AppState.checklist).filter(Boolean).length;

  container.innerHTML = `
    <div class="plan-header glass-card">
      <div class="plan-household">${profile.householdName || 'My Household'}</div>
      <div class="plan-meta text-muted">${profile.city || ''} • ${result.riskLevel} Risk • ${result.detectedFactors.length} factors detected</div>
      <div class="checklist-progress">
        <div class="progress-label">Checklist: <strong>${checkedCount}/${totalItems}</strong> completed</div>
        <div class="progress-bar-outer"><div class="progress-bar-inner" id="plan-progress-bar" style="width:${Math.round((checkedCount/totalItems)*100)}%"></div></div>
      </div>
    </div>

    <div class="plan-tabs" id="plan-tabs">
      <button class="plan-tab active" data-tab="actions" onclick="switchPlanTab('actions', this)">📋 Actions</button>
      <button class="plan-tab" data-tab="checklist" onclick="switchPlanTab('checklist', this)">✅ Checklist</button>
      ${specialCards ? '<button class="plan-tab" data-tab="special" onclick="switchPlanTab(\'special\', this)">⚡ Vulnerable Groups</button>' : ''}
    </div>

    <div id="plan-tab-actions" class="plan-tab-content">
      <div class="action-phase glass-card">
        <h3 class="phase-title immediate-phase">⚡ Immediate Actions (Next 24 Hours)</h3>
        ${actionList(plan.immediateActions, 'immediate')}
      </div>
      <div class="action-phase glass-card">
        <h3 class="phase-title before-phase">📅 Before Heatwave</h3>
        ${actionList(plan.beforeHeatwaveActions, 'before')}
      </div>
      <div class="action-phase glass-card">
        <h3 class="phase-title during-phase">🌡️ During Heatwave</h3>
        ${actionList(plan.duringHeatwaveActions, 'during')}
      </div>
    </div>

    <div id="plan-tab-checklist" class="plan-tab-content hidden">
      ${checklistSection('⚡ Immediate (Do Today)', CHECKLIST_ITEMS.immediate, 'immediate')}
      ${checklistSection('📅 Before Heatwave', CHECKLIST_ITEMS.beforeHeatwave, 'before')}
      ${checklistSection('🌡️ During Heatwave', CHECKLIST_ITEMS.duringHeatwave, 'during')}
    </div>

    ${specialCards ? `
    <div id="plan-tab-special" class="plan-tab-content hidden">
      <div class="special-grid">${specialCards}</div>
    </div>` : ''}

    <div class="guidance-source-note">
      <span>📋</span>
      <div>
        Public guidance sources:
        <a href="https://ndma.gov.in/Natural-Hazard/Heat-Wave" target="_blank" rel="noopener">NDMA Heat Wave Guidelines</a> •
        <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener">IMD Heat Advisories</a>
      </div>
    </div>

    <div class="page-actions">
      <button class="btn btn-secondary" onclick="navigateTo('ai-analysis')">← AI Analysis</button>
      <button class="btn btn-primary" onclick="goToCard()">Generate Safety Card →</button>
    </div>
  `;
}

function switchPlanTab(tab, btn) {
  document.querySelectorAll('.plan-tab-content').forEach((el) => el.classList.add('hidden'));
  document.querySelectorAll('.plan-tab').forEach((el) => el.classList.remove('active'));
  const content = document.getElementById(`plan-tab-${tab}`);
  if (content) content.classList.remove('hidden');
  if (btn) btn.classList.add('active');
}

function toggleCheck(id, checked) {
  AppState.checklist[id] = checked;
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const totalItems = CHECKLIST_ITEMS.immediate.length + CHECKLIST_ITEMS.beforeHeatwave.length + CHECKLIST_ITEMS.duringHeatwave.length;
  const checkedCount = Object.values(AppState.checklist).filter(Boolean).length;
  const bar = document.getElementById('plan-progress-bar');
  if (bar) bar.style.width = `${Math.round((checkedCount / totalItems) * 100)}%`;
  const label = document.querySelector('.progress-label');
  if (label) label.innerHTML = `Checklist: <strong>${checkedCount}/${totalItems}</strong> completed`;
}

// ── Safety Card Page ──────────────────────────────────────────────────────────
function goToCard() {
  navigateTo('card');
  renderCardPage();
}

function renderCardPage() {
  const container = document.getElementById('card-content');
  if (!container) return;

  const dataUrl = generateSafetyCard(
    AppState.profile,
    AppState.vulnerabilityResult,
    AppState.heatwaveContext,
    AppState.aiPlan
  );
  AppState.safetyCardDataUrl = dataUrl;

  container.innerHTML = `
    <div class="card-preview-wrapper">
      <img src="${dataUrl}" alt="HeatShield AI Safety Card" class="card-preview-img" id="safety-card-preview">
    </div>
    <div class="card-actions glass-card">
      <h3 class="section-title">📤 Share Your Safety Card</h3>
      <p class="text-muted">Download and share this card with your family and neighbours.</p>
      <div class="card-btn-group">
        <button class="btn btn-primary" id="download-card-btn" onclick="handleDownloadCard()">
          ⬇️ Download PNG
        </button>
        <button class="btn btn-secondary" onclick="handleShareCard()">
          📱 Share
        </button>
        <button class="btn btn-secondary" onclick="startOver()">
          🔄 New Profile
        </button>
      </div>
    </div>

    <div class="page-actions" style="margin-top:8px">
      <button class="btn btn-secondary" onclick="navigateTo('plan')">← Action Plan</button>
    </div>
  `;
}

function handleDownloadCard() {
  downloadSafetyCard(
    AppState.profile,
    AppState.vulnerabilityResult,
    AppState.heatwaveContext,
    AppState.aiPlan
  );
  showToast('✅ Safety card downloaded!', 'success');
}

async function handleShareCard() {
  if (navigator.share && AppState.safetyCardDataUrl) {
    try {
      const blob = await fetch(AppState.safetyCardDataUrl).then((r) => r.blob());
      const file = new File([blob], 'heatshield-safety-card.png', { type: 'image/png' });
      await navigator.share({ title: 'HeatShield AI Safety Card', files: [file] });
    } catch (e) {
      showToast('Share cancelled or not supported. Use Download instead.', 'info');
    }
  } else {
    showToast('📋 Share not supported on this browser. Use Download instead.', 'info');
  }
}

function startOver() {
  AppState.profile = null;
  AppState.vulnerabilityResult = null;
  AppState.heatwaveContext = null;
  AppState.aiPlan = null;
  AppState.safetyCardDataUrl = null;
  AppState.checklist = {};
  navigateTo('home');
}

// ── Page Flow Helpers ─────────────────────────────────────────────────────────
function goToHeatwave() {
  const city = AppState.profile?.city;
  AppState.heatwaveContext = getHeatwaveContext(city);
  navigateTo('heatwave');
  renderHeatwavePage();
}

// ── Toast Notifications ───────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Settings button
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) settingsBtn.addEventListener('click', openSettings);

  // Close modal on backdrop click
  const modal = document.getElementById('settings-modal');
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeSettings(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettings();
  });

  updateStepIndicator();
  console.log('🔥 HeatShield AI initialised');
  console.log('API key status:', AppState.apiKey ? 'Present' : 'Not set (using fallback)');
});
