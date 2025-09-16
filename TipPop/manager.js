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
