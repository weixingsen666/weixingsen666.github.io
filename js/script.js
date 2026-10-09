/* ============================================
   学术风格个人主页 - 轻量交互
   仅保留：导航高亮、移动端菜单、滚动淡入、年份
   ============================================ */

(function () {
    'use strict';

    /* ---------- 1. 导航栏 ---------- */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动时更新激活导航项
    window.addEventListener('scroll', updateActiveNav);

    // 移动端菜单切换
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // 点击菜单项后关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        document.querySelectorAll('section[id]').forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (!link) return;
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }

    /* ---------- 2. 滚动淡入（仅一次，不重复） ---------- */
    const revealEls = document.querySelectorAll('.card');
    revealEls.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach(el => io.observe(el));

    /* ---------- 3. 页脚年份 ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 4. 平滑锚点 ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

})();
