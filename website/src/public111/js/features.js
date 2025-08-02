document.addEventListener('DOMContentLoaded', function() {
    // Immersive Scroll-Story Logic
    const storySteps = document.querySelectorAll('.story-step');
    const deviceMockups = document.querySelectorAll('.device-mockup');
    const desktopImg = document.querySelector('.desktop-mockup img');
    const tabletImg = document.querySelector('.tablet-mockup img');
    const phoneScreen = document.querySelector('.phone-mockup .screen');

    if (!storySteps.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.55
    };

    const stepObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const step = entry.target;
            if (entry.isIntersecting) {
                storySteps.forEach(s => s.classList.remove('is-active'));
                step.classList.add('is-active');

                const visual = step.dataset.visual;
                const img = step.dataset.img;

                deviceMockups.forEach(mockup => {
                    if (mockup.dataset.device === visual) {
                        mockup.classList.add('is-active');
                        if (visual === 'desktop') {
                            // 修复：确保使用绝对路径进行比较和设置
                            const fullImgPath = new URL(img, window.location.origin).href;
                            if(desktopImg.src !== fullImgPath) desktopImg.src = fullImgPath;
                        } else if (visual === 'tablet') {
                            // 修复：确保使用绝对路径进行比较和设置
                            const fullImgPath = new URL(img, window.location.origin).href;
                            if(tabletImg.src !== fullImgPath) tabletImg.src = fullImgPath;
                        } else if (visual === 'phone') {
                            // 修复：确保使用绝对路径设置背景图片
                            const fullImgPath = new URL(img, window.location.origin).href;
                            phoneScreen.style.backgroundImage = `url(${fullImgPath})`;
                        }
                    } else {
                        mockup.classList.remove('is-active');
                    }
                });
            }
        });
    }, observerOptions);

    storySteps.forEach(step => {
        stepObserver.observe(step);
    });
    
    const scrollAnimObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = entry.target;
                if (step.dataset.scroll === 'true') {
                    const scrollPercentage = entry.intersectionRatio * 100;
                    phoneScreen.style.backgroundPosition = `center ${100 - scrollPercentage}%`;
                }
            }
        });
    }, { threshold: Array.from(Array(101).keys(), i => i / 100) });

    storySteps.forEach(step => {
        if (step.dataset.scroll === 'true') {
            scrollAnimObserver.observe(step);
        }
    });
});