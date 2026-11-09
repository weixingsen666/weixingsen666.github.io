/* ============================================
   魏兴森个人简历 - 极简脚本
   仅保留：页脚年份
   ============================================ */

(function () {
    'use strict';

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
