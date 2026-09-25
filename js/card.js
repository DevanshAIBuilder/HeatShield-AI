/**
 * HeatShield AI — Shareable Safety Card Generator
 * Renders a downloadable PNG safety card using HTML Canvas.
 */

/**
 * Draw the safety card on a canvas element and return the data URL.
 * @param {Object} profile
 * @param {Object} vulnerabilityResult
 * @param {Object} heatwaveContext
 * @param {Object} aiPlan
 * @returns {string} PNG data URL
 */
function generateSafetyCard(profile, vulnerabilityResult, heatwaveContext, aiPlan) {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');

  const riskColors = {
    Low: '#22c55e',
    Moderate: '#eab308',
    High: '#f97316',
    Critical: '#ef4444',
  };
  const riskColor = riskColors[vulnerabilityResult.riskLevel] || '#f97316';

  // ── Background ──────────────────────────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#070710');
  bgGrad.addColorStop(1, '#0d0d1a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ── Header Band ──────────────────────────────────────────────────────────────
  const headerGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  headerGrad.addColorStop(0, '#f59e0b');
  headerGrad.addColorStop(0.5, '#f97316');
  headerGrad.addColorStop(1, '#ef4444');
  ctx.fillStyle = headerGrad;
  roundRect(ctx, 0, 0, canvas.width, 140, 0, true);

  // Logo / brand text in header
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 32px Inter, Arial, sans-serif';
  ctx.fillText('🔥 HeatShield AI', 40, 55);
  ctx.font = '18px Inter, Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('Heatwave Preparedness Safety Card', 40, 88);
  ctx.font = '14px Inter, Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText(`Generated: ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}`, 40, 118);

  // ── Household Info Panel ─────────────────────────────────────────────────────
  drawGlassPanel(ctx, 30, 155, canvas.width - 60, 130, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px Inter, Arial, sans-serif';
  ctx.fillText('HOUSEHOLD', 55, 185);
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 22px Inter, Arial, sans-serif';
  ctx.fillText(profile.householdName || 'My Household', 55, 215);
  ctx.font = '15px Inter, Arial, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`📍 ${profile.city || 'Location not set'}  •  👥 ${profile.totalMembers} members`, 55, 245);
  ctx.fillText(buildMemberLine(profile), 55, 268);

  // ── Risk Level Badge ─────────────────────────────────────────────────────────
  drawGlassPanel(ctx, 30, 300, canvas.width - 60, 120, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px Inter, Arial, sans-serif';
  ctx.fillText('OVERALL RISK LEVEL', 55, 328);

  // Risk badge
  ctx.fillStyle = riskColor;
  roundRect(ctx, 55, 338, 220, 52, 8, true);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 26px Inter, Arial, sans-serif';
  ctx.fillText(`${vulnerabilityResult.riskEmoji} ${vulnerabilityResult.riskLevel.toUpperCase()}`, 72, 372);

  // Score bar
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, 295, 348, canvas.width - 350, 16, 8, true);
  const barWidth = Math.round(((canvas.width - 350) * vulnerabilityResult.percentage) / 100);
  ctx.fillStyle = riskColor;
  roundRect(ctx, 295, 348, barWidth, 16, 8, true);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px Inter, Arial, sans-serif';
  ctx.fillText(`Score: ${vulnerabilityResult.score}/${vulnerabilityResult.maxScore} (${vulnerabilityResult.percentage}%)`, 295, 388);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '13px Inter, Arial, sans-serif';
  wrapText(ctx, vulnerabilityResult.riskDescription, 55, 408, canvas.width - 110, 16);

  // ── Alert Context ─────────────────────────────────────────────────────────────
  drawGlassPanel(ctx, 30, 438, canvas.width - 60, 90, 12);
  const alertColor = heatwaveContext.alertMeta.color;
  ctx.fillStyle = alertColor;
  ctx.font = 'bold 15px Inter, Arial, sans-serif';
  ctx.fillText(`${heatwaveContext.alertMeta.icon} ${heatwaveContext.alertMeta.label}  —  ${heatwaveContext.city}`, 55, 468);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px Inter, Arial, sans-serif';
  ctx.fillText(`Max Temp: ${heatwaveContext.maxTempC}°C  •  Heat Index: ${heatwaveContext.heatIndex}°C  •  Humidity: ${heatwaveContext.humidity}%  [Demo Data]`, 55, 495);
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  wrapText(ctx, heatwaveContext.advisoryText, 55, 516, canvas.width - 110, 14);

  // ── Top Priority Risks ────────────────────────────────────────────────────────
  let y = 548;
  drawSectionHeader(ctx, 'TOP PRIORITY RISKS', 30, y, canvas.width - 60);
  y += 40;

  const risks = (aiPlan?.priorityRisks || []).slice(0, 3);
  risks.forEach((risk, i) => {
    const urgColors = { critical: '#ef4444', high: '#f97316', medium: '#eab308' };
    const urgColor = urgColors[risk.urgency] || '#f97316';
    drawGlassPanel(ctx, 30, y, canvas.width - 60, 78, 10);
    ctx.fillStyle = urgColor;
    ctx.font = 'bold 14px Inter, Arial, sans-serif';
    ctx.fillText(`${i + 1}. ${risk.risk}`, 55, y + 24);
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = '12px Inter, Arial, sans-serif';
    wrapText(ctx, risk.reason, 55, y + 44, canvas.width - 120, 13);
    y += 88;
  });

  // ── Top 5 Immediate Actions ───────────────────────────────────────────────────
  y = Math.max(y, 820);
  drawSectionHeader(ctx, 'IMMEDIATE ACTIONS (NEXT 24 HOURS)', 30, y, canvas.width - 60);
  y += 40;

  drawGlassPanel(ctx, 30, y, canvas.width - 60, 195, 10);
  const immediateActions = (aiPlan?.immediateActions || []).slice(0, 5);
  immediateActions.forEach((action, i) => {
    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 13px Inter, Arial, sans-serif';
    ctx.fillText(`${i + 1}.`, 55, y + 28 + i * 35);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '13px Inter, Arial, sans-serif';
    wrapText(ctx, action, 78, y + 28 + i * 35, canvas.width - 140, 13, 1);
  });
  y += 210;

  // ── Emergency Contacts ────────────────────────────────────────────────────────
  drawGlassPanel(ctx, 30, y, canvas.width - 60, 70, 10);
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 14px Inter, Arial, sans-serif';
  ctx.fillText('🆘 Emergency Contacts', 55, y + 24);
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '13px Inter, Arial, sans-serif';
  ctx.fillText('112 (Emergency)   •   108 (Ambulance)   •   1078 (NDMA Helpline)', 55, y + 50);
  y += 80;

  // ── Footer ────────────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(30, y, canvas.width - 60, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '11px Inter, Arial, sans-serif';
  ctx.fillText('Source: NDMA India / IMD Heat Action Plan  •  HeatShield AI  •  Preparedness guidance only — not medical advice', 30, y + 20);
  ctx.fillText(`Powered by Google Gemini AI  •  ${new Date().getFullYear()}`, 30, y + 38);

  return canvas.toDataURL('image/png');
}

// ── Drawing Helpers ──────────────────────────────────────────────────────────

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  else ctx.stroke();
}

function drawGlassPanel(ctx, x, y, w, h, r) {
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  roundRect(ctx, x, y, w, h, r, true);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, r, false);
}

