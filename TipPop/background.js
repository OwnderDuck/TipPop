// Copyright (c) 2025 OwnderDuck
// SPDX-License-Identifier: MIT
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
	url: chrome.runtime.getURL("filepicker.html"),
	active: true // 打开后立即切换到该标签页
  });
});

// ========== 分片存储到 sync ==========
function saveToSync(key, str, chunkSize = 2048) {
  const chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
	chunks.push(str.slice(i, i + chunkSize));
  }
  const data = {};
  data[key + "_meta"] = { chunks: chunks.length };
  chunks.forEach((chunk, i) => {
	data[`${key}_${i}`] = chunk;
  });
  return chrome.storage.sync.set(data);
}

function loadFromSync(key) {
  return new Promise((resolve, reject) => {
	chrome.storage.sync.get(key + "_meta", (meta) => {
	  if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
	  if (!meta[key + "_meta"]) return resolve(null);

	  const totalChunks = meta[key + "_meta"].chunks;
	  const keys = Array.from({ length: totalChunks }, (_, i) => `${key}_${i}`);

	  chrome.storage.sync.get(keys, (items) => {
		if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
		let result = "";
		for (let i = 0; i < totalChunks; i++) {
		  result += items[`${key}_${i}`] || "";
		}
		resolve(result);
	  });
	});
  });
}

// ========== 前端消息监听：触发云同步 ==========
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "syncTips") {
	const tipsStr = msg.tips.join("\n");
	saveToSync("tips", tipsStr)
	  .then(() => {
		console.log("已分片同步到云端");
		sendResponse({ ok: true });
	  })
	  .catch(err => {
		console.warn("云同步失败:", err);
		sendResponse({ ok: false, error: err });
	  });
	return true; // 异步响应
  }
});

// ========== 监听云端更改，合并回 local ==========
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync") {
	console.log("检测到云端更新:", changes);
	if (changes["tips_meta"]) {
	  loadFromSync("tips").then(tipsStr => {
		if (!tipsStr) return;
		const tips = tipsStr.split(/\r?\n/).filter(Boolean);
		chrome.storage.local.set({ tips }, () => {
		  console.log("已将云写到local");
		  // 可选：通知前端 UI 刷新
		  chrome.runtime.sendMessage({ action: "tipsUpdatedFromCloud", tips });
		});
	  });
	}
  }
});