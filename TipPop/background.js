// Copyright (c) 2025 OwnderDuck
// SPDX-License-Identifier: MIT
chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
      url: chrome.runtime.getURL("filepicker.html"),
      type: "popup",
      width: 400,
      height: 200
    });
  });
  