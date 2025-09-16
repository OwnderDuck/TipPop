// Copyright (c) 2025 OwnderDuck
// SPDX-License-Identifier: MIT
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("filepicker.html"),
    active: true // 打开后立即切换到该标签页
  });
});
