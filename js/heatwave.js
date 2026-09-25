/**
 * HeatShield AI — Heatwave Context Data
 *
 * DEMO DATA: Seeded for hackathon demonstration purposes.
 * In production, replace with live IMD API or OpenMeteo data.
 * Source structure mirrors IMD heat alert advisory format.
 *
 * Alert Levels (IMD Standard):
 * Green  = No warning
 * Yellow = Watch — Be updated (Severe heat wave likely)
 * Orange = Alert — Be prepared (Severe heat wave)
 * Red    = Warning — Take action (Extreme heat wave)
 */

const ALERT_LEVELS = {
  green:  { label: 'Green — No Warning',    color: '#22c55e', bgColor: 'rgba(34,197,94,0.12)',   icon: '🟢', urgency: 0 },
  yellow: { label: 'Yellow — Watch',        color: '#eab308', bgColor: 'rgba(234,179,8,0.12)',   icon: '🟡', urgency: 1 },
  orange: { label: 'Orange — Alert',        color: '#f97316', bgColor: 'rgba(249,115,22,0.12)',  icon: '🟠', urgency: 2 },
  red:    { label: 'Red — Extreme Warning', color: '#ef4444', bgColor: 'rgba(239,68,68,0.12)',   icon: '🔴', urgency: 3 },
};

const CITY_HEATWAVE_DATA = {
  Delhi: {
    state: 'Delhi',
    region: 'North India',
    alertLevel: 'red',
    maxTempC: 47,
    minTempC: 30,
    humidity: 18,
    heatIndex: 52,
    advisoryText: 'Extreme heatwave conditions persist. NDMA advises all residents to avoid outdoor exposure between 11 AM and 4 PM. Stay hydrated and monitor vulnerable household members closely.',
    imdStation: 'Delhi Safdarjung Observatory',
    demoNote: 'Seeded demo data — representative of Delhi peak summer conditions (May–June).',
  },
  Mumbai: {
    state: 'Maharashtra',
    region: 'West India',
    alertLevel: 'yellow',
    maxTempC: 38,
    minTempC: 28,
    humidity: 72,
    heatIndex: 44,
    advisoryText: 'High humidity combined with elevated temperatures creates uncomfortable and potentially hazardous heat stress conditions. Residents should limit outdoor activity and stay hydrated.',
    imdStation: 'Colaba Observatory, Mumbai',
    demoNote: 'Seeded demo data — representative of Mumbai pre-monsoon heat-humidity conditions.',
  },
  Ahmedabad: {
    state: 'Gujarat',
    region: 'West India',
    alertLevel: 'red',
    maxTempC: 48,
    minTempC: 31,
    humidity: 15,
    heatIndex: 55,
    advisoryText: 'Extreme heat wave warning. Ahmedabad Heat Action Plan activated. Cooling centres open in all wards. Avoid all non-essential outdoor activity.',
    imdStation: 'Ahmedabad Airport Observatory',
    demoNote: 'Seeded demo data — Ahmedabad experiences some of India\'s most severe heatwaves.',
  },
  Nagpur: {
    state: 'Maharashtra',
    region: 'Central India',
    alertLevel: 'red',
    maxTempC: 47,
    minTempC: 29,
    humidity: 20,
    heatIndex: 51,
    advisoryText: 'Severe heat wave conditions. Local administration advises restricting outdoor work and activities. Schools and outdoor events cancelled.',
    imdStation: 'Nagpur Sonegaon Observatory',
    demoNote: 'Seeded demo data — Nagpur is among India\'s hottest cities in May–June.',
  },
  Jaipur: {
    state: 'Rajasthan',
    region: 'North-West India',
    alertLevel: 'red',
    maxTempC: 46,
    minTempC: 30,
    humidity: 14,
    heatIndex: 50,
    advisoryText: 'Rajasthan Heat Wave Warning active. Low humidity combined with extreme temperatures creates rapid dehydration risk. Carry water at all times.',
    imdStation: 'Jaipur Observatory',
    demoNote: 'Seeded demo data — Rajasthan experiences dry, extreme heatwave conditions.',
  },
  Lucknow: {
    state: 'Uttar Pradesh',
    region: 'North India',
    alertLevel: 'orange',
    maxTempC: 44,
    minTempC: 28,
    humidity: 30,
    heatIndex: 48,
    advisoryText: 'Heat Wave Alert active for Lucknow and surrounding districts. NDMA and state health department advisories in effect. Vulnerable populations should remain indoors.',
    imdStation: 'Lucknow Amausi Observatory',
    demoNote: 'Seeded demo data — representative of UP heatwave conditions in May.',
  },
  Kolkata: {
    state: 'West Bengal',
    region: 'East India',
    alertLevel: 'orange',
    maxTempC: 40,
    minTempC: 29,
    humidity: 65,
    heatIndex: 47,
    advisoryText: 'High heat-humidity conditions. Apparent temperature significantly higher than actual. Elderly and children especially vulnerable. Ensure adequate ventilation and hydration.',
    imdStation: 'Kolkata Alipore Observatory',
    demoNote: 'Seeded demo data — Kolkata heat stress is amplified by high humidity.',
  },
  Bhopal: {
    state: 'Madhya Pradesh',
    region: 'Central India',
    alertLevel: 'orange',
    maxTempC: 44,
    minTempC: 27,
    humidity: 22,
    heatIndex: 47,
    advisoryText: 'Heat wave alert issued for Bhopal and central MP. Outdoor labour restricted during 12–3 PM. Public advised to drink ORS and avoid direct sunlight.',
    imdStation: 'Bhopal Bairagarh Observatory',
    demoNote: 'Seeded demo data — Madhya Pradesh frequently under heat wave advisories in May–June.',
  },
  Hyderabad: {
    state: 'Telangana',
    region: 'South India',
    alertLevel: 'yellow',
    maxTempC: 42,
    minTempC: 27,
    humidity: 35,
    heatIndex: 46,
    advisoryText: 'Heat wave watch issued. Telangana Heat Action Plan recommends precautionary measures for vulnerable populations. Monitor IMD alerts closely.',
    imdStation: 'Hyderabad Begumpet Observatory',
    demoNote: 'Seeded demo data — Telangana experiences heat waves in April–May.',
  },
  Chennai: {
    state: 'Tamil Nadu',
    region: 'South India',
    alertLevel: 'yellow',
    maxTempC: 39,
    minTempC: 28,
    humidity: 78,
    heatIndex: 48,
    advisoryText: 'High humidity heat stress conditions. Despite moderate temperatures, coastal humidity significantly raises apparent temperature and heat illness risk.',
    imdStation: 'Nungambakkam Observatory, Chennai',
    demoNote: 'Seeded demo data — Chennai heat stress driven by high coastal humidity.',
  },
};

