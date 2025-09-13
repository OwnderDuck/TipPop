// Copyright (c) 2025 OwnderDuck
// SPDX-License-Identifier: MIT
document.getElementById('fileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const text = await file.text();
    const tips = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  
    await chrome.storage.local.set({ tips });
    alert(`已导入 ${tips.length} 条 Tips`);
  });
  