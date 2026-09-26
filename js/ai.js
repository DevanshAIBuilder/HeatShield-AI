/**
 * HeatShield AI — Gemini AI Integration
 *
 * All AI-generated content is clearly labelled as preparedness guidance.
 * This module calls Google Gemini API with a structured household profile
 * and returns prioritized risk assessment and preparedness actions.
 *
 * If the API is unavailable or key is missing, a rule-based fallback
 * plan is generated automatically.
 */

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function validateHomeScanResult(value) {
  if (!value || !Array.isArray(value.detected_features)) return null;
  const allowed = ['ceiling_fan', 'cooler', 'ac', 'windows', 'visible_shading', 'visible_water_storage', 'room_environment'];
  const features = value.detected_features.filter((item) => item && allowed.includes(item.feature) && typeof item.detected === 'boolean')
    .map((item) => ({ feature: item.feature, detected: item.detected, confidence: ['high', 'medium', 'low'].includes(item.confidence) ? item.confidence : 'low' }));
  return { detected_features: features };
}

async function analyzeHomeScan(apiKey, base64Image, mimeType) {
  if (!apiKey) return { success: false, error: 'Add a Gemini API key in Settings to run the optional vision prototype.' };
  const prompt = `Analyze only observable household/environment features in this image. Do not infer age, medical conditions, disability, health status, identity, or any sensitive personal information. Return only JSON in this shape: {"detected_features":[{"feature":"ceiling_fan|cooler|ac|windows|visible_shading|visible_water_storage|room_environment","detected":true,"confidence":"high|medium|low"}]}. Include only features visibly supported by the image.`;
  try {
    const response = await fetch(`${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey.trim()}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64Image } }] }], generationConfig: { temperature: 0, maxOutputTokens: 512 } }),
    });
    if (!response.ok) throw new Error(`Vision API HTTP ${response.status}`);
    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = rawText.match(/```json\s*([\s\S]*?)```/) || rawText.match(/({[\s\S]*})/);
    const parsed = validateHomeScanResult(JSON.parse(match ? (match[1] || match[0]) : rawText));
    if (!parsed) throw new Error('Vision response did not match the expected structure.');
    return { success: true, result: parsed };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Build the structured prompt for Gemini.
 */
function buildHeatshieldPrompt(profile, vulnerabilityResult, heatwaveContext) {
  const factorList = getFactorSummaryText(vulnerabilityResult);

  return `You are HeatShield AI, a heatwave preparedness guidance assistant for India.
Your role is strictly prevention and preparedness — you do NOT provide medical diagnosis or treatment.

HOUSEHOLD PROFILE:
- Location: ${profile.city || 'Not specified'}, ${profile.state || 'India'}
- Total members: ${profile.totalMembers}
- Elderly members (65+): ${profile.elderlyCount}
- Children (under 12): ${profile.childrenCount}
- Pregnant members: ${profile.pregnantCount}
- Outdoor workers: ${profile.outdoorWorkers}
- Chronic illness/conditions present: ${profile.chronicIllness ? 'Yes' : 'No'}
- Housing type: ${profile.housingType}
- Home ventilation: ${profile.ventilation}
- Air conditioning available: ${profile.hasAC ? 'Yes' : 'No'}
- Fan or cooler available: ${profile.hasFanCooler ? 'Yes' : 'No'}
- Drinking water availability: ${profile.waterAvailability}
- Power supply reliability: ${profile.powerReliability}
- Household name/identifier: ${profile.householdName || 'Household'}

VULNERABILITY ASSESSMENT (rule-based score):
- Score: ${vulnerabilityResult.score} out of ${vulnerabilityResult.maxScore}
- Risk Level: ${vulnerabilityResult.riskLevel}
- Detected Risk Factors:
${factorList}

CURRENT HEATWAVE CONTEXT (Demo/Seeded Data):
- City: ${heatwaveContext.city}
- Alert Level: ${heatwaveContext.alertMeta.label}
- Max Temperature: ${heatwaveContext.maxTempC}°C
- Heat Index: ${heatwaveContext.heatIndex}°C
- Humidity: ${heatwaveContext.humidity}%
- Official Advisory: ${heatwaveContext.advisoryText}

TASK:
Based on this specific household profile and heatwave context, provide:
1. Top 3 priority risks for THIS household (tailored to their specific vulnerabilities)
2. 5 immediate preparedness actions (next 24 hours) for this specific household
3. 5 before-heatwave preparation actions for this specific household
4. 5 during-heatwave action rules for this specific household
5. Special guidance for each vulnerable group present (only include groups that are present)

IMPORTANT RULES:
- All guidance is preparedness and prevention ONLY — never medical diagnosis or treatment
- Keep each action concise and actionable (1–2 sentences max)
- Tailor actions to the specific vulnerabilities detected — not generic advice
- If no AC: focus on alternative cooling methods
- If outdoor workers: include work schedule and on-site precautions
- If elderly or children: include monitoring and supervision steps
- Base all recommendations on NDMA and WHO heat preparedness guidelines

Respond ONLY with valid JSON in exactly this format:
{
  "priorityRisks": [
    {"rank": 1, "risk": "Risk title", "reason": "Why this is a top risk for this specific household", "urgency": "critical"},
    {"rank": 2, "risk": "Risk title", "reason": "Why this is a top risk for this specific household", "urgency": "high"},
    {"rank": 3, "risk": "Risk title", "reason": "Why this is a top risk for this specific household", "urgency": "high"}
  ],
  "immediateActions": [
    "Action 1 tailored to this household",
    "Action 2",
    "Action 3",
    "Action 4",
    "Action 5"
  ],
  "beforeHeatwaveActions": [
    "Action 1",
    "Action 2",
    "Action 3",
    "Action 4",
    "Action 5"
  ],
  "duringHeatwaveActions": [
    "Action 1",
    "Action 2",
    "Action 3",
    "Action 4",
    "Action 5"
  ],
  "specialGuidance": {
    "elderly": "Guidance if elderly members present (omit key if not applicable)",
    "children": "Guidance if children present (omit key if not applicable)",
    "pregnant": "Guidance if pregnant members present (omit key if not applicable)",
    "outdoorWorkers": "Guidance if outdoor workers present (omit key if not applicable)",
    "chronicIllness": "Guidance if chronic illness present (omit key if not applicable)"
  },
  "aiDisclaimer": "All recommendations above are AI-generated preparedness guidance based on NDMA and WHO heat safety frameworks. This is not medical advice. Consult a healthcare professional for medical concerns."
}`;
}

/**
 * Call Gemini API and return parsed plan.
 * @param {string} apiKey - Gemini API key from user settings
 * @param {Object} profile - Household profile
 * @param {Object} vulnerabilityResult - From calculateVulnerability()
 * @param {Object} heatwaveContext - From getHeatwaveContext()
 * @returns {Object} { success, plan, error, usedFallback }
 */
async function generateAIPlan(apiKey, profile, vulnerabilityResult, heatwaveContext) {
  if (!apiKey || apiKey.trim() === '') {
    console.warn('HeatShield AI: No API key provided — using rule-based fallback plan.');
    return { success: true, plan: generateFallbackPlan(profile, vulnerabilityResult, heatwaveContext), usedFallback: true };
  }

  const prompt = buildHeatshieldPrompt(profile, vulnerabilityResult, heatwaveContext);
  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey.trim()}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          topP: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `HTTP ${response.status}`;
      throw new Error(`Gemini API error: ${errMsg}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error('Empty response from Gemini API.');

    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```/) || rawText.match(/({[\s\S]*})/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawText;

    const plan = JSON.parse(jsonText.trim());
    plan.generatedBy = 'Google Gemini';
    plan.usedFallback = false;
    return { success: true, plan, usedFallback: false };

  } catch (err) {
    console.error('HeatShield AI: Gemini API call failed —', err.message);
    return {
      success: false,
      plan: generateFallbackPlan(profile, vulnerabilityResult, heatwaveContext),
      usedFallback: true,
      error: err.message,
    };
  }
}

/**
 * Rule-based fallback plan generator.
 * Used when API key is missing or Gemini call fails.
 * All output is derived from NDMA guidance (see data/guidance.js).
 */
function generateFallbackPlan(profile, vulnerabilityResult, heatwaveContext) {
  const risks = [];
  const immediate = [];
  const before = [];
  const during = [];
  const special = {};

  // Build priority risks from detected factors
  const topFactors = vulnerabilityResult.sortedFactors.slice(0, 3);
  topFactors.forEach((f, i) => {
    risks.push({
      rank: i + 1,
      risk: f.label,
      reason: f.description,
      urgency: f.severity === 'critical' ? 'critical' : f.severity === 'high' ? 'high' : 'medium',
    });
  });

  if (risks.length === 0) {
    risks.push({
      rank: 1,
      risk: 'General Heat Exposure',
      reason: 'Even without specific vulnerability factors, heatwave conditions pose risk to all household members.',
      urgency: 'medium',
    });
  }

  // Build immediate actions based on profile
  if (!profile.hasFanCooler && !profile.hasAC) {
    immediate.push('Immediately acquire a fan or cooler — this is the most critical step for this household.');
  }
  if (profile.waterAvailability === 'scarce') {
    immediate.push('Identify and secure alternative water sources or purchase stored water today.');
  }
  immediate.push('Fill all available containers with clean drinking water and keep covered.');
  immediate.push('Purchase or prepare ORS (oral rehydration salts) — at least 10 sachets per household member.');
  immediate.push('Save emergency contacts: 112 (Emergency), 108 (Ambulance), 1078 (NDMA Helpline).');
  if (profile.elderlyCount > 0 || profile.childrenCount > 0) {
    immediate.push(`Check on all ${profile.elderlyCount > 0 ? 'elderly' : ''}${profile.elderlyCount > 0 && profile.childrenCount > 0 ? ' and ' : ''}${profile.childrenCount > 0 ? 'children' : ''} — ensure they are cool and hydrated right now.`);
  }

  // Before heatwave
  before.push('Install curtains, bamboo screens or reflective film on all east and west-facing windows.');
  if (profile.housingType === 'kutcha' || profile.housingType === 'semi-pucca') {
    before.push('Cover roof with white/reflective material or wet gunny bags to reduce indoor heat significantly.');
  }
  before.push('Identify the nearest community cooling centre, public library or air-conditioned public space.');
  before.push('Inspect all fans and coolers; repair or replace before peak summer days.');
  before.push('Prepare a household emergency kit: water, ORS, first-aid supplies, torch, important documents.');

  // During heatwave
  during.push(`Stay indoors between 12 PM and 3 PM — especially in ${heatwaveContext.city} where temperatures can reach ${heatwaveContext.maxTempC}°C.`);
  during.push('Drink water or ORS every 20–30 minutes regardless of thirst.');
  during.push('Use wet towels on neck, wrists and forehead for immediate cooling.');
  during.push('Keep windows closed during peak heat; open only after 6 PM for ventilation.');
  during.push('Follow IMD alerts and district administration announcements — act on Red alerts immediately.');

  // Vulnerable group guidance
  if (profile.elderlyCount > 0) {
    special.elderly = `With ${profile.elderlyCount} elderly member(s): check on them every hour during heatwave days, ensure they drink water regularly even if they say they are not thirsty, and prioritise their access to the coolest space in the home.`;
  }
  if (profile.childrenCount > 0) {
    special.children = `With ${profile.childrenCount} child/children: keep them strictly indoors during 12–3 PM, offer water and ORS frequently, dress them in lightweight cotton, and watch for irritability or reduced urination as dehydration signs.`;
  }
  if (profile.pregnantCount > 0) {
    special.pregnant = `With ${profile.pregnantCount} pregnant member(s): ensure they rest in the coolest available space, drink at least 2–3 litres of water daily, and have a trusted contact ready to assist them if needed.`;
  }
  if (profile.outdoorWorkers > 0) {
    special.outdoorWorkers = `With ${profile.outdoorWorkers} outdoor worker(s): schedule all work before 10 AM or after 4 PM, carry 1 litre of water per hour of work, take 15-minute shade breaks every hour, and stop work at first sign of dizziness or weakness.`;
  }
  if (profile.chronicIllness) {
    special.chronicIllness = 'For chronic illness conditions: consult your healthcare provider about heat management for your specific condition before the heatwave season peaks. Keep all medications stored at recommended temperatures.';
  }

  return {
    priorityRisks: risks,
    immediateActions: immediate.slice(0, 5),
    beforeHeatwaveActions: before.slice(0, 5),
    duringHeatwaveActions: during.slice(0, 5),
    specialGuidance: special,
    generatedBy: 'HeatShield AI Rule-Based Engine',
    usedFallback: true,
    aiDisclaimer: 'All recommendations are preparedness guidance derived from NDMA and IMD heat safety frameworks. This is not medical advice.',
  };
}