function drawSectionHeader(ctx, text, x, y, w) {
  ctx.fillStyle = 'rgba(249,115,22,0.15)';
  roundRect(ctx, x, y, w, 30, 6, true);
  ctx.fillStyle = '#f97316';
  ctx.font = 'bold 12px Inter, Arial, sans-serif';
  ctx.fillText(text, x + 12, y + 20);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  if (!text) return;
  const words = text.split(' ');
  let line = '';
  let lineCount = 0;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
      lineCount++;
      if (maxLines && lineCount >= maxLines) {
        ctx.fillText(line + '...', x, y);
        return;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function buildMemberLine(profile) {
  const parts = [];
  if (profile.elderlyCount > 0) parts.push(`${profile.elderlyCount} elderly`);
  if (profile.childrenCount > 0) parts.push(`${profile.childrenCount} children`);
  if (profile.pregnantCount > 0) parts.push(`${profile.pregnantCount} pregnant`);
  if (profile.outdoorWorkers > 0) parts.push(`${profile.outdoorWorkers} outdoor workers`);
  return parts.length ? `Members: ${parts.join(' • ')}` : 'No high-risk members flagged';
}

/**
 * Download the canvas as a PNG file.
 */
function downloadSafetyCard(profile, vulnerabilityResult, heatwaveContext, aiPlan) {
  const dataUrl = generateSafetyCard(profile, vulnerabilityResult, heatwaveContext, aiPlan);
  const link = document.createElement('a');
  const name = (profile.householdName || 'household').toLowerCase().replace(/\s+/g, '-');
  link.download = `heatshield-safety-card-${name}.png`;
  link.href = dataUrl;
  link.click();
  return dataUrl;
}
