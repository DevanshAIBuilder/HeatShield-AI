/**
 * HeatShield AI — Static Preparedness Guidance Data
 * Source: NDMA (National Disaster Management Authority) India
 *         IMD (India Meteorological Department) Heat Action Plan
 * All guidance is prevention and preparedness focused.
 */

const GUIDANCE = {
  source: {
    name: 'NDMA India / IMD Heat Action Plan',
    url: 'https://ndma.gov.in/Natural-Hazard/Heat-Wave',
    imdUrl: 'https://mausam.imd.gov.in',
    disclaimer: 'This guidance is based on publicly available NDMA and IMD heat preparedness advisories and is for preparedness purposes only — not medical advice.',
  },

  beforeHeatwave: [
    'Install reflective shading or whitewash rooftops to reduce indoor heat absorption.',
    'Ensure all water storage containers are cleaned, filled and covered to prevent contamination.',
    'Stock oral rehydration salts (ORS), electrolyte powder and sufficient drinking water (at least 3–4 litres per person per day).',
    'Identify the nearest cooling centre, community hall or air-conditioned public space in your locality.',
    'Check all fans, coolers and ventilation units; repair or replace before peak summer.',
    'Install window curtains, bamboo screens or reflective films on east and west-facing windows.',
    'Prepare a household emergency kit with water, ORS, first-aid supplies and important documents.',
    'Inform elderly and vulnerable household members about heat safety signs and what to do.',
    'Ensure mobile phones are charged and emergency contacts (NDMA, local health worker) are saved.',
    'Keep lightweight, light-coloured cotton clothing accessible for all household members.',
    'Discuss a heatwave plan with your family — who stays home, who monitors the elderly, etc.',
    'Purchase additional cooling supplies if possible: hand-held fans, wet towels, ice packs.',
  ],

  duringHeatwave: [
    'Stay indoors between 12 PM and 3 PM when temperatures are at their peak.',
    'Drink water or ORS every 20–30 minutes even if not thirsty — do not wait for thirst.',
    'Wear loose, lightweight, light-coloured cotton clothing and cover your head if going out.',
    'Keep windows and doors closed during the hottest part of the day; open after sunset.',
    'Use wet cloths, damp towels or water sprays to cool down — apply to neck, wrists and forehead.',
    'Avoid alcohol, caffeinated drinks, very sweet beverages and heavy meals during peak heat.',
    'Check on elderly neighbours, relatives and those living alone at least twice a day.',
    'Never leave children, elderly or pets in parked vehicles — temperatures inside can be fatal.',
    'If you must go outside, carry water, wear sunscreen and a hat, and take breaks in the shade.',
    'Turn off non-essential heat-generating appliances (ovens, dryers) during peak hours.',
    'Take cool (not cold) showers to lower body temperature if feeling overheated.',
    'Monitor local weather updates and follow IMD/district administration alerts.',
  ],

  afterHeatwave: [
    'Continue hydrating adequately — recovery from heat stress takes 24–48 hours.',
    'Check on vulnerable family members and neighbours for any delayed heat illness symptoms.',
    'Restock used water and ORS supplies.',
    'Document any damage or health impacts for community reporting.',
  ],

  heatStrokeWarning: [
    'High body temperature (above 103°F / 39.4°C)',
    'Hot, dry skin (no sweating)',
    'Rapid, strong pulse',
    'Confusion, slurred speech or loss of consciousness',
    'Nausea or vomiting',
  ],

  immediateHeatStrokeAction: 'If someone shows signs of heat stroke: call emergency services (112) immediately, move the person to a cool shaded area, apply cool water or wet cloths to the skin, and do NOT give fluids to an unconscious person. This is a medical emergency.',

  vulnerableGroupGuidance: {
    elderly: [
      'Check on elderly members every 1–2 hours during heatwave days.',
      'Ensure they drink water regularly — elderly may not feel thirst strongly.',
      'Keep their living space cool — prioritise fan/cooler access for elderly members.',
      'Watch for confusion, dizziness or weakness which are early heat stress signs in elderly.',
      'Accompany elderly to cooling centres if home temperature is too high.',
    ],
    children: [
      'Never leave children in parked vehicles even briefly.',
      'Keep children indoors during peak heat hours (12 PM – 3 PM).',
      'Offer water and ORS frequently — children dehydrate faster than adults.',
      'Dress children in lightweight, breathable cotton clothing.',
      'Watch for unusual irritability, lethargy or reduced urination as signs of dehydration.',
    ],
    pregnant: [
      'Stay well-hydrated — drink at least 2–3 litres of water per day.',
      'Avoid outdoor activity during peak heat; rest in coolest available space.',
      'Consult a healthcare worker if you experience dizziness, reduced fetal movement or swelling.',
      'Wear loose, comfortable clothing; avoid tight garments that restrict circulation.',
      'Have a trusted contact available who can assist or take you to a health facility if needed.',
    ],
    outdoorWorkers: [
      'Schedule outdoor work in early morning (before 10 AM) or late afternoon (after 4 PM).',
      'Take a 15-minute rest in shade every hour during peak heat.',
      'Carry at least 1 litre of water per hour of outdoor work; drink regularly.',
      'Wear a wide-brimmed hat, sunscreen and light-coloured full-sleeve clothing.',
      'Watch for signs of heat exhaustion in yourself and co-workers: heavy sweating, weakness, cold/pale/clammy skin.',
      'Do not ignore early signs of heat illness — stop work and move to shade immediately.',
    ],
    chronicIllness: [
      'Consult your healthcare provider before heatwave season about managing your condition in extreme heat.',
      'Keep all prescribed medications stored at recommended temperatures — extreme heat can degrade some medicines.',
      'Some medications (diuretics, beta-blockers, antipsychotics) can increase heat sensitivity — ask your doctor.',
      'Stay extra vigilant about hydration — certain conditions affect the body\'s ability to regulate temperature.',
      'Have an emergency plan including contact details for your healthcare provider.',
    ],
  },

  outdoorWorkerRules: [
    'No outdoor construction or labour work between 12 PM and 3 PM during heatwave advisories (NDMA guideline).',
    'Employers must provide shade, cool water and rest breaks to outdoor workers.',
    'Workers should be educated to recognise and report heat illness symptoms.',
  ],

  emergencyContacts: {
    ndma: '1078',
    ambulance: '108',
    police: '100',
    generalEmergency: '112',
    note: 'Save these numbers in your phone before heatwave season.',
  },
};

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
