/* ============================================
   魏兴森个人简历 - 极简脚本
   页脚年份 + 项目图片点击放大
   ============================================ */

(function () {
    'use strict';

    /* ---------- 页脚年份 ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 项目图片放大预览 ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');

    document.querySelectorAll('.entry-thumbs img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
        });
    });

    // 点击遮罩或按 Esc 关闭
    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            lightboxImg.src = '';
        }
    });

})();
