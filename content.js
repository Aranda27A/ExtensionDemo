
function randomHexColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF)
    .toString(16)
    .padStart(6, '0');
}
 
// Actualiza el preview en el popup
function updatePreview(color) {
  document.getElementById('colorPreview').style.background = color;
  document.getElementById('colorHex').textContent = color.toUpperCase();
}
 
// Botón: color aleatorio
document.getElementById('btnRandom').addEventListener('click', async () => {
  const color = randomHexColor();
  updatePreview(color);
 
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
 
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (bgColor) => {
      // Guarda el color original si aún no se guardó
      if (!document.body.dataset.originalBg) {
        document.body.dataset.originalBg = document.body.style.backgroundColor || '';
      }
      document.body.style.backgroundColor = bgColor;
    },
    args: [color]
  });
});
 
// Botón: restaurar color original
document.getElementById('btnReset').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
 
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const original = document.body.dataset.originalBg || '';
      document.body.style.backgroundColor = original;
      delete document.body.dataset.originalBg;
    }
  });
 
  document.getElementById('colorPreview').style.background = '#333';
  document.getElementById('colorHex').textContent = '#------';
});