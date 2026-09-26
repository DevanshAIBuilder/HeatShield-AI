/**
 * HeatShield AI — Interactive Preparedness Checklist Data
 * Source: NDMA (National Disaster Management Authority) India
 *         IMD (India Meteorological Department) Heat Action Plan
 * All guidance is prevention and preparedness focused.
 */

// Checklist items for the interactive preparedness checklist
const CHECKLIST_ITEMS = {
  immediate: [
    { id: 'chk-water', text: 'Fill and cover all water storage containers', category: 'water' },
    { id: 'chk-ors', text: 'Obtain ORS/electrolyte packets (at least 10)', category: 'water' },
    { id: 'chk-cooling', text: 'Test fans, coolers — repair if needed', category: 'cooling' },
    { id: 'chk-contacts', text: 'Save emergency contacts: 112, 108, 1078 (NDMA)', category: 'emergency' },
    { id: 'chk-clothing', text: 'Set aside light-coloured cotton clothes for household', category: 'clothing' },
  ],
  beforeHeatwave: [
    { id: 'chk-curtains', text: 'Install curtains/blinds on east and west-facing windows', category: 'shelter' },
    { id: 'chk-whitewash', text: 'Whitewash or cover roof with reflective material', category: 'shelter' },
    { id: 'chk-coolingcentre', text: 'Identify nearest community cooling centre', category: 'emergency' },
    { id: 'chk-kit', text: 'Prepare household emergency kit (water, ORS, first-aid, documents)', category: 'emergency' },
    { id: 'chk-schedule', text: 'Plan outdoor activity schedule — avoid 12 PM to 3 PM window', category: 'planning' },
    { id: 'chk-neighbours', text: 'Check on elderly neighbours — share your contact number', category: 'community' },
  ],
  duringHeatwave: [
    { id: 'chk-indoor', text: 'Stay indoors 12 PM – 3 PM', category: 'behaviour' },
    { id: 'chk-drink', text: 'Drink water every 20–30 minutes (do not wait for thirst)', category: 'water' },
    { id: 'chk-ventilate', text: 'Open windows only in early morning and after sunset', category: 'shelter' },
    { id: 'chk-cooldown', text: 'Use wet towels on neck/wrist/forehead to cool down', category: 'cooling' },
    { id: 'chk-monitor', text: 'Follow IMD and local administration weather alerts', category: 'planning' },
    { id: 'chk-checkup', text: 'Check on vulnerable family members every 1–2 hours', category: 'community' },
  ],
};
