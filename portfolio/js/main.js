/* =============================================================
   Kalpak Korde — portfolio behaviour
   No dependencies. Everything degrades to a readable page if
   this file fails to load.
   ============================================================= */

(function () {
    'use strict';

    var $ = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Theme ---------- */

    var root = document.documentElement;
    var themeToggle = $('#themeToggle');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (themeToggle) {
            themeToggle.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            );
        }
    }

    // The inline script in <head> already set the attribute; sync the label to it.
    applyTheme(root.getAttribute('data-theme') || 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
        });
    }

    // Follow the OS setting only while the visitor hasn't picked one themselves
    var osTheme = window.matchMedia('(prefers-color-scheme: dark)');
    var onOsThemeChange = function (e) {
        var stored = null;
        try { stored = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
        if (!stored) applyTheme(e.matches ? 'dark' : 'light');
    };
    if (osTheme.addEventListener) osTheme.addEventListener('change', onOsThemeChange);

    /* ---------- Mobile navigation ---------- */

    var navToggle = $('#navToggle');
    var nav = $('#nav');

    function closeNav() {
        if (!nav || !navToggle) return;
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
    }

    if (navToggle && nav) {
        navToggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(open));
            navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });

        $$('a', nav).forEach(function (link) {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNav();
        });
    }

    /* ---------- Scroll-driven header, progress bar, back-to-top ---------- */

    var header = $('#siteHeader');
    var progress = $('#scrollProgress');
    var toTop = $('#toTop');
    var projBg = $('.proj-bg');
    var ticking = false;

    function onScroll() {
        var y = window.scrollY || document.documentElement.scrollTop;
        var max = document.documentElement.scrollHeight - window.innerHeight;

        if (header) header.classList.toggle('is-stuck', y > 8);
        if (toTop) toTop.classList.toggle('is-visible', y > 600);
        if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

        // Project pages only: drift the hero backdrop slower than the page
        if (projBg && !reduceMotion && y < window.innerHeight * 1.5) {
            projBg.style.setProperty('--parallax', (y * 0.18) + 'px');
        }

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    onScroll();

    if (toTop) {
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------- Project page backdrop ---------- */

    // Cross-fade between backdrop pages. With one layer this just shows it.
    var bgLayers = $$('.proj-bg-layer');

    if (bgLayers.length) {
        bgLayers[0].classList.add('is-active');

        if (bgLayers.length > 1 && !reduceMotion) {
            var bgIndex = 0;
            window.setInterval(function () {
                // Skip while the tab is hidden so we don't wake it up to animate
                if (document.hidden) return;
                bgLayers[bgIndex].classList.remove('is-active');
                bgIndex = (bgIndex + 1) % bgLayers.length;
                bgLayers[bgIndex].classList.add('is-active');
            }, 7000);
        }
    }

    /* ---------- Scroll reveal ---------- */

    var revealables = $$('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        revealables.forEach(function (el) { revealObserver.observe(el); });

        // Safety net: if the observer never fires (background tab, an embedded
        // viewer that doesn't composite, anything unexpected), show everything
        // anyway rather than leaving the page invisible.
        window.setTimeout(function () {
            revealables.forEach(function (el) { el.classList.add('is-in'); });
        }, 4000);
    }

    /* ---------- Active section in the nav ---------- */

    var navLinks = $$('.nav a[href^="#"]');
    var sections = navLinks
        .map(function (link) { return document.getElementById(link.getAttribute('href').slice(1)); })
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        var visible = new Set();

        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) visible.add(entry.target.id);
                else visible.delete(entry.target.id);
            });

            // Highlight the topmost section currently on screen
            var current = sections.filter(function (s) { return visible.has(s.id); })[0];
            navLinks.forEach(function (link) {
                link.classList.toggle(
                    'is-active',
                    !!current && link.getAttribute('href') === '#' + current.id
                );
            });
        }, { rootMargin: '-25% 0px -60% 0px' });

        sections.forEach(function (s) { sectionObserver.observe(s); });
    }

    /* ---------- Lightbox ---------- */

    var lightbox = $('#lightbox');
    var lightboxImg = $('#lightboxImg');
    var lightboxCaption = $('#lightboxCaption');
    var lightboxClose = $('#lightboxClose');
    var lastFocused = null;

    if (lightbox && lightbox.showModal) {
        $$('.zoomable').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var img = $('img', btn);
                lastFocused = btn;
                lightboxImg.src = btn.getAttribute('data-full') || (img && img.src) || '';
                lightboxImg.alt = (img && img.alt) || '';
                lightboxCaption.textContent = btn.getAttribute('data-caption') || '';
                lightbox.showModal();
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', function () { lightbox.close(); });
        }

        // Clicking the backdrop (i.e. outside the image) closes it
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) lightbox.close();
        });

        lightbox.addEventListener('close', function () {
            lightboxImg.removeAttribute('src');
            if (lastFocused) lastFocused.focus();
        });
    } else {
        // No <dialog> support: fall back to opening the image in a new tab
        $$('.zoomable').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var url = btn.getAttribute('data-full');
                if (url) window.open(url, '_blank', 'noopener');
            });
        });
    }

    /* ---------- Footer year ---------- */

    var year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
})();
