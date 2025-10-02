// Copyright (c) 2025 OwnderDuck
// SPDX-License-Identifier: MIT
const tips = [
  "Welcome to TipPop!",

  `FROG fell from the 3rd floor ${(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())-new Date(2025,4/*月份从0开始*/,18))/(1000*60*60*24)} days ago.`
];

const randomTip = tips[Math.floor(Math.random() * tips.length)];

const badge = document.createElement('div');
Object.assign(badge.style, {
  position: 'fixed',
  bottom: '10px',
  left: '10px',
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  padding: '6px 16px',
  fontSize: '14px',
  fontFamily: "Noto Sans CJK SC, Source Han Sans SC, sans-serif",
  zIndex: 2147483647,
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  transform: 'translateX(-120%) skewX(-15deg)',
  transition: 'transform 0.4s ease',
  boxShadow: '0 2px 6px rgba(0,0,0,0)',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textRendering: 'geometricPrecision',
  willChange: 'transform',
  contain: 'layout paint style'
});

const inner = document.createElement('span');
inner.textContent = "Tip: " + randomTip;
inner.style.display = 'inline-block';
inner.style.transform = 'skewX(15deg)';
inner.style.WebkitFontSmoothing = 'antialiased';
inner.style.MozOsxFontSmoothing = 'grayscale';
inner.style.textRendering = 'optimizeLegibility';
badge.appendChild(inner);

document.documentElement.appendChild(badge);

setTimeout(() => {
  badge.style.transform = 'translateX(0) skewX(-15deg)';
}, 100);

window.addEventListener('load', () => {
  setTimeout(() => {
      badge.style.transform = 'translateX(-120%) skewX(-15deg)';
      setTimeout(() => badge.remove(), 400);
  }, 1145);
});

const fileInput = document.getElementById('fileInput');
const tipsList = document.getElementById('tipsList');
const status = document.getElementById('status');
const manualInput = document.getElementById('manualInput');
const addBtn = document.getElementById('addBtn');

async function loadTips() {
  const { tips = [] } = await chrome.storage.local.get('tips');
  tipsList.innerHTML = '';
  tips.forEach((tip, index) => {
    const li = document.createElement('li');
    li.textContent = tip;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = async () => {
      tips.splice(index, 1);
      await chrome.storage.local.set({ tips });
      loadTips();
      showStatus(`Deleted tip #${index + 1}`);
    };
    li.appendChild(delBtn);
    tipsList.appendChild(li);
  });
}

function showStatus(msg) {
  status.textContent = msg;
  setTimeout(() => status.textContent = '', 2000);
}
document.getElementById('importBtn').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

// 文件导入
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  const newTips = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const { tips = [] } = await chrome.storage.local.get('tips');
  const merged = tips.concat(newTips);
  await chrome.storage.local.set({ tips: merged });
  loadTips();
  showStatus(`Imported ${newTips.length} tips`);
});

// 清空
document.getElementById('clearBtn').onclick = async () => {
  await chrome.storage.local.set({ tips: [] });
  loadTips();
  showStatus('Cleared all tips');
};

// 导出
document.getElementById('exportBtn').onclick = async () => {
  const { tips = [] } = await chrome.storage.local.get('tips');
  const blob = new Blob([tips.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tips.txt';
  a.click();
  URL.revokeObjectURL(url);
};

// 手动添加
addBtn.onclick = async () => {
  const newTip = manualInput.value.trim();
  if (!newTip) {
    showStatus('Please enter a tip');
    return;
  }
  const { tips = [] } = await chrome.storage.local.get('tips');
  tips.push(newTip);
  await chrome.storage.local.set({ tips });
  manualInput.value = '';
  loadTips();
  showStatus('Tip added');
};
// 手动输入按 Enter 也触发添加
manualInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // 防止表单提交或换行
    addBtn.click();     // 直接调用按钮的点击逻辑
  }
});
loadTips();
const toggleSwitch = document.getElementById('toggleSwitch');

// 初始化时读取状态
chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  toggleSwitch.checked = enabled;
});

// 切换时更新存储
toggleSwitch.addEventListener('change', async () => {
  await chrome.storage.local.set({ enabled: toggleSwitch.checked });
  showStatus(toggleSwitch.checked ? 'Tips enabled' : 'Tips disabled');
});
