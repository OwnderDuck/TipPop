// Copyright (c) 2025 OwnderDuck
// SPDX-License-Identifier: MIT

chrome.storage.local.get('tips', (data) => {
    let tips = data.tips || ["Welcome to TipPop! Please click the extension icon to import tips"];
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
    inner.style.textRendering = 'optimizeLegibility';//'geometricPrecision';
    badge.appendChild(inner);

    document.documentElement.appendChild(badge);

    // 立即滑入
    setTimeout(() => {
        badge.style.transform = 'translateX(0) skewX(-15deg)';
    }, 100);

    // 页面完全加载后再延迟 1.145 秒滑出
    window.addEventListener('load', () => {
        setTimeout(() => {
            badge.style.transform = 'translateX(-120%) skewX(-15deg)';
            setTimeout(() => badge.remove(), 400);
        }, 1145);
    });
});