// General guidance for cities not in the seeded dataset
const DEFAULT_HEATWAVE_DATA = {
  state: 'India',
  region: 'India',
  alertLevel: 'yellow',
  maxTempC: 40,
  minTempC: 26,
  humidity: 30,
  heatIndex: 43,
  advisoryText: 'General heat wave advisory. Monitor your local IMD weather updates. Follow NDMA guidelines for heat preparedness.',
  imdStation: 'Local IMD Observatory',
  demoNote: 'Seeded default demo data. Enter a listed city for specific regional data.',
};

/**
 * Get heatwave context for a given city.
 * @param {string} city - City name (case-insensitive partial match)
 * @returns {Object} Heatwave context with alert metadata
 */
function getHeatwaveContext(city) {
  if (!city) return { ...DEFAULT_HEATWAVE_DATA, city: 'Your Location', alertMeta: ALERT_LEVELS.yellow };

  const cityKey = Object.keys(CITY_HEATWAVE_DATA).find(
    (k) => k.toLowerCase() === city.trim().toLowerCase()
  );

  const data = cityKey ? CITY_HEATWAVE_DATA[cityKey] : { ...DEFAULT_HEATWAVE_DATA };
  const alertMeta = ALERT_LEVELS[data.alertLevel] || ALERT_LEVELS.yellow;

  return {
    ...data,
    city: cityKey || city,
    alertMeta,
    isSeededData: true,
    dataTimestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

/**
 * List all available demo cities.
 */
function getAvailableCities() {
  return Object.keys(CITY_HEATWAVE_DATA);
}

/**
 * Get a friendly display label for heat index.
 */
function getHeatIndexLabel(heatIndex) {
  if (heatIndex < 27) return { label: 'Comfortable', color: '#22c55e' };
  if (heatIndex < 32) return { label: 'Caution', color: '#84cc16' };
  if (heatIndex < 41) return { label: 'Extreme Caution', color: '#eab308' };
  if (heatIndex < 54) return { label: 'Danger', color: '#f97316' };
  return { label: 'Extreme Danger', color: '#ef4444' };
}
