# HeatShield AI 🔥

**Personalised Household Heatwave Preparedness Agent**
PS-2 — Heatwave Preparedness Agent Hackathon Submission

---

## Problem
Generic heatwave alerts do not account for household-specific vulnerabilities such as elderly members, children, outdoor workers, housing conditions and cooling access. A household in Ahmedabad with kutcha housing, no AC, and elderly members faces radically different risks than a concrete-flat household in Mumbai.

## Solution
HeatShield AI is an AI-assisted preparedness agent that:
1. Profiles a household's specific vulnerabilities
2. Applies a rule-based scoring engine (14 evidence-based factors)
3. Fetches heatwave context (demo-seeded IMD-style data)
4. Calls Google Gemini AI to generate personalised, prioritised preparedness guidance
5. Produces an interactive action checklist and a downloadable safety card

**All guidance is prevention and preparedness only — not medical advice.**

---

## Live Demo

Open `index.html` in any modern browser. **No server, no npm, no build step required.**

```
HeatShield-AI/
└── index.html    ← Open this in your browser
```

---

## How to Run

```bash
# Clone the repo
git clone https://github.com/DevanshAIBuilder/HeatShield-AI.git
cd HeatShield-AI

# Open directly in browser — no server needed
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

**For AI-powered personalised plans** (optional):
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click ⚙️ Settings in the top-right corner of the app
3. Paste your key and save

Without a key, the app generates a full rule-based preparedness plan using NDMA guidelines automatically.

---

## User Flow

```
Home
  → Household Profile (14 inputs)
  → Vulnerability Analysis (rule-based, instant)
  → Heatwave Context (seeded IMD-style data for 10 Indian cities)
  → AI Risk Prioritisation (Google Gemini / rule-based fallback)
  → Personalised Preparedness Plan + Interactive Checklist
  → Shareable Safety Card (PNG download)
```

---

## Demo Household (Worst-Case for Judges)

Fill the profile with:
- **City**: Delhi
- **Total members**: 6
- **Elderly**: 1, **Children**: 2
- **Outdoor workers**: 1
- **Chronic illness**: ✅
- **Housing**: Kutcha
- **Ventilation**: Poor
- **AC**: ❌ No
- **Fan/Cooler**: ❌ No
- **Water**: Scarce
- **Power**: Unreliable

**Expected result**: Critical Risk (score ≥ 17/27), Delhi Red Alert, 8 vulnerability factors.

---

## Architecture

| Component | Technology |
|---|---|
| Frontend | Pure HTML5 + Vanilla CSS + ES6 JS |
| Styling | Custom design system (dark glass morphism) |
| Vulnerability Engine | Rule-based (14 factors, NDMA/WHO framework) |
| AI Integration | Google Gemini 2.0 Flash API |
| Heatwave Data | Seeded demo data (10 Indian cities, IMD format) |
| Safety Card | HTML Canvas → PNG download |
| Storage | Browser localStorage (API key only) |
| Dependencies | Zero — no npm, no build, no server |

### File Structure
```
HeatShield-AI/
├── index.html              ← App shell (7-page SPA)
├── css/
│   └── style.css           ← Complete design system
├── js/
│   ├── app.js              ← Router, state, page controllers
│   ├── profile.js          ← Profile form logic
│   ├── vulnerability.js    ← Rule-based scoring engine
│   ├── heatwave.js         ← Seeded city data + context
│   ├── ai.js               ← Gemini integration + fallback
│   └── card.js             ← Safety card canvas generator
└── data/
    └── guidance.js         ← Static NDMA/IMD preparedness guidance
```

---

## Vulnerability Scoring Engine

14 evidence-based factors scored 0–3 points each:

| Factor | Points | Severity |
|---|---|---|
| Elderly members (65+) | 3 | Critical |
| Pregnant members | 3 | Critical |
| Scarce drinking water | 3 | Critical |
| Children under 12 | 2 | High |
| Outdoor workers | 2 | High |
| Chronic illness | 2 | High |
| Kutcha/Semi-pucca housing | 2 | High |
| No fan or cooler | 2 | High |
| Poor ventilation | 2 | High |
| Unreliable power | 2 | High |
| No AC | 1 | Moderate |
| Intermittent water | 1 | Moderate |
| Large household (6+) | 1 | Moderate |
| Moderate ventilation | 1 | Low |

**Risk Bands**: Low (0–5) · Moderate (6–10) · High (11–16) · Critical (17+)

---

## Data Sources

All guidance is sourced from publicly available materials:
- [NDMA — National Disaster Management Authority](https://ndma.gov.in/Natural-Hazard/Heat-Wave)
- [IMD — India Meteorological Department](https://mausam.imd.gov.in)
- WHO Heat and Health Framework

Heatwave context data is seeded for demo purposes. Production deployment would use live IMD/OpenMeteo APIs (hooks are in `js/heatwave.js`).

---

## Key Constraints Honoured

- ✅ No fabricated weather data, risk scores or AI metrics
- ✅ All AI output clearly labelled as preparedness guidance, not medical advice
- ✅ Disclaimer shown at every output stage
- ✅ Works fully offline (rule-based fallback)
- ✅ No external dependencies — opens as a static HTML file
- ✅ Emergency contacts (112, 108, 1078) displayed throughout
- ✅ Sources cited on every guidance page

---

## Team

| Name | Role |
|---|---|
| **Devansh Nigam** | Team Leader / Full Stack |
| **Mohd Arsh Nafis** | UI/UX + Content |
| **Ehtesham Alam** | AI Integration + Data |

---

## Post-MVP Roadmap

- [ ] Hindi / Hinglish UI (i18n layer designed in, ready to add)
- [ ] Voice input interface
- [ ] Live IMD / OpenMeteo API integration
- [ ] Community sharing and neighbour alerts
- [ ] WhatsApp / SMS safety card distribution
- [ ] PWA (Progressive Web App) for offline field use

---

*HeatShield AI — Hackathon Project — Preparedness guidance only, not medical advice*
*Emergency: 112 (General) · 108 (Ambulance) · 1078 (NDMA Helpline)*