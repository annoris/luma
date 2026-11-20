'use strict';

(function initSponsorwareProtection() {
  console.log(
    '%c🔒 LUMA Botanical Soda — Protected Commercial & Sponsorware Build\n%cTo unlock full editable source code (annoris/luma-pro-source), contribute via Solana: 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm',
    'background:#c9ff49;color:#111111;padding:8px 14px;font-family:sans-serif;font-weight:700;font-size:12px;letter-spacing:0.06em;border-left:4px solid #ff85b3;',
    'background:#111111;color:#ffffff;padding:6px 14px;font-family:monospace;font-size:11px;'
  );

  document.addEventListener('contextmenu', (e) => {
    if (e.target && e.target.closest('img, svg, canvas, .can, .hero-stage, .flavors-stage')) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target && e.target.closest('img, svg')) {
      e.preventDefault();
    }
  });

  document.addEventListener('keydown', (e) => {
    const key = (e.key || '').toLowerCase();
    const isViewSource = (e.ctrlKey || e.metaKey) && key === 'u';
    const isDevTools =
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.altKey && (key === 'i' || key === 'j' || key === 'c')) ||
      (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'));

    if (isViewSource || isDevTools) {
      e.preventDefault();
    }
  });
})();

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('contact-button').addEventListener('click', () => {const message=document.getElementById('contact-message');message.hidden=!message.hidden;document.getElementById('contact-button').textContent=message.hidden?'LET’S TALK LUMA':'LET THE GOOD VIBES FLOW!';});
let soundtrack;
const soundButton = document.getElementById('sound-toggle');
const setSoundState = enabled => {
 soundButton.setAttribute('aria-pressed', String(enabled));
 soundButton.setAttribute('aria-label', enabled ? 'Turn off original LUMA music' : 'Play original LUMA music');
 document.getElementById('sound-label').textContent = enabled ? 'SOUND ON' : 'SOUND OFF';
};
soundButton.addEventListener('click', async () => {
 const enabled = soundButton.getAttribute('aria-pressed') === 'true';
 if (enabled) { setSoundState(false); await soundtrack?.stop(); return; }
 try {
  soundtrack ||= window.createLumaSoundtrack();
  if (!soundtrack) { document.getElementById('sound-label').textContent = 'AUDIO UNAVAILABLE'; return; }
  setSoundState(true);
  await soundtrack.start();
 } catch { setSoundState(false); }
});
document.addEventListener('visibilitychange', () => {
 if (document.hidden && soundButton.getAttribute('aria-pressed') === 'true') {
  setSoundState(false); soundtrack?.stop();
 }
});
document.querySelectorAll('.flavor-button').forEach(button=>button.addEventListener('click',()=>{const labels={citrus:'LIME<br>& LEMON',berry:'WILD<br>BERRIES',mint:'MINT<br>& CUCUMBER'};document.getElementById('display-flavor').innerHTML=labels[button.dataset.flavor];}));
// Copy Solana wallet address with Clipboard API and legacy fallback
const copySolanaButton = document.getElementById('copy-solana-address');
const copySolanaStatus = document.getElementById('copy-solana-status');
if (copySolanaButton && copySolanaStatus) {
 const defaultLabel = copySolanaButton.textContent;
 let resetTimer;
 const fallbackCopy = text => {
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(field);
  return copied;
 };
 copySolanaButton.addEventListener('click', async () => {
  const address = copySolanaButton.dataset.wallet || '';
  if (!address) return;
  let copied = false;
  try {
   if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(address);
    copied = true;
   } else {
    copied = fallbackCopy(address);
   }
  } catch {
   copied = fallbackCopy(address);
  }
  clearTimeout(resetTimer);
  if (copied) {
   copySolanaButton.textContent = 'COPIED!';
   copySolanaStatus.textContent = 'Copied! Solana wallet address is ready to paste.';
   resetTimer = setTimeout(() => {
    copySolanaButton.textContent = defaultLabel;
    copySolanaStatus.textContent = '';
   }, 2500);
  } else {
   copySolanaStatus.textContent = 'Unable to copy automatically. Please select and copy the address above.';
  }
 });
}
