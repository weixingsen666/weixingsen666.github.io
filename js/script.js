/* ============================================
   weixingsen666 个人主页交互脚本
   模块：导航、打字机、计数、进度条、滚动出现、粒子背景
   ============================================ */

(function () {
    'use strict';

    /* ---------- 1. 导航栏：滚动变色 + 移动端菜单 ---------- */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动时给导航栏添加阴影背景
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
        updateActiveNav();
    });

    // 移动端汉堡菜单切换
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // 点击移动端菜单项后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // 根据当前可视区域更新导航激活项
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (!link) return;
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }

    /* ---------- 2. 打字机效果 ---------- */
    const typingEl = document.getElementById('typing-text');
    const phrases = [
        'Web 开发者 💻',
        '开源爱好者 ⭐',
        '持续学习者 📚',
        'GitHub 新成员 🚀'
    ];
    let pIndex = 0;
    let cIndex = 0;
    let deleting = false;

    function typeLoop() {
        const current = phrases[pIndex];
        if (!deleting) {
            typingEl.textContent = current.slice(0, ++cIndex);
            if (cIndex === current.length) {
                deleting = true;
                setTimeout(typeLoop, 1800);
                return;
            }
        } else {
            typingEl.textContent = current.slice(0, --cIndex);
            if (cIndex === 0) {
                deleting = false;
                pIndex = (pIndex + 1) % phrases.length;
            }
        }
        setTimeout(typeLoop, deleting ? 50 : 120);
    }
    if (typingEl) typeLoop();

    /* ---------- 3. 数字计数动画 ---------- */
    function animateNumber(el, target) {
        // 非数字（如 ∞）直接显示
        if (isNaN(Number(target))) {
            el.textContent = target;
            return;
        }
        const goal = Number(target);
        const duration = 1500;
        const start = performance.now();
        function tick(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
            el.textContent = Math.floor(eased * goal);
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = goal;
        }
        requestAnimationFrame(tick);
    }

    /* ---------- 4. 滚动出现 + 触发计数/进度条 ---------- */
    const revealEls = document.querySelectorAll(
        '.section, .stat-card, .skill-card, .project-card, .contact-card, .progress-item'
    );
    revealEls.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('visible');

                // 触发数字计数
                el.querySelectorAll?.('.stat-num[data-target]').forEach(numEl => {
                    if (!numEl.dataset.done) {
                        animateNumber(numEl, numEl.dataset.target);
                        numEl.dataset.done = '1';
                    }
                });

                // 触发进度条
                el.querySelectorAll?.('.progress-fill[data-progress]').forEach(fill => {
                    if (!fill.dataset.done) {
                        fill.style.width = fill.dataset.progress + '%';
                        fill.dataset.done = '1';
                    }
                });

                io.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => io.observe(el));

    /* ---------- 5. 粒子背景 ---------- */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createParticles() {
        const count = Math.min(60, Math.floor(w / 22));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.8 + 0.6,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                a: Math.random() * 0.5 + 0.2
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // 连线
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 130) * 0.18})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }

        // 粒子
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96, 165, 250, ${p.a})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
        });

        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    /* ---------- 6. 页脚年份 ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 7. 平滑锚点（兼容老浏览器兜底） ---------- */
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
