/**
 * HeatShield AI — Household Profile Form Logic
 */

const AVAILABLE_CITIES = ['Delhi', 'Mumbai', 'Ahmedabad', 'Nagpur', 'Jaipur', 'Lucknow', 'Kolkata', 'Bhopal', 'Hyderabad', 'Chennai'];

function initProfileForm() {
  const form = document.getElementById('profile-form');
  if (!form) return;

  // Populate city suggestions once.
  const cityList = document.getElementById('city-datalist');
  if (cityList && cityList.children.length === 0) {
    AVAILABLE_CITIES.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      cityList.appendChild(opt);
    });
  }

  // If we have existing profile data, pre-fill the form
  if (AppState.profile) {
    populateForm(AppState.profile);
    renderProfileSavedState();
  }

  if (form.dataset.initialized === 'true') return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleProfileSubmit();
  });

  // Dynamic validation feedback
  form.querySelectorAll('input, select').forEach((el) => {
    el.addEventListener('change', () => clearError(el.id));
  });
  form.dataset.initialized = 'true';
}

function renderProfileSavedState() {
  const status = document.getElementById('profile-saved-status');
  const reset = document.getElementById('reset-profile-btn');
  if (status && AppState.profile) {
    status.classList.remove('hidden');
    status.textContent = '✓ Household profile saved · Welcome back — your saved household profile has been loaded.';
  }
  if (reset) reset.classList.remove('hidden');
}

function editProfile() {
  navigateTo('profile');
  initProfileForm();
  renderProfileSavedState();
}

function populateForm(profile) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = !!val;
    else el.value = val ?? '';
  };
  setVal('field-household-name', profile.householdName);
  setVal('field-city', profile.city);
  setVal('field-state', profile.state);
  setVal('field-total', profile.totalMembers);
  setVal('field-elderly', profile.elderlyCount);
  setVal('field-children', profile.childrenCount);
  setVal('field-pregnant', profile.pregnantCount);
  setVal('field-outdoor', profile.outdoorWorkers);
  setVal('field-chronic', profile.chronicIllness);
  setVal('field-housing', profile.housingType);
  setVal('field-ventilation', profile.ventilation);
  setVal('field-ac', profile.hasAC);
  setVal('field-fan', profile.hasFanCooler);
  setVal('field-water', profile.waterAvailability);
  setVal('field-power', profile.powerReliability);
}

function readForm() {
  const gv = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'number') return parseInt(el.value, 10) || 0;
    return el.value.trim();
  };

  return {
    householdName: gv('field-household-name') || 'My Household',
    city: gv('field-city'),
    state: gv('field-state'),
    totalMembers: gv('field-total'),
    elderlyCount: gv('field-elderly'),
    childrenCount: gv('field-children'),
    pregnantCount: gv('field-pregnant'),
    outdoorWorkers: gv('field-outdoor'),
    chronicIllness: gv('field-chronic'),
    housingType: gv('field-housing'),
    ventilation: gv('field-ventilation'),
    hasAC: gv('field-ac'),
    hasFanCooler: gv('field-fan'),
    waterAvailability: gv('field-water'),
    powerReliability: gv('field-power'),
  };
}

function validateProfile(profile) {
  const errors = [];
  if (!profile.city) errors.push({ field: 'field-city', msg: 'Please enter your city or location.' });
  if (!profile.totalMembers || profile.totalMembers < 1) errors.push({ field: 'field-total', msg: 'Household must have at least 1 member.' });
  if (profile.elderlyCount > profile.totalMembers) errors.push({ field: 'field-elderly', msg: 'Elderly count cannot exceed total members.' });
  if (profile.childrenCount > profile.totalMembers) errors.push({ field: 'field-children', msg: 'Children count cannot exceed total members.' });
  if (profile.pregnantCount > profile.totalMembers) errors.push({ field: 'field-pregnant', msg: 'Pregnant count cannot exceed total members.' });
  if (!profile.housingType) errors.push({ field: 'field-housing', msg: 'Please select housing type.' });
  if (!profile.ventilation) errors.push({ field: 'field-ventilation', msg: 'Please select ventilation level.' });
  if (!profile.waterAvailability) errors.push({ field: 'field-water', msg: 'Please select water availability.' });
  if (!profile.powerReliability) errors.push({ field: 'field-power', msg: 'Please select power reliability.' });
  return errors;
}

function showError(fieldId, msg) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  el.classList.add('field-error');
  const errEl = document.getElementById(`${fieldId}-error`);
  if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
}

function clearError(fieldId) {
  const el = document.getElementById(fieldId);
  if (el) el.classList.remove('field-error');
  const errEl = document.getElementById(`${fieldId}-error`);
  if (errEl) errEl.classList.add('hidden');
}

function handleProfileSubmit() {
  const profile = readForm();
  const errors = validateProfile(profile);

  // Clear all previous errors
  document.querySelectorAll('.field-error').forEach((el) => el.classList.remove('field-error'));
  document.querySelectorAll('.field-error-msg').forEach((el) => el.classList.add('hidden'));

  if (errors.length > 0) {
    errors.forEach(({ field, msg }) => showError(field, msg));
    const firstErr = document.getElementById(errors[0].field);
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Please fix the highlighted errors.', 'error');
    return;
  }

  // Save profile and compute vulnerability
  AppState.profile = profile;
  AppState.vulnerabilityResult = calculateVulnerability(profile);
  AppState.heatwaveContext = getHeatwaveContext(profile.city);
  persistState();
  renderHomeStatus();

  // Navigate to vulnerability page and render it
  navigateTo('vulnerability');
  renderVulnerabilityPage();

  showToast(`✅ Profile saved — ${AppState.vulnerabilityResult.riskLevel} risk detected`, 'success');
}
